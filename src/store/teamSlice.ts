import { Player, Team } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface TeamState {
  teams: Team[];
}

const initialState: TeamState = {
  teams: [],
};

const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    addTeam: (state, action: PayloadAction<Omit<Team, "id" | "players">>) => {
      const newTeam = { ...action.payload, id: uuidv4(), players: [] };
      state.teams.push(newTeam);
    },
    updateTeam: (
      state,
      action: PayloadAction<{ id: string; team: Omit<Team, "id" | "players"> }>
    ) => {
      const index = state.teams.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.teams[index] = {
          ...state.teams[index],
          ...action.payload.team,
        };
      }
    },
    deleteTeam: (state, action: PayloadAction<string>) => {
      state.teams = state.teams.filter((t) => t.id !== action.payload);
    },
    addPlayerToTeam: (
      state,
      action: PayloadAction<{ teamId: string; player: Player }>
    ) => {
      const team = state.teams.find((t) => t.id === action.payload.teamId);
      if (team) {
        team.players.push(action.payload.player);
        team.playerCount += 1;
      }
    },
    removePlayerFromTeam: (
      state,
      action: PayloadAction<{ teamId: string; playerId: number }>
    ) => {
      const team = state.teams.find((t) => t.id === action.payload.teamId);
      if (team) {
        team.players = team.players.filter(
          (p) => p.id !== action.payload.playerId
        );
        team.playerCount -= 1;
      }
    },
  },
});

export const {
  addTeam,
  updateTeam,
  deleteTeam,
  addPlayerToTeam,
  removePlayerFromTeam,
} = teamSlice.actions;
export default teamSlice.reducer;
