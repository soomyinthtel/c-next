"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { fetchPlayers } from "@/lib/api";
import { Player } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addPlayerToTeam } from "@/store/teamSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export default function PlayerList() {
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.teams.teams);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<{
    [playerId: number]: string;
  }>({});
  const [showModal, setShowModal] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["players"],
      queryFn: ({ pageParam = 1 }: { pageParam: number }) =>
        fetchPlayers(pageParam),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.meta.next_cursor === null) return undefined;
        const totalPages = Math.ceil(lastPage.meta.next_cursor);
        return allPages.length + 1 <= totalPages
          ? allPages.length + 1
          : undefined;
      },
      initialPageParam: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    const currentLoadMoreRef = loadMoreRef.current;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isFetching
        ) {
          setIsFetching(true);
          fetchNextPage().finally(() => setIsFetching(false));
        }
      },
      { threshold: 0.1 }
    );

    if (currentLoadMoreRef) {
      observerRef.current.observe(currentLoadMoreRef);
    }

    return () => {
      if (observerRef.current && currentLoadMoreRef) {
        observerRef.current.unobserve(currentLoadMoreRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isFetching]);

  const handleAddPlayer = (player: Player, teamId: string) => {
    // Check if there are no teams
    if (teams.length === 0) {
      setShowModal(true);
      return;
    }

    const isPlayerInTeam = teams.some((team) =>
      team.players.some((p) => p.id === player.id)
    );

    if (isPlayerInTeam) {
      toast.error("Error", {
        description: "Player is already in a team",
      });
      setSelectedTeams((prev) => ({ ...prev, [player.id]: "" }));
      return;
    }

    dispatch(addPlayerToTeam({ teamId, player }));
    toast.success("Success", {
      description: "Player added to team",
    });
    setSelectedTeams((prev) => ({ ...prev, [player.id]: "" }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading players...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data?.pages.map((page, i) => (
        <div key={i} className="grid gap-4 md:grid-cols-2">
          {page.data.map((player: Player) => (
            <Card key={player.id}>
              <CardHeader>
                <CardTitle>
                  {player.first_name} {player.last_name}
                  <div className="font-normal mt-2 space-y-2">
                    <p className="flex gap-2">
                      <span>Position: </span>
                      <span>{player.position}</span>
                    </p>
                    <p className="flex gap-2">
                      <span>Height: </span>
                      <span>{player.height}</span>
                    </p>
                    <p className="flex gap-2">
                      <span>Weight: </span>
                      <span>{player.weight}</span>
                    </p>
                    <p className="flex gap-2">
                      <span>College: </span>
                      <span>{player.college}</span>
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center gap-4">
                <select
                  className="w-full p-2 border rounded"
                  value={selectedTeams[player.id] || ""}
                  onChange={(e) =>
                    setSelectedTeams((prev) => ({
                      ...prev,
                      [player.id]: e.target.value,
                    }))
                  }
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                <button
                  className="p-2 text-white rounded w-full max-w-fit bg-gray-500 hover:bg-gray-600"
                  onClick={() =>
                    handleAddPlayer(player, selectedTeams[player.id] || "")
                  }
                >
                  Add to Team
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
      <div ref={loadMoreRef} className="h-10" />
      {isFetchingNextPage && (
        <div className="flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading more players...</span>
        </div>
      )}

      {showModal && (
        <Dialog open={showModal} onOpenChange={() => setShowModal(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>No Teams Available</DialogTitle>
            </DialogHeader>

            <p className="mb-4">
              You need to create a team before you can add players. Please
              create a team first.
            </p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
