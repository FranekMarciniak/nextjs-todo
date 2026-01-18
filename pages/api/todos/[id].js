import { query } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const result = await query('SELECT * FROM todos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    return res.json(result.rows[0]);
  }

  if (req.method === 'PUT') {
    const { title, completed } = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (completed !== undefined) {
      updates.push(`completed = $${paramCount++}`);
      values.push(completed);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const result = await query(
      `UPDATE todos SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    return res.json(result.rows[0]);
  }

  if (req.method === 'DELETE') {
    const result = await query('DELETE FROM todos WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    return res.json({ message: 'Todo deleted' });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}


