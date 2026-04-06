// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export type LookupValue = { key: string; label: string };
export type GeoLocation = { lat: number; long: number; info?: string };

export interface Dienstleister {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    kategorie?: LookupValue;
    firmenname?: string;
    ansprechpartner_vorname?: string;
    ansprechpartner_nachname?: string;
    dienstleister_email?: string;
    dienstleister_telefon?: string;
    dienstleister_webseite?: string;
    dl_strasse?: string;
    dl_hausnummer?: string;
    dl_plz?: string;
    dl_ort?: string;
    vereinbarter_preis?: number;
    anzahlung?: number;
    zahlungsstatus?: LookupValue;
    vertragsstatus?: LookupValue;
    dl_notizen?: string;
  };
}

export interface Tischplan {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    tisch_name?: string;
    tisch_form?: LookupValue;
    tisch_kapazitaet?: number;
    gaeste_zuweisung?: string; // applookup -> URL zu 'Gaesteliste' Record
    tisch_notizen?: string;
  };
}

export interface Locations {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    location_name?: string;
    location_typ?: LookupValue;
    loc_strasse?: string;
    loc_hausnummer?: string;
    loc_plz?: string;
    loc_ort?: string;
    loc_geo?: GeoLocation; // { lat, long, info }
    loc_kontakt_vorname?: string;
    loc_kontakt_nachname?: string;
    loc_telefon?: string;
    loc_email?: string;
    loc_kapazitaet?: number;
    loc_mietpreis?: number;
    loc_buchung_von?: string; // Format: YYYY-MM-DD oder ISO String
    loc_buchung_bis?: string; // Format: YYYY-MM-DD oder ISO String
    loc_ausstattung?: LookupValue[];
    loc_notizen?: string;
  };
}

export interface ZeitplanAblauf {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    zeitpunkt?: string; // Format: YYYY-MM-DD oder ISO String
    programm_titel?: string;
    programm_beschreibung?: string;
    dauer_minuten?: number;
    verantwortliche_person?: string;
    location_ref?: string; // applookup -> URL zu 'Locations' Record
    zeitplan_dienstleister_ref?: string; // applookup -> URL zu 'Dienstleister' Record
    zeitplan_notizen?: string;
  };
}

export interface Gaesteliste {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    gast_vorname?: string;
    gast_nachname?: string;
    gast_email?: string;
    gast_telefon?: string;
    gast_strasse?: string;
    gast_hausnummer?: string;
    gast_plz?: string;
    gast_ort?: string;
    beziehung?: LookupValue;
    rsvp_status?: LookupValue;
    menuewahl?: LookupValue;
    allergien?: string;
    uebernachtung?: boolean;
    gast_notizen?: string;
  };
}

export interface Hochzeitsdetails {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    partner1_vorname?: string;
    partner1_nachname?: string;
    partner2_vorname?: string;
    partner2_nachname?: string;
    kontakt_email?: string;
    kontakt_telefon?: string;
    hochzeitsdatum?: string; // Format: YYYY-MM-DD oder ISO String
    motto?: string;
    zeremonie_sprache?: LookupValue;
    gaeste_anzahl?: number;
    gesamtbudget?: number;
    besondere_wuensche?: string;
  };
}

export interface AufgabenToDos {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    aufgabe_titel?: string;
    aufgabe_beschreibung?: string;
    aufgabe_kategorie?: LookupValue;
    prioritaet?: LookupValue;
    faellig_am?: string; // Format: YYYY-MM-DD oder ISO String
    verantwortlich?: string;
    aufgabe_status?: LookupValue;
    aufgabe_notizen?: string;
  };
}

export interface Budgetplanung {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    budget_kategorie?: LookupValue;
    budget_beschreibung?: string;
    geplanter_betrag?: number;
    tatsaechlicher_betrag?: number;
    budget_zahlungsstatus?: LookupValue;
    faelligkeitsdatum?: string; // Format: YYYY-MM-DD oder ISO String
    dienstleister_ref?: string; // applookup -> URL zu 'Dienstleister' Record
    budget_notizen?: string;
  };
}

