import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Hochzeitsdetails, Locations, Dienstleister, Gaesteliste, Budgetplanung, ZeitplanAblauf, AufgabenToDos, Tischplan } from '@/types/app';
import { LivingAppsService } from '@/services/livingAppsService';

export function useDashboardData() {
  const [hochzeitsdetails, setHochzeitsdetails] = useState<Hochzeitsdetails[]>([]);
  const [locations, setLocations] = useState<Locations[]>([]);
  const [dienstleister, setDienstleister] = useState<Dienstleister[]>([]);
  const [gaesteliste, setGaesteliste] = useState<Gaesteliste[]>([]);
  const [budgetplanung, setBudgetplanung] = useState<Budgetplanung[]>([]);
  const [zeitplanAblauf, setZeitplanAblauf] = useState<ZeitplanAblauf[]>([]);
  const [aufgabenToDos, setAufgabenToDos] = useState<AufgabenToDos[]>([]);
  const [tischplan, setTischplan] = useState<Tischplan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAll = useCallback(async () => {
    setError(null);
    try {
      const [hochzeitsdetailsData, locationsData, dienstleisterData, gaestelisteData, budgetplanungData, zeitplanAblaufData, aufgabenToDosData, tischplanData] = await Promise.all([
        LivingAppsService.getHochzeitsdetails(),
        LivingAppsService.getLocations(),
        LivingAppsService.getDienstleister(),
        LivingAppsService.getGaesteliste(),
        LivingAppsService.getBudgetplanung(),
        LivingAppsService.getZeitplanAblauf(),
        LivingAppsService.getAufgabenToDos(),
        LivingAppsService.getTischplan(),
      ]);
      setHochzeitsdetails(hochzeitsdetailsData);
      setLocations(locationsData);
      setDienstleister(dienstleisterData);
      setGaesteliste(gaestelisteData);
      setBudgetplanung(budgetplanungData);
      setZeitplanAblauf(zeitplanAblaufData);
      setAufgabenToDos(aufgabenToDosData);
      setTischplan(tischplanData);
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
        const [hochzeitsdetailsData, locationsData, dienstleisterData, gaestelisteData, budgetplanungData, zeitplanAblaufData, aufgabenToDosData, tischplanData] = await Promise.all([
          LivingAppsService.getHochzeitsdetails(),
          LivingAppsService.getLocations(),
          LivingAppsService.getDienstleister(),
          LivingAppsService.getGaesteliste(),
          LivingAppsService.getBudgetplanung(),
          LivingAppsService.getZeitplanAblauf(),
          LivingAppsService.getAufgabenToDos(),
          LivingAppsService.getTischplan(),
        ]);
        setHochzeitsdetails(hochzeitsdetailsData);
        setLocations(locationsData);
        setDienstleister(dienstleisterData);
        setGaesteliste(gaestelisteData);
        setBudgetplanung(budgetplanungData);
        setZeitplanAblauf(zeitplanAblaufData);
        setAufgabenToDos(aufgabenToDosData);
        setTischplan(tischplanData);
      } catch {
        // silently ignore — stale data is better than no data
      }
    }
    function handleRefresh() { void silentRefresh(); }
    window.addEventListener('dashboard-refresh', handleRefresh);
    return () => window.removeEventListener('dashboard-refresh', handleRefresh);
  }, []);

  const locationsMap = useMemo(() => {
    const m = new Map<string, Locations>();
    locations.forEach(r => m.set(r.record_id, r));
    return m;
  }, [locations]);

  const dienstleisterMap = useMemo(() => {
    const m = new Map<string, Dienstleister>();
    dienstleister.forEach(r => m.set(r.record_id, r));
    return m;
  }, [dienstleister]);

  const gaestelisteMap = useMemo(() => {
    const m = new Map<string, Gaesteliste>();
    gaesteliste.forEach(r => m.set(r.record_id, r));
    return m;
  }, [gaesteliste]);

  return { hochzeitsdetails, setHochzeitsdetails, locations, setLocations, dienstleister, setDienstleister, gaesteliste, setGaesteliste, budgetplanung, setBudgetplanung, zeitplanAblauf, setZeitplanAblauf, aufgabenToDos, setAufgabenToDos, tischplan, setTischplan, loading, error, fetchAll, locationsMap, dienstleisterMap, gaestelisteMap };
}