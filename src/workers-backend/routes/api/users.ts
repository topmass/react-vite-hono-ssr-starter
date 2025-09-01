import { Hono } from 'hono';

// Example API routes for users - demonstrates D1 database usage
// Note: These are placeholder routes - you'll need to create actual database tables
const users = new Hono<{ Bindings: { DB: D1Database } }>();

// GET /api/users - List all users
users.get('/', async (c) => {
  try {
    // Example D1 query - you'll need to create a 'users' table first
    // const result = await c.env.DB.prepare('SELECT * FROM users').all();
    // return c.json({ users: result.results });
    
    // Placeholder response for now
    return c.json({ 
      users: [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' }
      ],
      note: 'This is a placeholder. Configure your D1 database to enable real data.'
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// POST /api/users - Create a new user
users.post('/', async (c) => {
  try {
    const body = await c.req.json();
    
    // Example D1 insert - you'll need to create a 'users' table first
    // const result = await c.env.DB.prepare(
    //   'INSERT INTO users (name, email) VALUES (?, ?) RETURNING id, name, email'
    // ).bind(body.name, body.email).first();
    // return c.json({ user: result });
    
    // Placeholder response for now
    return c.json({ 
      user: { id: Date.now(), ...body },
      note: 'This is a placeholder. Configure your D1 database to enable real data persistence.'
    });
  } catch (error) {
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// GET /api/users/:id - Get a specific user
users.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    // Example D1 query - you'll need to create a 'users' table first
    // const result = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
    // if (!result) {
    //   return c.json({ error: 'User not found' }, 404);
    // }
    // return c.json({ user: result });
    
    // Placeholder response for now
    return c.json({ 
      user: { id: parseInt(id), name: 'Sample User', email: 'sample@example.com' },
      note: 'This is a placeholder. Configure your D1 database to enable real data.'
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

export default users;