// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const institutions = [
    {
      name: 'School of engineering',
      description: 'Fostering innovation and technical excellence',
      image: '/intsitutions/Engineering.jpg',
      alumni: '1,000+'
    },
    {
      name: 'School of Languages',
      description: 'Rich in multilanguages and cultural diversity',
      image: '/intsitutions/language.jpg',
      alumni: '2,500+'
    },
    {
      name: 'School of Physical sciences',
      description: 'The science of the physical world and its phenomena',
      image: '/intsitutions/Physics.jpg',
      alumni: '1,200+'
    },
    {
      name: 'School of International studies',
      description: 'The study of global affairs and international relations',
      image: '/intsitutions/international_studies.jpg',
      alumni: '2,300+'
    },
  ];

  const features = [
    { icon: '🤝', title: 'Network', desc: 'Connect with alumni from your school' },
    { icon: '📅', title: 'Events', desc: 'Discover alumni meetups and conferences' },
    { icon: '💬', title: 'Chat', desc: 'Direct messaging with fellow alumni' },
    { icon: '👥', title: 'Directory', desc: 'Browse profiles and find connections' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-slate-900 bg-opacity-95 backdrop-blur z-40 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">AC</span>
            </div>
            <span className="text-2xl font-bold">AlumniConnect</span>
          </div>
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg hover:bg-slate-800 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold"
            >
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Connect with Your Alumni Network
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Reconnect with classmates, expand your professional network, and discover opportunities from our thriving alumni community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105"
            >
              Get Started →
            </Link>
            <a
              href="#about"
              className="px-8 py-4 border-2 border-blue-400 rounded-lg font-bold hover:bg-blue-400 hover:text-slate-900 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      {/* Features Section */}
      <section className="py-20 bg-slate-800 bg-opacity-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Why Join AlumniConnect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 bg-slate-800 rounded-lg border border-slate-700 hover:border-blue-500 transition text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Institutions Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Institutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {institutions.map((inst, idx) => (
              <div
                key={idx}
                className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 transition transform hover:-translate-y-2"
              >
                <img
                  src={inst.image}
                  alt={inst.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{inst.name}</h3>
                  <p className="text-slate-400 text-sm mb-3">{inst.description}</p>
                  <p className="text-blue-400 font-semibold">{inst.alumni} Alumni</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section, the uploaded photos */}
      <section className="py-20 bg-slate-800 bg-opacity-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Alumni Moments</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              'Img1.avif',
              'Img2.jpg',
              'Img3.jpg',
              'Img4.jpg',
              'Img5.jpg',
              'Img6.jpg'
            ].map((fileName, idx) => (
              <div
                key={idx}
                className="relative h-48 rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={`/gallary/${fileName}`}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                  <p className="text-white font-semibold">Alumni Event {idx + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section : Our activities*/}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-slate-800 rounded-lg border border-slate-700">
              <h3 className="text-5xl font-bold text-blue-400 mb-2">15K+</h3>
              <p className="text-slate-300">Active Alumni</p>
            </div>
            <div className="p-8 bg-slate-800 rounded-lg border border-slate-700">
              <h3 className="text-5xl font-bold text-purple-400 mb-2">500+</h3>
              <p className="text-slate-300">Monthly Events</p>
            </div>
            <div className="p-8 bg-slate-800 rounded-lg border border-slate-700">
              <h3 className="text-5xl font-bold text-pink-400 mb-2">50+</h3>
              <p className="text-slate-300">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Connect?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of alumni in our global network today</p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-slate-100 transition transform hover:scale-105"
          >
            Create Your Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">About</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">Network</a></li>
                <li><a href="#" className="hover:text-white">Events</a></li>
                <li><a href="#" className="hover:text-white">Directory</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>&copy; 2024 AlumniConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
