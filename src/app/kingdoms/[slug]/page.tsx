import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Timeline from '@/components/Timeline';
import kingdomsData from '@/data/kingdoms.json';
import kingsData from '@/data/kings.json';

interface King {
  id: string;
  name: string;
  reign: string;
  kingdom: string;
  notes?: string;
}

interface Kingdom {
  id: string;
  name: string;
  period: string;
  description: string;
  mapUrl?: string;
  locations?: {
    name: string;
    description?: string;
    googleMapsUrl: string;
  }[];
}

export async function generateStaticParams() {
  return kingdomsData.map((kingdom) => ({
    slug: kingdom.id,
  }));
}

export default async function KingdomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kingdom = kingdomsData.find((k) => k.id === slug);
  
  if (!kingdom) {
    notFound();
  }

  // Filter kings for this kingdom
  const kingdomKings = kingsData.filter((king: King) => 
    king.kingdom.toLowerCase().includes(kingdom.name.toLowerCase()) ||
    kingdom.name.toLowerCase().includes(king.kingdom.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto py-6 px-5">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: kingdom.name }
        ]} />
        
        <article>
          <h1 className="text-4xl font-bold mb-4">{kingdom.name} Kingdom</h1>
          <p className="text-lg mb-6">{kingdom.description}</p>
          
          {kingdom.period && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
              <strong>Period:</strong> {kingdom.period}
            </div>
          )}

          {(kingdom as any).mapUrl && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Kingdom Map</h2>
              <div className="card overflow-hidden">
                <div className="relative" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={(kingdom as any).mapUrl}
                    title={`Map of ${kingdom.name}`}
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          )}

          {(kingdom as any).locations && (kingdom as any).locations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Important Sites</h2>
              <div className="grid grid-cols-1 gap-6">
                {(kingdom as any).locations.map((location: any, index: number) => (
                  <div key={`${kingdom.id}-location-${index}`} className="card overflow-hidden">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800">
                      <h3 className="font-semibold text-lg mb-1">📍 {location.name}</h3>
                      {location.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{location.description}</p>
                      )}
                    </div>
                    <div className="relative" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={location.googleMapsUrl}
                        title={`Map of ${location.name}`}
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold mt-8 mb-6">Monarchs Timeline</h2>
          
          {kingdomKings.length > 0 ? (
            <Timeline kings={kingdomKings} />
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No monarchs currently listed for this kingdom.</p>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
