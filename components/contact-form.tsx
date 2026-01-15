"use client"

import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, CheckCircle, AlertCircle } from "lucide-react"

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-gradient-futuristic border-t border-cyan-500/20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-4">Get In Touch</h2>
          <p className="text-cyan-200/70 dark:text-cyan-200/60 mb-3">
            Interested in collaborating or have questions about my work? Let's connect!
          </p>
          <p className="text-cyan-300/80 dark:text-cyan-300/70 text-sm">
            Fill out the form below and send me a message. I'll get back to you promptly to discuss opportunities, share my resume, or chat about AI and cybersecurity.
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
            <CheckCircle className="mx-auto mb-3 text-green-400" size={32} />
            <h3 className="text-lg font-semibold text-green-300 mb-2">Message Sent!</h3>
            <p className="text-green-200/70">
              Thanks for reaching out. I'll get back to you within 24-48 hours. You should receive a confirmation email shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-red-400 mt-1 flex-shrink-0" size={20} />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-cyan-200 dark:text-cyan-200">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="bg-gray-900/50 border-cyan-500/30 dark:border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-500/20 text-cyan-100 placeholder:text-cyan-400/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cyan-200 dark:text-cyan-200">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  className="bg-gray-900/50 border-cyan-500/30 dark:border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-500/20 text-cyan-100 placeholder:text-cyan-400/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-cyan-200 dark:text-cyan-200">
                Subject
              </Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this regarding?"
                required
                className="bg-gray-900/50 border-cyan-500/30 dark:border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-500/20 text-cyan-100 placeholder:text-cyan-400/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-cyan-200 dark:text-cyan-200">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
                rows={6}
                required
                className="bg-gray-900/50 border-cyan-500/30 dark:border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-500/20 text-cyan-100 placeholder:text-cyan-400/50"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 dark:from-cyan-600 dark:to-blue-600 dark:hover:from-cyan-700 dark:hover:to-blue-700 shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="mr-2 h-4 w-4" />
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
