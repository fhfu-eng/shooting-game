import { GameCanvas } from "@/components/game-canvas";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-4 py-8">
      <GameCanvas />
      <p className="mt-4 text-gray-500 text-sm text-center">
        ← → / A D : Move &nbsp;&nbsp; SPACE : Shoot
      </p>
    </main>
  );
}
