import { query, initDb } from '../../../lib/db';

export default async function handler(req, res) {
  // Initialize database on first request
  await initDb();

  if (req.method === 'GET') {
    const result = await query('SELECT * FROM todos ORDER BY id DESC');
    return res.json(result.rows);
  }

  if (req.method === 'POST') {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const result = await query(
      'INSERT INTO todos (title) VALUES ($1) RETURNING *',
      [title]
    );
    return res.status(201).json(result.rows[0]);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

