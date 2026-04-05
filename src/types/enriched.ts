import type { Budgetplanung, Tischplan, ZeitplanAblauf } from './app';

export type EnrichedBudgetplanung = Budgetplanung & {
  dienstleister_refName: string;
};

export type EnrichedZeitplanAblauf = ZeitplanAblauf & {
  location_refName: string;
  zeitplan_dienstleister_refName: string;
};

export type EnrichedTischplan = Tischplan & {
  gaeste_zuweisungName: string;
};
