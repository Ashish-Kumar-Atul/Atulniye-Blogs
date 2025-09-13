import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              About
            </h3>
            <p className="mt-4 text-gray-300 text-sm">
              A simple blog site built with the MERN stack. Post, explore, and manage your thoughts!
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/all-posts" className="text-gray-300 hover:text-white transition duration-200">
                  All Posts
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-gray-300 hover:text-white transition duration-200">
                  Create Post
                </Link>
              </li>
              <li>
                <Link to="/my-posts" className="text-gray-300 hover:text-white transition duration-200">
                  My Posts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Categories
            </h3>
            <ul className="mt-4 space-y-2">
              <li><span className="text-gray-300">Tech</span></li>
              <li><span className="text-gray-300">Lifestyle</span></li>
              <li><span className="text-gray-300">Coding</span></li>
              <li><span className="text-gray-300">Travel</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Atulniye Blogs. All rights reserved.</p>
          <div className="space-x-4">
            <Link to="/" className="hover:text-white">Home</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}