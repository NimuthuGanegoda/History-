import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import kingsData from '@/data/kings.json';
import kingdomsData from '@/data/kingdoms.json';

interface King {
  id: string;
  name: string;
  slug: string;
  kingdom: string;
  reign: string;
  [key: string]: any; // Allow additional properties
}

export async function generateStaticParams() {
  return kingsData.map((king) => ({
    slug: king.id,
  }));
}

export default async function KingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const king = kingsData.find((k: King) => k.id === slug) as King | undefined;
  
  if (!king) {
    notFound();
  }

  // Find the kingdom
  const kingdom = kingdomsData.find((k) => 
    king.kingdom.toLowerCase().includes(k.name.toLowerCase()) ||
    k.name.toLowerCase().includes(king.kingdom.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto py-6 px-5">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          ...(kingdom ? [{ label: kingdom.name, href: `/kingdoms/${kingdom.id}` }] : []),
          { label: king.name }
        ]} />
        
        <article>
          <h1 className="text-4xl font-bold mb-4">{king.name}</h1>
          
          <section className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div><strong>Reign:</strong> {king.reign}</div>
              <div><strong>Kingdom:</strong> {king.kingdom}</div>
            </div>
          </section>

          {king.notes && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">Overview</h2>
              <p className="text-lg">{king.notes}</p>
            </div>
          )}

          {king.biography && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">Biography</h2>
              <div className="prose dark:prose-invert max-w-none">
                {king.biography.split('\n\n').map((paragraph: string) => (
                  <p key={paragraph.substring(0, 50)} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {!king.biography && !king.notes && (
            <p className="text-gray-600 dark:text-gray-400">
              Detailed biography for {king.name} is being researched and will be added soon.
            </p>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
