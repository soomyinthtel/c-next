"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { deleteTeam, removePlayerFromTeam } from "@/store/teamSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import TeamForm from "./TeamForm";

export default function TeamList() {
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.teams.teams);
  const [isOpen, setIsOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<null | any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);

  const handleRemovePlayer = (teamId: string, playerId: number) => {
    dispatch(removePlayerFromTeam({ teamId, playerId }));

    toast.success("Success", {
      description: "Player removed from team.",
    });
  };
  const handleCreateTeam = () => {
    setEditingTeam(null);
    setIsOpen(true);
  };
  const handleDelete = (id: string) => {
    setTeamToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (teamToDelete) {
      dispatch(deleteTeam(teamToDelete));
      toast.warning("Success", {
        description: "Team deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
      setTeamToDelete(null);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Teams</h2>
        <Button onClick={handleCreateTeam}>Create Team</Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTeam ? "Edit Team" : "Create Team"}
            </DialogTitle>
          </DialogHeader>
          <TeamForm
            team={editingTeam}
            onClose={() => {
              setIsOpen(false);
              setEditingTeam(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this team "
              {teams.find((t) => t.id === teamToDelete)?.name}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {team.name}
                <div className="space-x-2 flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingTeam(team);
                      setIsOpen(true);
                    }}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(team.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Region: {team.region}</p>
              <p>Country: {team.country}</p>
              <p>Players: {team.playerCount}</p>
              <div className="mt-2">
                <h4 className="font-bold">Players:</h4>
                {team.players.length === 0 ? (
                  <p>No players</p>
                ) : (
                  <ul className="list-disc ">
                    {team.players.map((player) => (
                      <li
                        key={player.id}
                        className="flex justify-between items-cente border-b"
                      >
                        {player.first_name} {player.last_name}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePlayer(team.id, player.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
