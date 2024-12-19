import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


const Home = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      title: "Secure Data Sharing",
      description: "Share your medical data securely with advanced encryption",
      icon: "🔒"
    },
    {
      title: "Earn Rewards",
      description: "Get incentivized for contributing to medical research",
      icon: "💎"
    },
    {
      title: "Privacy First",
      description: "Your data privacy is our top priority with OCY technology",
      icon: "🛡️"
    },
    {
      title: "AI-Powered Insights",
      description: "Contributing to advanced medical research through RAG",
      icon: "🤖"
    }
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-r from-blue-700 via-blue-300 to-blue-500">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center px-4 mt-20"
        >
          <motion.h1 
            initial={{ y: 30 }} 
            animate={{ y: 0 }} 
            className="text-6xl md:text-8xl font-bold mb-6 text-gray-900"
          >
            Med<span className="text-blue-800">Vault</span>
          </motion.h1>
          <motion.p 
            {...fadeIn}
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-800"
          >
            Revolutionizing healthcare by securely sharing medical data while earning rewards
          </motion.p>
          <motion.div 
            {...fadeIn}
            className="flex gap-4 justify-center"
          >
            <Link to="/trade" className="px-8 py-3 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-all font-semibold">
              Get Started
            </Link>
            <a href="#learn-more" className="px-8 py-3 border-2 border-blue-800 text-blue-900 rounded-full hover:bg-blue-50 transition-all">
              Learn More
            </a>
          </motion.div>

          {/* Floating medical icons */}
          <motion.div 
            className="absolute top-40 left-20 hidden lg:block"
            animate={{ y: [-10, 10], rotate: [0, 10] }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
          >
            <span className="text-6xl">💊</span>
          </motion.div>
          <motion.div 
            className="absolute bottom-40 right-20 hidden lg:block"
            animate={{ y: [10, -10], rotate: [0, -10] }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2.5 }}
          >
            <span className="text-6xl">🏥</span>
          </motion.div>

          {/* Additional floating medical icons */}
          <motion.div 
            className="absolute top-60 right-32 hidden lg:block"
            animate={{ y: [-15, 15], rotate: [0, -15] }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 3 }}
          >
            <span className="text-5xl">🧬</span>
          </motion.div>
          <motion.div 
            className="absolute bottom-60 left-32 hidden lg:block"
            animate={{ y: [12, -12], rotate: [0, 20] }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2.8 }}
          >
            <span className="text-5xl">⚕️</span>
          </motion.div>
          <motion.div 
            className="absolute top-1/4 right-1/4 hidden lg:block"
            animate={{ y: [-8, 8], x: [-5, 5] }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 3.2 }}
          >
            <span className="text-4xl">🔬</span>
          </motion.div>
          <motion.div 
            className="absolute bottom-1/4 left-1/4 hidden lg:block"
            animate={{ y: [10, -10], x: [8, -8] }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 3.5 }}
          >
            <span className="text-4xl">🧪</span>
          </motion.div>
          <motion.div 
            className="absolute top-1/3 left-1/3 hidden lg:block opacity-80"
            animate={{ y: [-12, 12], rotate: [10, -10] }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 4 }}
          >
            <span className="text-4xl">💉</span>
          </motion.div>
          <motion.div 
            className="absolute bottom-1/3 right-1/3 hidden lg:block opacity-80"
            animate={{ y: [15, -15], rotate: [-5, 5] }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 3.8 }}
          >
            <span className="text-4xl">🩺</span>
          </motion.div>

          {/* Background decorative elements */}
          <motion.div 
            className="absolute top-1/2 left-10 hidden lg:block opacity-20"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 15 }}
          >
            <span className="text-8xl">⚕️</span>
          </motion.div>
          <motion.div 
            className="absolute bottom-1/2 right-10 hidden lg:block opacity-20"
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 0] }}
            transition={{ repeat: Infinity, duration: 15 }}
          >
            <span className="text-8xl">🧬</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section - Updated styling */}
      <section id="learn-more" className="py-20 px-4 bg-white/90 backdrop-blur-lg">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">Why Choose MedVault?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-xl bg-white/80 backdrop-blur-lg hover:bg-white/90 transition-all border border-blue-100"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section - Updated styling */}
      <section className="py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                number: "100%", 
                label: "Data Privacy", 
                description: "End-to-end encryption for complete security",
                icon: "🔒"
              },
              { 
                number: "24/7", 
                label: "Secure Access", 
                description: "Always available, always protected",
                icon: "🌐"
              },
              { 
                number: "Instant", 
                label: "Rewards", 
                description: "Immediate benefits for data sharing",
                icon: "💎"
              }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="p-8 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <motion.h3 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  className="text-5xl font-bold text-white mb-2"
                >
                  {stat.number}
                </motion.h3>
                <h4 className="text-xl font-semibold text-blue-300 mb-2">{stat.label}</h4>
                <p className="text-gray-300">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 bg-black/10 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">Trusted by Healthcare Professionals</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Join thousands of healthcare providers and researchers who trust MedVault for secure data sharing and collaboration.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              "🏥 Hospitals",
              "👨‍⚕️ Doctors",
              "🔬 Researchers",
              "💊 Pharmacies"
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <p className="text-2xl mb-2">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section before Footer */}
      <section className="py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Transform Healthcare Data Sharing?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join MedVault today and be part of the revolution in secure medical data sharing.
          </p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            whileHover={{ scale: 1.02 }}
          >
            <Link 
              to="/trade" 
              className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all font-semibold"
            >
              Get Started Now
            </Link>
            <a 
              href="#learn-more" 
              className="px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white/10 transition-all"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* New Footer Section */}
      <footer className="bg-gray-900/90 backdrop-blur-lg border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">MedVault</h3>
              <p className="text-gray-300 max-w-md">
                Empowering healthcare through secure data sharing and blockchain technology.
                Join us in revolutionizing medical research while maintaining privacy.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Twitter</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Discord</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">GitHub</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2024 MedVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
   
    </div>
  );
};

export default Home;