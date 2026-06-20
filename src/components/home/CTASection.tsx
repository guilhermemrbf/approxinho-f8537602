import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { businessInfo } from "@/data/menu";

export function CTASection() {
  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl md:rounded-3xl gradient-açai p-6 md:p-12 lg:p-16 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 text-5xl opacity-20 animate-float">🍇</div>
          <div className="absolute bottom-4 right-4 text-5xl opacity-20 animate-float" style={{ animationDelay: "1s" }}>🍓</div>
          <div className="absolute top-1/2 left-10 text-4xl opacity-10 animate-float" style={{ animationDelay: "0.5s" }}>🥝</div>
          <div className="absolute top-1/4 right-10 text-4xl opacity-10 animate-float" style={{ animationDelay: "1.5s" }}>🍌</div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground">
              Pronto pra montar o seu?
            </h2>
            <p className="mt-3 md:mt-4 text-sm md:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Personalize cada detalhe do seu açaí e receba fresquinho em casa.
              É rápido, fácil e delicioso!
            </p>
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
              <Link to="/montar" className="w-full sm:w-auto">
                <Button size="xl" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-xl group">
                  Começar a Montar
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              {businessInfo.whatsapp && (
                <a
                  href={`https://wa.me/${businessInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="outline" size="xl" className="w-full sm:w-auto border-white text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                    Falar no WhatsApp
                  </Button>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
