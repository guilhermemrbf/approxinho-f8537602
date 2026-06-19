import { motion } from "framer-motion";
import { sizes, flavors, complements, toppings, businessInfo } from "@/data/menu";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const MenuPage = () => {
  const supremos = flavors.filter((f) => f.premium);

  return (
    <div className="min-h-screen bg-background py-6 md:py-10">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-foreground sm:text-4xl"
          >
            Nosso{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              Cardápio
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-sm md:text-base text-muted-foreground"
          >
            {businessInfo.tagline} — escolha seu pote do jeito que você ama.
          </motion.p>
        </div>

        {/* POTES */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-primary mb-4 text-center">Potes</h2>
          <div className="rounded-2xl border-2 border-primary/20 bg-card p-4 md:p-6 shadow-card">
            <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
              {sizes.map((size) => (
                <div key={size.id} className="rounded-xl bg-primary/5 p-3 md:p-5">
                  <p className="text-sm md:text-lg font-bold text-foreground">{size.ml}ML</p>
                  <p className="mt-2 inline-block rounded-lg bg-primary px-3 py-1.5 text-sm md:text-base font-extrabold text-primary-foreground">
                    R$ {size.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POTES SUPREMOS */}
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-primary mb-4 text-center">Potes Supremos</h2>
          <div className="rounded-2xl border-2 border-primary/30 bg-card p-4 md:p-6 shadow-card">
            <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
              {sizes.map((size) => (
                <div key={size.id} className="rounded-xl bg-primary/10 p-3 md:p-5">
                  <p className="text-sm md:text-lg font-bold text-foreground">{size.ml}ML</p>
                  <p className="mt-2 inline-block rounded-lg bg-primary px-3 py-1.5 text-sm md:text-base font-extrabold text-primary-foreground">
                    R$ {size.supremoPrice.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SUPREMOS - receitas */}
        <section className="mb-10">
          <h2 className="text-xl font-extrabold text-foreground mb-4 flex items-center gap-2">
            ✨ Supremos
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {supremos.map((s) => (
              <div key={s.id} className="rounded-xl border bg-card p-4 shadow-card">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <span className="text-xl">{s.icon}</span>
                  {s.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className="font-semibold">Acomp.:</span> {s.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* COMPLEMENTOS BÁSICOS */}
        <section className="mb-10">
          <h2 className="text-xl font-extrabold text-foreground mb-2 flex items-center gap-2">
            🎊 Complementos básicos
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            5 inclusos em todos os tamanhos • Acomp. extra: R$ 1,00
          </p>
          <div className="flex flex-wrap gap-2">
            {complements.map((c) => (
              <span
                key={c.id}
                className="px-3 py-1.5 rounded-full bg-card border text-xs md:text-sm flex items-center gap-1.5"
              >
                {c.icon} {c.name}
              </span>
            ))}
          </div>
        </section>

        {/* ADICIONAIS PREMIUM */}
        <section className="mb-10">
          <h2 className="text-xl font-extrabold text-foreground mb-2 flex items-center gap-2">
            ✨ Adicionais Premium
          </h2>
          <p className="text-xs text-muted-foreground mb-4">R$ 2,00 cada</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {toppings.map((t) => (
              <div
                key={t.id}
                className="rounded-xl bg-card border p-4 shadow-card flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.icon}</span>
                  <span className="font-medium">{t.name}</span>
                </div>
                <span className="font-bold text-primary">
                  R$ {t.price.toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 rounded-2xl gradient-açai text-center"
        >
          <h2 className="text-xl font-bold text-primary-foreground mb-2">
            Monte seu pote do seu jeito!
          </h2>
          <p className="text-primary-foreground/80 mb-4 text-sm">
            Escolha tamanho, tipo e seus complementos favoritos.
          </p>
          <Link to="/montar">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Começar a Montar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default MenuPage;