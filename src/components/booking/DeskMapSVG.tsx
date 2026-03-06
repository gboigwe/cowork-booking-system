import { useBooking } from '../../context/BookingContext';
import type { DeskAvailability } from '../../types';

interface DeskPosition {
  x: number;
  y: number;
  tableW: number;
  tableH: number;
  chairX: number;
  chairY: number;
}

// C-shaped layout: right leg (1-3), bottom (4), left leg (5-7), arc top (8-10)
const deskPositions: Record<number, DeskPosition> = {
  1:  { x: 520, y: 200, tableW: 70, tableH: 50, chairX: 495, chairY: 215 },
  2:  { x: 520, y: 300, tableW: 70, tableH: 50, chairX: 495, chairY: 315 },
  3:  { x: 520, y: 400, tableW: 70, tableH: 50, chairX: 495, chairY: 415 },
  4:  { x: 300, y: 480, tableW: 70, tableH: 50, chairX: 325, chairY: 455 },
  5:  { x: 110, y: 400, tableW: 70, tableH: 50, chairX: 205, chairY: 415 },
  6:  { x: 110, y: 300, tableW: 70, tableH: 50, chairX: 205, chairY: 315 },
  7:  { x: 110, y: 200, tableW: 70, tableH: 50, chairX: 205, chairY: 215 },
  8:  { x: 170, y: 110, tableW: 70, tableH: 50, chairX: 195, chairY: 180 },
  9:  { x: 310, y: 110, tableW: 70, tableH: 50, chairX: 335, chairY: 180 },
  10: { x: 450, y: 110, tableW: 70, tableH: 50, chairX: 475, chairY: 180 },
};

function DeskMapSVG() {
  const { desks, selectedDesk, selectDesk } = useBooking();

  const getDeskByIndex = (idx: number): DeskAvailability | undefined =>
    desks.find(d => d.position_index === idx);

  const getColor = (desk: DeskAvailability | undefined, _idx: number) => {
    if (!desk) return { fill: 'rgba(255,255,255,0.03)', stroke: 'rgba(255,255,255,0.1)', text: 'rgba(255,255,255,0.2)' };
    if (selectedDesk?.id === desk.id) return { fill: 'rgba(59,130,246,0.2)', stroke: '#3b82f6', text: '#93c5fd' };
    if (desk.isAvailable) return { fill: 'rgba(34,197,94,0.15)', stroke: '#22c55e', text: '#86efac' };
    return { fill: 'rgba(255,255,255,0.03)', stroke: 'rgba(255,255,255,0.15)', text: 'rgba(255,255,255,0.3)' };
  };

  const handleClick = (desk: DeskAvailability | undefined) => {
    if (desk?.isAvailable) selectDesk(desk.id);
  };

  return (
    <div>
      <svg viewBox="0 0 700 580" className="w-full" role="img" aria-label="Desk floor plan">
        {/* Room outline */}
        <rect x="60" y="60" width="580" height="500" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />

        {/* Entrance marker */}
        <rect x="280" y="54" width="140" height="12" rx="4" fill="#3b82f6" />
        <text x="350" y="48" textAnchor="middle" fill="#93c5fd" fontSize="13" fontWeight="600">ENTRANCE</text>

        {/* Desks */}
        {Object.entries(deskPositions).map(([idxStr, pos]) => {
          const idx = Number(idxStr);
          const desk = getDeskByIndex(idx);
          const colors = getColor(desk, idx);
          const isClickable = desk?.isAvailable;

          return (
            <g
              key={idx}
              onClick={() => handleClick(desk)}
              className={isClickable ? 'cursor-pointer' : desk ? 'cursor-not-allowed' : ''}
              role="button"
              aria-label={`Desk ${idx}${desk ? (desk.isAvailable ? ' - Available' : ' - Booked') : ''}`}
            >
              {/* Table */}
              <rect
                x={pos.x}
                y={pos.y}
                width={pos.tableW}
                height={pos.tableH}
                rx="6"
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth="2.5"
              />
              {/* Chair */}
              <circle
                cx={pos.chairX}
                cy={pos.chairY}
                r="10"
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth="2"
              />
              {/* Desk number */}
              <text
                x={pos.x + pos.tableW / 2}
                y={pos.y + pos.tableH / 2 + 5}
                textAnchor="middle"
                fill={colors.text}
                fontSize="14"
                fontWeight="700"
              >
                {idx}
              </text>

              {/* Hover overlay */}
              {isClickable && (
                <rect
                  x={pos.x - 4}
                  y={pos.y - 4}
                  width={pos.tableW + 8}
                  height={pos.tableH + 8}
                  rx="8"
                  fill="transparent"
                  className="hover:fill-blue-600/5"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default DeskMapSVG;
