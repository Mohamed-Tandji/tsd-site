// Éléments d'interface communs, repris de la maquette (.btn, .sh, .tag)

type ButtonVariant = "primary" | "outline" | "white";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "border-action bg-action text-white hover:border-action-hover hover:bg-action-hover",
  outline: "border-action bg-transparent text-action hover:bg-action hover:text-white",
  white: "border-white bg-white text-navy hover:border-[#e8f1fd] hover:bg-[#e8f1fd]",
};

export function buttonClass(variant: ButtonVariant = "primary", size: "md" | "sm" = "md") {
  const sizing = size === "sm" ? "px-[18px] py-[9px] text-[15px]" : "px-6 py-[13px] text-base";
  return `inline-block rounded border-2 font-semibold leading-normal no-underline transition-colors duration-150 ${sizing} ${BUTTON_VARIANTS[variant]}`;
}

export function SectionHeading({ title, text, tight = false }: { title: string; text?: string; tight?: boolean }) {
  return (
    <div
      className={`max-w-[620px] after:mt-4 after:block after:h-[3px] after:w-12 after:bg-mint after:content-[''] ${tight ? "mb-6" : "mb-12 nav:mb-[72px]"}`}
    >
      <h2 className="text-[clamp(2rem,3.6vw,2.7rem)]">{title}</h2>
      {text && <p className="mt-4 text-slate">{text}</p>}
    </div>
  );
}

export function StatusBadge({ available, label }: { available: boolean; label: string }) {
  return (
    <span
      className={`self-start rounded-full px-3 py-1 text-[13px] leading-normal font-semibold ${
        available ? "bg-[#e6faf2] text-[#0b6b4c]" : "bg-[#e8f1fd] text-action"
      }`}
    >
      {label}
    </span>
  );
}
