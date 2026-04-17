"use client";

import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import VideoSection from "@/components/VideoSection";
import Services from "@/components/Services";
import Properties from "@/components/Properties";
import Testimonials from "@/components/Testimonials";
import Clients from "@/components/Clients";
import ContentHighlight from "@/components/ContentHighlight";
import InstagramFeed from "@/components/InstagramFeed";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import { useSiteData } from "@/context/SiteDataContext";

export default function HomeContent() {
  const { config, services, testimonials, clients, properties } = useSiteData();

  return (
    <main>
      <Hero config={config} />
      <AboutMe config={config} />
      <VideoSection config={config} />
      <Services services={services} />
      <Properties properties={properties} />
      <Testimonials testimonials={testimonials} />
      <Clients clients={clients} />
      <ContentHighlight config={config} />
      <InstagramFeed config={config} />
      <CallToAction config={config} />
      <Footer config={config} />
    </main>
  );
}
