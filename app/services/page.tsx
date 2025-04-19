"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import {
  Code,
  Zap,
  Shield,
  Smartphone,
  Globe,
  ShoppingCart,
  BarChart,
  Server,
  Database,
  Search,
  Layers,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ServicesPage() {
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: servicesRef, inView: servicesInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: processRef, inView: processInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.1 })

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

  const services = [
    {
      title: "Custom Web Development",
      description: "Tailored websites built from scratch to meet your specific business needs and goals.",
      icon: Code,
      link: "/services/custom-development",
      popular: true,
    },
    {
      title: "E-commerce Solutions",
      description: "Powerful online stores with secure payment processing and inventory management.",
      icon: ShoppingCart,
      link: "/services/ecommerce",
    },
    {
      title: "Responsive Design",
      description: "Mobile-friendly websites that look great on all devices and screen sizes.",
      icon: Smartphone,
      link: "/services/responsive-design",
    },
    {
      title: "Web Application Development",
      description: "Complex web applications with user authentication, dashboards, and custom functionality.",
      icon: Layers,
      link: "/services/web-applications",
    },
    {
      title: "Performance Optimization",
      description: "Speed up your website for better user experience and improved search rankings.",
      icon: Zap,
      link: "/services/performance",
    },
    {
      title: "SEO Services",
      description: "Improve your website's visibility in search engines and drive more organic traffic.",
      icon: Search,
      link: "/services/seo",
    },
    {
      title: "Website Maintenance",
      description: "Regular updates, security patches, and technical support to keep your website running smoothly.",
      icon: Shield,
      link: "/services/maintenance",
    },
    {
      title: "Deployment Services",
      description: "Expert deployment of your website to ensure reliability, security, and optimal performance.",
      icon: Server,
      link: "/service/deployment",
      featured: true,
    },
    {
      title: "Database Integration",
      description: "Connect your website to powerful databases for storing and managing your data.",
      icon: Database,
      link: "/services/database",
    },
    {
      title: "Analytics & Reporting",
      description: "Track your website's performance and gain insights into user behavior.",
      icon: BarChart,
      link: "/services/analytics",
    },
    {
      title: "Domain & Hosting",
      description: "Secure your domain name and get reliable hosting for your website.",
      icon: Globe,
      link: "/services/hosting",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 to-gray-950 z-0" />

        {/* Animated Background Patterns */}
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] z-0 opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                Our Services
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              From custom web development to deployment and maintenance, we offer a comprehensive range of services to
              help your business succeed online.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            ref={servicesRef}
            variants={containerVariants}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.03 }}>
                <Card
                  className={`h-full bg-gray-900 border ${service.featured ? "border-purple-500" : "border-gray-800"} overflow-hidden`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                        <service.icon className="h-6 w-6 text-purple-400" />
                      </div>
                      {service.popular && (
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border-purple-300 dark:border-purple-800">
                          Popular
                        </Badge>
                      )}
                      {service.featured && (
                        <Badge className="bg-gradient-to-r from-purple-600 to-purple-400 text-white border-none">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl text-white">{service.title}</CardTitle>
                    <CardDescription className="text-gray-400">{service.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Link href={service.link} className="w-full">
                      <Button
                        variant="outline"
                        className={`w-full ${
                          service.featured
                            ? "text-purple-400 border-purple-500 hover:bg-purple-500/10"
                            : "text-purple-400 border-purple-800 hover:bg-purple-900/20"
                        }`}
                      >
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            ref={processRef}
            initial={{ opacity: 0, y: 20 }}
            animate={processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Our Process</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We follow a structured approach to deliver high-quality web solutions that meet your business needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-full">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3 text-white mt-2">Discovery</h3>
                <p className="text-gray-300">
                  We start by understanding your business goals, target audience, and project requirements to create a
                  tailored solution.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative"
            >
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-full">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3 text-white mt-2">Design & Planning</h3>
                <p className="text-gray-300">
                  We create wireframes and design mockups for your approval, and develop a detailed project plan with
                  timelines.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative"
            >
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-full">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3 text-white mt-2">Development</h3>
                <p className="text-gray-300">
                  Our expert developers build your website or application using the latest technologies and best
                  practices.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="relative"
            >
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-full">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <h3 className="text-xl font-bold mb-3 text-white mt-2">Launch & Support</h3>
                <p className="text-gray-300">
                  We deploy your website, conduct thorough testing, and provide ongoing maintenance and support.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            ref={ctaRef}
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to get started?</h2>
            <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your project and see how we can help you achieve your business goals.
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
          </motion.div>
        </div>
      </section>
    </div>
  )
}
