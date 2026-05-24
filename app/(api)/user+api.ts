import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.EXPO_PUBLIC_DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, clerk_id } = body;

    if (!name || !email || !clerk_id) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO users (name, email, clerk_id)
      VALUES (${name}, ${email}, ${clerk_id})
      RETURNING *;
    `;

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error("[API /user] Error:", error);

    return Response.json({ error: "Failed to create user" }, { status: 500 });
  }
}
