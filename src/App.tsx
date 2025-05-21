
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import Awards from "./pages/Awards";
import Nominations from "./pages/Nominations";
import EventDetails from "./pages/EventDetails";
import Sponsors from "./pages/Sponsors";
import Registration from "./pages/Registration";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import NomineesPage from "./pages/admin/NomineesPage";
import TransactionsPage from "./pages/admin/TransactionsPage";

// Define a layout for public pages if needed, or just render them directly
const PublicLayout = () => (
  <>
    {/* You might have a Navbar/Footer component here for public pages */}
    <Outlet />
  </>
);

const App = () => {
  // Create QueryClient inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/awards" element={<Awards />} />
              <Route path="/nominations" element={<Nominations />} />
              <Route path="/event" element={<EventDetails />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="nominees" element={<NomineesPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              {/* Add other admin routes here as they are built */}
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
