import type { EnrichedBudgetplanung, EnrichedTischplan, EnrichedZeitplanAblauf } from '@/types/enriched';
import type { Budgetplanung, Dienstleister, Gaesteliste, Locations, Tischplan, ZeitplanAblauf } from '@/types/app';
import { extractRecordId } from '@/services/livingAppsService';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveDisplay(url: unknown, map: Map<string, any>, ...fields: string[]): string {
  if (!url) return '';
  const id = extractRecordId(url);
  if (!id) return '';
  const r = map.get(id);
  if (!r) return '';
  return fields.map(f => String(r.fields[f] ?? '')).join(' ').trim();
}

interface TischplanMaps {
  gaestelisteMap: Map<string, Gaesteliste>;
}

export function enrichTischplan(
  tischplan: Tischplan[],
  maps: TischplanMaps
): EnrichedTischplan[] {
  return tischplan.map(r => ({
    ...r,
    gaeste_zuweisungName: resolveDisplay(r.fields.gaeste_zuweisung, maps.gaestelisteMap, 'gast_vorname'),
  }));
}

interface ZeitplanAblaufMaps {
  locationsMap: Map<string, Locations>;
  dienstleisterMap: Map<string, Dienstleister>;
}

export function enrichZeitplanAblauf(
  zeitplanAblauf: ZeitplanAblauf[],
  maps: ZeitplanAblaufMaps
): EnrichedZeitplanAblauf[] {
  return zeitplanAblauf.map(r => ({
    ...r,
    location_refName: resolveDisplay(r.fields.location_ref, maps.locationsMap, 'location_name'),
    zeitplan_dienstleister_refName: resolveDisplay(r.fields.zeitplan_dienstleister_ref, maps.dienstleisterMap, 'firmenname'),
  }));
}

interface BudgetplanungMaps {
  dienstleisterMap: Map<string, Dienstleister>;
}

export function enrichBudgetplanung(
  budgetplanung: Budgetplanung[],
  maps: BudgetplanungMaps
): EnrichedBudgetplanung[] {
  return budgetplanung.map(r => ({
    ...r,
    dienstleister_refName: resolveDisplay(r.fields.dienstleister_ref, maps.dienstleisterMap, 'firmenname'),
  }));
}
