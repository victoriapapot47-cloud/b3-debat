export default function Footer() {
  return (
    <footer className="relative z-10 flex flex-col gap-3 border-t border-ink/15 px-5 py-6 text-[10px] uppercase tracking-[0.3em] text-taupe md:flex-row md:items-center md:justify-between md:px-10">
      <span>© 2026 Maison Julia</span>
      <span>Eau de parfum · 50 ml · 100 ml</span>
      <a href="#hero" className="transition-colors hover:text-ink">Retour en haut ↑</a>
    </footer>
  );
}
