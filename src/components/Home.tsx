"use client";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import LoginForm from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import TeamList from "./TeamList";
import PlayerList from "./PlayerList";

export default function Home() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {isAuthenticated ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Welcome, {user}!</h1>
            <Button onClick={() => dispatch(logout())}>Logout</Button>
          </div>
          <div className="space-y-8">
            <TeamList />
            <PlayerList />
          </div>
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <LoginForm />
        </div>
      )}
    </div>
  );
}
