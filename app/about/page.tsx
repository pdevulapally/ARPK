"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { History, Target, Award, Code, Zap, Shield, Lightbulb, Rocket, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  const { ref: missionRef, inView: missionInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: teamRef, inView: teamInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: valuesRef, inView: valuesInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: storyRef, inView: storyInView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Gradient Background */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-indigo-900 to-blue-950 animate-gradient-slow z-0" />

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-fuchsia-600/10 to-blue-600/20 animate-gradient z-0" />

        {/* Animated Glow Spots */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-pulse-glow" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse-glow animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[90px] opacity-25 animate-pulse-glow animation-delay-4000" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] z-0 opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Decorative Elements */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full opacity-70"></div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 animate-gradient-fast">
                ARPK
              </span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              We're a team of passionate developers dedicated to creating exceptional web experiences that help
              businesses thrive in the digital world.
            </p>

            {/* Animated Underline */}
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mx-auto animate-gradient-fast"></div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            ref={storyRef}
            variants={containerVariants}
            initial="hidden"
            animate={storyInView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants} className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-6 text-white">Our Story</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  ARPK Web Development was founded in 2022 by two university students with a shared passion for creating
                  beautiful, functional websites. What started as a side project quickly grew into a full-service web
                  development agency.
                </p>
                <p>
                  Our journey began when we noticed a gap in the market for affordable, high-quality web development
                  services for small businesses and startups. We combined our technical expertise and creative vision to
                  build a company that delivers premium websites without the premium price tag.
                </p>
                <p>
                  Today, we're proud to have helped dozens of clients establish their online presence and achieve their
                  business goals through custom web solutions.
                </p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-purple-900 aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <History className="h-24 w-24 text-purple-400 opacity-20" />
                  </div>
                  <img
                    src="/team-working.jpg"
                    alt="ARPK Team Working"
                    className="w-full h-full object-cover mix-blend-overlay opacity-80"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            ref={missionRef}
            variants={containerVariants}
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            className="text-center mb-12"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-4 text-white">
              Our Mission & Vision
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-300 max-w-3xl mx-auto">
              We're driven by a clear purpose and ambitious goals for the future.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Our Mission</h3>
              <p className="text-gray-300">
                To empower businesses with custom web solutions that are not only visually stunning but also
                strategically designed to drive growth and success. We believe that every business deserves a website
                that truly represents their brand and connects with their audience.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-6">
                <Lightbulb className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Our Vision</h3>
              <p className="text-gray-300">
                To become the go-to web development partner for businesses seeking quality, innovation, and reliability.
                We envision a future where every client we work with achieves measurable success through their digital
                presence, and where our team continues to push the boundaries of what's possible on the web.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            ref={teamRef}
            variants={containerVariants}
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
            className="text-center mb-12"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-4 text-white">
              Meet Our Team
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-300 max-w-3xl mx-auto">
              The talented individuals behind ARPK Web Development.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div variants={itemVariants} className="text-center">
              <div className="relative mb-6 mx-auto w-48 h-48">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full blur opacity-30"></div>
                <div className="relative bg-gray-800 rounded-full overflow-hidden border border-purple-900 w-full h-full">
                  <img src="/team-member-1.jpg" alt="Arjun Patel" className="w-full h-full object-cover" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Arjun Patel</h3>
              <p className="text-purple-400 mb-2">Co-Founder & Lead Developer</p>
              <p className="text-gray-400 text-sm">
                Full-stack developer with expertise in React and Node.js. Passionate about creating seamless user
                experiences.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="relative mb-6 mx-auto w-48 h-48">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full blur opacity-30"></div>
                <div className="relative bg-gray-800 rounded-full overflow-hidden border border-purple-900 w-full h-full">
                  <img src="/team-member-2.jpg" alt="Preetham Kumar" className="w-full h-full object-cover" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Preetham Kumar</h3>
              <p className="text-purple-400 mb-2">Co-Founder & Design Lead</p>
              <p className="text-gray-400 text-sm">
                UI/UX specialist with a background in graphic design. Turns complex ideas into intuitive interfaces.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="relative mb-6 mx-auto w-48 h-48">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full blur opacity-30"></div>
                <div className="relative bg-gray-800 rounded-full overflow-hidden border border-purple-900 w-full h-full">
                  <img src="/team-member-3.jpg" alt="Riya Shah" className="w-full h-full object-cover" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Riya Shah</h3>
              <p className="text-purple-400 mb-2">Project Manager</p>
              <p className="text-gray-400 text-sm">
                Ensures projects are delivered on time and within scope. Expert in client communication and team
                coordination.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="relative mb-6 mx-auto w-48 h-48">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full blur opacity-30"></div>
                <div className="relative bg-gray-800 rounded-full overflow-hidden border border-purple-900 w-full h-full">
                  <img src="/team-member-4.jpg" alt="Kiran Patel" className="w-full h-full object-cover" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Kiran Patel</h3>
              <p className="text-purple-400 mb-2">Backend Developer</p>
              <p className="text-gray-400 text-sm">
                Database and API specialist. Creates robust, scalable backend systems that power our applications.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            ref={valuesRef}
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
            className="text-center mb-12"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-4 text-white">
              Our Core Values
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Quality Craftsmanship</h3>
              <p className="text-gray-300">
                We take pride in writing clean, efficient code and creating designs that stand the test of time.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Innovation</h3>
              <p className="text-gray-300">
                We constantly explore new technologies and approaches to deliver cutting-edge solutions.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Client-Centered</h3>
              <p className="text-gray-300">
                We listen carefully to our clients' needs and build solutions that truly serve their goals.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Performance</h3>
              <p className="text-gray-300">
                We optimize every website for speed, responsiveness, and seamless functionality.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Security</h3>
              <p className="text-gray-300">
                We implement robust security measures to protect our clients and their users.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Excellence</h3>
              <p className="text-gray-300">We strive for excellence in everything we do, from code to communication.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to work with us?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Let's create something amazing together. Get in touch to discuss your project.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/request">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
                Request a Website
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-purple-800">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
