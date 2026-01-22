import nextConfig from 'eslint-config-next'

// Relax selected rules globally; keep Next.js base config.
export default [
  ...nextConfig,
  {
    rules: {
      // Next.js specific rules
      '@next/next/no-img-element': 'off',

      // React Hooks strict rules → warnings
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/purity': 'warn',

      // JSX text entities → warnings
      'react/no-unescaped-entities': 'warn',
    },
  },
]
