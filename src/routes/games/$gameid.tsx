import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/games/$gameid")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/game/$gameid",
      params: { gameid: params.gameid }
    });
  }
});