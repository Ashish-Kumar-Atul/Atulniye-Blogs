import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';



export default function EditBlog() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  // Fetch blog data when component mounts
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/blog/blog/${id}`, {
          withCredentials: true
        });
        setFormData({
          title: response.data.title || '',
          description: response.data.description || '',
          author: response.data.author || ''
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch blog data:", err);
        setStatus('❌ Failed to load blog data.');
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogData();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:3000/api/blog/edit/${id}`, formData, {
        withCredentials: true
      });
      setStatus('✅ Blog updated successfully!');
      setTimeout(() => {
        navigate("/my-posts");
      }, 1500);
    } catch (err) {
      setStatus('❌ Failed to update blog.');
      console.error("Error updating blog:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white text-center">
              ✍️ Edit your Blog Post
            </h2>
            <p className="text-blue-100 text-center mt-2">
              Share your thoughts with the world
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading blog data...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Status Message */}
                {status && (
                  <div className={`mt-6 p-4 rounded-lg ${
                    status.includes('✅') 
                      ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200' 
                      : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200'
                  }`}>
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{status.includes('✅') ? '✅' : '❌'}</span>
                      <p className="font-medium">{status.replace(/[✅❌]\s*/, '')}</p>
                    </div>
                  </div>
                )}
                {/* Title Field */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blog Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Enter an engaging title for your blog..."
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Blog Content
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Write your blog content here..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                />
              </div>

              {/* Author Field */}
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Author Name
                </label>
                <input
                  id="author"
                  type="text"
                  name="author"
                  placeholder="Your name"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Update Blog Post
                  </span>
                </button>
              </div>
            </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            📝 Ready to share your story? Fill out the form above to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
