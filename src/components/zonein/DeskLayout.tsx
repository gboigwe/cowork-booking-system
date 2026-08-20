import type { DeskAvailability } from '../../types';

interface DeskLayoutProps {
  desks: DeskAvailability[];
  interactive?: boolean;
  selectedId?: string | null;
  onSelectDesk?: (deskId: string) => void;
}

function DeskBlock({
  desk, interactive, selected, onSelectDesk,
}: { desk: DeskAvailability; interactive: boolean; selected: boolean; onSelectDesk?: (id: string) => void }) {
  const clickable = interactive && desk.isAvailable;

  let classes = 'w-16 h-[52px] rounded-lg flex items-center justify-center text-sm font-semibold border-[1.5px] transition-colors duration-150 ';
  if (!interactive) {
    classes += 'border-zonein-border bg-zonein-cream text-zonein-gray';
  } else if (selected) {
    classes += 'border-zonein-green bg-zonein-green text-zonein-cream cursor-pointer';
  } else if (!desk.isAvailable) {
    classes += 'border-zonein-border bg-zonein-border text-zonein-gray cursor-not-allowed';
  } else {
    classes += 'border-zonein-border bg-zonein-cream text-zonein-ink hover:border-zonein-green cursor-pointer';
  }

  return (
    <div
      className={classes}
      onClick={clickable ? () => onSelectDesk?.(desk.id) : undefined}
      role={clickable ? 'button' : undefined}
      aria-label={`Desk ${desk.id}${desk.isAvailable ? ' - Available' : ' - Booked'}`}
    >
      {desk.id}
    </div>
  );
}

function DeskLayout({ desks, interactive = false, selectedId = null, onSelectDesk }: DeskLayoutProps) {
  const leftDesks = desks.filter(d => d.side === 'left');
  const rightDesks = desks.filter(d => d.side === 'right');

  return (
    <div className="border border-zonein-border rounded-2xl p-6 sm:p-10">
      <div className="flex justify-between max-w-md mx-auto mb-7">
        <div className="flex flex-col gap-2.5">
          {leftDesks.map(d => (
            <DeskBlock key={d.id} desk={d} interactive={interactive} selected={d.id === selectedId} onSelectDesk={onSelectDesk} />
          ))}
        </div>
        <div className="flex items-center text-zonein-gray text-[11px] tracking-[0.08em] uppercase" style={{ writingMode: 'vertical-rl' }}>
          Walkway
        </div>
        <div className="flex flex-col gap-2.5">
          {rightDesks.map(d => (
            <DeskBlock key={d.id} desk={d} interactive={interactive} selected={d.id === selectedId} onSelectDesk={onSelectDesk} />
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-zonein-gray mb-6">↑ Entrance</p>
      {interactive && (
        <div className="flex justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-[4px] border-[1.5px] border-zonein-border inline-block" />
            <span className="text-[13px] text-zonein-gray">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-[4px] bg-zonein-border inline-block" />
            <span className="text-[13px] text-zonein-gray">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-[4px] bg-zonein-green inline-block" />
            <span className="text-[13px] text-zonein-gray">Selected</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeskLayout;
