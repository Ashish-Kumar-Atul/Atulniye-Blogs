import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Loading from '../components/Loading'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyPost() {
  const [blog,setBlog] = useState([]);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://atulniye-blogs.onrender.com/api/blog/user-blogs', {
          withCredentials: true
        })
        setBlog(response.data.data);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error("Failed to fetch blogs", error);
      }
    };
    fetchBlogs();
  },[])

  const toggleDelete = async (id) => {
    try {
      await axios.delete(`https://atulniye-blogs.onrender.com/api/blog/blog/${id}`, {
        withCredentials: true
      });
      setBlog(prev => prev.filter(blog => blog._id !== id));
    } catch (error) {
      console.error("Failed to delete blog", error);
    }
  }
  
  const toggleEdit = async (id) => {
    try {
      navigate(`/edit/${id}`)
      // await axios.put(`https://atulniye-blogs.onrender.com/blog/${id}`);
    } catch (error) {
      console.error("Failed to edit blog", error);
    }
  }
    
  if (loading) {
    return (
      <Loading/>
    )
  };



  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Articles
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and track your published content
              </p>
            </div>
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Article
            </Link>
          </div>
          
          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{blog.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Articles</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{blog.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {blog.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No articles yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start writing your first article to see it here.</p>
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Write Your First Article
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blog.map((singleBlog) => (
              <Card
                key={singleBlog._id}
                id={singleBlog._id}
                title={singleBlog.title}
                description={singleBlog.description}
                author={singleBlog.author}
                thumbnail={singleBlog.thumbnail ? `https://atulniye-blogs.onrender.com/api/blog/thumbnail/${singleBlog._id}` : null}
                showActions={true}
                onDelete={toggleDelete}
                onEdit={toggleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPost










    // <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    //   <div className="container mx-auto px-4">
    //     <div className="text-center mb-12">
    //       <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
    //         My Posts
    //       </h1>
    //       <p className="text-lg text-gray-600 dark:text-gray-300">
    //         Manage and view all your blog posts
    //       </p>
    //     </div>

    //     {/* Placeholder for when user has no posts */}
    //     <div className="max-w-2xl mx-auto text-center">
    //       <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg">
    //         <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    //         </svg>
    //         <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
    //           You haven't written any posts yet
    //         </h3>
    //         <p className="text-gray-500 dark:text-gray-400 mb-6">
    //           Start your blogging journey by creating your first post!
    //         </p>
    //         <Link 
    //           to="/create" 
    //           className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
    //         >
    //           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    //           </svg>
    //           Write Your First Post
    //         </Link>
    //       </div>
    //     </div>
    //   </div>
    // </div>
