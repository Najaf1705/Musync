import React from 'react'

const Errorpage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
          Sorry, the page you are looking for does not exist.
        </p>
        <a
          href="/"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded transition"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}

export default Errorpage
