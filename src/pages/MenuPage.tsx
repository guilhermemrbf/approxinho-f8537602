import { motion } from "framer-motion";
import { sizes, flavors, complements, toppings, fruits, creams, extras } from "@/data/menu";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const MenuPage = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground sm:text-4xl">

            Nosso <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-primary)' }}>Cardápio</span>
          
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-muted-foreground">

            Açaí e Cupuaçu fresquinhos, do seu jeito!
          </motion.p>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 p-6 rounded-2xl gradient-açai text-center">

          <h2 className="text-xl font-bold text-primary-foreground mb-2">
            Monte seu Açaí Personalizado!
          </h2>
          <p className="text-primary-foreground/80 mb-4">
            Escolha tamanho, sabor, complementos, coberturas e frutas
          </p>
          <Link to="/montar">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Começar a Montar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Sizes */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            🍇 Monte do Seu Jeito
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sizes.map((size) =>
            <div
              key={size.id}
              className="bg-card rounded-xl border p-5 shadow-card">

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{size.name}</h3>
                    <p className="text-primary font-extrabold text-xl">{size.ml}ml</p>
                  </div>
                  <p className="text-2xl font-bold">
                    R$ {size.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="mt-3 text-xs text-muted-foreground space-y-0.5">
                  <p>✓ {size.freeComplements >= 99 ? "Acompanhamentos livres" : `${size.freeComplements} acomp. grátis`}</p>
                  <p>✓ {size.freeFruits >= 99 ? "Frutas livres" : `${size.freeFruits} fruta${size.freeFruits > 1 ? "s" : ""} grátis`}</p>
                  <p>✓ {size.freeToppings >= 99 ? "Caldas livres" : `${size.freeToppings} calda grátis`}</p>
                  {size.freeCream && <p>✓ Creme grátis incluso</p>}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Flavors */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            🍨 Sabores
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {flavors.map((flavor) =>
            <div
              key={flavor.id}
              className="bg-card rounded-xl border p-4 shadow-card flex items-center gap-4">

                <span className="text-4xl">{flavor.icon}</span>
                <div>
                  <h3 className="font-bold">{flavor.name}</h3>
                  <p className="text-sm text-muted-foreground">{flavor.description}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Complements */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
            🎊 Acompanhamentos
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Inclusos conforme tamanho • Adicional: R$ 1,00
          </p>
          <div className="flex flex-wrap gap-2">
            {complements.map((c) =>
            <span
              key={c.id}
              className="px-3 py-2 rounded-full bg-card border text-sm flex items-center gap-2">

                {c.icon} {c.name}
              </span>
            )}
          </div>
        </section>

        {/* Toppings / Caldas */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
            🍫 Caldas
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            1 grátis inclusa • Adicional: R$ 1,00
          </p>
          <div className="flex flex-wrap gap-2">
            {toppings.map((t) =>
            <span
              key={t.id}
              className="px-3 py-2 rounded-full bg-card border text-sm flex items-center gap-2">

                {t.icon} {t.name}
              </span>
            )}
          </div>
        </section>

        {/* Fruits */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
            🍓 Frutas
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Inclusos conforme tamanho • Adicional: R$ 1,00
          </p>
          <div className="flex flex-wrap gap-3">
            {fruits.map((f) =>
            <span
              key={f.id}
              className="px-4 py-3 rounded-xl bg-card border text-sm flex items-center gap-2 shadow-card">

                <span className="text-2xl">{f.icon}</span>
                {f.name}
              </span>
            )}
          </div>
        </section>

        {/* Creams */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
            🍨 Cremes / Mousse
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Acréscimo: R$ 2,00 • Grátis no 1.000ml
          </p>
          <div className="flex flex-wrap gap-3">
            {creams.map((c) =>
            <span
              key={c.id}
              className="px-4 py-3 rounded-xl bg-card border text-sm flex items-center gap-2 shadow-card">

                <span className="text-2xl">{c.icon}</span>
                {c.name}
              </span>
            )}
          </div>
        </section>

        {/* Extras / Adicionais */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
            🍬 Adicionais
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map((e) =>
            <div
              key={e.id}
              className="bg-card rounded-xl border p-4 shadow-card flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <span className="text-2xl">{e.icon}</span>
                  <span className="font-medium">{e.name}</span>
                </div>
                <span className="font-bold text-primary">
                  R$ {e.price.toFixed(2).replace(".", ",")}
                </span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>);

};

export default MenuPage;