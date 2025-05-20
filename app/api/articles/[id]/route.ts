import { NextResponse } from 'next/server';
import { articles } from '../../../../data/articles';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const article = articles.find((a) => a.id === params.id);
  
  if (!article) {
    return NextResponse.json(
      { error: 'Article not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(article);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // In a real application, you would delete from a database
  // For this static example, we'll just return a success response
  
  const articleExists = articles.some((a) => a.id === params.id);
  
  if (!articleExists) {
    return NextResponse.json(
      { error: 'Article not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: 'Article deleted successfully' });
} 