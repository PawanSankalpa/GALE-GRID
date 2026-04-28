import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./admin/styles/admin-shell.css";

// Public pages
import HomePage from "./pages/HomePage/HomePage.jsx";
import Services from "./pages/ServicesPage/Services.jsx";
import PricingPage from "./pages/PricingPage/PricingPage.jsx";
import OurWork from "./pages/OurWorkPage/OurWork.jsx";
import Plan from "./pages/PlanPage/Plan3.jsx";

// Auth
import AdminLogin from "./pages/LoginPage/AdminLogin.jsx";
import Register from "./pages/RegisterPage/Register.jsx";
import ClientOnboarding from "./pages/OnboardingPage/ClientOnboarding.jsx";

// Admin shell
import AdminLayout from "./admin/layout/AdminLayout.jsx";
import AdminRoute from "./admin/routes/AdminRoute.jsx";
import DashboardHome from "./admin/pages/DashboardHome.jsx";
import LeadsPage from "./admin/pages/LeadsPage.jsx";
import ClientsPage from "./admin/pages/ClientsPage.jsx";
import ProjectsPage from "./admin/pages/ProjectsPage.jsx";
import PaymentsPage from "./admin/pages/PaymentsPage.jsx";
import SubscriptionsPage from "./admin/pages/SubscriptionsPage.jsx";
import SettingsPage from "./admin/pages/SettingsPage.jsx";
import TasksPage from "./admin/pages/TasksPage.jsx";
import MessagesPage from "./admin/pages/MessagesPage.jsx";
import InboxPage from "./admin/pages/InboxPage.jsx";
import BookingsPage from "./admin/pages/BookingsPage.jsx";
import TeamPage from "./admin/pages/TeamPage.jsx";
import FinancePage from "./admin/pages/FinancePage.jsx";
import AnalyticsPage from "./admin/pages/AnalyticsPage.jsx";
import FilesPage from "./admin/pages/FilesPage.jsx";
import PartnersPage from "./admin/pages/PartnersPage.jsx";

// Partner portal
import PartnerLayout from "./portals/partner/PartnerLayout.jsx";
import PartnerRoute from "./portals/partner/PartnerRoute.jsx";
import PartnerDashboard from "./portals/partner/pages/PartnerDashboard.jsx";
import PartnerLeadsPage from "./portals/partner/pages/PartnerLeadsPage.jsx";
import PartnerEarningsPage from "./portals/partner/pages/PartnerEarningsPage.jsx";
import PartnerResourcesPage from "./portals/partner/pages/PartnerResourcesPage.jsx";

// Booking system
import { BookingProvider } from "./context/BookingContext.jsx";

function App() {
  return (
    <BookingProvider>
      <Routes>
        {/* Public website */}
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/ourWork" element={<OurWork />} />
        <Route path="/plan" element={<Plan />} />

        {/* /contact → open booking modal via redirect to home */}
        <Route path="/contact" element={<Navigate to="/" replace />} />

        {/* Auth */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<ClientOnboarding />} />

        {/* Legacy redirect */}
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

        {/* Protected admin shell — all roles land here */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="inbox/:projectId" element={<InboxPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="partners" element={<PartnersPage />} />
        </Route>

        {/* Partner portal */}
        <Route
          path="/partner"
          element={
            <PartnerRoute>
              <PartnerLayout />
            </PartnerRoute>
          }
        >
          <Route index element={<PartnerDashboard />} />
          <Route path="leads" element={<PartnerLeadsPage />} />
          <Route path="earnings" element={<PartnerEarningsPage />} />
          <Route path="resources" element={<PartnerResourcesPage />} />
        </Route>

        {/* 404 → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BookingProvider>
  );
}

export default App;

