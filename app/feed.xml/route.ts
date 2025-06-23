import { NextResponse } from 'next/server'
import connectDB from '../../lib/mongodb'
import Post from '../../models/Post'

export async function GET() {
  try {
    await connectDB()
    
    // Get latest 50 posts
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    const baseUrl = 'https://blog.earthfields.in'
    const currentDate = new Date().toUTCString()

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Earthfields Blog - Land Insights &amp; Property News</title>
    <description>Discover expert insights on land transactions, property market trends, and real estate analysis from India's first exclusive land platform - Earthfields.</description>
    <link>${baseUrl}</link>
    <language>en-IN</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/EF_Journal_Logo.png</url>
      <title>Earthfields Blog</title>
      <link>${baseUrl}</link>
      <width>400</width>
      <height>400</height>
    </image>
    <managingEditor>info@earthfields.in (Earthfields Team)</managingEditor>
    <webMaster>info@earthfields.in (Earthfields Team)</webMaster>
    <category>Real Estate</category>
    <category>Land Transactions</category>
    <category>Property Investment</category>
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${baseUrl}/post/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/post/${post.slug}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <category><![CDATA[${post.category}]]></category>
      <author>info@earthfields.in (Earthfields Team)</author>
      ${post.coverImage ? `<enclosure url="${post.coverImage}" type="image/jpeg"/>` : ''}
    </item>`).join('')}
  </channel>
</rss>`

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
} 