export const APP_IDS = {
  DIENSTLEISTER: '69d23a9451738ee4cd0b187d',
  TISCHPLAN: '69d23a988247f96f9b95d80a',
  LOCATIONS: '69d23a935dd994ff99fee8eb',
  ZEITPLAN_ABLAUF: '69d23a978de260826ade5809',
  GAESTELISTE: '69d23a9578db530f545cb88a',
  HOCHZEITSDETAILS: '69d23a8e89c5177deacbdebc',
  AUFGABEN_TO_DOS: '69d23a989e9072af0f038f40',
  BUDGETPLANUNG: '69d23a96cb929938e4f78841',
} as const;


export const LOOKUP_OPTIONS: Record<string, Record<string, {key: string, label: string}[]>> = {
  'dienstleister': {
    kategorie: [{ key: "fotograf", label: "Fotograf" }, { key: "videograf", label: "Videograf" }, { key: "caterer", label: "Caterer" }, { key: "dj", label: "DJ" }, { key: "band_musiker", label: "Band / Musiker" }, { key: "florist", label: "Florist" }, { key: "konditor_torte", label: "Konditor / Torte" }, { key: "friseur_makeup", label: "Friseur / Make-up" }, { key: "trauredner", label: "Trauredner" }, { key: "dekoration", label: "Dekoration" }, { key: "transport", label: "Transport" }, { key: "sonstiges", label: "Sonstiges" }],
    zahlungsstatus: [{ key: "offen", label: "Offen" }, { key: "anzahlung_geleistet", label: "Anzahlung geleistet" }, { key: "vollstaendig_bezahlt", label: "Vollständig bezahlt" }],
    vertragsstatus: [{ key: "kein_vertrag", label: "Kein Vertrag" }, { key: "vertrag_angefragt", label: "Vertrag angefragt" }, { key: "vertrag_erhalten", label: "Vertrag erhalten" }, { key: "vertrag_unterzeichnet", label: "Vertrag unterzeichnet" }],
  },
  'tischplan': {
    tisch_form: [{ key: "rechteckig", label: "Rechteckig" }, { key: "oval", label: "Oval" }, { key: "u_form", label: "U-Form" }, { key: "bankett", label: "Bankett" }, { key: "sonstiges", label: "Sonstiges" }, { key: "rund", label: "Rund" }],
  },
  'locations': {
    location_typ: [{ key: "zeremonie", label: "Zeremonie" }, { key: "feier_empfang", label: "Feier / Empfang" }, { key: "zeremonie_feier", label: "Zeremonie & Feier" }, { key: "standesamt", label: "Standesamt" }, { key: "kirche", label: "Kirche" }, { key: "sonstiges", label: "Sonstiges" }],
    loc_ausstattung: [{ key: "parkplaetze", label: "Parkplätze" }, { key: "uebernachtung", label: "Übernachtungsmöglichkeiten" }, { key: "catering_kueche", label: "Catering-Küche" }, { key: "tanzflaeche", label: "Tanzfläche" }, { key: "aussenbereich", label: "Außenbereich / Garten" }, { key: "behindertengerecht", label: "Behindertengerecht" }, { key: "technik_buehne", label: "Technik / Bühne" }, { key: "klimaanlage", label: "Klimaanlage" }],
  },
  'gaesteliste': {
    beziehung: [{ key: "familie_braeutigam", label: "Familie Bräutigam" }, { key: "freunde_braut", label: "Freunde Braut" }, { key: "freunde_braeutigam", label: "Freunde Bräutigam" }, { key: "arbeitskollegen", label: "Arbeitskollegen" }, { key: "sonstige", label: "Sonstige" }, { key: "familie_braut", label: "Familie Braut" }],
    rsvp_status: [{ key: "ausstehend", label: "Ausstehend" }, { key: "zugesagt", label: "Zugesagt" }, { key: "abgesagt", label: "Abgesagt" }, { key: "vielleicht", label: "Vielleicht" }],
    menuewahl: [{ key: "fleisch", label: "Fleisch" }, { key: "fisch", label: "Fisch" }, { key: "vegetarisch", label: "Vegetarisch" }, { key: "vegan", label: "Vegan" }, { key: "kinderteller", label: "Kinderteller" }],
  },
  'hochzeitsdetails': {
    zeremonie_sprache: [{ key: "deutsch", label: "Deutsch" }, { key: "englisch", label: "Englisch" }, { key: "zweisprachig", label: "Zweisprachig" }, { key: "sonstige", label: "Sonstige" }],
  },
  'aufgaben_to_dos': {
    aufgabe_kategorie: [{ key: "location_dekoration", label: "Location & Dekoration" }, { key: "catering_torte", label: "Catering & Torte" }, { key: "dienstleister", label: "Dienstleister" }, { key: "gaeste_einladungen", label: "Gäste & Einladungen" }, { key: "kleidung_beauty", label: "Kleidung & Beauty" }, { key: "dokumente_behoerden", label: "Dokumente & Behörden" }, { key: "flitterwochen", label: "Flitterwochen" }, { key: "sonstiges", label: "Sonstiges" }],
    prioritaet: [{ key: "hoch", label: "Hoch" }, { key: "mittel", label: "Mittel" }, { key: "niedrig", label: "Niedrig" }],
    aufgabe_status: [{ key: "offen", label: "Offen" }, { key: "in_bearbeitung", label: "In Bearbeitung" }, { key: "erledigt", label: "Erledigt" }, { key: "verschoben", label: "Verschoben" }],
  },
  'budgetplanung': {
    budget_kategorie: [{ key: "location", label: "Location" }, { key: "catering_getraenke", label: "Catering & Getränke" }, { key: "fotografie_video", label: "Fotografie & Video" }, { key: "musik_unterhaltung", label: "Musik & Unterhaltung" }, { key: "blumen_dekoration", label: "Blumen & Dekoration" }, { key: "hochzeitstorte", label: "Hochzeitstorte" }, { key: "kleidung_accessoires", label: "Kleidung & Accessoires" }, { key: "einladungen_papeterie", label: "Einladungen & Papeterie" }, { key: "transport", label: "Transport" }, { key: "flitterwochen", label: "Flitterwochen" }, { key: "sonstiges", label: "Sonstiges" }],
    budget_zahlungsstatus: [{ key: "offen", label: "Offen" }, { key: "anzahlung_geleistet", label: "Anzahlung geleistet" }, { key: "vollstaendig_bezahlt", label: "Vollständig bezahlt" }],
  },
};

