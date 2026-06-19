import { useState, useMemo, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingCart, Check, Plus, Minus, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import {
  sizes,
  flavors,
  complements,
  toppings,
  Size,
  Flavor,
  Complement,
  Topping,
} from "@/data/menu";

type Step = "size" | "flavor" | "complements" | "toppings" | "summary";

const steps: { key: Step; label: string; emoji: string }[] = [
  { key: "size", label: "Tamanho", emoji: "📏" },
  { key: "flavor", label: "Tipo", emoji: "🍇" },
  { key: "complements", label: "Acomp.", emoji: "🍫" },
  { key: "toppings", label: "Premium", emoji: "✨" },
  { key: "summary", label: "Resumo", emoji: "✨" },
];

const ItemIcon = ({ icon, image, size = "md" }: { icon: string; image?: string; size?: "sm" | "md" | "lg" }) => {
  const dims = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-16 w-16" : "h-10 w-10";
  if (image) {
    return <img src={image} alt={icon} className={`${dims} object-contain`} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />;
  }
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl";
  return <span className={textSize}>{icon}</span>;
};

const BuilderPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem, totalItems } = useCart();
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
  const [selectedFruits] = useState<never[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [addedCount, setAddedCount] = useState(0);

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const freeComplementsLeft = selectedSize
    ? selectedSize.freeComplements - Math.min(selectedComplements.length, selectedSize.freeComplements)
    : 0;

  const { totalPrice, breakdown } = useMemo(() => {
    if (!selectedSize) return { totalPrice: 0, breakdown: { base: 0, complements: 0, toppings: 0, fruits: 0 } };

    const isSupremo = selectedFlavor?.premium ?? false;
    const base = isSupremo ? selectedSize.supremoPrice : selectedSize.price;
    const paidComplements = selectedComplements.slice(selectedSize.freeComplements);
    const complementsPrice = paidComplements.reduce((sum, c) => sum + c.price, 0);
    const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);

    return {
      totalPrice: base + complementsPrice + toppingsPrice,
      breakdown: { base, complements: complementsPrice, toppings: toppingsPrice, fruits: 0 },
    };
  }, [selectedSize, selectedFlavor, selectedComplements, selectedToppings]);

  const canProceed = () => {
    switch (currentStep) {
      case "size": return selectedSize !== null;
      case "flavor": return selectedFlavor !== null;
      default: return true;
    }
  };

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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

  const resetBuilder = () => {
    setSelectedSize(null);
    setSelectedFlavor(null);
    setSelectedComplements([]);
    setSelectedToppings([]);
    setQuantity(1);
    setCurrentStep("size");
    setTimeout(scrollToTop, 50);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedFlavor) return;

    addItem({
      size: selectedSize,
      flavor: selectedFlavor,
      complements: selectedComplements,
      toppings: selectedToppings,
      fruits: [],
      quantity,
      totalPrice,
      freeComplementsUsed: Math.min(selectedComplements.length, selectedSize.freeComplements),
      freeToppingsUsed: 0,
      freeFruitsUsed: 0,
    });

    setAddedCount((prev) => prev + quantity);

    toast({
      title: "Adicionado ao carrinho! 🎉",
      description: `${quantity}x Açaí ${selectedSize.name} - ${selectedFlavor.name}`,
    });
  };

  const handleAddAndBuildAnother = () => {
    handleAddToCart();
    resetBuilder();
  };

  const handleAddAndGoToCart = () => {
    handleAddToCart();
    navigate("/carrinho");
  };

  return (
    <div className="min-h-screen bg-background pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-36">
      {/* Sticky progress bar */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b shadow-sm" ref={contentRef}>
        <div className="container py-3 md:py-4">
          {/* Header with price + cart count */}
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="h-9 w-9 md:h-12 md:w-12 rounded-full gradient-açai flex items-center justify-center shadow-lg">
                <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-xl font-extrabold text-foreground leading-tight">Monte seu Açaí</h1>
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  {addedCount > 0 ? `${addedCount} açaí${addedCount > 1 ? "s" : ""} no carrinho` : "Personalize do seu jeito"}
                </p>
              </div>
            </div>
            <div className="text-right bg-primary/10 px-3 py-1.5 md:px-4 md:py-2 rounded-xl">
              <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Total</p>
              <span className="text-lg md:text-2xl font-extrabold text-primary">
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
          
          {/* Step Indicators */}
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-4 right-4 md:left-6 md:right-6 h-0.5 bg-muted" />
            <div 
              className="absolute top-4 left-4 md:left-6 h-0.5 bg-primary transition-all duration-500"
              style={{ width: `calc(${(currentStepIndex / (steps.length - 1)) * 100}% - 32px)` }}
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
                  className="flex flex-col items-center gap-0.5 md:gap-1 relative z-10"
                >
                  <div className={`h-7 w-7 md:h-8 md:w-8 rounded-full flex items-center justify-center text-xs md:text-sm transition-all duration-300 ${
                    isComplete 
                      ? "bg-primary text-primary-foreground shadow-md cursor-pointer" 
                      : isCurrent 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-2 md:ring-4 ring-primary/20 scale-110" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {isComplete ? <Check className="h-3 w-3 md:h-4 md:w-4" /> : step.emoji}
                  </div>
                  <span className={`text-[8px] md:text-[10px] font-medium leading-tight text-center max-w-[50px] md:max-w-[60px] ${
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
      <div className="container px-3 py-4 pb-28 md:px-4 md:py-8 md:pb-8">
        <AnimatePresence mode="wait">
          {/* SIZE STEP */}
          {currentStep === "size" && (
            <motion.div
              key="size"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 md:space-y-6"
            >
              <div className="text-center px-2">
                <h2 className="text-lg md:text-2xl font-bold">Escolha o Tamanho</h2>
                <p className="text-xs md:text-base text-muted-foreground mt-1">
                  Acompanhamentos, caldas e frutas inclusos!
                </p>
              </div>

              <div className="grid gap-2 md:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`relative p-3 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all active:scale-[0.97] flex flex-col items-center text-center ${
                      selectedSize?.id === size.id
                        ? "border-primary bg-primary/5 shadow-xl shadow-primary/20 scale-[1.02]"
                        : "border-border bg-card hover:border-primary/40 hover:shadow-md active:bg-primary/5"
                    }`}
                  >
                    {selectedSize?.id === size.id && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1.5 right-1.5 md:top-2 md:right-2 h-5 w-5 md:h-6 md:w-6 rounded-full bg-primary flex items-center justify-center shadow-md"
                      >
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-primary-foreground" />
                      </motion.div>
                    )}
                    <div
                      className={`rounded-full gradient-açai flex items-center justify-center text-xl md:text-2xl shadow-lg mb-2 md:mb-3 ${
                        size.ml <= 300 ? "h-11 w-11 md:h-14 md:w-14" : size.ml <= 500 ? "h-13 w-13 md:h-16 md:w-16" : "h-16 w-16 md:h-20 md:w-20"
                      }`}
                    >
                      <ItemIcon icon="🍇" image={size.image} size="lg" />
                    </div>
                    <h3 className="font-bold text-xs md:text-base">{size.name}</h3>
                    <p className="text-sm md:text-xl font-extrabold text-primary">{size.ml}ml</p>
                    <p className="text-sm font-bold mt-0.5 md:mt-1">
                      R$ {size.price.toFixed(2).replace(".", ",")}
                    </p>
                    <div className="mt-1.5 md:mt-2 text-[9px] md:text-xs text-muted-foreground space-y-0.5 w-full">
                      <p>✓ {size.freeComplements} acomp. inclusos</p>
                      <p className="text-primary font-semibold">Supremo R$ {size.supremoPrice.toFixed(2).replace(".", ",")}</p>
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
              className="space-y-3 md:space-y-6"
            >
              <div className="text-center px-2">
                <h2 className="text-lg md:text-2xl font-bold">Escolha o Sabor</h2>
                <p className="text-xs md:text-base text-muted-foreground mt-1">
                  Selecione a base do seu açaí
                </p>
              </div>

              <div className="grid gap-2 md:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {flavors.map((flavor) => (
                  <button
                    key={flavor.id}
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`relative p-3 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all text-left active:scale-[0.98] ${
                      selectedFlavor?.id === flavor.id
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                        : "border-border bg-card hover:border-primary/50 active:bg-primary/5"
                    }`}
                  >
                    {selectedFlavor?.id === flavor.id && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 h-5 w-5 md:h-6 md:w-6 rounded-full bg-primary flex items-center justify-center shadow-md"
                      >
                        <Check className="h-3 w-3 md:h-4 md:w-4 text-primary-foreground" />
                      </motion.div>
                    )}
                    <div className="flex items-center gap-3">
                      <ItemIcon icon={flavor.icon} image={flavor.image} size="lg" />
                      <div>
                        <h3 className="font-bold text-sm md:text-lg">{flavor.name}</h3>
                        <p className="text-[11px] md:text-sm text-muted-foreground">{flavor.description}</p>
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
              className="space-y-3 md:space-y-6"
            >
              <div className="text-center px-2">
                <h2 className="text-lg md:text-2xl font-bold">Acompanhamentos</h2>
                {freeComplementsLeft > 0 && (
                  <div className="inline-flex items-center gap-2 mt-1.5 md:mt-2 px-3 py-1 md:py-1.5 rounded-full bg-success/10 border border-success/30">
                    <span className="text-success font-bold text-xs md:text-sm">{freeComplementsLeft} GRÁTIS</span>
                    <span className="text-[10px] md:text-xs text-muted-foreground">restantes</span>
                  </div>
                )}
                <p className="text-[10px] md:text-sm text-muted-foreground mt-1.5">
                  Adicionais: R$ 1,00 cada
                </p>
              </div>

              <div className="grid gap-1.5 md:gap-3 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
                {complements.map((complement) => {
                  const isSelected = selectedComplements.find((c) => c.id === complement.id);
                  const selectedIndex = selectedComplements.findIndex((c) => c.id === complement.id);
                  const isFree = selectedIndex !== -1 && selectedIndex < (selectedSize?.freeComplements || 0);

                  return (
                    <button
                      key={complement.id}
                      onClick={() => toggleComplement(complement)}
                      className={`relative p-2 md:p-4 rounded-lg md:rounded-xl border-2 transition-all active:scale-[0.95] ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-card hover:border-primary/50 active:bg-primary/5"
                      }`}
                    >
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 rounded-full bg-primary flex items-center justify-center shadow-md"
                        >
                          <Check className="h-2.5 w-2.5 md:h-3 md:w-3 text-primary-foreground" />
                        </motion.div>
                      )}
                      <ItemIcon icon={complement.icon} image={complement.image} size="md" />
                      <p className="font-medium text-[10px] md:text-sm mt-0.5 md:mt-2 leading-tight">{complement.name}</p>
                      <p
                        className={`text-[9px] md:text-xs mt-0.5 font-medium ${
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
              className="space-y-3 md:space-y-6"
            >
              <div className="text-center px-2">
                <h2 className="text-lg md:text-2xl font-bold">Adicionais Premium</h2>
                <p className="text-[10px] md:text-sm text-muted-foreground mt-1.5">
                  Opcional • R$ 2,00 cada
                </p>
              </div>

              <div className="grid gap-1.5 md:gap-3 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
                {toppings.map((topping) => {
                  const isSelected = selectedToppings.find((t) => t.id === topping.id);

                  return (
                    <button
                      key={topping.id}
                      onClick={() => toggleTopping(topping)}
                      className={`relative p-2 md:p-4 rounded-lg md:rounded-xl border-2 transition-all active:scale-[0.95] ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-card hover:border-primary/50 active:bg-primary/5"
                      }`}
                    >
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 rounded-full bg-primary flex items-center justify-center shadow-md"
                        >
                          <Check className="h-2.5 w-2.5 md:h-3 md:w-3 text-primary-foreground" />
                        </motion.div>
                      )}
                      <ItemIcon icon={topping.icon} image={topping.image} size="md" />
                      <p className="font-medium text-[10px] md:text-sm mt-0.5 md:mt-2 leading-tight">{topping.name}</p>
                      <p className="text-[9px] md:text-xs mt-0.5 font-medium text-muted-foreground">
                        +R${topping.price.toFixed(0)}
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
                <h2 className="text-lg md:text-2xl font-bold">Resumo do Pedido</h2>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Confira seu açaí personalizado
                </p>
              </div>

              <div className="max-w-lg mx-auto bg-card rounded-2xl border shadow-card p-4 md:p-6 space-y-3 md:space-y-4">
                {/* Size & Flavor */}
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="h-12 w-12 md:h-16 md:w-16 rounded-full gradient-açai flex items-center justify-center text-2xl md:text-3xl shrink-0">
                    <ItemIcon icon={selectedFlavor.icon} image={selectedFlavor.image} size="lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm md:text-lg">{selectedFlavor.name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {selectedSize.name} ({selectedSize.ml}ml)
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm md:text-lg">R$ {breakdown.base.toFixed(2).replace(".", ",")}</p>
                  </div>
                </div>

                {/* Complements */}
                {selectedComplements.length > 0 && (
                  <div className="pb-3 border-b">
                    <h4 className="font-semibold text-xs md:text-base mb-1.5 md:mb-2">Complementos</h4>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {selectedComplements.map((c, i) => (
                        <span
                          key={c.id}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-xs font-medium ${
                            i < selectedSize.freeComplements
                              ? "bg-success/20 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <ItemIcon icon={c.icon} image={c.image} size="sm" /> {c.name}
                        </span>
                      ))}
                    </div>
                    {breakdown.complements > 0 && (
                      <p className="text-[10px] md:text-sm text-muted-foreground mt-1.5">
                        + R$ {breakdown.complements.toFixed(2).replace(".", ",")}
                      </p>
                    )}
                  </div>
                )}

                {/* Toppings */}
                {selectedToppings.length > 0 && (
                  <div className="pb-3 border-b">
                    <h4 className="font-semibold text-xs md:text-base mb-1.5 md:mb-2">Adicionais Premium</h4>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {selectedToppings.map((t) => (
                        <span
                          key={t.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-xs font-medium bg-muted text-muted-foreground"
                        >
                          <ItemIcon icon={t.icon} image={t.image} size="sm" /> {t.name}
                        </span>
                      ))}
                    </div>
                    {breakdown.toppings > 0 && (
                      <p className="text-[10px] md:text-sm text-muted-foreground mt-1.5">
                        + R$ {breakdown.toppings.toFixed(2).replace(".", ",")}
                      </p>
                    )}
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center justify-between py-2">
                  <span className="font-medium text-sm">Quantidade</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-3 border-t bg-primary/5 -mx-4 md:-mx-6 px-4 md:px-6 pb-4 rounded-b-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-lg font-bold">Total</span>
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

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-2xl safe-area-bottom z-50">
        <div className="container px-3 py-3 md:px-4 md:py-4">
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={goPrev}
              disabled={currentStepIndex === 0}
              className="h-11 md:h-14 px-3 md:px-6 flex-shrink-0 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline ml-2">Voltar</span>
            </Button>

            {currentStep !== "summary" ? (
              <Button
                variant="hero"
                size="lg"
                onClick={goNext}
                disabled={!canProceed()}
                className="h-11 md:h-14 flex-1 text-sm md:text-lg font-bold gap-2 rounded-xl shadow-lg shadow-primary/30"
              >
                Continuar
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            ) : (
              <div className="flex-1 flex gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddAndBuildAnother}
                  className="h-11 md:h-14 flex-1 text-xs md:text-base font-bold gap-1 md:gap-2 rounded-xl"
                >
                  <RefreshCw className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Montar</span> +1
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleAddAndGoToCart}
                  className="h-11 md:h-14 flex-1 text-xs md:text-base font-bold gap-1 md:gap-2 rounded-xl shadow-lg shadow-primary/30"
                >
                  <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  Carrinho
                  {(totalItems + quantity) > 0 && (
                    <span className="bg-primary-foreground/20 px-1.5 py-0.5 rounded-full text-[10px]">
                      {totalItems + quantity}
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;
