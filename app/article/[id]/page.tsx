import { notFound } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ArticleImage from '../../components/ArticleImage';
import Post, { IPost } from '../../../models/Post';
import connectDB from '../../../lib/mongodb';
import { Types } from 'mongoose';

interface ArticleDetailPageProps {
  params: {
    id: string;
  };
}

interface PostType extends Omit<IPost, 'sections'> {
  _id: Types.ObjectId;
  sections: Array<{
    title: string;
    content: string;
  }>;
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  await connectDB();
  
  const post = await Post.findById(params.id) as PostType;
  if (!post) {
    notFound();
  }

  const recentPosts = await Post.find({ _id: { $ne: post._id } })
    .sort({ createdAt: -1 })
    .limit(3) as PostType[];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="mb-8">
            <ArticleImage 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-[400px] rounded-lg"
              loading="eager"
            />
          </div>
          <div className="prose max-w-none">
            {post.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                <div className="text-gray-700 leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </article>

        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Explore More</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentPosts.map((recentPost) => (
              <div key={recentPost._id.toString()} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 relative">
                  <ArticleImage 
                    src={recentPost.coverImage} 
                    alt={recentPost.title}
                    className="w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{recentPost.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{recentPost.sections[0]?.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 