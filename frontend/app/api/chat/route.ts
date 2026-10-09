import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Read the internal binding URL injected by Vercel
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      console.warn("BACKEND_URL is not set. Falling back to localhost:8000.");
    }
    
    const targetUrl = new URL("/chat", backendUrl || "http://127.0.0.1:8000");

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        errorData || { detail: "Backend error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ detail: (err as Error).message }, { status: 500 });
  }
}
