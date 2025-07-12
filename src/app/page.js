'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/layout/Layout';

// Hero Section
const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    '/vintagejeans.png',
    '/vintagethsirt.png',
    '/gucci.png',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-green-100 rounded-full opacity-60" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-100 rounded-full opacity-60" />
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-green-50 rounded-full opacity-60" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            <span className="sustainable-text">ReWear</span>
            <br />
            <span className="text-4xl md:text-5xl font-medium text-gray-700">
              Sustainable Fashion, 
            </span>
            <br />
            <span className="text-4xl md:text-5xl font-medium text-gray-700">
              Infinite Style
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Join the circular fashion revolution. Swap, share, and discover pre-loved clothing 
            while earning points and reducing waste. Your wardrobe, reimagined.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 fade-in">
          <Link href="/register" className="btn-sustainable text-lg px-8 py-4">
            Start Swapping Today
          </Link>
          <Link href="/items" className="btn-secondary text-lg px-8 py-4">
            Browse Items
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto fade-in">
          <div className="text-center">
            <div className="text-4xl font-bold sustainable-text mb-2">10K+</div>
            <div className="text-gray-600">Active Swappers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold sustainable-text mb-2">50K+</div>
            <div className="text-gray-600">Items Swapped</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold sustainable-text mb-2">95%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
        </div>
      </div>

      {/* Floating Image */}
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 hidden lg:block fade-in">
        <div className="relative">
          <div className="w-96 h-96 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={images[currentImage]}
              alt="Fashion showcase"
              className="w-full h-full object-cover transition-opacity duration-1000"
            />
          </div>
          <div className="absolute -inset-4 bg-green-600 rounded-2xl opacity-10" />
        </div>
      </div>
    </section>
  );
};

// Features Section
const Features = () => {
  const features = [
    {
      icon: "🔄",
      title: "Smart Swapping",
      description: "AI-powered matching system connects you with perfect swap partners based on style, size, and preferences."
    },
    {
      icon: "💎",
      title: "Points System",
      description: "Earn points for every successful swap and use them to unlock premium features and exclusive items."
    },
    {
      icon: "🌱",
      title: "Eco-Friendly",
      description: "Reduce fashion waste by giving pre-loved clothing a second life. Every swap helps the planet."
    },
    {
      icon: "🔒",
      title: "Secure & Trusted",
      description: "Verified users, secure payments, and comprehensive protection ensure safe and reliable swaps."
    },
    {
      icon: "📱",
      title: "Real-time Notifications",
      description: "Stay updated with instant notifications about swap requests, messages, and platform updates."
    },
    {
      icon: "🎯",
      title: "Personalized Experience",
      description: "Get tailored recommendations based on your style preferences and swap history."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="sustainable-text">ReWear</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of sustainable fashion with our innovative platform designed 
            for conscious consumers who love style and the planet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card card-hover p-8 text-center fade-in"
            >
              <div className="text-5xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "List Your Items",
      description: "Upload photos and details of clothing you'd like to swap. Our AI helps you set the perfect points value.",
      icon: "📸"
    },
    {
      number: "02",
      title: "Discover & Match",
      description: "Browse thousands of items from other users. Use our smart filters to find exactly what you're looking for.",
      icon: "🔍"
    },
    {
      number: "03",
      title: "Propose Swaps",
      description: "Send swap requests with personalized messages. Offer items or points to make the perfect trade.",
      icon: "🤝"
    },
    {
      number: "04",
      title: "Complete & Earn",
      description: "Once both parties agree, complete the swap and earn points for future exchanges.",
      icon: "🎉"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How <span className="sustainable-text">ReWear</span> Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started in minutes with our simple 4-step process designed for maximum convenience and satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative fade-in"
            >
              <div className="card p-8 text-center h-full">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <div className="text-4xl mb-6 mt-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTA = () => {
  return (
    <section className="py-20 bg-green-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/5" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Sustainable Fashion Journey?
          </h2>
          <p className="text-xl text-green-100 mb-12 max-w-2xl mx-auto">
            Join thousands of fashion-conscious individuals who are already making a difference 
            while looking amazing. Your perfect swap is waiting.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200">
              Get Started Free
            </Link>
            <Link href="/items" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-200">
              Explore Items
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold sustainable-text mb-4">ReWear</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              The future of sustainable fashion. Swap, share, and discover pre-loved clothing 
              while making a positive impact on the planet.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/items" className="hover:text-white transition-colors">Browse Items</Link></li>
              <li><Link href="/swaps" className="hover:text-white transition-colors">My Swaps</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">Profile</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Search</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ReWear. All rights reserved. Making fashion sustainable, one swap at a time.</p>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page
const LandingPage = () => {
  return (
    <Layout showSidebar={false}>
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </Layout>
  );
};

export default LandingPage;