import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react";

import { AuthProvider } from "@/contexts/AuthContext";

// Import layout components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingIHSDPopup from "@/components/common/FloatingIHSDPopup";

// Public pages
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
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import NomineesPage from "./pages/admin/NomineesPage";
import TransactionsPage from "./pages/admin/TransactionsPage";
import MessagesPage from "./pages/admin/MessagesPage";
import NominationFormPage from "./pages/NominationFormPage";
import NewRegistrationPage from "./pages/NewRegistrationPage";
import RegistrationDetailsPage from "./pages/RegistrationDetailsPage";

// New Admin Pages for submenus
import CompletedNominationsPage from "./pages/admin/CompletedNominationsPage";
import IncompleteNominationsPage from "./pages/admin/IncompleteNominationsPage";
import ApprovedNomineesPage from "./pages/admin/ApprovedNomineesPage";
import RejectedNomineesPage from "./pages/admin/RejectedNomineesPage";
import RegistrationsPage from "./pages/admin/RegistrationsPage";
import PendingRegistrationsPage from "./pages/admin/PendingRegistrationsPage";
import PaidRegistrationsPage from "./pages/admin/PaidRegistrationsPage";
import SponsorsTrackingPage from "./pages/admin/SponsorsTrackingPage";
import SponsorshipInquiriesPage from "./pages/admin/SponsorshipInquiriesPage";

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow bg-background">
      <Outlet />
    </main>
    <Footer />
    <FloatingIHSDPopup />
  </div>
);

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/awards" element={<Awards />} />
                <Route path="/nominations" element={<Nominations />} />
                <Route path="/nomination-form" element={<NominationFormPage />} />
                <Route path="/event" element={<EventDetails />} />
                <Route path="/sponsors" element={<Sponsors />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/new-registration" element={<NewRegistrationPage />} />
                <Route path="/registration-details" element={<RegistrationDetailsPage />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="nominees" element={<NomineesPage />} /> 
                <Route path="nominations/completed" element={<CompletedNominationsPage />} />
                <Route path="nominations/incomplete" element={<IncompleteNominationsPage />} />
                <Route path="nominees/status/approved" element={<ApprovedNomineesPage />} /> 
                <Route path="nominees/status/rejected" element={<RejectedNomineesPage />} />
                <Route path="registrations" element={<RegistrationsPage />} />
                <Route path="registrations/pending" element={<PendingRegistrationsPage />} />
                <Route path="registrations/paid" element={<PaidRegistrationsPage />} />
                <Route path="sponsors/tracking" element={<SponsorsTrackingPage />} />
                <Route path="sponsors/inquiries" element={<SponsorshipInquiriesPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="messages" element={<MessagesPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;