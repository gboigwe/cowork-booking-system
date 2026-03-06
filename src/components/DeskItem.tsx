import { useBooking } from '../context/BookingContext';
import type { DeskAvailability } from '../types';

interface DeskItemProps {
  desk: DeskAvailability;
}

function DeskItem({ desk }: DeskItemProps) {
  const { selectDesk, selectedDesk } = useBooking();

  const isSelected = selectedDesk?.id === desk.id;

  return (
    <button
      onClick={() => desk.isAvailable && selectDesk(desk.id)}
      disabled={!desk.isAvailable}
      className={`p-3 rounded-lg border text-left transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
          : desk.isAvailable
          ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm cursor-pointer'
          : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
      }`}
    >
      <p className="text-sm font-medium text-gray-900">{desk.name}</p>
      <span className={`text-xs font-medium mt-1 inline-block ${
        desk.isAvailable ? 'text-green-600' : 'text-gray-400'
      }`}>
        {desk.isAvailable ? 'Available' : 'Booked'}
      </span>
    </button>
  );
}

export default DeskItem;
