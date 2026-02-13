import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingCart, Check, Plus, Minus, Sparkles } from "lucide-react";
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

const steps: { key: Step; label: string; emoji: string }[] = [
  { key: "size", label: "Tamanho", emoji: "📏" },
  { key: "flavor", label: "Sabor", emoji: "🍇" },
  { key: "complements", label: "Acompanhamentos", emoji: "🍫" },
  { key: "toppings", label: "Caldas", emoji: "🍯" },
  { key: "fruits", label: "Frutas", emoji: "🍓" },
  { key: "summary", label: "Resumo", emoji: "✨" },
];

const BuilderPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Scroll to top when step changes
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key);
      setTimeout(scrollToTop, 50);
    }
  };

  const goPrev = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
      setTimeout(scrollToTop, 50);
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
    <div className="min-h-screen bg-background pb-28 md:pb-32">
      {/* Progress bar - Improved Design */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b shadow-sm" ref={contentRef}>
        <div className="container py-3 md:py-4">
          {/* Header with price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full gradient-açai flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-extrabold text-foreground">Monte seu Açaí</h1>
                <p className="text-xs text-muted-foreground">Personalize do seu jeito</p>
              </div>
            </div>
            <div className="text-right bg-primary/10 px-4 py-2 rounded-xl">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Total</p>
              <span className="text-xl md:text-2xl font-extrabold text-primary">
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
          
          {/* Step Indicators - Clickable circles */}
          <div className="flex items-center justify-between relative">
            {/* Progress line behind */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-muted" />
            <div 
              className="absolute top-4 left-6 h-0.5 bg-primary transition-all duration-500"
              style={{ width: `calc(${(currentStepIndex / (steps.length - 1)) * 100}% - 48px)` }}
            />
            
            {steps.map((step, index) => {
              const isComplete = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isClickable = index < currentStepIndex;
              
              return (
                <button
                  key={step.key}
                  onClick={() => {
                    if (isClickable) {
                      setCurrentStep(step.key);
                      setTimeout(scrollToTop, 50);
                    }
                  }}
                  disabled={!isClickable}
                  className="flex flex-col items-center gap-1 relative z-10"
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                    isComplete 
                      ? "bg-primary text-primary-foreground shadow-md cursor-pointer" 
                      : isCurrent 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/20 scale-110" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {isComplete ? <Check className="h-4 w-4" /> : step.emoji}
                  </div>
                  <span className={`text-[9px] md:text-[10px] font-medium leading-tight text-center max-w-[60px] ${
                    isCurrent ? "text-primary font-bold" : isComplete ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-4 md:py-8">
        <AnimatePresence mode="wait">
          {/* SIZE STEP */}
          {currentStep === "size" && (
            <motion.div
              key="size"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 md:space-y-6"
            >
              <div className="text-center px-2">
                <h2 className="text-xl md:text-2xl font-bold">Escolha o Tamanho</h2>
                <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
                  Acompanhamentos, caldas e frutas inclusos conforme o tamanho!
                </p>
              </div>

              <div className="grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`relative p-4 md:p-5 rounded-2xl border-2 transition-all active:scale-[0.97] flex flex-col items-center text-center ${
                      selectedSize?.id === size.id
                        ? "border-primary bg-primary/5 shadow-xl shadow-primary/20 scale-[1.02]"
                        : "border-border bg-card hover:border-primary/40 hover:shadow-md active:bg-primary/5"
                    }`}
                  >
                    {selectedSize?.id === size.id && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow-md"
                      >
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </motion.div>
                    )}
                    <div
                      className={`rounded-full gradient-açai flex items-center justify-center text-2xl shadow-lg mb-3 ${
                        size.ml <= 300 ? "h-14 w-14" : size.ml <= 500 ? "h-16 w-16" : "h-20 w-20"
                      }`}
                    >
                      🍇
                    </div>
                    <h3 className="font-bold text-sm md:text-base">{size.name}</h3>
                    <p className="text-lg md:text-xl font-extrabold text-primary">{size.ml}ml</p>
                    <p className="text-base font-bold mt-1">
                      R$ {size.price.toFixed(2).replace(".", ",")}
                    </p>
                    <div className="mt-2 text-[10px] md:text-xs text-muted-foreground space-y-0.5 w-full">
                      <p>✓ {size.freeComplements >= 99 ? "Acomp. livres" : `${size.freeComplements} acomp.`}</p>
                      <p>✓ {size.freeToppings >= 99 ? "Caldas livres" : `${size.freeToppings} calda`}</p>
                      <p>✓ {size.freeFruits >= 99 ? "Frutas livres" : `${size.freeFruits} fruta${size.freeFruits > 1 ? "s" : ""}`}</p>
                      {size.freeCream && <p className="text-primary font-semibold">✓ Creme grátis</p>}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 md:space-y-6"
            >
              <div className="text-center px-2">
                <h2 className="text-xl md:text-2xl font-bold">Escolha o Sabor</h2>
                <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
                  Selecione a base do seu açaí
                </p>
              </div>

              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {flavors.map((flavor) => (
                  <button
                    key={flavor.id}
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`relative p-4 md:p-5 rounded-2xl border-2 transition-all text-left active:scale-[0.98] ${
                      selectedFlavor?.id === flavor.id
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                        : "border-border bg-card hover:border-primary/50 active:bg-primary/5"
                    }`}
                  >
                    {selectedFlavor?.id === flavor.id && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 md:top-3 md:right-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow-md"
                      >
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </motion.div>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-3xl md:text-4xl">{flavor.icon}</span>
                      <div>
                        <h3 className="font-bold text-base md:text-lg">{flavor.name}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">{flavor.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* COMPLEMENTS STEP */}
          {currentStep === "complements" && (
            <motion.div
              key="complements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 md:space-y-6"
            >
              <div className="text-center px-2">
                <h2 className="text-xl md:text-2xl font-bold">Escolha os Acompanhamentos</h2>
                {freeComplementsLeft > 0 && (
                  <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
                    <span className="text-success font-bold text-sm">{freeComplementsLeft} GRÁTIS</span>
                    <span className="text-xs text-muted-foreground">restantes</span>
                  </div>
                )}
                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                  Adicionais: R$ 1,00 cada
                </p>
              </div>

              <div className="grid gap-2 md:gap-3 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
                {complements.map((complement) => {
                  const isSelected = selectedComplements.find((c) => c.id === complement.id);
                  const selectedIndex = selectedComplements.findIndex((c) => c.id === complement.id);
                  const isFree = selectedIndex !== -1 && selectedIndex < (selectedSize?.freeComplements || 0);

                  return (
                    <button
                      key={complement.id}
                      onClick={() => toggleComplement(complement)}
                      className={`relative p-2 md:p-4 rounded-xl border-2 transition-all active:scale-[0.95] ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-card hover:border-primary/50 active:bg-primary/5"
                      }`}
                    >
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow-md"
                        >
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </motion.div>
                      )}
                      <span className="text-xl md:text-2xl">{complement.icon}</span>
                      <p className="font-medium text-[11px] md:text-sm mt-1 md:mt-2 leading-tight">{complement.name}</p>
                      <p
                        className={`text-[10px] md:text-xs mt-0.5 md:mt-1 font-medium ${
                          isFree ? "text-success" : "text-muted-foreground"
                        }`}
                      >
                        {isFree ? "GRÁTIS" : `+R$${complement.price.toFixed(0)}`}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 md:space-y-6"
            >
              <div className="text-center px-2">
                <h2 className="text-xl md:text-2xl font-bold">Escolha as Caldas</h2>
                {freeToppingsLeft > 0 && (
                  <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
                    <span className="text-success font-bold text-sm">{freeToppingsLeft} GRÁTIS</span>
                    <span className="text-xs text-muted-foreground">restantes</span>
                  </div>
                )}
                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                  Adicionais: R$ 1,00 cada
                </p>
              </div>

              <div className="grid gap-2 md:gap-3 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
                {toppings.map((topping) => {
                  const isSelected = selectedToppings.find((t) => t.id === topping.id);
                  const selectedIndex = selectedToppings.findIndex((t) => t.id === topping.id);
                  const isFree = selectedIndex !== -1 && selectedIndex < (selectedSize?.freeToppings || 0);

                  return (
                    <button
                      key={topping.id}
                      onClick={() => toggleTopping(topping)}
                      className={`relative p-2 md:p-4 rounded-xl border-2 transition-all active:scale-[0.95] ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-card hover:border-primary/50 active:bg-primary/5"
                      }`}
                    >
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow-md"
                        >
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </motion.div>
                      )}
                      <span className="text-xl md:text-2xl">{topping.icon}</span>
                      <p className="font-medium text-[11px] md:text-sm mt-1 md:mt-2 leading-tight">{topping.name}</p>
                      <p
                        className={`text-[10px] md:text-xs mt-0.5 md:mt-1 font-medium ${
                          isFree ? "text-success" : "text-muted-foreground"
                        }`}
                      >
                        {isFree ? "GRÁTIS" : `+R$${topping.price.toFixed(0)}`}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 md:space-y-6"
            >
              <div className="text-center px-2">
                <h2 className="text-xl md:text-2xl font-bold">Escolha as Frutas</h2>
                {freeFruitsLeft > 0 && (
                  <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
                    <span className="text-success font-bold text-sm">{freeFruitsLeft} GRÁTIS</span>
                    <span className="text-xs text-muted-foreground">restantes</span>
                  </div>
                )}
                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                  Adicionais: R$ 3,00 cada
                </p>
              </div>

              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                {fruits.map((fruit) => {
                  const isSelected = selectedFruits.find((f) => f.id === fruit.id);
                  const selectedIndex = selectedFruits.findIndex((f) => f.id === fruit.id);
                  const isFree = selectedIndex !== -1 && selectedIndex < (selectedSize?.freeFruits || 0);

                  return (
                    <button
                      key={fruit.id}
                      onClick={() => toggleFruit(fruit)}
                      className={`relative p-4 md:p-6 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/20"
                          : "border-border bg-card hover:border-primary/50 active:bg-primary/5"
                      }`}
                    >
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 md:top-3 md:right-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow-md"
                        >
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </motion.div>
                      )}
                      <span className="text-4xl md:text-5xl">{fruit.icon}</span>
                      <p className="font-bold text-sm md:text-base mt-2 md:mt-3">{fruit.name}</p>
                      <p
                        className={`text-xs md:text-sm mt-1 font-medium ${
                          isFree ? "text-success" : "text-muted-foreground"
                        }`}
                      >
                        {isFree ? "GRÁTIS" : `+R$${fruit.price.toFixed(0)}`}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 md:space-y-6"
            >
              <div className="text-center px-2">
                <h2 className="text-xl md:text-2xl font-bold">Resumo do Pedido</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Confira seu açaí personalizado
                </p>
              </div>

              <div className="max-w-lg mx-auto bg-card rounded-2xl border shadow-card p-4 md:p-6 space-y-3 md:space-y-4">
                {/* Size & Flavor */}
                <div className="flex items-center gap-3 md:gap-4 pb-3 md:pb-4 border-b">
                  <div className="h-12 w-12 md:h-16 md:w-16 rounded-full gradient-açai flex items-center justify-center text-2xl md:text-3xl shrink-0">
                    {selectedFlavor.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base md:text-lg">{selectedFlavor.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedSize.name} ({selectedSize.ml}ml)
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-base md:text-lg">R$ {breakdown.base.toFixed(2).replace(".", ",")}</p>
                  </div>
                </div>

                {/* Complements */}
                {selectedComplements.length > 0 && (
                  <div className="pb-3 md:pb-4 border-b">
                    <h4 className="font-semibold text-sm md:text-base mb-2">Complementos</h4>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {selectedComplements.map((c, i) => (
                        <span
                          key={c.id}
                          className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${
                            i < selectedSize.freeComplements
                              ? "bg-success/20 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {c.icon} {c.name}
                        </span>
                      ))}
                    </div>
                    {breakdown.complements > 0 && (
                      <p className="text-xs md:text-sm text-muted-foreground mt-2">
                        + R$ {breakdown.complements.toFixed(2).replace(".", ",")}
                      </p>
                    )}
                  </div>
                )}

                {/* Toppings */}
                {selectedToppings.length > 0 && (
                  <div className="pb-3 md:pb-4 border-b">
                    <h4 className="font-semibold text-sm md:text-base mb-2">Coberturas</h4>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {selectedToppings.map((t, i) => (
                        <span
                          key={t.id}
                          className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${
                            i < selectedSize.freeToppings
                              ? "bg-success/20 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {t.icon} {t.name}
                        </span>
                      ))}
                    </div>
                    {breakdown.toppings > 0 && (
                      <p className="text-xs md:text-sm text-muted-foreground mt-2">
                        + R$ {breakdown.toppings.toFixed(2).replace(".", ",")}
                      </p>
                    )}
                  </div>
                )}

                {/* Fruits */}
                {selectedFruits.length > 0 && (
                  <div className="pb-3 md:pb-4 border-b">
                    <h4 className="font-semibold text-sm md:text-base mb-2">Frutas</h4>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {selectedFruits.map((f, i) => (
                        <span
                          key={f.id}
                          className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${
                            i < selectedSize.freeFruits
                              ? "bg-success/20 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {f.icon} {f.name}
                        </span>
                      ))}
                    </div>
                    {breakdown.fruits > 0 && (
                      <p className="text-xs md:text-sm text-muted-foreground mt-2">
                        + R$ {breakdown.fruits.toFixed(2).replace(".", ",")}
                      </p>
                    )}
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center justify-between py-2">
                  <span className="font-medium text-sm md:text-base">Quantidade</span>
                  <div className="flex items-center gap-2 md:gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 md:h-10 md:w-10"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg md:text-xl font-bold w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 md:h-10 md:w-10"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-3 md:pt-4 border-t bg-primary/5 -mx-4 md:-mx-6 px-4 md:px-6 pb-4 md:pb-6 rounded-b-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-base md:text-lg font-bold">Total</span>
                    <span className="text-xl md:text-2xl font-extrabold text-primary">
                      R$ {(totalPrice * quantity).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom navigation - Improved */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-2xl safe-area-bottom">
        <div className="container py-3 md:py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={goPrev}
              disabled={currentStepIndex === 0}
              className="h-12 md:h-14 px-4 md:px-6 flex-shrink-0 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">Voltar</span>
            </Button>

            {currentStep !== "summary" ? (
              <Button
                variant="hero"
                size="lg"
                onClick={goNext}
                disabled={!canProceed()}
                className="h-12 md:h-14 flex-1 text-base md:text-lg font-bold gap-2 rounded-xl shadow-lg shadow-primary/30"
              >
                Continuar
                <ArrowRight className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="hero"
                size="lg"
                onClick={handleAddToCart}
                className="h-12 md:h-14 flex-1 text-base md:text-lg font-bold gap-2 rounded-xl shadow-lg shadow-primary/30"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline">Adicionar ao</span> Carrinho
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;
