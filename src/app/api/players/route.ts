import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "10";
  const searchQuery = searchParams.get("search") || "";

  try {
    let apiUrl = `https://api.balldontlie.io/v1/players?page=${page}&per_page=${perPage}`;
    if (searchQuery) {
      apiUrl += `&search=${encodeURIComponent(searchQuery)}`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: process.env.BALLDONTLIE_API_KEY || "",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
