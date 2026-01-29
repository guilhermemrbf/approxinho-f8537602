import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingCart, Check, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import {
  sizes,
  flavors,
  complements,
  toppings,
  fruits,
  Size,
  Flavor,
  Complement,
  Topping,
  Fruit,
} from "@/data/menu";

type Step = "size" | "flavor" | "complements" | "toppings" | "fruits" | "summary";

const steps: { key: Step; label: string }[] = [
  { key: "size", label: "Tamanho" },
  { key: "flavor", label: "Sabor" },
  { key: "complements", label: "Complementos" },
  { key: "toppings", label: "Coberturas" },
  { key: "fruits", label: "Frutas" },
  { key: "summary", label: "Resumo" },
];

const BuilderPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  const initialSize = searchParams.get("size");
  const [currentStep, setCurrentStep] = useState<Step>(initialSize ? "flavor" : "size");
  const [selectedSize, setSelectedSize] = useState<Size | null>(
    initialSize ? sizes.find((s) => s.id === initialSize) || null : null
  );
  const [selectedFlavor, setSelectedFlavor] = useState<Flavor | null>(null);
  const [selectedComplements, setSelectedComplements] = useState<Complement[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [selectedFruits, setSelectedFruits] = useState<Fruit[]>([]);
  const [quantity, setQuantity] = useState(1);

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const freeComplementsLeft = selectedSize
    ? selectedSize.freeComplements - Math.min(selectedComplements.length, selectedSize.freeComplements)
    : 0;
  const freeToppingsLeft = selectedSize
    ? selectedSize.freeToppings - Math.min(selectedToppings.length, selectedSize.freeToppings)
    : 0;
  const freeFruitsLeft = selectedSize
    ? selectedSize.freeFruits - Math.min(selectedFruits.length, selectedSize.freeFruits)
    : 0;

  const { totalPrice, breakdown } = useMemo(() => {
    if (!selectedSize) return { totalPrice: 0, breakdown: { base: 0, complements: 0, toppings: 0, fruits: 0 } };

    const base = selectedSize.price;

    // Complementos pagos (após os grátis)
    const paidComplements = selectedComplements.slice(selectedSize.freeComplements);
    const complementsPrice = paidComplements.reduce((sum, c) => sum + c.price, 0);

    // Coberturas pagas (após as grátis)
    const paidToppings = selectedToppings.slice(selectedSize.freeToppings);
    const toppingsPrice = paidToppings.reduce((sum, t) => sum + t.price, 0);

    // Frutas pagas (após as grátis)
    const paidFruits = selectedFruits.slice(selectedSize.freeFruits);
    const fruitsPrice = paidFruits.reduce((sum, f) => sum + f.price, 0);

    return {
      totalPrice: base + complementsPrice + toppingsPrice + fruitsPrice,
      breakdown: {
        base,
        complements: complementsPrice,
        toppings: toppingsPrice,
        fruits: fruitsPrice,
      },
    };
  }, [selectedSize, selectedComplements, selectedToppings, selectedFruits]);

  const canProceed = () => {
    switch (currentStep) {
      case "size":
        return selectedSize !== null;
      case "flavor":
        return selectedFlavor !== null;
      case "complements":
      case "toppings":
      case "fruits":
        return true;
      case "summary":
        return true;
      default:
        return false;
    }
  };

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key);
    }
  };

  const goPrev = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
    }
  };

  const toggleComplement = (complement: Complement) => {
    setSelectedComplements((prev) =>
      prev.find((c) => c.id === complement.id)
        ? prev.filter((c) => c.id !== complement.id)
        : [...prev, complement]
    );
  };

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings((prev) =>
      prev.find((t) => t.id === topping.id)
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  const toggleFruit = (fruit: Fruit) => {
    setSelectedFruits((prev) =>
      prev.find((f) => f.id === fruit.id)
        ? prev.filter((f) => f.id !== fruit.id)
        : [...prev, fruit]
    );
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedFlavor) return;

    addItem({
      size: selectedSize,
      flavor: selectedFlavor,
      complements: selectedComplements,
      toppings: selectedToppings,
      fruits: selectedFruits,
      quantity,
      totalPrice,
      freeComplementsUsed: Math.min(selectedComplements.length, selectedSize.freeComplements),
      freeToppingsUsed: Math.min(selectedToppings.length, selectedSize.freeToppings),
      freeFruitsUsed: Math.min(selectedFruits.length, selectedSize.freeFruits),
    });

    toast({
      title: "Adicionado ao carrinho! 🎉",
      description: `${quantity}x Açaí ${selectedSize.name} - ${selectedFlavor.name}`,
    });

    navigate("/carrinho");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Progress bar */}
      <div className="sticky top-0 z-40 bg-card border-b shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-foreground">Monte seu Açaí</h1>
            <span className="text-sm font-medium text-primary">
              R$ {totalPrice.toFixed(2).replace(".", ",")}
            </span>
          </div>
          <div className="flex gap-1">
            {steps.map((step, index) => (
              <div
                key={step.key}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  index <= currentStepIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {steps.map((step, index) => (
              <span
                key={step.key}
                className={index === currentStepIndex ? "text-primary font-semibold" : ""}
              >
                {step.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <AnimatePresence mode="wait">
          {/* SIZE STEP */}
          {currentStep === "size" && (
            <motion.div
              key="size"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold">Escolha o Tamanho</h2>
                <p className="text-muted-foreground mt-2">
                  Todos incluem complementos, cobertura e fruta grátis!
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`relative p-6 rounded-2xl border-2 transition-all ${
                      selectedSize?.id === size.id
                        ? "border-primary bg-primary/5 shadow-lg"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    {selectedSize?.id === size.id && (
                      <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`mx-auto rounded-full gradient-açai flex items-center justify-center text-3xl shadow-md mb-4 ${
                        size.ml === 300 ? "h-16 w-16" : size.ml === 500 ? "h-20 w-20" : "h-24 w-24"
                      }`}
                    >
                      🍇
                    </div>
                    <h3 className="font-bold text-lg">{size.name}</h3>
                    <p className="text-2xl font-extrabold text-primary">{size.ml}ml</p>
                    <p className="text-xl font-bold mt-2">
                      R$ {size.price.toFixed(2).replace(".", ",")}
                    </p>
                    <div className="mt-3 text-xs text-muted-foreground space-y-0.5">
                      <p>✓ {size.freeComplements} complementos</p>
                      <p>✓ {size.freeToppings} cobertura</p>
                      <p>✓ {size.freeFruits} fruta</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* FLAVOR STEP */}
          {currentStep === "flavor" && (
            <motion.div
              key="flavor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold">Escolha o Sabor</h2>
                <p className="text-muted-foreground mt-2">
                  Selecione a base do seu açaí
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {flavors.map((flavor) => (
                  <button
                    key={flavor.id}
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`relative p-5 rounded-2xl border-2 transition-all text-left ${
                      selectedFlavor?.id === flavor.id
                        ? "border-primary bg-primary/5 shadow-lg"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    {selectedFlavor?.id === flavor.id && (
                      <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <span className="text-4xl">{flavor.icon}</span>
                    <h3 className="font-bold text-lg mt-3">{flavor.name}</h3>
                    <p className="text-sm text-muted-foreground">{flavor.description}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* COMPLEMENTS STEP */}
          {currentStep === "complements" && (
            <motion.div
              key="complements"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold">Escolha os Complementos</h2>
                <p className="text-muted-foreground mt-2">
                  {freeComplementsLeft > 0 ? (
                    <>
                      Você ainda tem{" "}
                      <span className="text-primary font-bold">{freeComplementsLeft} grátis</span>!
                      Adicionais: R$ 2,00 cada
                    </>
                  ) : (
                    "Cada complemento adicional: R$ 2,00"
                  )}
                </p>
              </div>

              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {complements.map((complement, index) => {
                  const isSelected = selectedComplements.find((c) => c.id === complement.id);
                  const selectedIndex = selectedComplements.findIndex((c) => c.id === complement.id);
                  const isFree = selectedIndex !== -1 && selectedIndex < (selectedSize?.freeComplements || 0);

                  return (
                    <button
                      key={complement.id}
                      onClick={() => toggleComplement(complement)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <span className="text-2xl">{complement.icon}</span>
                      <p className="font-medium text-sm mt-2">{complement.name}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isFree ? "text-success font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        {isFree ? "GRÁTIS" : `+ R$ ${complement.price.toFixed(2).replace(".", ",")}`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TOPPINGS STEP */}
          {currentStep === "toppings" && (
            <motion.div
              key="toppings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold">Escolha as Coberturas</h2>
                <p className="text-muted-foreground mt-2">
                  {freeToppingsLeft > 0 ? (
                    <>
                      Você ainda tem{" "}
                      <span className="text-primary font-bold">{freeToppingsLeft} grátis</span>!
                      Adicionais: R$ 2,00 cada
                    </>
                  ) : (
                    "Cada cobertura adicional: R$ 2,00"
                  )}
                </p>
              </div>

              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {toppings.map((topping) => {
                  const isSelected = selectedToppings.find((t) => t.id === topping.id);
                  const selectedIndex = selectedToppings.findIndex((t) => t.id === topping.id);
                  const isFree = selectedIndex !== -1 && selectedIndex < (selectedSize?.freeToppings || 0);

                  return (
                    <button
                      key={topping.id}
                      onClick={() => toggleTopping(topping)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <span className="text-2xl">{topping.icon}</span>
                      <p className="font-medium text-sm mt-2">{topping.name}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isFree ? "text-success font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        {isFree ? "GRÁTIS" : `+ R$ ${topping.price.toFixed(2).replace(".", ",")}`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* FRUITS STEP */}
          {currentStep === "fruits" && (
            <motion.div
              key="fruits"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold">Escolha as Frutas</h2>
                <p className="text-muted-foreground mt-2">
                  {freeFruitsLeft > 0 ? (
                    <>
                      Você ainda tem{" "}
                      <span className="text-primary font-bold">{freeFruitsLeft} grátis</span>!
                      Adicionais: R$ 3,00 cada
                    </>
                  ) : (
                    "Cada fruta adicional: R$ 3,00"
                  )}
                </p>
              </div>

              <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                {fruits.map((fruit) => {
                  const isSelected = selectedFruits.find((f) => f.id === fruit.id);
                  const selectedIndex = selectedFruits.findIndex((f) => f.id === fruit.id);
                  const isFree = selectedIndex !== -1 && selectedIndex < (selectedSize?.freeFruits || 0);

                  return (
                    <button
                      key={fruit.id}
                      onClick={() => toggleFruit(fruit)}
                      className={`relative p-6 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                      <span className="text-5xl">{fruit.icon}</span>
                      <p className="font-bold mt-3">{fruit.name}</p>
                      <p
                        className={`text-sm mt-1 ${
                          isFree ? "text-success font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        {isFree ? "GRÁTIS" : `+ R$ ${fruit.price.toFixed(2).replace(".", ",")}`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SUMMARY STEP */}
          {currentStep === "summary" && selectedSize && selectedFlavor && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold">Resumo do Pedido</h2>
                <p className="text-muted-foreground mt-2">
                  Confira seu açaí personalizado
                </p>
              </div>

              <div className="max-w-lg mx-auto bg-card rounded-2xl border shadow-card p-6 space-y-4">
                {/* Size & Flavor */}
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="h-16 w-16 rounded-full gradient-açai flex items-center justify-center text-3xl">
                    {selectedFlavor.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedFlavor.name}</h3>
                    <p className="text-muted-foreground">
                      {selectedSize.name} ({selectedSize.ml}ml)
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="font-bold text-lg">R$ {breakdown.base.toFixed(2).replace(".", ",")}</p>
                  </div>
                </div>

                {/* Complements */}
                {selectedComplements.length > 0 && (
                  <div className="pb-4 border-b">
                    <h4 className="font-semibold mb-2">Complementos</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedComplements.map((c, i) => (
                        <span
                          key={c.id}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            i < selectedSize.freeComplements
                              ? "bg-success/20 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {c.icon} {c.name}
                          {i < selectedSize.freeComplements && " (grátis)"}
                        </span>
                      ))}
                    </div>
                    {breakdown.complements > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        + R$ {breakdown.complements.toFixed(2).replace(".", ",")}
                      </p>
                    )}
                  </div>
                )}

                {/* Toppings */}
                {selectedToppings.length > 0 && (
                  <div className="pb-4 border-b">
                    <h4 className="font-semibold mb-2">Coberturas</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedToppings.map((t, i) => (
                        <span
                          key={t.id}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            i < selectedSize.freeToppings
                              ? "bg-success/20 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {t.icon} {t.name}
                          {i < selectedSize.freeToppings && " (grátis)"}
                        </span>
                      ))}
                    </div>
                    {breakdown.toppings > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        + R$ {breakdown.toppings.toFixed(2).replace(".", ",")}
                      </p>
                    )}
                  </div>
                )}

                {/* Fruits */}
                {selectedFruits.length > 0 && (
                  <div className="pb-4 border-b">
                    <h4 className="font-semibold mb-2">Frutas</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFruits.map((f, i) => (
                        <span
                          key={f.id}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            i < selectedSize.freeFruits
                              ? "bg-success/20 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {f.icon} {f.name}
                          {i < selectedSize.freeFruits && " (grátis)"}
                        </span>
                      ))}
                    </div>
                    {breakdown.fruits > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        + R$ {breakdown.fruits.toFixed(2).replace(".", ",")}
                      </p>
                    )}
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center justify-between">
                  <span className="font-medium">Quantidade</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-extrabold text-primary">
                      R$ {(totalPrice * quantity).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg">
        <div className="container py-4 flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            className="flex-1 sm:flex-none"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          {currentStep !== "summary" ? (
            <Button
              variant="hero"
              size="lg"
              onClick={goNext}
              disabled={!canProceed()}
              className="flex-1 sm:flex-none"
            >
              Continuar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="hero"
              size="lg"
              onClick={handleAddToCart}
              className="flex-1 sm:flex-none"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Adicionar ao Carrinho
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;
