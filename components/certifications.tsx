"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Award, BookOpen, ShieldCheck, FileText } from "lucide-react"
import { certifications, type Certification } from "@/lib/certifications"
import { headingVariants, cardVariants, staggerContainer as containerVariants } from "@/lib/motion-variants"
import TiltCard from "@/components/tilt-card"

type CertGroup = {
  id: string
  label: string
  sublabel: string
  icon: React.ReactNode
  accentClass: string
  certs: Certification[]
  gridCols: string
  compact: boolean
}

const groups: CertGroup[] = [
  {
    id: "professional",
    label: "Professional Certification",
    sublabel: "Emergency Medical Services",
    icon: <ShieldCheck className="h-4 w-4" />,
    accentClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    certs: certifications.filter((c) => c.issuer === "National Registry of Emergency Medical Technicians"),
    gridCols: "grid-cols-1",
    compact: false,
  },
  {
    id: "purdue",
    label: "Institutional Compliance",
    sublabel: "Purdue University",
    icon: <Award className="h-4 w-4" />,
    accentClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    certs: certifications.filter((c) => c.issuer === "Purdue University"),
    gridCols: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    compact: false,
  },
  {
    id: "anthropic",
    label: "Anthropic Academy",
    sublabel: "AI Literacy & Development",
    icon: <BookOpen className="h-4 w-4" />,
    accentClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20",
    certs: certifications.filter((c) => c.issuer === "Anthropic Academy"),
    gridCols: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    compact: true,
  },
]

interface CertPdfModalProps {
  cert: Certification | null
  open: boolean
  onClose: () => void
}

function CertPdfModal({ cert, open, onClose }: CertPdfModalProps) {
  if (!cert || !cert.pdfPath) return null
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-4 gap-3">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-base font-semibold leading-snug pr-8">
            {cert.title}
          </DialogTitle>
          <p className="text-xs text-foreground/50 mt-0.5">
            {cert.issuer} · {cert.date}
          </p>
        </DialogHeader>
        <div className="flex-1 rounded-lg overflow-hidden border border-border-subtle/60 bg-foreground/5 min-h-0">
          <iframe
            src={`${cert.pdfPath}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            className="w-full h-full"
            title={`Certificate: ${cert.title}`}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function Certifications() {
  const [activeCert, setActiveCert] = useState<Certification | null>(null)

  return (
    <section id="certifications" className="py-20 bg-gradient-lab dark:bg-gradient-neural border-t border-border-subtle/80">
      <motion.div
        className="text-center mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={headingVariants}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">Certifications</h2>
        <p className="text-foreground/60 max-w-2xl mx-auto">
          Professional certifications, compliance training, and AI literacy credentials.
        </p>
      </motion.div>

      <div className="space-y-14">
        {groups.map((group) => (
          <motion.div
            key={group.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
          >
            {/* Group header */}
            <motion.div variants={cardVariants} className="flex items-center gap-3 mb-6">
              <div className={`flex items-center justify-center w-7 h-7 rounded-md border ${group.accentClass}`}>
                {group.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground leading-none">{group.label}</p>
                <p className="text-xs text-foreground/45 mt-0.5">{group.sublabel}</p>
              </div>
              <Badge variant="outline" className="ml-auto border-border-subtle/80 text-foreground/45 text-xs tabular-nums">
                {group.certs.length}
              </Badge>
            </motion.div>

            {/* Cert cards */}
            <div className={`grid gap-4 ${group.gridCols}`}>
              {group.certs.map((cert) => (
                <motion.div key={cert.id} variants={cardVariants}>
                  {group.compact ? (
                    <TiltCard className="h-full">
                      <Card
                        className="glass-effect-sm border-glow h-full flex flex-col cursor-default"
                        data-cursor-hover
                      >
                        <CardHeader className="pb-1 pt-4 px-4">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-sm font-semibold text-foreground leading-snug">
                              {cert.title}
                            </CardTitle>
                          </div>
                          <p className="text-xs text-foreground/45 mt-0.5">{cert.date}</p>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-1 flex-1 flex flex-col justify-between gap-3">
                          <p className="text-xs text-foreground/60 leading-relaxed">{cert.description}</p>
                          {cert.pdfPath && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="self-start px-0 h-7 text-xs text-primary/70 hover:text-primary hover:bg-transparent gap-1"
                              onClick={() => setActiveCert(cert)}
                            >
                              <FileText className="h-3 w-3" />
                              View Certificate
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </TiltCard>
                  ) : (
                    <TiltCard className="h-full">
                      <Card
                        className="glass-effect-sm border-glow card-interactive h-full flex flex-col"
                        data-cursor-hover
                      >
                        <CardHeader className="flex flex-row items-start gap-3">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border shrink-0 ${group.accentClass}`}>
                            {group.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base text-foreground leading-snug">{cert.title}</CardTitle>
                            <p className="text-xs text-foreground/50 mt-0.5">
                              {cert.issuer} · {cert.date}
                            </p>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between gap-3">
                          <p className="text-sm text-foreground/65 leading-relaxed">{cert.description}</p>
                          {cert.pdfPath && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="self-start px-0 h-7 text-xs text-primary/70 hover:text-primary hover:bg-transparent gap-1"
                              onClick={() => setActiveCert(cert)}
                            >
                              <FileText className="h-3 w-3" />
                              View Certificate
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </TiltCard>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <CertPdfModal
        cert={activeCert}
        open={!!activeCert}
        onClose={() => setActiveCert(null)}
      />
    </section>
  )
}
