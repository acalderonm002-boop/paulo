import HomeContent from "@/components/HomeContent";
import { SiteDataProvider } from "@/context/SiteDataContext";
import { fetchSiteContent } from "@/lib/content";
import { fetchProperties } from "@/lib/properties-db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, properties] = await Promise.all([
    fetchSiteContent(),
    fetchProperties(),
  ]);

  return (
    <SiteDataProvider
      initial={{
        config: content.config,
        services: content.services,
        testimonials: content.testimonials,
        clients: content.clients,
        properties,
      }}
    >
      <HomeContent />
    </SiteDataProvider>
  );
}
