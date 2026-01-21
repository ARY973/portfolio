'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section className="py-24 px-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center"
      >

        {/* LEFT — IMAGE */}
        <div className="flex justify-center md:justify-start">
          <div className="relative z-10 max-w-5xl mx-auto px-8 py10 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 -z-10" />
            <Image
              src="/about/aryan.jpg"
              alt="Aryan portrait"
              width={360}
              height={360}
              className="rounded-2xl shadow-lg object-cover"
              priority
            />
          </div>
        </div>

        {/* RIGHT — TEXT */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-semibold text-white">About</h2>
          <p className="mt-4 text-gray-200 leading-relaxed">
            About
          </p>

          <p className="text-gray-800/90 leading-relaxed mb-4">
            I’m Aryan, and I’m glad you’re here. I began my journey with a
            Bachelor’s degree in Information Technology and early professional
            experience working with Power BI analytics and SAP MM in India.
          </p>

          <p className="text-gray-800/90leading-relaxed mb-4">
            Wanting to deepen my technical depth and gain global exposure, I moved
            to the United States to pursue a Master’s in Information Systems.
          </p>

          <p className="text-gray-800/90 leading-relaxed">
            My long-term goal is to work at the intersection of data, machine
            learning, and finance—helping teams make informed, strategic decisions.
          </p>
        </div>

      </motion.div>
    </section>
  );
}