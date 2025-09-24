import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import axios from 'axios'
import Loading from '../components/Loading';


function AllPost() {
    const [blog,setBlog] = useState([]);
    const [loading,setLoading] = useState(true);
  
  useEffect(()=>{
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://atulniye-blogs.onrender.com/api/blog/get-all-blogs', {
          withCredentials: true
        })
        setBlog(response.data.data);
        setLoading(false)
        
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch blogs", error);
      }
    };
    fetchBlogs();
  },[])
  
  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Latest Articles
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover insights, stories, and expertise from our community of writers
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                Filter
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Sort
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-6 flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              {blog.length} articles published
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Fresh content daily
            </span>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blog.map((singleBlog) => (
            <Card
              key={singleBlog._id}
              id={singleBlog._id}
              title={singleBlog.title}
              description={singleBlog.description}
              author={singleBlog.author}
              thumbnail={singleBlog.thumbnail ? `https://atulniye-blogs.onrender.com/api/blog/thumbnail/${singleBlog._id}` : null}
              showActions={false}
            />
          ))}
        </div>
        

        {/* Load More Button */}
        {/* <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
            Load More Posts
          </button>
        </div> */}
      </div>
    </div>
  )
}

export default AllPost