// src/App.tsx
import './App.css'
import About from './pages/about/About';
import Contact from './pages/contacts/Contact';
import FAQ from './pages/faq/FAQ';
import GiftQuiz from './pages/GiftQuiz/GiftQuiz';
import Home from './pages/home/Home';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Products from './pages/Products/Products';
import { AuthCallback } from "./pages/Auth/AuthCallback";
import { AuthPage } from "./pages/Auth/AuthPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { FavouritesProvider } from "./Context/FavouritesContext";
import { CartProvider } from "./Context/CartContext";
import Favourites from "./pages/Favourites/Favourites";
import ShoppingCart from "./pages/ShoppingCart/ShoppingCart";
import Checkout from './pages/Checkout/Checkout';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';
import Materials from "./pages/Materials/Materials";
import MaterialDetails from "./pages/MaterialDetails/MaterialDetails";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { I18nDomTranslator } from "./components/I18nDomTranslator";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { ThemeToggle } from "./components/ThemeToggle";


function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <FavouritesProvider>
      <CartProvider>
          <I18nDomTranslator />
          <div className="app-top-controls">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <Routes>
    
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/gift-quiz" element={<GiftQuiz />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contacts" element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/materials/cart" element={<Navigate to="/cart" replace />} />
          <Route path="/materials/checkout" element={<Navigate to="/checkout" replace />} />
          <Route path="/materials/order-success" element={<Navigate to="/order-success" replace />} />
          <Route path="/materials/:id" element={<MaterialDetails />} />

          {/* ✅ Protected Routes - تتطلب تسجيل الدخول */}
          <Route
            path="/favourites"
            element={isLoggedIn ? <Favourites /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/cart"
            element={isLoggedIn ? <ShoppingCart /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/checkout"
            element={isLoggedIn ? <Checkout /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/order-success"
            element={isLoggedIn ? <OrderSuccess /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" replace />}
          />

          {/* ✅ Auth Routes - لو مسجل دخول يروح للـ Home */}
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <AuthPage defaultTab="login" />
              )
            }
          />
          <Route
            path="/register"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <AuthPage defaultTab="register" />
              )
            }
          />

          {/* ✅ Auth Callback - لازم يكون بره أي شرط */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* ✅ Fallback Route - لو الرابط مش موجود */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </CartProvider>
    </FavouritesProvider>
  );
}

export default App
