import { HashRouter, Routes, Route } from 'react-router-dom';
import { ActionsProvider } from '@/context/ActionsContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Layout } from '@/components/Layout';
import DashboardOverview from '@/pages/DashboardOverview';
import AdminPage from '@/pages/AdminPage';
import DienstleisterPage from '@/pages/DienstleisterPage';
import TischplanPage from '@/pages/TischplanPage';
import LocationsPage from '@/pages/LocationsPage';
import ZeitplanAblaufPage from '@/pages/ZeitplanAblaufPage';
import GaestelistePage from '@/pages/GaestelistePage';
import HochzeitsdetailsPage from '@/pages/HochzeitsdetailsPage';
import AufgabenToDosPage from '@/pages/AufgabenToDosPage';
import BudgetplanungPage from '@/pages/BudgetplanungPage';
// <custom:imports>
// </custom:imports>

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <ActionsProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="dienstleister" element={<DienstleisterPage />} />
              <Route path="tischplan" element={<TischplanPage />} />
              <Route path="locations" element={<LocationsPage />} />
              <Route path="zeitplan-ablauf" element={<ZeitplanAblaufPage />} />
              <Route path="gaesteliste" element={<GaestelistePage />} />
              <Route path="hochzeitsdetails" element={<HochzeitsdetailsPage />} />
              <Route path="aufgaben-to-dos" element={<AufgabenToDosPage />} />
              <Route path="budgetplanung" element={<BudgetplanungPage />} />
              <Route path="admin" element={<AdminPage />} />
              {/* <custom:routes> */}
              {/* </custom:routes> */}
            </Route>
          </Routes>
        </ActionsProvider>
      </HashRouter>
    </ErrorBoundary>
  );
}
