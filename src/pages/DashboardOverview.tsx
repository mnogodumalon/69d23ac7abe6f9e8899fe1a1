import { useDashboardData } from '@/hooks/useDashboardData';
import { enrichBudgetplanung, enrichZeitplanAblauf, enrichTischplan } from '@/lib/enrich';
import type { EnrichedBudgetplanung } from '@/types/enriched';
import type { AufgabenToDos, Gaesteliste } from '@/types/app';
import { LivingAppsService } from '@/services/livingAppsService';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/StatCard';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { AufgabenToDosDialog } from '@/components/dialogs/AufgabenToDosDialog';
import { GaestelisteDialog } from '@/components/dialogs/GaestelisteDialog';
import { AI_PHOTO_SCAN } from '@/config/ai-features';
import {
  IconAlertCircle, IconTool, IconRefresh, IconCheck, IconUsers,
  IconCurrencyEuro, IconSquareCheck, IconPlus, IconPencil, IconTrash,
  IconCalendarEvent, IconHeart, IconChevronRight, IconClock,
  IconBuildingStore, IconMapPin, IconRings,
} from '@tabler/icons-react';
import { differenceInDays, parseISO, isValid } from 'date-fns';

const APPGROUP_ID = '69d23ac7abe6f9e8899fe1a1';
const REPAIR_ENDPOINT = '/claude/build/repair';

const AUFGABE_STATUS_ORDER = ['offen', 'in_bearbeitung', 'erledigt', 'verschoben'];
const AUFGABE_STATUS_LABELS: Record<string, string> = {
  offen: 'Offen',
  in_bearbeitung: 'In Bearbeitung',
  erledigt: 'Erledigt',
  verschoben: 'Verschoben',
};
const AUFGABE_STATUS_COLORS: Record<string, string> = {
  offen: 'bg-amber-50 border-amber-200 text-amber-800',
  in_bearbeitung: 'bg-blue-50 border-blue-200 text-blue-800',
  erledigt: 'bg-green-50 border-green-200 text-green-800',
  verschoben: 'bg-slate-50 border-slate-200 text-slate-600',
};
const AUFGABE_STATUS_BADGE: Record<string, string> = {
  offen: 'bg-amber-100 text-amber-700 border-amber-200',
  in_bearbeitung: 'bg-blue-100 text-blue-700 border-blue-200',
  erledigt: 'bg-green-100 text-green-700 border-green-200',
  verschoben: 'bg-slate-100 text-slate-600 border-slate-200',
};
const PRIORITAET_COLORS: Record<string, string> = {
  hoch: 'bg-red-500',
  mittel: 'bg-amber-400',
  niedrig: 'bg-slate-300',
};

