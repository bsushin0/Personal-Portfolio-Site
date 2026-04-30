import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import About from "@/components/about"
import Interests from "@/components/interests"
import Experience from "@/components/experience"
import Projects from "@/components/projects"
import Education from "@/components/education"
import Skills from "@/components/skills"
import Certifications from "@/components/certifications"
import ContactForm from "@/components/contact-form"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 pt-0 pb-12 md:pb-16">
        <Hero />
        <About />
        <Interests />
        <Experience />
        <Projects />
        <Education />
        <Skills />
        <Certifications />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}
