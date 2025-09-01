# Workers Backend Functions

This directory contains reusable serverless functions for your Hono backend.

## 📁 Structure Examples:

```
functions/
├── auth/
│   ├── generateJWT.ts      # JWT token generation
│   └── validateUser.ts     # User authentication
├── database/
│   ├── userQueries.ts      # Reusable D1 database queries
│   └── migrations.ts       # Database migration helpers
├── storage/
│   ├── fileUpload.ts       # R2 file upload logic
│   └── imageProcessor.ts   # Image resizing/optimization
├── external/
│   ├── emailService.ts     # Email sending functions
│   └── paymentAPI.ts       # Payment processing
└── validation/
    ├── schemas.ts          # Input validation schemas
    └── sanitize.ts         # Data sanitization
```

## 🎯 Example Function:

```typescript
// functions/database/userQueries.ts
export async function getUserById(db: D1Database, userId: string) {
  return await db.prepare(
    'SELECT id, name, email FROM users WHERE id = ?'
  ).bind(userId).first();
}

export async function createUser(db: D1Database, userData: CreateUserData) {
  return await db.prepare(
    'INSERT INTO users (name, email) VALUES (?, ?) RETURNING id'
  ).bind(userData.name, userData.email).first();
}
```

## 📝 Usage in Routes:

```typescript
// routes/api/users.ts
import { getUserById, createUser } from '../../functions/database/userQueries';

users.get('/:id', async (c) => {
  const user = await getUserById(c.env.DB, c.req.param('id'));
  return c.json({ user });
});
```

## 💡 Best Practices:

- **Pure Functions** - Functions should be stateless and predictable
- **Single Responsibility** - Each function should do one thing well  
- **Proper Types** - Use TypeScript interfaces for parameters
- **Error Handling** - Always handle potential errors gracefully
- **Reusability** - Write functions that can be used across multiple routes