export default function DashboardOverview() {
  const {
    hochzeitsdetails, locations, dienstleister, gaesteliste, budgetplanung,
    zeitplanAblauf, aufgabenToDos, tischplan,
    locationsMap, dienstleisterMap, gaestelisteMap,
    loading, error, fetchAll,
  } = useDashboardData();

  const enrichedBudgetplanung = enrichBudgetplanung(budgetplanung, { dienstleisterMap });
  const enrichedZeitplanAblauf = enrichZeitplanAblauf(zeitplanAblauf, { locationsMap, dienstleisterMap });
  const enrichedTischplan = enrichTischplan(tischplan, { gaestelisteMap });

  // All hooks BEFORE early returns
  const [aufgabeDialogOpen, setAufgabeDialogOpen] = useState(false);
  const [editAufgabe, setEditAufgabe] = useState<AufgabenToDos | null>(null);
  const [deleteAufgabe, setDeleteAufgabe] = useState<AufgabenToDos | null>(null);
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [editGuest, setEditGuest] = useState<Gaesteliste | null>(null);
  const [deleteGuest, setDeleteGuest] = useState<Gaesteliste | null>(null);
  const [activeTab, setActiveTab] = useState<'aufgaben' | 'gaeste' | 'budget' | 'zeitplan'>('aufgaben');

  const wedding = hochzeitsdetails[0];
  const weddingDate = wedding?.fields.hochzeitsdatum ? parseISO(wedding.fields.hochzeitsdatum) : null;
  const daysUntil = weddingDate && isValid(weddingDate) ? differenceInDays(weddingDate, new Date()) : null;

  // Budget stats
  const totalGeplant = useMemo(() => enrichedBudgetplanung.reduce((s, b) => s + (b.fields.geplanter_betrag ?? 0), 0), [enrichedBudgetplanung]);
  const totalIst = useMemo(() => enrichedBudgetplanung.reduce((s, b) => s + (b.fields.tatsaechlicher_betrag ?? 0), 0), [enrichedBudgetplanung]);
  const budgetRemaining = (wedding?.fields.gesamtbudget ?? 0) - totalIst;

  // Guest stats
  const zugesagt = useMemo(() => gaesteliste.filter(g => g.fields.rsvp_status?.key === 'zugesagt').length, [gaesteliste]);
  const ausstehend = useMemo(() => gaesteliste.filter(g => g.fields.rsvp_status?.key === 'ausstehend').length, [gaesteliste]);

  // Aufgaben by status
  const aufgabenByStatus = useMemo(() => {
    const grouped: Record<string, AufgabenToDos[]> = {};
    AUFGABE_STATUS_ORDER.forEach(s => { grouped[s] = []; });
    aufgabenToDos.forEach(a => {
      const key = a.fields.aufgabe_status?.key ?? 'offen';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(a);
    });
    return grouped;
  }, [aufgabenToDos]);

  const offeneAufgaben = aufgabenByStatus['offen']?.length ?? 0;
  const erledigteAufgaben = aufgabenByStatus['erledigt']?.length ?? 0;

  // Upcoming Zeitplan events (next 5)
  const upcomingEvents = useMemo(() => {
    return [...enrichedZeitplanAblauf]
      .filter(z => z.fields.zeitpunkt)
      .sort((a, b) => (a.fields.zeitpunkt ?? '').localeCompare(b.fields.zeitpunkt ?? ''))
      .slice(0, 5);
  }, [enrichedZeitplanAblauf]);

  // Budget by category grouped
  const budgetByCategory = useMemo(() => {
    const map: Record<string, EnrichedBudgetplanung[]> = {};
    enrichedBudgetplanung.forEach(b => {
      const cat = b.fields.budget_kategorie?.label ?? 'Sonstiges';
      if (!map[cat]) map[cat] = [];
      map[cat].push(b);
    });
    return Object.entries(map).sort((a, b) => {
      const sumA = a[1].reduce((s, x) => s + (x.fields.tatsaechlicher_betrag ?? x.fields.geplanter_betrag ?? 0), 0);
      const sumB = b[1].reduce((s, x) => s + (x.fields.tatsaechlicher_betrag ?? x.fields.geplanter_betrag ?? 0), 0);
      return sumB - sumA;
    });
  }, [enrichedBudgetplanung]);

  // Unused variables suppression — these are used in JSX below or enrichment kept
  void enrichedTischplan;

  if (loading) return <DashboardSkeleton />;
  if (error) return <DashboardError error={error} onRetry={fetchAll} />;

  const handleDeleteAufgabe = async () => {
    if (!deleteAufgabe) return;
    await LivingAppsService.deleteAufgabenToDo(deleteAufgabe.record_id);
    setDeleteAufgabe(null);
    fetchAll();
  };

  const handleDeleteGuest = async () => {
    if (!deleteGuest) return;
    await LivingAppsService.deleteGaestelisteEntry(deleteGuest.record_id);
    setDeleteGuest(null);
    fetchAll();
  };

  const partnerName = wedding
    ? `${wedding.fields.partner1_vorname ?? ''} & ${wedding.fields.partner2_vorname ?? ''}`.trim()
    : null;

  return (
    <div className="space-y-6">
      {/* Hero: Countdown + Wedding Info */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <IconHeart size={16} className="text-primary shrink-0" />
              <span className="text-sm font-medium text-primary">Eure Hochzeit</span>
            </div>
            {partnerName ? (
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">{partnerName}</h1>
            ) : (
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Hochzeitsplaner</h1>
            )}
            {wedding?.fields.motto && (
              <p className="text-sm text-muted-foreground mt-1 italic">"{wedding.fields.motto}"</p>
            )}
            {weddingDate && isValid(weddingDate) && (
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <IconCalendarEvent size={15} className="shrink-0" />
                  <span>{formatDate(wedding?.fields.hochzeitsdatum)}</span>
                </div>
                {locations[0] && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <IconMapPin size={15} className="shrink-0" />
                    <span className="truncate">{locations[0].fields.location_name ?? locations[0].fields.loc_ort ?? 'Location'}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Countdown */}
          {daysUntil !== null && (
            <div className="shrink-0 flex flex-col items-center bg-primary text-primary-foreground rounded-2xl px-6 py-4 shadow-lg min-w-[100px]">
              <span className="text-4xl font-black leading-none">
                {daysUntil > 0 ? daysUntil : daysUntil === 0 ? '🎉' : Math.abs(daysUntil)}
              </span>
              <span className="text-xs font-medium opacity-80 mt-1 text-center">
                {daysUntil > 0 ? 'Tage noch' : daysUntil === 0 ? 'Heute!' : 'Tage her'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="Gäste"
          value={String(gaesteliste.length)}
          description={`${zugesagt} zugesagt · ${ausstehend} ausstehend`}
          icon={<IconUsers size={18} className="text-muted-foreground" />}
        />
        <StatCard
          title="Aufgaben offen"
          value={String(offeneAufgaben)}
          description={`${erledigteAufgaben} erledigt`}
          icon={<IconSquareCheck size={18} className="text-muted-foreground" />}
        />
        <StatCard
          title="Budget geplant"
          value={formatCurrency(totalGeplant)}
          description={`${formatCurrency(totalIst)} ausgegeben`}
          icon={<IconCurrencyEuro size={18} className="text-muted-foreground" />}
        />
        <StatCard
          title="Dienstleister"
          value={String(dienstleister.length)}
          description={`${tischplan.length} Tische · ${locations.length} Locations`}
          icon={<IconBuildingStore size={18} className="text-muted-foreground" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/40 rounded-xl p-1 flex-wrap">
        {(['aufgaben', 'gaeste', 'budget', 'zeitplan'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[80px] px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'aufgaben' ? 'Aufgaben' : tab === 'gaeste' ? 'Gäste' : tab === 'budget' ? 'Budget' : 'Zeitplan'}
          </button>
        ))}
      </div>

      {/* Tab: Aufgaben Kanban */}
      {activeTab === 'aufgaben' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-semibold">To-Dos & Aufgaben</h2>
            <Button size="sm" onClick={() => { setEditAufgabe(null); setAufgabeDialogOpen(true); }}>
              <IconPlus size={15} className="mr-1 shrink-0" />Aufgabe hinzufügen
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AUFGABE_STATUS_ORDER.map(status => {
              const aufgaben = aufgabenByStatus[status] ?? [];
              return (
                <div key={status} className={`rounded-xl border p-3 ${AUFGABE_STATUS_COLORS[status]}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wide opacity-70">{AUFGABE_STATUS_LABELS[status]}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${AUFGABE_STATUS_BADGE[status]}`}>{aufgaben.length}</span>
                  </div>
                  <div className="space-y-2">
                    {aufgaben.length === 0 && (
                      <p className="text-xs opacity-50 text-center py-4">Keine Aufgaben</p>
                    )}
                    {aufgaben.map(a => (
                      <div key={a.record_id} className="bg-white/80 rounded-lg p-2.5 shadow-sm border border-white/50">
                        <div className="flex items-start gap-2">
                          {a.fields.prioritaet?.key && (
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${PRIORITAET_COLORS[a.fields.prioritaet.key] ?? 'bg-slate-300'}`} />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 leading-tight truncate">{a.fields.aufgabe_titel ?? '—'}</p>
                            {a.fields.faellig_am && (
                              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                <IconClock size={11} className="shrink-0" />
                                {formatDate(a.fields.faellig_am)}
                              </p>
                            )}
                            {a.fields.aufgabe_kategorie?.label && (
                              <p className="text-xs text-slate-400 mt-0.5">{a.fields.aufgabe_kategorie.label}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 mt-2">
                          <button
                            onClick={() => { setEditAufgabe(a); setAufgabeDialogOpen(true); }}
                            className="p-1 rounded hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                            title="Bearbeiten"
                          >
                            <IconPencil size={13} className="shrink-0" />
                          </button>
                          <button
                            onClick={() => setDeleteAufgabe(a)}
                            className="p-1 rounded hover:bg-red-50 transition-colors text-slate-500 hover:text-red-600"
                            title="Löschen"
                          >
                            <IconTrash size={13} className="shrink-0" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Gästeliste */}
      {activeTab === 'gaeste' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-semibold">Gästeliste <span className="text-muted-foreground font-normal text-base">({gaesteliste.length})</span></h2>
            <Button size="sm" onClick={() => { setEditGuest(null); setGuestDialogOpen(true); }}>
              <IconPlus size={15} className="mr-1 shrink-0" />Gast hinzufügen
            </Button>
          </div>
          {/* RSVP Summary */}
          <div className="flex flex-wrap gap-2">
            {['zugesagt', 'ausstehend', 'abgesagt', 'vielleicht'].map(status => {
              const count = gaesteliste.filter(g => g.fields.rsvp_status?.key === status).length;
              const colors: Record<string, string> = {
                zugesagt: 'bg-green-100 text-green-700 border-green-200',
                ausstehend: 'bg-amber-100 text-amber-700 border-amber-200',
                abgesagt: 'bg-red-100 text-red-700 border-red-200',
                vielleicht: 'bg-blue-100 text-blue-700 border-blue-200',
              };
              const labels: Record<string, string> = { zugesagt: 'Zugesagt', ausstehend: 'Ausstehend', abgesagt: 'Abgesagt', vielleicht: 'Vielleicht' };
              return (
                <span key={status} className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors[status]}`}>
                  {labels[status]}: {count}
                </span>
              );
            })}
          </div>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Name</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden sm:table-cell">Beziehung</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">RSVP</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden md:table-cell">Menü</th>
                  <th className="px-4 py-2.5 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {gaesteliste.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-muted-foreground py-10">
                      <IconUsers size={32} className="mx-auto mb-2 opacity-30" />
                      Noch keine Gäste eingetragen
                    </td>
                  </tr>
                )}
                {gaesteliste.map((g, i) => {
                  const rsvp = g.fields.rsvp_status?.key ?? '';
                  const rsvpColors: Record<string, string> = {
                    zugesagt: 'bg-green-100 text-green-700',
                    ausstehend: 'bg-amber-100 text-amber-700',
                    abgesagt: 'bg-red-100 text-red-700',
                    vielleicht: 'bg-blue-100 text-blue-700',
                  };
                  return (
                    <tr key={g.record_id} className={`border-b last:border-b-0 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-2.5">
                        <span className="font-medium truncate block max-w-[150px]">
                          {g.fields.gast_vorname} {g.fields.gast_nachname}
                        </span>
                        {g.fields.uebernachtung && (
                          <span className="text-xs text-purple-600 font-medium">Übernachtung</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 hidden sm:table-cell text-muted-foreground text-xs">{g.fields.beziehung?.label ?? '—'}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rsvpColors[rsvp] ?? 'bg-muted text-muted-foreground'}`}>
                          {g.fields.rsvp_status?.label ?? 'Ausstehend'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 hidden md:table-cell text-muted-foreground text-xs">{g.fields.menuewahl?.label ?? '—'}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => { setEditGuest(g); setGuestDialogOpen(true); }} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                            <IconPencil size={14} className="shrink-0" />
                          </button>
                          <button onClick={() => setDeleteGuest(g)} className="p-1.5 rounded hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600">
                            <IconTrash size={14} className="shrink-0" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Budget */}
      {activeTab === 'budget' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Budgetübersicht</h2>
          {/* Budget summary bar */}
          {wedding?.fields.gesamtbudget && (
            <div className="rounded-xl border p-4 bg-muted/20 space-y-2">
              <div className="flex justify-between text-sm flex-wrap gap-2">
                <span className="text-muted-foreground">Gesamtbudget</span>
                <span className="font-semibold">{formatCurrency(wedding.fields.gesamtbudget)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all ${totalIst > (wedding.fields.gesamtbudget ?? 0) ? 'bg-red-500' : 'bg-primary'}`}
                  style={{ width: `${Math.min(100, (totalIst / (wedding.fields.gesamtbudget ?? 1)) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs flex-wrap gap-1">
                <span className="text-muted-foreground">Ausgegeben: <span className="font-semibold text-foreground">{formatCurrency(totalIst)}</span></span>
                <span className={`font-semibold ${budgetRemaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {budgetRemaining < 0 ? 'Überzogen: ' : 'Rest: '}{formatCurrency(Math.abs(budgetRemaining))}
                </span>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {budgetByCategory.length === 0 && (
              <div className="text-center text-muted-foreground py-10">
                <IconCurrencyEuro size={32} className="mx-auto mb-2 opacity-30" />
                Noch keine Budgetpositionen
              </div>
            )}
            {budgetByCategory.map(([cat, items]) => {
              const catGeplant = items.reduce((s, b) => s + (b.fields.geplanter_betrag ?? 0), 0);
              const catIst = items.reduce((s, b) => s + (b.fields.tatsaechlicher_betrag ?? 0), 0);
              return (
                <div key={cat} className="rounded-xl border overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/20 flex-wrap gap-1">
                    <span className="font-medium text-sm">{cat}</span>
                    <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                      <span>Geplant: <span className="font-semibold text-foreground">{formatCurrency(catGeplant)}</span></span>
                      <span>Ist: <span className="font-semibold text-foreground">{formatCurrency(catIst)}</span></span>
                    </div>
                  </div>
                  <div className="divide-y">
                    {items.map(b => {
                      const statusKey = b.fields.budget_zahlungsstatus?.key ?? '';
                      const statusColors: Record<string, string> = {
                        offen: 'bg-amber-100 text-amber-700',
                        anzahlung_geleistet: 'bg-blue-100 text-blue-700',
                        vollstaendig_bezahlt: 'bg-green-100 text-green-700',
                      };
                      return (
                        <div key={b.record_id} className="flex items-center gap-3 px-4 py-2.5 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium truncate block">{b.fields.budget_beschreibung ?? '—'}</span>
                            {b.dienstleister_refName && (
                              <span className="text-xs text-muted-foreground">{b.dienstleister_refName}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0 flex-wrap">
                            {b.fields.faelligkeitsdatum && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <IconClock size={11} />
                                {formatDate(b.fields.faelligkeitsdatum)}
                              </span>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[statusKey] ?? 'bg-muted text-muted-foreground'}`}>
                              {b.fields.budget_zahlungsstatus?.label ?? 'Offen'}
                            </span>
                            <span className="text-sm font-semibold">
                              {formatCurrency(b.fields.tatsaechlicher_betrag ?? b.fields.geplanter_betrag ?? 0)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Zeitplan */}
      {activeTab === 'zeitplan' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Hochzeitsablauf</h2>
          {upcomingEvents.length === 0 && (
            <div className="text-center text-muted-foreground py-10 rounded-xl border">
              <IconCalendarEvent size={32} className="mx-auto mb-2 opacity-30" />
              Noch kein Ablaufplan eingetragen
            </div>
          )}
          <div className="relative">
            {enrichedZeitplanAblauf
              .sort((a, b) => (a.fields.zeitpunkt ?? '').localeCompare(b.fields.zeitpunkt ?? ''))
              .map((z, i) => (
                <div key={z.record_id} className="flex gap-4 pb-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {i + 1}
                    </div>
                    {i < enrichedZeitplanAblauf.length - 1 && (
                      <div className="w-0.5 flex-1 bg-border mt-1 min-h-[20px]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pb-2">
                    <div className="rounded-xl border bg-card p-3">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{z.fields.programm_titel ?? '—'}</p>
                          {z.fields.zeitpunkt && (
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                              <IconClock size={11} className="shrink-0" />
                              {formatDate(z.fields.zeitpunkt)}
                              {z.fields.dauer_minuten && ` · ${z.fields.dauer_minuten} Min.`}
                            </p>
                          )}
                          {z.fields.programm_beschreibung && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{z.fields.programm_beschreibung}</p>
                          )}
                        </div>
                        <div className="shrink-0 flex flex-col gap-1 items-end">
                          {z.location_refName && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <IconMapPin size={10} className="shrink-0" />
                              <span className="truncate max-w-[100px]">{z.location_refName}</span>
                            </Badge>
                          )}
                          {z.fields.verantwortliche_person && (
                            <span className="text-xs text-muted-foreground">{z.fields.verantwortliche_person}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Floating Action: Quick summary at bottom */}
      {activeTab !== 'aufgaben' && offeneAufgaben > 0 && (
        <div
          className="fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 cursor-pointer hover:bg-primary/90 transition-colors"
          onClick={() => setActiveTab('aufgaben')}
        >
          <IconSquareCheck size={16} className="shrink-0" />
          <span className="text-sm font-semibold">{offeneAufgaben} Aufgabe{offeneAufgaben !== 1 ? 'n' : ''} offen</span>
          <IconChevronRight size={15} className="shrink-0" />
        </div>
      )}

      {/* Dialogs */}
      <AufgabenToDosDialog
        open={aufgabeDialogOpen}
        onClose={() => { setAufgabeDialogOpen(false); setEditAufgabe(null); }}
        onSubmit={async (fields) => {
          if (editAufgabe) {
            await LivingAppsService.updateAufgabenToDo(editAufgabe.record_id, fields);
          } else {
            await LivingAppsService.createAufgabenToDo(fields);
          }
          fetchAll();
        }}
        defaultValues={editAufgabe?.fields}
        enablePhotoScan={AI_PHOTO_SCAN['AufgabenToDos']}
      />

      <GaestelisteDialog
        open={guestDialogOpen}
        onClose={() => { setGuestDialogOpen(false); setEditGuest(null); }}
        onSubmit={async (fields) => {
          if (editGuest) {
            await LivingAppsService.updateGaestelisteEntry(editGuest.record_id, fields);
          } else {
            await LivingAppsService.createGaestelisteEntry(fields);
          }
          fetchAll();
        }}
        defaultValues={editGuest?.fields}
        enablePhotoScan={AI_PHOTO_SCAN['Gaesteliste']}
      />

      <ConfirmDialog
        open={!!deleteAufgabe}
        title="Aufgabe löschen"
        description={`Aufgabe "${deleteAufgabe?.fields.aufgabe_titel ?? ''}" wirklich löschen?`}
        onConfirm={handleDeleteAufgabe}
        onClose={() => setDeleteAufgabe(null)}
      />

      <ConfirmDialog
        open={!!deleteGuest}
        title="Gast entfernen"
        description={`${deleteGuest?.fields.gast_vorname ?? ''} ${deleteGuest?.fields.gast_nachname ?? ''} wirklich aus der Gästeliste entfernen?`}
        onConfirm={handleDeleteGuest}
        onClose={() => setDeleteGuest(null)}
      />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
      </div>
      <Skeleton className="h-10 rounded-xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}

function DashboardError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  const [repairing, setRepairing] = useState(false);
  const [repairStatus, setRepairStatus] = useState('');
  const [repairDone, setRepairDone] = useState(false);
  const [repairFailed, setRepairFailed] = useState(false);

  const handleRepair = async () => {
    setRepairing(true);
    setRepairStatus('Reparatur wird gestartet...');
    setRepairFailed(false);

    const errorContext = JSON.stringify({
      type: 'data_loading',
      message: error.message,
      stack: (error.stack ?? '').split('\n').slice(0, 10).join('\n'),
      url: window.location.href,
    });

    try {
      const resp = await fetch(REPAIR_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ appgroup_id: APPGROUP_ID, error_context: errorContext }),
      });

      if (!resp.ok || !resp.body) {
        setRepairing(false);
        setRepairFailed(true);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const raw of lines) {
          const line = raw.trim();
          if (!line.startsWith('data: ')) continue;
          const content = line.slice(6);
          if (content.startsWith('[STATUS]')) setRepairStatus(content.replace(/^\[STATUS]\s*/, ''));
          if (content.startsWith('[DONE]')) { setRepairDone(true); setRepairing(false); }
          if (content.startsWith('[ERROR]') && !content.includes('Dashboard-Links')) setRepairFailed(true);
        }
      }
    } catch {
      setRepairing(false);
      setRepairFailed(true);
    }
  };

  if (repairDone) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
          <IconCheck size={22} className="text-green-500" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-foreground mb-1">Dashboard repariert</h3>
          <p className="text-sm text-muted-foreground max-w-xs">Das Problem wurde behoben. Bitte laden Sie die Seite neu.</p>
        </div>
        <Button size="sm" onClick={() => window.location.reload()}>
          <IconRefresh size={14} className="mr-1" />Neu laden
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <IconAlertCircle size={22} className="text-destructive" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-foreground mb-1">Fehler beim Laden</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {repairing ? repairStatus : error.message}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onRetry} disabled={repairing}>Erneut versuchen</Button>
        <Button size="sm" onClick={handleRepair} disabled={repairing}>
          {repairing
            ? <span className="inline-block w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-1" />
            : <IconTool size={14} className="mr-1" />}
          {repairing ? 'Reparatur läuft...' : 'Dashboard reparieren'}
        </Button>
      </div>
      {repairFailed && <p className="text-sm text-destructive">Automatische Reparatur fehlgeschlagen. Bitte kontaktieren Sie den Support.</p>}
    </div>
  );
}

// Suppress unused import warning for IconRings (used indirectly via the icon set)
void IconRings;
