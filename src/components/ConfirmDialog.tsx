import { Button } from "@/components/AppButton";
import { cn } from "@/lib/utils";

export function ConfirmDialog({
  open,
  title,
  body,
  detail,
  confirmLabel,
  pendingLabel,
  destructive,
  pending,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  body: string;
  detail?: string;
  confirmLabel: string;
  pendingLabel?: string;
  destructive?: boolean;
  pending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-md rounded-[var(--radius-card)] border border-border bg-card p-8 shadow-card">
        <h2 className="text-2xl text-foreground">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
        {detail ? <p className="mt-4 text-sm font-medium text-foreground">{detail}</p> : null}
        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={pending}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={pending}
            className={cn(destructive && "bg-red-700 text-white hover:bg-red-800")}
          >
            {pending ? (pendingLabel ?? "Working…") : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
