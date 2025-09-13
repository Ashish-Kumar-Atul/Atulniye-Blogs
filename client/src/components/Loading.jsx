import React from 'react'

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="text-center space-y-6">
        {/* Simple Spinner */}
        <div className="relative flex justify-center">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
        </div>

        {/* Clean Title */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Loading...
        </h2>

        {/* Progress bar */}
        <div className="w-48 h-1 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
        </div>

        {/* Simple message */}
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Please wait while we load your content
        </p>
      </div>
    </div>
  );
}

export default Loading