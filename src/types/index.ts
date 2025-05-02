export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  jersey_number: string | null;
  college: string | null;
  country: string;
  draft_year: number | null;
  draft_round: number | null;
  draft_number: number | null;
  team: PlayerTeam | null;
}
export interface PlayerTeam {
  id: number;
  conference: string;
  division: string;
  city: string;
  name: string;
  full_name: string;
  abbreviation: string;
}

export interface Team {
  id: string;
  name: string;
  playerCount: number;
  region: string;
  country: string;
  players: Player[];
}
export type TeamFormValues = {
  name: string;
  playerCount: number;
  region: string;
  country: string;
};
