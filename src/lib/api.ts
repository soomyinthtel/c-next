import { Player } from "@/types";

export const fetchPlayers = async (
  page: number,
  searchQuery: string = ""
): Promise<{ data: Player[]; meta: { next_cursor: number | null } }> => {
  const url = new URL("/api/players", window.location.origin);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("per_page", "10");
  if (searchQuery) {
    url.searchParams.append("search", searchQuery);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch players");
  }
  return response.json();
};
