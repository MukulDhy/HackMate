import React, { useEffect, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const HackMateDonationPage: React.FC = () => {
  const [raisedAmount, setRaisedAmount] = useState(12500);
  const [goalAmount, setGoalAmount] = useState(50000);
  const progress = (raisedAmount / goalAmount) * 100;

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const pulseAnimation = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatAnimation = {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold mb-6 font-orbitron bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            >
              Support Innovation.
              <br />
              Empower Hackers.
              <br />
              Build the Future.
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              HackMate connects students, mentors, and sponsors to accelerate hackathon ideas into real-world impact. 
              Your support fuels the next generation of innovators.
            </motion.p>
            
            <motion.button
              variants={fadeInUp}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(34, 211, 238, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl font-bold text-lg neon-glow-hover relative overflow-hidden group"
            >
              <span className="relative z-10">Donate Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-cyan-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Why We Need Donations */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 font-orbitron bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
          >
            Why Your Support Matters
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🚀",
                title: "Host Hackathons",
                description: "Providing free access and resources for students to innovate"
              },
              {
                icon: "💻",
                title: "Platform Infrastructure",
                description: "Covering server costs and maintaining the HackMate platform"
              },
              {
                icon: "👨‍🏫",
                title: "Mentorship Programs",
                description: "Building resources and workshops with industry experts"
              },
              {
                icon: "🏆",
                title: "Prizes & Scholarships",
                description: "Supporting student projects with funding and recognition"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card p-6 rounded-2xl text-center group cursor-pointer"
              >
                <motion.div
                  className="text-4xl mb-4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-cyan-300">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Value Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Beyond Coding Competitions
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                HackMate isn't just about coding competitions – it's about building a community where ideas become startups. 
                Your donation directly fuels innovation and supports young developers to turn dreams into reality.
              </p>
              <div className="flex flex-wrap gap-4">
                {["Community", "Innovation", "Mentorship", "Startups"].map((tag, index) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 text-sm font-semibold"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Animated Illustration */}
              <div className="relative w-full h-96">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-3xl blur-xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-4 glass-card rounded-2xl flex items-center justify-center">
                  <motion.div
                    className="text-6xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    💡
                  </motion.div>
                  <motion.div
                    className="absolute top-8 right-8 text-3xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    ⚡
                  </motion.div>
                  <motion.div
                    className="absolute bottom-8 left-8 text-3xl"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    🚀
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* QR Code Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Support HackMate
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Choose your preferred donation method. Every contribution helps us empower more students.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* QR Code Card */}
              <motion.div
                variants={pulseAnimation}
                initial="initial"
                whileInView="pulse"
                viewport={{ once: true }}
                className="relative"
              >
                <div className="glass-card p-8 rounded-3xl text-center">
                  <div className="w-64 h-64 mx-auto bg-white rounded-2xl p-4 mb-6 relative overflow-hidden">
                    {/* Placeholder for QR Code */}
                    <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">HackMate QR Code</span>
                    </div>
                    
                    {/* Animated border */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-transparent"
                      animate={{
                        borderColor: ["#22d3ee", "#a855f7", "#22d3ee"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        background: `linear-gradient(45deg, transparent, transparent), 
                                    linear-gradient(45deg, #22d3ee, #a855f7, #22d3ee)`,
                        backgroundClip: 'padding-box, border-box',
                        backgroundOrigin: 'padding-box, border-box'
                      }}
                    />
                  </div>
                  <p className="text-lg font-semibold text-cyan-300 mb-2">
                    Scan to Donate and Be a Part of the Change
                  </p>
                  <p className="text-gray-400 text-sm">
                    Quick and secure payment via QR code
                  </p>
                </div>

                {/* Floating particles */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      x: [0, Math.random() * 100 - 50],
                      y: [0, Math.random() * 100 - 50],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.6,
                    }}
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${10 + i * 15}%`,
                    }}
                  />
                ))}
              </motion.div>

              {/* Payment Methods */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                {[
                  { name: "UPI Payment", color: "from-green-500 to-emerald-600" },
                  { name: "PayPal", color: "from-blue-500 to-cyan-600" },
                  { name: "Credit Card", color: "from-purple-500 to-pink-600" },
                  { name: "Bank Transfer", color: "from-orange-500 to-red-600" }
                ].map((method, index) => (
                  <motion.button
                    key={method.name}
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.05,
                      x: 10
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-4 bg-gradient-to-r ${method.color} rounded-2xl font-semibold text-lg neon-glow-hover relative overflow-hidden group`}
                  >
                    <span className="relative z-10">{method.name}</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Progress & Transparency */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-3xl text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-orbitron bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Our Progress
            </h2>
            
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Raised: ${raisedAmount.toLocaleString()}</span>
                <span>Goal: ${goalAmount.toLocaleString()}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: [-100, 100] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: '50%' }}
                  />
                </motion.div>
              </div>
            </div>

            <p className="text-xl text-gray-300 mb-6">
              Every contribution, no matter how small, takes us one step closer to empowering 10,000+ students.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                { number: "2,500+", label: "Students Impacted" },
                { number: "50+", label: "Hackathons Hosted" },
                { number: "15", label: "Projects Funded" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 font-orbitron bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Together, we can hack the future.
            </h2>
            
            <motion.button
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 20px rgba(34, 211, 238, 0.3)",
                  "0 0 40px rgba(34, 211, 238, 0.6)",
                  "0 0 20px rgba(34, 211, 238, 0.3)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="px-16 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl font-bold text-xl relative overflow-hidden group"
            >
              <span className="relative z-10">Fuel Innovation Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800/50">
        <div className="container mx-auto max-w-6xl text-center text-gray-400">
          <p>© 2024 HackMate. Empowering the next generation of innovators.</p>
        </div>
      </footer>
    </div>
  );
};

export default HackMateDonationPage;