import { notFound } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { articles } from '../../../data/articles';
import Link from 'next/link';

// This is a server component
export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  // Use the id parameter to find the article - without using async/await
  const articleId = params.id;
  
  // Since we're using static data, we don't need async/await
  const article = articles.find((a) => a.id === articleId);
  
  if (!article) notFound();

  // Get 3 featured articles for the explore section (excluding current article)
  const featuredArticles = articles
    .filter(a => a.id !== articleId)
    .slice(0, 3);
  
  // Get all related articles for the related section
  const relatedArticles = articles
    .filter(a => a.id !== articleId)
    .slice(0, 3);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      
      {/* Banner image */}
      <div className="w-full h-80 bg-gray-200 flex items-center justify-center overflow-hidden">
        {article.image ? (
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl text-gray-400 font-bold">[Banner Image]</span>
        )}
      </div>

      <main className="container mx-auto px-4 max-w-4xl flex-1">
        {/* Title and date */}
        <h1 className="text-3xl md:text-4xl font-bold mt-8 mb-4">{article.title}</h1>
        <div className="text-gray-500 mb-8">{article.date}</div>
        
        {/* Article body */}
        <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: article.content }} />

        {/* Explore more section */}
        <div className="my-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Explore More Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {article.image ? (
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400 font-bold text-xl">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">{article.excerpt}</p>
                  <Link 
                    href={`/article/${article.id}`}
                    className="bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600 transition"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related articles */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Related Articles</h2>
            <Link href="/" className="text-blue-400 text-sm">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <Link key={rel.id} href={`/article/${rel.id}`} className="bg-blue-400 rounded-lg p-4 flex flex-col hover:bg-blue-500 transition">
                <div className="bg-white h-24 rounded mb-4 flex items-center justify-center overflow-hidden">
                  {rel.image ? (
                    <img src={rel.image} alt={rel.title} className="h-full w-full object-cover rounded" />
                  ) : (
                    <span className="text-blue-400 font-bold text-2xl">IMG</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white line-clamp-1">{rel.title}</h3>
                <p className="text-sm text-blue-100 mb-2 line-clamp-2">{rel.excerpt}</p>
                <span className="text-xs text-blue-100">{rel.date}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 