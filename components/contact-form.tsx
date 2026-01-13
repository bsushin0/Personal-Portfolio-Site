"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"

export default function ContactForm() {
  // TODO: Create a form on https://formspree.io and replace the action URL
  const formspreeUrl = "https://formspree.io/f/your_form_id"

  return (
    <section id="contact" className="py-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Interested in collaborating or have questions about my work? Let's connect!
          </p>
        </div>

        <form action={formspreeUrl} method="POST" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                required
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                required
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300">
              Subject
            </Label>
            <Input
              id="subject"
              name="subject"
              placeholder="What is this regarding?"
              required
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Your message..."
              rows={6}
              required
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </form>
      </div>
    </section>
  )
}
