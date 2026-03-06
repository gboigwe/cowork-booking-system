import db from './database.js';

export function seedDesks() {
  const count = db.prepare('SELECT COUNT(*) as cnt FROM desks').get() as { cnt: number };
  if (count.cnt > 0) return;

  const insert = db.prepare('INSERT INTO desks (id, name, type, position_index) VALUES (?, ?, ?, ?)');

  const desks = [
    { id: 'desk-1', name: 'Desk 1', type: 'individual', position_index: 1 },
    { id: 'desk-2', name: 'Desk 2', type: 'individual', position_index: 2 },
    { id: 'desk-3', name: 'Desk 3', type: 'individual', position_index: 3 },
    { id: 'desk-4', name: 'Desk 4', type: 'individual', position_index: 4 },
    { id: 'desk-5', name: 'Desk 5', type: 'individual', position_index: 5 },
    { id: 'desk-6', name: 'Desk 6', type: 'team', position_index: 6 },
    { id: 'desk-7', name: 'Desk 7', type: 'team', position_index: 7 },
    { id: 'desk-8', name: 'Desk 8', type: 'individual', position_index: 8 },
    { id: 'desk-9', name: 'Desk 9', type: 'individual', position_index: 9 },
    { id: 'desk-10', name: 'Desk 10', type: 'team', position_index: 10 },
  ];

  const insertMany = db.transaction(() => {
    for (const desk of desks) {
      insert.run(desk.id, desk.name, desk.type, desk.position_index);
    }
  });

  insertMany();
  console.log('Seeded 10 desks');
}
