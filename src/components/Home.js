import React from "react";
import image from "../assets/image.png"; 
import { useNavigate } from "react-router-dom";
import { Search, Shield, Star, Users } from "lucide-react";  // ✅ Added icons

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 text-white font-sans">
      {/* Home Section */}
      <section
        className="h-screen flex flex-col justify-center px-8 pt-20"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold">Find your perfect stay,</h1>
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mt-2">
            Stress-free.
          </h1>

          <button
            onClick={() => {
              console.log("Navigating...");
              navigate("/search");
            }}
            className="mt-6 bg-white bg-opacity-50 px-12 py-5 text-black rounded-3xl font-bold text-2xl hover:bg-gray-100"
          >
            Search Now
          </button>

          <p className="mt-6 text-lg font-light">
            “Smart Boarding Finder helps students and professionals easily find trusted boarding
            places through a simple and user-friendly platform.”
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Smart Boarding Finder?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide a comprehensive platform that connects property owners with potential tenants,
              making the process of finding and renting boarding places simple and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
              <p className="text-gray-600">
                Find boarding places that match your preferences with our advanced search filters.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
              <p className="text-gray-600">
                All properties are verified and reviewed by our team for your safety.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-gray-600">
                We ensure high-quality accommodations that meet our standards.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                Join our community of students and professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started with Smart Boarding Finder is simple and straightforward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Search & Browse</h3>
              <p className="text-gray-600">
                Use our search filters to find boarding places that match your location, budget, and preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Contact Owner</h3>
              <p className="text-gray-600">
                Get in touch with property owners directly through our secure messaging system.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Book & Move In</h3>
              <p className="text-gray-600">
                Finalize your booking and move into your new boarding place hassle-free.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
