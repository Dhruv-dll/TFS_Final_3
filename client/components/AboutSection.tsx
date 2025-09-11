import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Users, Award, Target } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "1000+",
    label: "Active Members",
  },
  {
    icon: TrendingUp,
    value: "50+",
    label: "Industry Partners",
  },
  {
    icon: Award,
    value: "25+",
    label: "Annual Events",
  },
  {
    icon: Target,
    value: "5+",
    label: "Years of Excellence",
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-20 overflow-hidden"
      style={{
        backgroundColor: "#101E36", // Solid navy background
      }}
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={isMobile ? { duration: 0 } : { duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            About <span className="text-finance-teal">TFS</span>
          </h2>
          <div className="w-24 h-1 bg-finance-teal mx-auto mb-6" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={
              isMobile ? { duration: 0 } : { duration: 0.8, delay: 0.2 }
            }
          >
            <h3 className="text-3xl font-bold text-finance-teal mb-6">
              Bridging Theory and Practice in Finance
            </h3>
            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <div>
                <h4 className="text-xl font-semibold text-finance-teal mb-3">
                  Our Story
                </h4>
                <p className="text-lg">
                  The Finance Symposium (TFS) is a flagship initiative by the
                  Department of Accounting and Finance at St. Xavier's College,
                  Mumbai. TFS is not merely an event; it is an invaluable
                  experience where all the different dimensions of finance are
                  explored effortlessly converging with knowledge based
                  amusement, knowledge which fosters innovation, networking
                  which cultivates opportunities. Get ready to be engrossed in
                  stimulating discussions, gaining insights from the industry
                  stalwarts and top business leaders, and enjoy an invigorating
                  atmosphere designed to both inspire and educate.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Photo Grid (replaces statistics metrics) */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={
              isMobile ? { duration: 0 } : { duration: 0.8, delay: 0.4 }
            }
          >
            {[
              {
                src:
                  "https://cdn.builder.io/api/v1/image/assets%2Fec53267d89ab44d08a2c376dc045e9e9%2F0f5273b6716a4240b73f697e6165774b?format=webp&width=800",
                alt: "Event panel discussion photo 1",
              },
              {
                src:
                  "https://cdn.builder.io/api/v1/image/assets%2Fec53267d89ab44d08a2c376dc045e9e9%2F8a76cf3505e542e79fb6d964ed82753d?format=webp&width=800",
                alt: "Event panel discussion photo 2",
              },
              {
                src:
                  "https://cdn.builder.io/api/v1/image/assets%2Fec53267d89ab44d08a2c376dc045e9e9%2Fc5cf76724a0a4830ad8f29befec4e99a?format=webp&width=800",
                alt: "Event panel discussion photo 3",
              },
              {
                src:
                  "https://cdn.builder.io/api/v1/image/assets%2Fec53267d89ab44d08a2c376dc045e9e9%2Fc65abcb71050401c9d417d0c6af632bc?format=webp&width=800",
                alt: "Event panel discussion photo 4",
              },
            ].map((photo, index) => (
              <motion.div
                key={photo.src}
                initial={
                  isMobile
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.5 }
                }
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={
                  isMobile
                    ? { duration: 0 }
                    : { duration: 0.6, delay: 0.6 + index * 0.1 }
                }
                className="relative group overflow-hidden rounded-xl border border-finance-teal/30 bg-finance-navy-light/95 shadow-lg hover:shadow-xl"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
