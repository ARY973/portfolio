"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const images = [
  "/dc/20251010_051612_7CAE45.jpeg",
  "/dc/20251010_051612_788752.jpeg",
  "/dc/20251010_184124_700A1F.jpeg",
  "/dc/20251010_184124_79519E.jpeg",
  "/dc/20251010_184124_739209.jpeg",
  "/dc/20251010_184838_79891F.jpeg",
  "/dc/20251010_190310_7E70B1.jpeg",
  "/dc/20251010_190310_774615.jpeg",
  "/dc/20251012_104518_799B77.jpeg",
  "/dc/20251012_104519_7CEBDA.jpeg",
];

export default function DcExperience() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* TEXT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            backdrop-blur-md
            bg-white/10
            border border-white/20
            rounded-2xl
            p-10
            shadow-xl
            space-y-6
          "
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            Washington DC Leadership Experience
          </h2>

          <p className="text-white/80 leading-relaxed">
            I have tears while writing this. I never imagined that I would be gifted
            with so many experiences, lessons, and relationships in a single year.
          </p>

          <p className="text-white/80 leading-relaxed">
            As an international student, I never felt like I was away from home.
            Utah State University and the Jon M. Huntsman School of Business shaped
            me in ways I’ll carry for life.
          </p>

          <p className="italic text-white/60">
            “Ascend to higher ground and descend to higher ground.”
          </p>
        </motion.div>

        {/* IMAGE CAROUSEL */}
        <div className="relative h-[520px] overflow-hidden rounded-2xl shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={images[index]}
              alt={`Washington DC ${index + 1}`}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="
                h-full w-full object-cover
                rounded-2xl
                transition-transform duration-500
                hover:scale-[1.02]
              "
            />
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}