// Single seam for the brand swap: once the real ZONEIN brand document lands,
// only this component (and the mark file it points at) needs to change.
const GEM_MARK_SRC = '/zonein-gem-mark.png';

function Logo({ tagline = false, dark = false }: { tagline?: boolean; dark?: boolean }) {
  const textColor = dark ? 'text-white' : 'text-zonein-ink';
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-[1px]">
        <span className={`font-display font-bold text-[22px] tracking-tight ${textColor}`}>ZONE</span>
        <img src={GEM_MARK_SRC} alt="ZoneIn" className="h-[22.7px] w-[13.5px] object-contain" />
        <span className={`font-display font-bold text-[22px] tracking-tight ${textColor}`}>N</span>
      </div>
      {tagline && (
        <p className={`text-xs tracking-[0.12em] uppercase mt-1 ${dark ? 'text-white/60' : 'text-zonein-gray'}`}>Hub</p>
      )}
    </div>
  );
}

export default Logo;
