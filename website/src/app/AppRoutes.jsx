import { Outlet, Route, Routes } from 'react-router-dom';
import { SiteLayout } from '../components/layout/SiteLayout.jsx';
import { RequireAuth } from '../features/auth/AuthContext.jsx';
import { LoginPage } from '../features/auth/LoginPage.jsx';
import { CheckoutPage } from '../features/checkout/CheckoutPage.jsx';
import { DashboardPage } from '../features/dashboard/DashboardPage.jsx';
import { PricingPlans } from '../features/aeo-checker/components/PricingPlans.jsx';
import { Home } from '../pages/HomePage.jsx';
import { Services } from '../pages/ServicesPage.jsx';
import { Audit } from '../pages/AuditPage.jsx';
import { Industries } from '../pages/IndustriesPage.jsx';
import { About } from '../pages/AboutPage.jsx';
import { Insights } from '../pages/InsightsPage.jsx';
import { Article } from '../pages/ArticlePage.jsx';
import { Contact } from '../pages/ContactPage.jsx';
import { Legal } from '../pages/LegalPage.jsx';
import { NotFound } from '../pages/NotFoundPage.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/admin/:section?"
        element={
          <RequireAuth roles={['admin']}>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/superadmin/:section?"
        element={
          <RequireAuth roles={['superadmin']}>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/account/:section?"
        element={
          <RequireAuth roles={['user']}>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        element={
          <SiteLayout>
            <Outlet />
          </SiteLayout>
        }
      >
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/plans"
          element={
            <div className="mx-auto max-w-[1150px] px-6 pt-[30px] pb-[70px]">
              <PricingPlans website="" />
            </div>
          }
        />
        <Route
          path="/checkout"
          element={
            <RequireAuth roles={['user']}>
              <CheckoutPage />
            </RequireAuth>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/aeo-audit" element={<Audit />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/about" element={<About />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/insights/:slug" element={<Article />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<Legal privacy />} />
        <Route path="/terms-and-conditions" element={<Legal />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
