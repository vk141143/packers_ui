import { motion } from "framer-motion";
import { Shield, Package, Truck, MapPin, Phone, CheckCircle, Clock, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

function ElegantShape({ className, delay = 0, width = 400, height = 100, rotate = 0, gradient = "from-white/[0.08]" }: {
  className?: string; delay?: number; width?: number; height?: number; rotate?: number; gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        <div className={cn("absolute inset-0 rounded-full bg-gradient-to-r to-transparent", gradient, "backdrop-blur-[2px] border-2 border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]")} />
      </motion.div>
    </motion.div>
  );
}

export function EnhancedLanding() {
  const navigate = useNavigate();

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 1, delay: 0.5 + i * 0.2, ease: [0.25, 0.4, 0.25, 1] } }),
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* British Flag Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-white to-blue-600" />
      </div>

      <nav className="relative z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-600 to-blue-700 p-2 rounded-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">UK Packers & Movers</span>
            <p className="text-xs text-blue-200">Trusted Since 2024</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-white/90 hover:text-white px-4 py-2 font-medium">Sign In</button>
          <button onClick={() => navigate('/signup')} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg">Get Started</button>
        </motion.div>
      </nav>

      <div className="flex-1 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent" />
        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape delay={0.3} width={600} height={140} rotate={12} gradient="from-red-600/[0.15]" className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]" />
          <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="from-blue-700/[0.15]" className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]" />
          <ElegantShape delay={0.4} width={300} height={80} rotate={-8} gradient="from-slate-400/[0.15]" className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div custom={0} variants={fadeUpVariants} initial="hidden" animate="visible" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.15] mb-8 md:mb-12 backdrop-blur-sm">
              <Shield className="h-4 w-4 text-red-400" />
              <span className="text-sm text-white/80 tracking-wide font-medium">Trusted by UK Councils & Housing Associations</span>
            </motion.div>

            <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 tracking-tight leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-blue-100 to-white/90">Britain's Premier</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-white to-blue-400">Property Clearance</span>
              </h1>
            </motion.div>

            <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
              <p className="text-lg sm:text-xl md:text-2xl text-blue-100/90 mb-10 leading-relaxed font-light max-w-3xl mx-auto px-4">
                24-48 hour emergency response across England, Scotland & Wales. 
                <span className="text-white font-medium"> SLA-guaranteed</span> service for councils, insurers & housing associations.
              </p>
            </motion.div>

            <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button onClick={() => navigate('/booking')} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-5 text-lg font-semibold rounded-xl flex items-center gap-3 shadow-2xl shadow-red-900/50 transition-all hover:scale-105">
                <Truck className="h-6 w-6" />
                Book Emergency Clearance
              </button>
              <button className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-5 text-lg font-semibold rounded-xl flex items-center gap-3 backdrop-blur-sm transition-all hover:border-white/50">
                <Phone className="h-6 w-6" />
                0800 123 4567
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div custom={4} variants={fadeUpVariants} initial="hidden" animate="visible" className="flex flex-wrap justify-center gap-6 mb-16 text-sm text-blue-200/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>ISO 9001 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Fully Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>GDPR Compliant</span>
              </div>
            </motion.div>

            <motion.div custom={5} variants={fadeUpVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Clock, title: "24h Emergency Response", desc: "Guaranteed dispatch within hours", color: "from-red-500 to-red-600" },
                { icon: Shield, title: "SLA Compliance", desc: "Audit-ready documentation", color: "from-blue-600 to-blue-700" },
                { icon: Award, title: "UK-Wide Coverage", desc: "London • Birmingham • Manchester", color: "from-slate-600 to-slate-700" },
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-2xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-md hover:bg-white/[0.08] transition-all hover:scale-105 hover:border-white/20">
                  <div className={cn("w-14 h-14 rounded-xl bg-gradient-to-br", feature.color, "flex items-center justify-center mb-5 group-hover:scale-110 transition-transform")}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-blue-200/70 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent pointer-events-none" />
    </div>
  );
}
