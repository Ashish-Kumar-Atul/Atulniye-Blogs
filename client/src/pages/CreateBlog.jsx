import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function CreateBlog() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: ''
  });
  const [thumbnail,setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const isEditing = Boolean(id);

  // Load blog data if in edit mode
  useEffect(() => {
    if (isEditing) {
      axios.get(`https://atulniye-blogs.onrender.com/api/blog/blog/${id}`, {
        withCredentials: true
      })
        .then(res => {
          setFormData({
            title: res.data.title || '',
            description: res.data.description || '',
            author: res.data.author || ''
          });
          // Set thumbnail preview if editing and image exists
          if (res.data.thumbnail) {
            setThumbnailPreview(`https://atulniye-blogs.onrender.com/api/blog/thumbnail/${id}`);
          }
        })
        .catch(err => {
          console.error("Failed to fetch blog for editing:", err);
        });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setThumbnail(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    // Reset file input
    const fileInput = document.getElementById('thumbnail');
    if (fileInput) fileInput.value = '';
  };

  const {user} = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("author", user?.username || user?.email);
      
      // Only append thumbnail if it exists
      if (thumbnail) {
        data.append("thumbnail", thumbnail);
        console.log('Thumbnail file being sent:', thumbnail);
      } else {
        console.log('No thumbnail file selected');
      }

      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };

      if (isEditing) {
        await axios.put(`https://atulniye-blogs.onrender.com/api/blog/edit/${id}`, data, config);
      } else {
        await axios.post('https://atulniye-blogs.onrender.com/api/blog/create-blogs', data, config);
      }

      navigate("/my-posts");
    } catch (err) {
      console.error("Error submitting blog:", err);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-blue-100/50 dark:shadow-indigo-900/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-8 py-8 border-b border-gray-200/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-white">
                    {isEditing ? "Edit Article" : "Create New Article"}
                  </h1>
                </div>
                <p className="text-blue-100 dark:text-indigo-100 text-lg">
                  {isEditing ? "Update your article content and reach your audience" : "Share your thoughts and inspire the community"}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-3 text-sm font-medium text-blue-600 bg-white/90 hover:bg-white border border-white/20 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Field */}
              <div className="group">
                <label htmlFor="title" className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <span>Article Title *</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Enter a compelling title for your article..."
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-lg group-hover:border-gray-300 dark:group-hover:border-gray-500"
                />
              </div>

              {/* Author Field */}
              <div className="group">
                <label htmlFor="author" className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span>Author Name *</span>
                </label>
                <input
                  id="author"
                  type="text"
                  name="author"
                  placeholder="Your name"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-lg group-hover:border-gray-300 dark:group-hover:border-gray-500"
                />
              </div>

              {/* Category Field */}
              <div className="group">
                <label htmlFor="category" className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <span>Category *</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200 text-lg group-hover:border-gray-300 dark:group-hover:border-gray-500"
                >
                  <option value="">Select a category</option>
                  <option value="technology">🔧 Technology</option>
                  <option value="programming">💻 Programming</option>
                  <option value="web-development">🌐 Web Development</option>
                  <option value="mobile-development">📱 Mobile Development</option>
                  <option value="data-science">📊 Data Science</option>
                  <option value="artificial-intelligence">🤖 Artificial Intelligence</option>
                  <option value="machine-learning">🧠 Machine Learning</option>
                  <option value="cybersecurity">🔒 Cybersecurity</option>
                  <option value="cloud-computing">☁️ Cloud Computing</option>
                  <option value="devops">⚙️ DevOps</option>
                  <option value="design">🎨 Design</option>
                  <option value="ui-ux">✨ UI/UX</option>
                  <option value="business">💼 Business</option>
                  <option value="startup">🚀 Startup</option>
                  <option value="career">👔 Career</option>
                  <option value="tutorial">📚 Tutorial</option>
                  <option value="tips-tricks">💡 Tips & Tricks</option>
                  <option value="review">⭐ Review</option>
                  <option value="news">📰 News</option>
                  <option value="opinion">💭 Opinion</option>
                  <option value="lifestyle">🌟 Lifestyle</option>
                  <option value="health">🏥 Health</option>
                  <option value="finance">💰 Finance</option>
                  <option value="education">🎓 Education</option>
                  <option value="travel">✈️ Travel</option>
                  <option value="food">🍴 Food</option>
                  <option value="entertainment">🎬 Entertainment</option>
                  <option value="sports">⚽ Sports</option>
                  <option value="science">🔬 Science</option>
                  <option value="other">📝 Other</option>
                </select>
              </div>

              {/* Thumbnail Upload */}
              <div className="group">
                <label htmlFor="thumbnail" className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>Featured Image</span>
                  <span className="text-gray-500 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">(Optional - JPEG, PNG, WebP, max 5MB)</span>
                </label>
                
                <div className="space-y-4">
                  <input
                    id="thumbnail"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {!thumbnailPreview ? (
                    <label
                      htmlFor="thumbnail"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500"
                    >
                      <div className="flex flex-col items-center justify-center pt-6 pb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                          <span className="text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG, JPEG or WebP (MAX. 5MB)</p>
                      </div>
                    </label>
                  ) : (
                    <div className="relative group">
                      <img
                        src={thumbnailPreview}
                        alt="Featured image preview"
                        className="w-full h-72 object-cover rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-2xl"></div>
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          type="button"
                          onClick={() => document.getElementById('thumbnail').click()}
                          className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
                          title="Change image"
                        >
                          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={removeThumbnail}
                          className="p-3 bg-red-500/90 hover:bg-red-600 text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                          title="Remove image"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Field */}
              <div className="group">
                <label htmlFor="description" className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span>Article Content *</span>
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Write your article content here... Share your knowledge, insights, and stories with the community."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={14}
                    className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-lg resize-none group-hover:border-gray-300 dark:group-hover:border-gray-500"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Markdown supported</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-8 border-t-2 border-gradient-to-r from-blue-200 to-indigo-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">* Required fields</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-8 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>{isEditing ? "Update Article" : "Publish Article"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}