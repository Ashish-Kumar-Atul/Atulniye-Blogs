import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';


function EditProfile() {

    const navigate = useNavigate();
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [formData,setFormData] = useState({
        fullName:'',
        username : '',
        email : '',
        phone:'',
        website:'',
        bio:'',
        twitter:'',
        linkedin:'',
        github:'',
        instagram:'',
      })
    const [profilePhoto,setProfilePhoto] = useState(null);
    const [profilePhotoPreview,setProfilePhotoPreview] = useState(null);


    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,[e.target.name] : e.target.value
        }));
      };

    const handleProfilePhotoChange = (e) => {
      const file = e.target.files[0];
      if(file){
        setProfilePhoto(file)
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const formDataToSend = new FormData();
    
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });
        
        if (profilePhoto) {
            formDataToSend.append('profilePhoto', profilePhoto);
        }
        try {
            const res = await fetch('http://localhost:3000/api/auth/update-profile',{
                method:'POST',
                credentials:'include',
                body: formDataToSend
            });
            const data = await res.json();

            if(!res.ok) {
                throw new Error(data.message || 'Failed to update data')
            }
            navigate('/my-profile')
        } catch (error) {
            setError(error.message);
        }
    }



    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/auth/status`,{credentials:'include'})
                const data = await response.json();
                
                if (response.ok && data.user) {
                    setUserData(data);
                    // Populate form with existing user data
                    setFormData({
                        fullName: data.user.fullName || '',
                        username: data.user.username || '',
                        email: data.user.email || '',
                        phone: data.user.phone || '',
                        website: data.user.website || '',
                        bio: data.user.bio || '',
                        twitter: data.user.twitter || '',
                        linkedin: data.user.linkedin || '',
                        github: data.user.github || '',
                        instagram: data.user.instagram || '',
                    });
                } else {
                    setError('Failed to fetch user data.');
                    navigate('/login');
                }
            } catch (error) {
                setError('Failed to fetch user data.');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    },[])



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Update your personal information and profile settings</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading profile data...</span>
            </div>
          </div>
        ) : (
          /* Edit Form */
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Update your account profile information</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Avatar Upload Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Photo</h3>
              <div className="flex items-center space-x-6">
                <img
                  src={profilePhotoPreview || (userData?.user?._id ? `http://localhost:3000/api/auth/profile-photo/${userData.user._id}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200")}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200";
                  }}
                />
                <div className="flex-1">
                  <div className="flex space-x-3">
                    <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer">
                      <input 
                        type="file" 
                        name="profilePhoto" 
                        accept="image/*" 
                        onChange={handleProfilePhotoChange}
                        className="hidden" 
                      />
                      Upload New Photo
                    </label>
                    <button type="button" className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                      Remove Photo
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    JPG, PNG or GIF. Max size 2MB. Recommended size 400x400px.
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    onChange={handleChange}
                    type="text"
                    value={formData.fullName}
                    className="w-full px-4 py-3 border border-gray-30~0 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username *
                  </label>
                  <input
                    id="username"
                    name="username"
                    onChange={handleChange}
                    type="text"
                    value={formData.username}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Enter your username"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    onChange={handleChange}
                    type="email"
                    value={formData.email}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    onChange={handleChange}
                    type="tel"
                    value={formData.phone}
                    placeholder="+91 xxxxx xxxxx"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website/Portfolio
                  </label>
                  <input
                    id="website"
                    name="website"
                    onChange={handleChange}
                    type="url"
                    value={formData.website}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">About You</h3>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  onChange={handleChange}
                  rows={4}
                  maxLength={250}
                  value={formData.bio}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors resize-none"
                  placeholder="Tell us about yourself"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Brief description for your profile. Maximum 250 characters.
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    250 max
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Social Links</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twitter
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </div>
                    <input
                      id="twitter"
                      name="twitter"
                      onChange={handleChange}
                      type="text"
                      value={formData.twitter}
                      placeholder="@username"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <input
                      id="linkedin"
                      name="linkedin"
                      onChange={handleChange}
                      type="text"
                      value={formData.linkedin}
                      placeholder="linkedin.com/in/username"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <input
                      id="github"
                      name="github"
                      onChange={handleChange}
                      type="text"
                      value={formData.github}
                      placeholder="github.com/username"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Instagram
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <input
                      id="instagram"
                      name="instagram"
                      onChange={handleChange}
                      type="text"
                      value={formData.instagram}
                      placeholder="@username"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3 mb-4 sm:mb-0">
                <button 
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/my-profile')}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                  Cancel
                </button>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Form ready</span>
                </div>
                <span>•</span>
                <span>All fields validated</span>
              </div>
            </div>
          </div>
        </form>
        )}
      </div>
    </div>
  )
}

export default EditProfile