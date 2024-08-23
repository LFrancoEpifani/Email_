import { mysqlconnFn } from "$lib/db/mysql";

export async function GET({ url }) {
  const emailId = url.searchParams.get('emailId');
  const noteId = url.searchParams.get('noteId');
  let mysqlconn = await mysqlconnFn();

  try {
    if (emailId) {
      const notes = await fetchNotesByEmailId(mysqlconn, emailId);
      return new Response(JSON.stringify({ notes }), { status: 200 });
    }

    if (noteId) {
      const note = await fetchNoteById(mysqlconn, noteId);
      return new Response(JSON.stringify({ note }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Invalid query parameters' }), { status: 400 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch notes' }), { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const { emailId, note } = await request.json();

    if (!emailId || !note) {
      return new Response(JSON.stringify({ error: 'Missing emailId or note' }), { status: 400 });
    }

    let mysqlconn = await mysqlconnFn();
    const newNote = await addNoteToEmail(mysqlconn, emailId, note);

    return new Response(JSON.stringify({ success: true, note: newNote }), { status: 201 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to add note' }), { status: 500 });
  }
}

export async function DELETE({ url }) {
  const noteId = url.searchParams.get('noteId');

  if (!noteId) {
    return new Response(JSON.stringify({ error: 'Missing noteId' }), { status: 400 });
  }

  try {
    let mysqlconn = await mysqlconnFn();
    await deleteNoteById(mysqlconn, noteId);
    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to delete note' }), { status: 500 });
  }
}


async function fetchNotesByEmailId(mysqlconn, emailId) {
  const [rows] = await mysqlconn.execute('SELECT * FROM email_notes WHERE email_id = ?', [emailId]);
  return rows;
}


async function fetchNoteById(mysqlconn, noteId) {
  const [rows] = await mysqlconn.execute('SELECT * FROM email_notes WHERE id = ?', [noteId]);
  return rows[0];
}

async function addNoteToEmail(mysqlconn, emailId, note) {
  const [result] = await mysqlconn.execute(
    'INSERT INTO email_notes (email_id, note) VALUES (?, ?)',
    [emailId, note]
  );
  console.log('New note inserted with ID:', result.insertId); 
  return { id: result.insertId, email_id: emailId, note };
}

async function deleteNoteById(mysqlconn, noteId) {
  await mysqlconn.execute('DELETE FROM email_notes WHERE id = ?', [noteId]);
}
