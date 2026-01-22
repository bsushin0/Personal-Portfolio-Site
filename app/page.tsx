import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Projects from "@/components/projects"
import Certifications from "@/components/certifications"
import ContactForm from "@/components/contact-form"
import Footer from "@/components/footer"
import About from "@/components/about"
import Experience from "@/components/experience"
import Skills from "@/components/skills"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-futuristic-light dark:bg-gradient-futuristic text-gray-900 dark:text-cyan-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Certifications />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}
