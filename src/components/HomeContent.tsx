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
import AdminBar from "@/components/admin/AdminBar";
import AdminSection from "@/components/admin/AdminSection";
import HeroDrawer from "@/components/admin/drawers/HeroDrawer";
import AboutMeDrawer from "@/components/admin/drawers/AboutMeDrawer";
import VideoSectionDrawer from "@/components/admin/drawers/VideoSectionDrawer";
import ServicesDrawer from "@/components/admin/drawers/ServicesDrawer";
import PropertiesDrawer from "@/components/admin/drawers/PropertiesDrawer";
import TestimonialsDrawer from "@/components/admin/drawers/TestimonialsDrawer";
import ClientsDrawer from "@/components/admin/drawers/ClientsDrawer";
import ContentHighlightDrawer from "@/components/admin/drawers/ContentHighlightDrawer";
import InstagramDrawer from "@/components/admin/drawers/InstagramDrawer";
import CallToActionDrawer from "@/components/admin/drawers/CallToActionDrawer";
import ContactDrawer from "@/components/admin/drawers/ContactDrawer";
import { useSiteData } from "@/context/SiteDataContext";
import { useAdmin } from "@/hooks/useAdmin";

export default function HomeContent() {
  const { config, services, testimonials, clients, properties } = useSiteData();
  const { isAdmin, logout } = useAdmin();

  return (
    <>
      {isAdmin && <AdminBar onLogout={logout} />}

      <main>
        <AdminSection
          isAdmin={isAdmin}
          renderDrawer={(open, setOpen) => (
            <HeroDrawer open={open} onClose={() => setOpen(false)} />
          )}
        >
          <Hero config={config} />
        </AdminSection>

        <AdminSection
          isAdmin={isAdmin}
          renderDrawer={(open, setOpen) => (
            <AboutMeDrawer open={open} onClose={() => setOpen(false)} />
          )}
        >
          <AboutMe config={config} />
        </AdminSection>

        <AdminSection
          isAdmin={isAdmin}
          renderDrawer={(open, setOpen) => (
            <VideoSectionDrawer open={open} onClose={() => setOpen(false)} />
          )}
        >
          <VideoSection config={config} />
        </AdminSection>

        <AdminSection
          isAdmin={isAdmin}
          renderDrawer={(open, setOpen) => (
            <ServicesDrawer open={open} onClose={() => setOpen(false)} />
          )}
        >
          <Services services={services} />
        </AdminSection>

        <AdminSection
          isAdmin={isAdmin}
          renderDrawer={(open, setOpen) => (
            <PropertiesDrawer open={open} onClose={() => setOpen(false)} />
          )}
        >
          <Properties properties={properties} />
        </AdminSection>

        <AdminSection
          isAdmin={isAdmin}
          renderDrawer={(open, setOpen) => (
            <TestimonialsDrawer open={open} onClose={() => setOpen(false)} />
          )}
        >
          <Testimonials testimonials={testimonials} />
        </AdminSection>

        <AdminSection
          isAdmin={isAdmin}
          renderDrawer={(open, setOpen) => (
            <ClientsDrawer open={open} onClose={() => setOpen(false)} />
          )}
        >
          <Clients clients={clients} />
        </AdminSection>

        <AdminSection
          isAdmin={isAdmin}
          renderDrawer={(open, setOpen) => (
            <ContentHighlightDrawer
              open={open}
              onClose={() => setOpen(false)}
            />
          )}
        >
          <ContentHighlight config={config} />
        </AdminSection>

        <AdminSection
          isAdmin={isAdmin}
          renderDrawer={(open, setOpen) => (
            <InstagramDrawer open={open} onClose={() => setOpen(false)} />
          )}
        >
          <InstagramFeed config={config} />
        </AdminSection>

        <AdminSection
          isAdmin={isAdmin}
          renderDrawer={(open, setOpen) => (
            <CallToActionDrawer open={open} onClose={() => setOpen(false)} />
          )}
        >
          <CallToAction config={config} />
        </AdminSection>

        <AdminSection
          isAdmin={isAdmin}
          renderDrawer={(open, setOpen) => (
            <ContactDrawer open={open} onClose={() => setOpen(false)} />
          )}
        >
          <Footer config={config} />
        </AdminSection>
      </main>
    </>
  );
}
