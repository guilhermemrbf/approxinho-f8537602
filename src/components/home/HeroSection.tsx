import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-acai.jpg";
export function HeroSection() {
  return <section className="relative min-h-[70vh] md:min-h-[90vh] flex items-center overflow-hidden py-12 md:py-0">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Açaí delicioso com toppings" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-secondary/95 via-secondary/85 to-secondary/40 md:to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-2xl">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Monte do seu jeito!
            </span>
          </motion.div>

          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
          }} className="mt-5 text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            O melhor <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Açaí</span> da região,
            <br />
            <span className="text-primary-foreground/90">personalizado pra você</span>
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="mt-4 text-base md:text-lg text-primary-foreground/80 max-w-xl">
            Escolha o tamanho, sabor, complementos ilimitados, coberturas e frutas.
            Montamos exatamente como você imaginou! 🍇
          </motion.p>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link to="/montar" className="w-full sm:w-auto">
              <Button variant="hero" size="xl" className="group w-full sm:w-auto">
                Monte seu Açaí
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/cardapio" className="w-full sm:w-auto">
              <Button variant="glass" size="xl" className="w-full sm:w-auto text-primary-foreground border-primary-foreground/30">
                Ver Cardápio
              </Button>
            </Link>
          </motion.div>

          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.6,
          delay: 0.5
        }} className="mt-8 md:mt-12 flex flex-wrap gap-4 md:gap-6">
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/30 backdrop-blur-sm">
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <p className="font-semibold">Entrega Rápida</p>
                <p className="text-xs opacity-80">30-45 minutos</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div initial={{
      opacity: 0,
      scale: 0.8
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      duration: 1,
      delay: 0.5
    }} className="absolute bottom-10 right-10 hidden lg:block">
        <div className="text-8xl animate-float">🍇</div>
      </motion.div>
    </section>;
}