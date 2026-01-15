"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"

export default function ContactForm() {
  // Contact form configured with Formspree
  const formspreeUrl = "https://formspree.io/f/xyzqwpab"

  return (
    <section id="contact" className="py-20 bg-gradient-futuristic border-t border-cyan-500/20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-4">Get In Touch</h2>
          <p className="text-cyan-200/70 dark:text-cyan-200/60">
            Interested in collaborating or have questions about my work? Let's connect!
          </p>
        </div>

        <form action={formspreeUrl} method="POST" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-cyan-200 dark:text-cyan-200">
                Name
              </Label>
              <Input
                id="name"
                name="name"
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
              placeholder="Your message..."
              rows={6}
              required
              className="bg-gray-900/50 border-cyan-500/30 dark:border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-500/20 text-cyan-100 placeholder:text-cyan-400/50"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 dark:from-cyan-600 dark:to-blue-600 dark:hover:from-cyan-700 dark:hover:to-blue-700 shadow-lg shadow-cyan-500/50"
          >
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </form>
      </div>
    </section>
  )
}
