import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

function Card({ title, description, author, id, thumbnail, showActions = false, onDelete, onEdit}) {

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Image/Header */}
      <div className="h-48 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to gradient if image fails to load
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Metadata */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {author ? author.charAt(0).toUpperCase() : 'A'}
              </span>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {author}
            </span>
          </div>
          <time className="text-xs text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </time>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* Footer: Author + Read More */}
        <div className="flex items-center justify-between mb-4">
          {/* Author Info */}
          <div className="flex items-center flex-1 min-w-0">
            <div className="w-8 h-8 bg-gray-300 rounded-full mr-3 flex-shrink-0"></div> 
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              {author}
            </span>
          </div>

          {/* Read More Link */}
          <Link
            to={`/blog/${id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm whitespace-nowrap ml-4"
          >
            Read More →
          </Link>
        </div>

        {/* Edit/Delete Buttons*/}
        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button 
            onClick={() => onEdit(id)}
            className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors duration-200">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button 
            onClick={() => onDelete(id)}
            className="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors duration-200">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default Card;
