import { HashRouter, Routes, Route } from 'react-router-dom';
import { ActionsProvider } from '@/context/ActionsContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Layout } from '@/components/Layout';
import DashboardOverview from '@/pages/DashboardOverview';
import { WorkflowPlaceholders } from '@/components/WorkflowPlaceholders';
import AdminPage from '@/pages/AdminPage';
import HochzeitsdetailsPage from '@/pages/HochzeitsdetailsPage';
import LocationsPage from '@/pages/LocationsPage';
import DienstleisterPage from '@/pages/DienstleisterPage';
import GaestelistePage from '@/pages/GaestelistePage';
import BudgetplanungPage from '@/pages/BudgetplanungPage';
import ZeitplanAblaufPage from '@/pages/ZeitplanAblaufPage';
import AufgabenToDosPage from '@/pages/AufgabenToDosPage';
import TischplanPage from '@/pages/TischplanPage';

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <ActionsProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<><div className="mb-8"><WorkflowPlaceholders /></div><DashboardOverview /></>} />
              <Route path="hochzeitsdetails" element={<HochzeitsdetailsPage />} />
              <Route path="locations" element={<LocationsPage />} />
              <Route path="dienstleister" element={<DienstleisterPage />} />
              <Route path="gaesteliste" element={<GaestelistePage />} />
              <Route path="budgetplanung" element={<BudgetplanungPage />} />
              <Route path="zeitplan-&-ablauf" element={<ZeitplanAblaufPage />} />
              <Route path="aufgaben-&-to-dos" element={<AufgabenToDosPage />} />
              <Route path="tischplan" element={<TischplanPage />} />
              <Route path="admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </ActionsProvider>
      </HashRouter>
    </ErrorBoundary>
  );
}
