import { Article } from '../types/article'
import Link from 'next/link'

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="bg-blue-400 h-32 rounded mb-4 flex items-center justify-center">
        {/* Placeholder for image */}
        {article.image ? (
          <img src={article.image} alt={article.title} className="h-full w-full object-cover rounded" />
        ) : (
          <span className="text-white font-bold text-2xl">IMG</span>
        )}
      </div>
      <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
      <Link href={`/article/${article.id}`} className="mt-auto border border-custom-blue text-custom-blue px-4 py-1 rounded hover:bg-blue-50 transition">
        Read More
      </Link>
    </div>
  )
} 