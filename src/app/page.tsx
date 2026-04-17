import Hero from "@/components/Hero";
import ProfileTabs from "@/components/ProfileTabs";
import { fetchBrokerBundle, listingsToProperties } from "@/lib/brokers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { broker, activeListings } = await fetchBrokerBundle();
  const properties = listingsToProperties(activeListings, broker);

  return (
    <main>
      <Hero broker={broker} />
      <ProfileTabs broker={broker} properties={properties} />
    </main>
  );
}
