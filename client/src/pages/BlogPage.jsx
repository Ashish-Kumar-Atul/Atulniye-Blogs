import React, { useState,useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingComponent from '../components/Loading'
import NotFoundComponent from './Error'

export default function BlogPage() {

    const {id} = useParams();
    const [blogData,setBlogData] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState('')

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/blog/blog/${id}`,{
                    credentials:'include'
                });
                const data = await res.json();
                setBlogData(data);

            } catch (error) {
                setError('Failed to load blog');
            } finally {
                setLoading(false);
            }
        }
        fetchBlogData();
    },[id]);

    // Add these conditional renders at the top of your return statement
    if (loading) return <LoadingComponent />;
    if (error) return <ErrorComponent message={error} />;
    if (!blogData) return <NotFoundComponent />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <NavLink to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </NavLink>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <NavLink to="/all-posts" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              All Posts
            </NavLink>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {blogData.title.length > 50 ? blogData.title.substring(0, 50) + '...' : blogData.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <header className="mb-8">
          {/* Featured Image */}
          <div className="aspect-video rounded-xl overflow-hidden mb-8 shadow-lg">
            <img 
              // Change thumbnail src to:
                src={`http://localhost:3000/api/blog/thumbnail/${id}`}
                alt={blogData.title}
                className="w-full h-full object-cover" 
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {blogData.title}
          </h1>

          {/* Author and Meta Information */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <img 
                // src={blogData.author.avatar} 
                alt={blogData.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {blogData.author}
                </h3>
                <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                  <time dateTime={blogData.createdAt}>
                    {new Date(blogData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <span>•</span>
                  <span>{blogData.readTime}</span>
                </div>
              </div>
            </div>

            {/* Article Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span>Views</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>Likes</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                <span>Comments</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {/* <div className="flex flex-wrap gap-2 mb-8">
            {blogData.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div> */}
        </header>

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {blogData.description}
          </div>
        </div>

        {/* Article Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Like</span>
                <span className="text-sm">(243)</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Comment</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </button>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Author Bio */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-4">
            <img 
            //   src={blogData.author.avatar} 
            //   alt={blogData.author.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {/* About {blogData.author.name} */}Ashish
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {/* {blogData.author.bio} */}This is ashish From AIML
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Follow
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {/* <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Related Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400" 
                alt="Related article"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  Understanding React Server Components: A Deep Dive
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  Explore the revolutionary React Server Components and how they're changing the way we build React applications.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>5 min read</span>
                  <span>Mar 10, 2024</span>
                </div>
              </div>
            </article>

            <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400" 
                alt="Related article"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  Building Scalable APIs with Node.js and TypeScript
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  Learn best practices for creating robust and scalable APIs using modern Node.js and TypeScript patterns.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>7 min read</span>
                  <span>Mar 8, 2024</span>
                </div>
              </div>
            </article>
          </div>
        </div> */}
      </article>
    </div>
  );
}
