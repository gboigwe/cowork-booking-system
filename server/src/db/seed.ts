import db from './database.js';

export function seedDesks() {
  const count = db.prepare('SELECT COUNT(*) as cnt FROM desks').get() as { cnt: number };
  if (count.cnt > 0) return;

  const insert = db.prepare('INSERT INTO desks (id, side, desc, position) VALUES (?, ?, ?, ?)');

  const desks = [
    { id: 'D1', side: 'right', desc: 'window-side', position: 1 },
    { id: 'D2', side: 'right', desc: 'window-side', position: 2 },
    { id: 'D3', side: 'right', desc: 'aisle', position: 3 },
    { id: 'D4', side: 'right', desc: 'aisle', position: 4 },
    { id: 'D5', side: 'right', desc: 'quiet corner', position: 5 },
    { id: 'D6', side: 'right', desc: 'quiet corner', position: 6 },
    { id: 'D7', side: 'left', desc: 'near entrance', position: 1 },
    { id: 'D8', side: 'left', desc: 'near entrance', position: 2 },
    { id: 'D9', side: 'left', desc: 'wall-side', position: 3 },
    { id: 'D10', side: 'left', desc: 'wall-side', position: 4 },
  ];

  const insertMany = db.transaction(() => {
    for (const desk of desks) {
      insert.run(desk.id, desk.side, desk.desc, desk.position);
    }
  });

  insertMany();
  console.log('Seeded 10 desks');
}
