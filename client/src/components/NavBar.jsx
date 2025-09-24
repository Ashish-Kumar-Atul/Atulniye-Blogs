import axios from "axios";
import React, { useContext, useState, useEffect } from "react"; // Import useContext
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Import the context

const API_URL = import.meta.env.VITE_API_URL || 'https://atulniye-blogs.onrender.com';

export default function Navbar() {
  // 1. Get user state and the function to update it from the global context
  const { user, setUser } = useContext(UserContext);
  const isLoggedIn = !!user; // isLoggedIn is true if the user object is not null

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Theme toggler state (no changes here)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. This useEffect is no longer needed because the UserProvider handles it.
  // useEffect(() => {
  //   axios.get(`${API_URL}/api/auth/status`,{withCredentials:true})
  //   .then(res => {
  //     setIsLoggedIn(!!res.data.user)
  //     setUser(res.data.user)
  //   })
  //   .catch(err => {
  //     console.error('Auth check failed', err);
  //     setIsLoggedIn(false);
  //     setUser(null);
  //   });
  // },[]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
      // 3. Update the global state on logout
      setUser(null);
      setIsDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.log('Logout failed', error);
    }
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // The empty useEffect can be removed
  // useEffect(() => {})

  return (
    // Added dark mode classes for better theme support
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                {/* Using a better icon */}
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Atulniye Blogs
              </h1>
            </Link>
          </div>


          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={({ isActive }) => `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-gray-800'}`}>Home</NavLink>
            <NavLink to="/all-posts" className={({ isActive }) => `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-gray-800'}`}>All Posts</NavLink>
            <NavLink to="/create" className={({ isActive }) => `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-gray-800'}`}>Create</NavLink>
            <NavLink to="/my-posts" className={({ isActive }) => `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-gray-800'}`}>My Posts</NavLink>
          </div>

          {/* Mobile Nav Menu */}
          {isDropdownOpen && (
            <div className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden" onClick={() => setIsDropdownOpen(false)}></div>
          )}
          <div className={`fixed top-0 left-0 w-3/4 max-w-xs h-full bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 md:hidden ${isDropdownOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{minWidth: 220}}>
            <div className="flex flex-col p-6 space-y-4">
              <NavLink to="/" className={({ isActive }) => `block px-4 py-2 text-base font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-gray-800'}`} onClick={() => setIsDropdownOpen(false)}>Home</NavLink>
              <NavLink to="/all-posts" className={({ isActive }) => `block px-4 py-2 text-base font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-gray-800'}`} onClick={() => setIsDropdownOpen(false)}>All Posts</NavLink>
              <NavLink to="/create" className={({ isActive }) => `block px-4 py-2 text-base font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-gray-800'}`} onClick={() => setIsDropdownOpen(false)}>Create</NavLink>
              <NavLink to="/my-posts" className={({ isActive }) => `block px-4 py-2 text-base font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-gray-800'}`} onClick={() => setIsDropdownOpen(false)}>My Posts</NavLink>
              {!isLoggedIn && <>
                <NavLink to="/login" className={({ isActive }) => `block px-4 py-2 text-base font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-gray-800'}`} onClick={() => setIsDropdownOpen(false)}>Sign In</NavLink>
                <NavLink to="/get-started" className={({ isActive }) => `block px-4 py-2 text-base font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-gray-800'}`} onClick={() => setIsDropdownOpen(false)}>Get Started</NavLink>
              </>}
              {isLoggedIn && <>
                <NavLink to="/my-profile" className={({ isActive }) => `block px-4 py-2 text-base font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-gray-800'}`} onClick={() => setIsDropdownOpen(false)}>My Profile</NavLink>
                <NavLink to="/settings" className={({ isActive }) => `block px-4 py-2 text-base font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-gray-800'}`} onClick={() => setIsDropdownOpen(false)}>Settings</NavLink>
                <button onClick={() => { handleLogout(); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">Logout</button>
              </>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              className="hidden md:block p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            {!isLoggedIn && (
              <>
              <Link 
              to="/login" 
              className="hidden md:block px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link 
              to="/get-started" 
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
              </>
            )}

            {isLoggedIn && (
              <div className="relative profile-dropdown">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  {/* Check for the user and that profilePhoto is true */}
                  {user && user.profilePhoto ? (
                    <img
                      src={`${API_URL}/api/auth/profile-photo/${user._id}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border dark:border-gray-700"
                      onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.username || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    
                    <Link
                      to="/my-profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </Link>

                    <Link
                      to="/my-posts"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      My Posts
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>

                    <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            
            {/* Mobile menu button toggles nav menu */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-800 transition-colors duration-200"
              onClick={toggleDropdown}
              aria-label="Open navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}