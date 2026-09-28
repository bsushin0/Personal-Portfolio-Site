import Anthropic from "@anthropic-ai/sdk"
import { oidcFederationProvider } from "@anthropic-ai/sdk/lib/credentials/oidc-federation"
import { getVercelOidcToken } from "@vercel/oidc"

/**
 * Returns an Anthropic client.
 *
 * If the federation env vars are set, authenticates with workload identity
 * federation: the Vercel OIDC token is exchanged for a short-lived Anthropic
 * token (no static API key). Otherwise falls back to ANTHROPIC_API_KEY so the
 * site keeps working until federation is configured.
 */
export function getAnthropicClient(): Anthropic {
  const federationRuleId = process.env.ANTHROPIC_FEDERATION_RULE_ID
  const organizationId = process.env.ANTHROPIC_ORGANIZATION_ID

  if (!federationRuleId || !organizationId) {
    return new Anthropic()
  }

  return new Anthropic({
    credentials: oidcFederationProvider({
      identityTokenProvider: () => getVercelOidcToken(),
      federationRuleId,
      organizationId,
      serviceAccountId: process.env.ANTHROPIC_SERVICE_ACCOUNT_ID,
      workspaceId: process.env.ANTHROPIC_WORKSPACE_ID,
      baseURL: "https://api.anthropic.com",
      fetch: globalThis.fetch,
    }),
  })
}
