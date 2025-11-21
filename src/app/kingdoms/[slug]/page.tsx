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
