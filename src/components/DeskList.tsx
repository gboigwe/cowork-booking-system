import DeskItem from './DeskItem';
import { useBooking } from '../context/BookingContext';

function DeskList() {
  const { desks } = useBooking();

  const individualDesks = desks.filter(d => d.type === 'individual');
  const teamDesks = desks.filter(d => d.type === 'team');

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Individual Desks</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {individualDesks.map(desk => (
            <DeskItem key={desk.id} desk={desk} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Team Desks</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {teamDesks.map(desk => (
            <DeskItem key={desk.id} desk={desk} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default DeskList;
