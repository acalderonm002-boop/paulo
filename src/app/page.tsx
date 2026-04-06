import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Services from "@/components/Services";
import Properties from "@/components/Properties";
import Testimonials from "@/components/Testimonials";
import Clients from "@/components/Clients";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutMe />
      <Services />
      <Properties />
      <Testimonials />
      <Clients />
    </main>
  );
}
