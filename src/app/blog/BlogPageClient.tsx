"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";

const categories = ["All", "Student Life", "Tips & Tricks", "Visakhapatnam", "Hostel Life", "Health"];

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Students Moving to Visakhapatnam for the First Time",
    excerpt:
      "Moving to a new city can be overwhelming. Here are practical tips to help you settle into Vizag smoothly and make the most of your time.",
    category: "Student Life",
    author: "Murams Team",
    date: "March 15, 2025",
    readTime: "5 min read",
    color: "from-[#1A2E5A] to-[#2A4A8A]",
    featured: true,
  },
  {
    id: 2,
    title: "Why Rushikonda is the Best Location for PG Accommodation in Vizag",
    excerpt:
      "Rushikonda offers a unique combination of natural beauty, proximity to IT parks, and educational institutions. Discover why it's the top choice for residents.",
    category: "Visakhapatnam",
    author: "Murams Team",
    date: "February 28, 2025",
    readTime: "4 min read",
    color: "from-[#E8601C] to-[#F4845F]",
    featured: false,
  },
  {
    id: 3,
    title: "How to Maintain a Healthy Work-Life Balance While Living in a PG",
    excerpt:
      "Living in a hostel or PG comes with unique challenges. Learn how to maintain a healthy balance between work, studies, and personal well-being.",
    category: "Health",
    author: "Murams Team",
    date: "February 10, 2025",
    readTime: "6 min read",
    color: "from-[#2A6049] to-[#4CAF82]",
    featured: false,
  },
  {
    id: 4,
    title: "A Complete Guide to Rushikonda Beach: Things to Do & Places to Visit",
    excerpt:
      "Just 1 km from Murams Living, Rushikonda Beach is a paradise. Here's everything you need to know about exploring this beautiful coastline.",
    category: "Visakhapatnam",
    author: "Murams Team",
    date: "January 25, 2025",
    readTime: "7 min read",
    color: "from-[#0056B3] to-[#007BFF]",
    featured: false,
  },
  {
    id: 5,
    title: "The Importance of Security in PG Accommodation: What to Look For",
    excerpt:
      "When choosing a PG or hostel, security should be your top priority. Here's a comprehensive checklist to evaluate safety features.",
    category: "Hostel Life",
    author: "Murams Team",
    date: "January 12, 2025",
    readTime: "5 min read",
    color: "from-[#C44E0E] to-[#E8601C]",
    featured: false,
  },
  {
    id: 6,
    title: "Budget-Friendly Hacks for Working Professionals in Hostel Life",
    excerpt:
      "Making the most of your hostel stay without breaking the bank. Smart tips for working professionals who want comfort on a budget.",
    category: "Tips & Tricks",
    author: "Murams Team",
    date: "December 20, 2024",
    readTime: "4 min read",
    color: "from-[#B5770D] to-[#E8B84B]",
    featured: false,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function BlogPageClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  const featuredPost = blogPosts.find((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured || activeCategory !== "All");

  return (
    <div className="min-h-screen">
      {/* Page Hero */}
      <section
        className="py-20 md:py-28 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0F1C38 0%, #1A2E5A 50%, #2A1A0E 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#E8601C]" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#F4845F]" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-[#E8601C]/20 border border-[#E8601C]/30 text-[#F4845F] text-xs font-semibold px-4 py-1.5 rounded-full mb-4"
          >
            Insights & Tips
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4"
          >
            Our{" "}
            <span className="gradient-text">Blog</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Tips, guides, and stories about hostel life, student living, and
            the beautiful city of Visakhapatnam.
          </motion.p>
        </div>
      </section>

      {/* Featured Post */}
      {activeCategory === "All" && featuredPost && (
        <section className="section-padding bg-white pb-0">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-2xl overflow-hidden bg-[#FFF8F5] border border-gray-100"
            >
              {/* Featured image */}
              <div
                className={`h-64 lg:h-auto bg-gradient-to-br ${featuredPost.color} relative flex items-center justify-center min-h-[240px]`}
              >
                <div className="text-center text-white p-8">
                  <div className="font-heading text-5xl font-bold opacity-20 mb-4">
                    Featured
                  </div>
                  <p className="text-white/60 text-sm">
                    {featuredPost.category}
                  </p>
                </div>
                <div className="absolute top-4 left-4 bg-[#E8601C] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Featured Post
                </div>
              </div>

              {/* Featured content */}
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={13} className="text-[#E8601C]" />
                  <span className="text-[#E8601C] text-xs font-semibold">
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className="font-heading font-bold text-xl md:text-2xl text-[#1A2E5A] mb-3 leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {featuredPost.readTime}
                  </span>
                </div>
                <button className="btn-primary self-start text-sm">
                  Read Full Article
                  <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Blog Posts */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionTitle
            eyebrow="Latest Articles"
            title="Read Our "
            highlight="Latest Posts"
            centered
          />

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#E8601C] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-[#E8601C]/10 hover:text-[#E8601C]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {regularPosts.map((post) => (
              <motion.article
                key={post.id}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
              >
                {/* Card image */}
                <div
                  className={`h-44 bg-gradient-to-br ${post.color} relative flex items-center justify-center overflow-hidden`}
                >
                  <div className="text-center text-white/30 font-heading text-4xl font-bold">
                    ML
                  </div>
                  <div className="absolute top-3 left-3 bg-white/90 text-[#E8601C] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Tag size={10} />
                    {post.category}
                  </div>
                </div>

                {/* Card content */}
                <div className="p-5">
                  <h3 className="font-heading font-bold text-base text-[#1A2E5A] mb-2 leading-tight group-hover:text-[#E8601C] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {post.readTime}
                      </span>
                    </div>
                    <ArrowRight
                      size={15}
                      className="text-[#E8601C] group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              No posts in this category yet.
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-[#FFF8F5]">
        <div className="container-custom">
          <div
            className="rounded-2xl p-8 md:p-12 text-center"
            style={{
              background: "linear-gradient(135deg, #1A2E5A 0%, #0F1C38 100%)",
            }}
          >
            <span className="inline-block bg-[#E8601C]/20 border border-[#E8601C]/30 text-[#F4845F] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              Stay Updated
            </span>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-white/70 mb-6 max-w-md mx-auto text-sm">
              Get the latest articles, tips, and Murams Living updates delivered
              directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#E8601C]"
              />
              <button className="bg-[#E8601C] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#C44E0E] transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
