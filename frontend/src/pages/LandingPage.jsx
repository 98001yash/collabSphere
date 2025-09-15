import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Spotlight Your Projects, Connect Locally
            </h1>
            <p className="text-lg mb-6">
              CollabSphere is a Web3 + AI platform where students showcase projects, earn verified endorsements, and find hyperlocal internships and collaborators.
            </p>
            <div className="flex gap-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border border-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded font-semibold transition"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="md:w-1/2 mt-10 md:mt-0 relative">
            {/* Floating circles */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white opacity-20 rounded-full animate-bounce"></div>
            <div className="absolute top-20 right-0 w-48 h-48 bg-white opacity-10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 left-20 w-40 h-40 bg-white opacity-15 rounded-full animate-spin-slow"></div>

            <div className="w-full h-64 md:h-80 flex items-center justify-center text-6xl">
              🎓💡🌐
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-blue-600 text-4xl mb-4">💡</div>
            <h3 className="text-xl font-bold mb-2">Showcase Projects</h3>
            <p className="text-gray-600">Build an interactive portfolio to highlight your academic and personal projects.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-purple-600 text-4xl mb-4">🏅</div>
            <h3 className="text-xl font-bold mb-2">Earn Endorsements</h3>
            <p className="text-gray-600">Get verified endorsements from faculty to showcase your skills.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-green-600 text-4xl mb-4">📍</div>
            <h3 className="text-xl font-bold mb-2">Discover Opportunities</h3>
            <p className="text-gray-600">Find hyperlocal internships, events, and collaborators tailored for you.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6 text-lg">Join CollabSphere today and give your projects the spotlight they deserve.</p>
        <Link
          to="/register"
          className="bg-white text-blue-600 px-8 py-3 rounded font-semibold hover:bg-gray-100 transition"
        >
          Sign Up Now
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
