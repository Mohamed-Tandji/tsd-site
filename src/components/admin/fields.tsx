import { inputClass } from "@/components/admin/styles";

// Champs de formulaire de l'administration (composants serveur)

type FieldProps = {
  name: string;
  id?: string;
  label: string;
  defaultValue?: string | number | null;
  hint?: string;
  required?: boolean;
  type?: string;
  maxLength?: number;
  autoComplete?: string;
};

export function Field({ name, id = name, label, defaultValue, hint, required, type = "text", maxLength = 300, autoComplete }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="font-semibold">
        {label}
        {required && <span className="text-[#b42318]"> *</span>}
      </label>
      {hint && <p className="mt-0.5 text-sm text-slate">{hint}</p>}
      <input id={id} name={name} type={type} defaultValue={defaultValue ?? ""} required={required} maxLength={maxLength} autoComplete={autoComplete} className={inputClass} />
    </div>
  );
}

export function TextArea({ name, label, defaultValue, hint, required, rows = 4, maxLength = 5000 }: FieldProps & { rows?: number }) {
  return (
    <div>
      <label htmlFor={name} className="font-semibold">
        {label}
        {required && <span className="text-[#b42318]"> *</span>}
      </label>
      {hint && <p className="mt-0.5 text-sm text-slate">{hint}</p>}
      <textarea id={name} name={name} defaultValue={defaultValue ?? ""} required={required} rows={rows} maxLength={maxLength} className={`${inputClass} resize-y`} />
    </div>
  );
}

export function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 font-semibold">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-action" />
      {label}
    </label>
  );
}

// Image : aperçu actuel, téléversement d'un nouveau fichier, retrait
export function ImageField({
  name,
  label,
  current,
  hint,
  removeLabel = "Retirer l’image",
  canRemove = !!current,
}: {
  name: string;
  label: string;
  current?: string | null;
  hint?: string;
  removeLabel?: string;
  canRemove?: boolean;
}) {
  return (
    <fieldset className="rounded border border-line bg-white p-4">
      <legend className="px-1 font-semibold">{label}</legend>
      {hint && <p className="text-sm text-slate">{hint}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-4">
        {current ? (
          <img src={current} alt="" className="h-20 max-w-[200px] rounded border border-line bg-paper object-contain p-1" />
        ) : (
          <span className="grid h-20 w-32 place-items-center rounded border border-dashed border-line text-sm text-slate">Aucune image</span>
        )}
        <div className="grid gap-2">
          <label htmlFor={`${name}File`} className="text-sm">
            Nouvelle image (JPG, PNG ou WebP, 5 Mo maximum)
          </label>
          <input id={`${name}File`} name={`${name}File`} type="file" accept="image/jpeg,image/png,image/webp" className="text-sm file:mr-3 file:cursor-pointer file:rounded file:border file:border-line file:bg-paper file:px-3 file:py-1.5" />
          {canRemove && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name={`${name}Remove`} className="size-4 accent-action" />
              {removeLabel}
            </label>
          )}
        </div>
      </div>
    </fieldset>
  );
}

export function Notice({ ok, error }: { ok?: string; error?: string }) {
  if (error)
    return (
      <p role="alert" className="mb-6 rounded border border-[#f3c4c0] bg-[#fdf1f0] px-4 py-3 text-[#8a1c13]">
        {error}
      </p>
    );
  if (ok)
    return (
      <p role="status" className="mb-6 rounded border border-[#b8ecd6] bg-[#e6faf2] px-4 py-3 text-[#0b6b4c]">
        {ok}
      </p>
    );
  return null;
}

export function PageTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <h1 className="font-serif text-[2rem]">{title}</h1>
      {children}
    </div>
  );
}

export function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <section className="rounded-md border border-line bg-white p-6">
      {title && <h2 className="mb-5 font-sans text-lg font-semibold">{title}</h2>}
      {children}
    </section>
  );
}
