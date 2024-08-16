// src/routes/emails/+server.js
import { mysqlconnFn } from '$lib/db/mysql';

export async function GET({ url }) {
    const tag = url.searchParams.get('tag');
    const pool = mysqlconnFn();

    let query = 'SELECT * FROM email';
    let values = [];

    if (tag) {
        query += ' WHERE manualTags LIKE ?';
        values.push(`%${tag}%`);
    }

    try {
        const [rows] = await pool.execute(query, values);
        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error('Database query failed:', err);
        return new Response(JSON.stringify({ error: 'Database query failed' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
