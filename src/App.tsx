import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProtectedRoute } from "@/components/admin/AdminProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import HomePage from "@/pages/HomePage";
import BuilderPage from "@/pages/BuilderPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import MenuPage from "@/pages/MenuPage";
import LoginPage from "@/pages/LoginPage";
import OrdersPage from "@/pages/OrdersPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminOrdersPage from "@/pages/AdminOrdersPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/cardapio" element={<MenuPage />} />
                <Route path="/montar" element={<BuilderPage />} />
                <Route path="/carrinho" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/pedidos" element={<OrdersPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route
                path="/admin/pedidos"
                element={
                  <AdminProtectedRoute>
                    <AdminOrdersPage />
                  </AdminProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
