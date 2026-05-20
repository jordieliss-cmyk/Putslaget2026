import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Namn krävs").max(100),
  email: z.string().trim().email("Ogiltig e-postadress").max(255),
  address: z.string().trim().min(1, "Adress krävs").max(255),
  windowCount: z.coerce.number().int().min(1, "Minst 1 fönster").max(1000),
  hasMuntins: z.enum(["nej", "ja-fasta", "ja-borttagbara"]),
  openable: z.enum(["ja", "nej", "blandat"]),
  notes: z.string().trim().max(1000).optional(),
});

export function QuoteForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center shadow-sm">
        <h3 className="text-2xl">Tack!</h3>
        <p className="mt-3 text-muted-foreground">
          Vi hör av oss inom 24 timmar med din offert.
        </p>
      </div>
    );
  }

  const field = "w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20";
  const label = "mb-1.5 block text-sm font-medium text-foreground";
  const err = "mt-1 text-xs text-destructive";

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>Namn</label>
          <input id="name" name="name" maxLength={100} className={field} placeholder="Förnamn Efternamn" />
          {errors.name && <p className={err}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className={label}>Mail</label>
          <input id="email" name="email" type="email" maxLength={255} className={field} placeholder="du@exempel.se" />
          {errors.email && <p className={err}>{errors.email}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="address" className={label}>Adress</label>
          <input id="address" name="address" maxLength={255} className={field} placeholder="Gatuadress, ort" />
          {errors.address && <p className={err}>{errors.address}</p>}
        </div>
        <div>
          <label htmlFor="windowCount" className={label}>Antal fönster</label>
          <input id="windowCount" name="windowCount" type="number" min={1} max={1000} className={field} placeholder="t.ex. 12" />
          {errors.windowCount && <p className={err}>{errors.windowCount}</p>}
        </div>
        <div>
          <label htmlFor="openable" className={label}>Öppningsbara?</label>
          <select id="openable" name="openable" defaultValue="ja" className={field}>
            <option value="ja">Ja</option>
            <option value="nej">Nej</option>
            <option value="blandat">Blandat</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="hasMuntins" className={label}>Spröjs</label>
          <select id="hasMuntins" name="hasMuntins" defaultValue="nej" className={field}>
            <option value="nej">Inga spröjs</option>
            <option value="ja-borttagbara">Ja – borttagbara</option>
            <option value="ja-fasta">Ja – fasta (ej borttagbara)</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="notes" className={label}>Andra specifikationer (valfritt)</label>
          <textarea id="notes" name="notes" rows={4} maxLength={1000} className={field} placeholder="Höjd, balkonger, tillgänglighet ..." />
          {errors.notes && <p className={err}>{errors.notes}</p>}
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 w-full rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:w-auto"
      >
        Begär offert
      </button>
    </form>
  );
}
