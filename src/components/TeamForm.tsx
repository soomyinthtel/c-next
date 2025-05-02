"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addTeam, updateTeam } from "@/store/teamSlice";
import { toast } from "sonner";
import { Team } from "@/types";

type TeamFormValues = {
  name: string;
  playerCount: number;
  region: string;
  country: string;
};

const formSchema = (teams: Team[], currentTeam?: Team) =>
  z.object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .refine(
        (name) => {
          return !teams.some(
            (t) =>
              t.name.toLowerCase() === name.toLowerCase() &&
              (!currentTeam || t.id !== currentTeam.id)
          );
        },
        { message: "Team name must be unique" }
      ),
    playerCount: z
      .number()
      .min(0, { message: "Player count must be non-negative" }),
    region: z.string().min(1, { message: "Region is required" }),
    country: z.string().min(1, { message: "Country is required" }),
  });

interface TeamFormProps {
  team?: { id: string } & TeamFormValues;
  onClose: () => void;
}

export default function TeamForm({ team, onClose }: TeamFormProps) {
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.teams.teams);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(
      formSchema(teams, team ? { ...team, players: [] } : undefined)
    ),
    defaultValues: team || {
      name: "",
      playerCount: 0,
      region: "",
      country: "",
    },
  });

  const onSubmit = (values: TeamFormValues) => {
    const teamNameExists = teams.some(
      (t) =>
        t.name.toLowerCase() === values.name.toLowerCase() &&
        (!team || t.id !== team.id)
    );

    if (teamNameExists) {
      toast.error("Error", {
        description: "Team name must be unique",
      });
      return;
    }

    if (team) {
      dispatch(updateTeam({ id: team.id, team: values }));
      toast.success("Team updated successfully");
    } else {
      dispatch(addTeam(values));
      toast.success("Team created successfully");
    }
    onClose();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="playerCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Player Count</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : parseInt(value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
