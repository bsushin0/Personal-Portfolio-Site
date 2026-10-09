import FlightHeader from "@/components/flight/flight-header"
import Sky from "@/components/flight/sky"
import PlaneCursor from "@/components/flight/plane-cursor"
import Hero from "@/components/flight/hero"
import CrewBriefing from "@/components/flight/crew-briefing"
import Logbook from "@/components/flight/logbook"
import Departures from "@/components/flight/departures"
import GroundSchool from "@/components/flight/ground-school"
import Radar from "@/components/flight/radar"
import Patches from "@/components/flight/patches"
import RadioContact from "@/components/flight/radio-contact"
import FlightFooter from "@/components/flight/flight-footer"
import { EcgDivider } from "@/components/flight/primitives"
import { FlightProvider } from "@/context/flight-context"

export default function Home() {
  return (
    <FlightProvider>
      <Sky />
      <PlaneCursor />
      <FlightHeader />
      <main>
        <Hero />
        <CrewBriefing />
        <EcgDivider hr={72} />
        <Logbook />
        <EcgDivider hr={76} />
        <Departures />
        <EcgDivider hr={74} spo2={98} />
        <GroundSchool />
        <EcgDivider hr={70} />
        <Radar />
        <EcgDivider hr={78} />
        <Patches />
        <EcgDivider hr={68} />
        <RadioContact />
      </main>
      <FlightFooter />
    </FlightProvider>
  )
}
