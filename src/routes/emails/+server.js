import { mysqlconnFn } from '$lib/db/mysql';

export async function GET() {
    const pool = mysqlconnFn();

    try {
        
        const [rows] = await pool.execute('SELECT * FROM email ORDER BY emlDate DESC');

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