export const FIELD_TYPES: Record<string, Record<string, string>> = {
  'dienstleister': {
    'kategorie': 'lookup/select',
    'firmenname': 'string/text',
    'ansprechpartner_vorname': 'string/text',
    'ansprechpartner_nachname': 'string/text',
    'dienstleister_email': 'string/email',
    'dienstleister_telefon': 'string/tel',
    'dienstleister_webseite': 'string/url',
    'dl_strasse': 'string/text',
    'dl_hausnummer': 'string/text',
    'dl_plz': 'string/text',
    'dl_ort': 'string/text',
    'vereinbarter_preis': 'number',
    'anzahlung': 'number',
    'zahlungsstatus': 'lookup/select',
    'vertragsstatus': 'lookup/select',
    'dl_notizen': 'string/textarea',
  },
  'tischplan': {
    'tisch_name': 'string/text',
    'tisch_form': 'lookup/select',
    'tisch_kapazitaet': 'number',
    'gaeste_zuweisung': 'applookup/select',
    'tisch_notizen': 'string/textarea',
  },
  'locations': {
    'location_name': 'string/text',
    'location_typ': 'lookup/select',
    'loc_strasse': 'string/text',
    'loc_hausnummer': 'string/text',
    'loc_plz': 'string/text',
    'loc_ort': 'string/text',
    'loc_geo': 'geo',
    'loc_kontakt_vorname': 'string/text',
    'loc_kontakt_nachname': 'string/text',
    'loc_telefon': 'string/tel',
    'loc_email': 'string/email',
    'loc_kapazitaet': 'number',
    'loc_mietpreis': 'number',
    'loc_buchung_von': 'date/datetimeminute',
    'loc_buchung_bis': 'date/datetimeminute',
    'loc_ausstattung': 'multiplelookup/checkbox',
    'loc_notizen': 'string/textarea',
  },
  'zeitplan_ablauf': {
    'zeitpunkt': 'date/datetimeminute',
    'programm_titel': 'string/text',
    'programm_beschreibung': 'string/textarea',
    'dauer_minuten': 'number',
    'verantwortliche_person': 'string/text',
    'location_ref': 'applookup/select',
    'zeitplan_dienstleister_ref': 'applookup/select',
    'zeitplan_notizen': 'string/textarea',
  },
  'gaesteliste': {
    'gast_vorname': 'string/text',
    'gast_nachname': 'string/text',
    'gast_email': 'string/email',
    'gast_telefon': 'string/tel',
    'gast_strasse': 'string/text',
    'gast_hausnummer': 'string/text',
    'gast_plz': 'string/text',
    'gast_ort': 'string/text',
    'beziehung': 'lookup/select',
    'rsvp_status': 'lookup/select',
    'menuewahl': 'lookup/select',
    'allergien': 'string/textarea',
    'uebernachtung': 'bool',
    'gast_notizen': 'string/textarea',
  },
  'hochzeitsdetails': {
    'partner1_vorname': 'string/text',
    'partner1_nachname': 'string/text',
    'partner2_vorname': 'string/text',
    'partner2_nachname': 'string/text',
    'kontakt_email': 'string/email',
    'kontakt_telefon': 'string/tel',
    'hochzeitsdatum': 'date/datetimeminute',
    'motto': 'string/text',
    'zeremonie_sprache': 'lookup/select',
    'gaeste_anzahl': 'number',
    'gesamtbudget': 'number',
    'besondere_wuensche': 'string/textarea',
  },
  'aufgaben_to_dos': {
    'aufgabe_titel': 'string/text',
    'aufgabe_beschreibung': 'string/textarea',
    'aufgabe_kategorie': 'lookup/select',
    'prioritaet': 'lookup/radio',
    'faellig_am': 'date/date',
    'verantwortlich': 'string/text',
    'aufgabe_status': 'lookup/select',
    'aufgabe_notizen': 'string/textarea',
  },
  'budgetplanung': {
    'budget_kategorie': 'lookup/select',
    'budget_beschreibung': 'string/text',
    'geplanter_betrag': 'number',
    'tatsaechlicher_betrag': 'number',
    'budget_zahlungsstatus': 'lookup/select',
    'faelligkeitsdatum': 'date/date',
    'dienstleister_ref': 'applookup/select',
    'budget_notizen': 'string/textarea',
  },
};

type StripLookup<T> = {
  [K in keyof T]: T[K] extends LookupValue | undefined ? string | LookupValue | undefined
    : T[K] extends LookupValue[] | undefined ? string[] | LookupValue[] | undefined
    : T[K];
};

// Helper Types for creating new records (lookup fields as plain strings for API)
export type CreateDienstleister = StripLookup<Dienstleister['fields']>;
export type CreateTischplan = StripLookup<Tischplan['fields']>;
export type CreateLocations = StripLookup<Locations['fields']>;
export type CreateZeitplanAblauf = StripLookup<ZeitplanAblauf['fields']>;
export type CreateGaesteliste = StripLookup<Gaesteliste['fields']>;
export type CreateHochzeitsdetails = StripLookup<Hochzeitsdetails['fields']>;
export type CreateAufgabenToDos = StripLookup<AufgabenToDos['fields']>;
export type CreateBudgetplanung = StripLookup<Budgetplanung['fields']>;