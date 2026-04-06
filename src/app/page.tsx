import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import VideoSection from "@/components/VideoSection";
import Services from "@/components/Services";
import Properties from "@/components/Properties";
import Testimonials from "@/components/Testimonials";
import Clients from "@/components/Clients";
import ContentHighlight from "@/components/ContentHighlight";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutMe />
      <VideoSection />
      <Services />
      <Properties />
      <Testimonials />
      <Clients />
      <ContentHighlight />
      <CallToAction />
      <Footer />
    </main>
  );
}
