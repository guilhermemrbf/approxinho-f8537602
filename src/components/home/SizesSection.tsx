import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { sizes } from "@/data/menu";
export function SizesSection() {
  return <section className="py-12 md:py-20 bg-background">
      <div className="container">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground sm:text-4xl">
            Nossos <span className="text-primary font-extrabold">Potes</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            240ml, 360ml ou 480ml • 5 acompanhamentos básicos inclusos em todos os tamanhos.
          </p>
        </motion.div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {sizes.map((size, index) => <motion.div key={size.id} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }}>
              <Link to={`/montar?size=${size.id}`}>
                <div className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-card border border-border p-4 md:p-8 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Size icon */}
                  <div className="relative mx-auto mb-3 md:mb-6 flex items-center justify-center">
                    <div className={`
                        rounded-full gradient-açai flex items-center justify-center text-2xl md:text-4xl shadow-lg
                        ${size.ml <= 240 ? 'h-14 w-14 md:h-20 md:w-20' : size.ml <= 360 ? 'h-16 w-16 md:h-24 md:w-24' : 'h-20 w-20 md:h-28 md:w-28'}
                      `}>
                      🍇
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative text-center">
                    <h3 className="text-base md:text-xl font-bold text-foreground">{size.name}</h3>
                    <p className="text-xl md:text-3xl font-extrabold text-primary mt-1 md:mt-2">
                      {size.ml}ml
                    </p>
                    <p className="text-xl md:text-3xl font-bold text-foreground mt-2 md:mt-4">
                      R$ {size.price.toFixed(2).replace(".", ",")}
                    </p>
                    <div className="mt-3 md:mt-4 text-xs md:text-sm text-muted-foreground space-y-1">
                      <p>✓ 5 acompanhamentos inclusos</p>
                      <p>✓ Supremo por R$ {size.supremoPrice.toFixed(2).replace(".", ",")}</p>
                    </div>
                    <div className="mt-4 md:mt-6 inline-flex items-center gap-2 text-sm md:text-base text-primary font-semibold group-hover:gap-3 transition-all">
                      Escolher
                      <span className="text-lg">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>)}
        </div>
      </div>
    </section>;
}