import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Dienstleister, Tischplan, Locations, ZeitplanAblauf, Gaesteliste, Hochzeitsdetails, AufgabenToDos, Budgetplanung } from '@/types/app';
import { LivingAppsService } from '@/services/livingAppsService';

export function useDashboardData() {
  const [dienstleister, setDienstleister] = useState<Dienstleister[]>([]);
  const [tischplan, setTischplan] = useState<Tischplan[]>([]);
  const [locations, setLocations] = useState<Locations[]>([]);
  const [zeitplanAblauf, setZeitplanAblauf] = useState<ZeitplanAblauf[]>([]);
  const [gaesteliste, setGaesteliste] = useState<Gaesteliste[]>([]);
  const [hochzeitsdetails, setHochzeitsdetails] = useState<Hochzeitsdetails[]>([]);
  const [aufgabenToDos, setAufgabenToDos] = useState<AufgabenToDos[]>([]);
  const [budgetplanung, setBudgetplanung] = useState<Budgetplanung[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = useCallback(async () => {
    setError(null);
    try {
      const [dienstleisterData, tischplanData, locationsData, zeitplanAblaufData, gaestelisteData, hochzeitsdetailsData, aufgabenToDosData, budgetplanungData] = await Promise.all([
        LivingAppsService.getDienstleister(),
        LivingAppsService.getTischplan(),
        LivingAppsService.getLocations(),
        LivingAppsService.getZeitplanAblauf(),
        LivingAppsService.getGaesteliste(),
        LivingAppsService.getHochzeitsdetails(),
        LivingAppsService.getAufgabenToDos(),
        LivingAppsService.getBudgetplanung(),
      ]);
      setDienstleister(dienstleisterData);
      setTischplan(tischplanData);
      setLocations(locationsData);
      setZeitplanAblauf(zeitplanAblaufData);
      setGaesteliste(gaestelisteData);
      setHochzeitsdetails(hochzeitsdetailsData);
      setAufgabenToDos(aufgabenToDosData);
      setBudgetplanung(budgetplanungData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Fehler beim Laden der Daten'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Silent background refresh (no loading state change → no flicker)
  useEffect(() => {
    async function silentRefresh() {
      try {
        const [dienstleisterData, tischplanData, locationsData, zeitplanAblaufData, gaestelisteData, hochzeitsdetailsData, aufgabenToDosData, budgetplanungData] = await Promise.all([
          LivingAppsService.getDienstleister(),
          LivingAppsService.getTischplan(),
          LivingAppsService.getLocations(),
          LivingAppsService.getZeitplanAblauf(),
          LivingAppsService.getGaesteliste(),
          LivingAppsService.getHochzeitsdetails(),
          LivingAppsService.getAufgabenToDos(),
          LivingAppsService.getBudgetplanung(),
        ]);
        setDienstleister(dienstleisterData);
        setTischplan(tischplanData);
        setLocations(locationsData);
        setZeitplanAblauf(zeitplanAblaufData);
        setGaesteliste(gaestelisteData);
        setHochzeitsdetails(hochzeitsdetailsData);
        setAufgabenToDos(aufgabenToDosData);
        setBudgetplanung(budgetplanungData);
      } catch {
        // silently ignore — stale data is better than no data
      }
    }
    function handleRefresh() { void silentRefresh(); }
    window.addEventListener('dashboard-refresh', handleRefresh);
    return () => window.removeEventListener('dashboard-refresh', handleRefresh);
  }, []);

  const dienstleisterMap = useMemo(() => {
    const m = new Map<string, Dienstleister>();
    dienstleister.forEach(r => m.set(r.record_id, r));
    return m;
  }, [dienstleister]);

  const locationsMap = useMemo(() => {
    const m = new Map<string, Locations>();
    locations.forEach(r => m.set(r.record_id, r));
    return m;
  }, [locations]);

  const gaestelisteMap = useMemo(() => {
    const m = new Map<string, Gaesteliste>();
    gaesteliste.forEach(r => m.set(r.record_id, r));
    return m;
  }, [gaesteliste]);

  return { dienstleister, setDienstleister, tischplan, setTischplan, locations, setLocations, zeitplanAblauf, setZeitplanAblauf, gaesteliste, setGaesteliste, hochzeitsdetails, setHochzeitsdetails, aufgabenToDos, setAufgabenToDos, budgetplanung, setBudgetplanung, loading, error, fetchAll, dienstleisterMap, locationsMap, gaestelisteMap };
}