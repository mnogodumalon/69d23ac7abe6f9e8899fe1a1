import type { Hochzeitsdetails } from '@/types/app';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { IconPencil } from '@tabler/icons-react';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

function formatDate(d?: string) {
  if (!d) return '—';
  try { return format(parseISO(d), 'dd.MM.yyyy', { locale: de }); } catch { return d; }
}

interface HochzeitsdetailsViewDialogProps {
  open: boolean;
  onClose: () => void;
  record: Hochzeitsdetails | null;
  onEdit: (record: Hochzeitsdetails) => void;
}

export function HochzeitsdetailsViewDialog({ open, onClose, record, onEdit }: HochzeitsdetailsViewDialogProps) {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Hochzeitsdetails anzeigen</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end">
          <Button size="sm" onClick={() => { onClose(); onEdit(record); }}>
            <IconPencil className="h-3.5 w-3.5 mr-1.5" />
            Bearbeiten
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Vorname Partner/in 1</Label>
            <p className="text-sm">{record.fields.partner1_vorname ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Nachname Partner/in 1</Label>
            <p className="text-sm">{record.fields.partner1_nachname ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Vorname Partner/in 2</Label>
            <p className="text-sm">{record.fields.partner2_vorname ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Nachname Partner/in 2</Label>
            <p className="text-sm">{record.fields.partner2_nachname ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">E-Mail-Adresse</Label>
            <p className="text-sm">{record.fields.kontakt_email ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Telefonnummer</Label>
            <p className="text-sm">{record.fields.kontakt_telefon ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Hochzeitsdatum</Label>
            <p className="text-sm">{formatDate(record.fields.hochzeitsdatum)}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Motto / Thema der Hochzeit</Label>
            <p className="text-sm">{record.fields.motto ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Sprache der Zeremonie</Label>
            <Badge variant="secondary">{record.fields.zeremonie_sprache?.label ?? '—'}</Badge>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Erwartete Gästeanzahl</Label>
            <p className="text-sm">{record.fields.gaeste_anzahl ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Gesamtbudget (€)</Label>
            <p className="text-sm">{record.fields.gesamtbudget ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Besondere Wünsche / Notizen</Label>
            <p className="text-sm whitespace-pre-wrap">{record.fields.besondere_wuensche ?? '—'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}