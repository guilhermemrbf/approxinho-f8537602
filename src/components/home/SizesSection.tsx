import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { sizes } from "@/data/menu";
export function SizesSection() {
  return <section className="py-20 bg-background">
      <div className="container">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Escolha o <span className="text-primary font-extrabold">Tamanho</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            De 200ml a 1 litro! Acompanhamentos, caldas e frutas inclusos conforme o tamanho.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                <div className="group relative overflow-hidden rounded-3xl bg-card border border-border p-8 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Size icon */}
                  <div className="relative mx-auto mb-6 flex items-center justify-center">
                    <div className={`
                        rounded-full gradient-açai flex items-center justify-center text-4xl shadow-lg
                        ${size.ml <= 300 ? 'h-16 w-16' : size.ml <= 500 ? 'h-20 w-20' : size.ml <= 700 ? 'h-24 w-24' : 'h-28 w-28'}
                      `}>
                      🍇
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative text-center">
                    <h3 className="text-xl font-bold text-foreground">{size.name}</h3>
                    <p className="text-3xl font-extrabold text-primary mt-2">
                      {size.ml}ml
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-4">
                      R$ {size.price.toFixed(2).replace(".", ",")}
                    </p>
                    <div className="mt-4 text-sm text-muted-foreground space-y-1">
                      <p>✓ {size.freeComplements >= 99 ? "Acomp. livres" : `${size.freeComplements} acomp. grátis`}</p>
                      <p>✓ {size.freeToppings >= 99 ? "Caldas livres" : `${size.freeToppings} calda grátis`}</p>
                      <p>✓ {size.freeFruits >= 99 ? "Frutas livres" : `${size.freeFruits} fruta${size.freeFruits > 1 ? "s" : ""} grátis`}</p>
                      {size.freeCream && <p>✓ Creme grátis</p>}
                    </div>
                    <div className="mt-6 inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
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