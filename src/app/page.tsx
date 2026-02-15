import { GameCanvas } from "@/components/game-canvas";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center bg-gray-950 px-4 py-4">
      <GameCanvas />
      <p className="mt-3 text-gray-500 text-sm text-center hidden md:block">
        ← → / A D : Move &nbsp;&nbsp; SPACE : Shoot
      </p>
    </main>
  );
}
