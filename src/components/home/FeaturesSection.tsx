import { motion } from "framer-motion";
import { Gift, Star, Zap, Heart } from "lucide-react";
const features = [{
  icon: Zap,
  title: "Montagem Rápida",
  description: "Interface intuitiva para personalizar seu açaí em segundos"
}, {
  icon: Star,
  title: "Toppings Ilimitados",
  description: "Adicione quantos complementos quiser ao seu copo"
}, {
  icon: Heart,
  title: "Fidelidade",
  description: "A cada 10 copos, ganhe 1 grátis! Programa exclusivo"
}, {
  icon: Gift,
  title: "Grátis Inclusos",
  description: "3 complementos, 1 cobertura e 1 fruta já no preço base"
}];
export function FeaturesSection() {
  return <section className="py-20 bg-accent/50">
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
            Por que escolher o <span className="text-primary font-extrabold">Açaí BH</span>?
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => <motion.div key={feature.title} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }} className="group relative overflow-hidden rounded-2xl bg-card p-6 shadow-card hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full" />
              
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-md">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>)}
        </div>
      </div>
    </section>;
}