import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminSettings from "./pages/AdminSettings";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { ScrollToTop } from "./components/ScrollToTop";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
      <WhatsAppButton />
      <ScrollToTop />
    </Router>
  );
}
