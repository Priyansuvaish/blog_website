import { Article } from '../types/article'
import ArticleCard from './ArticleCard'
import Link from 'next/link'

export default function SectionBlock({ title, articles }: { title: string, articles: Article[] }) {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Link href="#" className="text-blue-400 text-sm">View all</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map(article => <ArticleCard key={article.id} article={article} />)}
      </div>
    </section>
  )
} 