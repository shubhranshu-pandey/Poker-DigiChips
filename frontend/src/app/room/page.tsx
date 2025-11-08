import { Suspense } from "react";
import PokerRoom from "@/components/PokerRoom";

export default function RoomPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b border-white/40 mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
      </div>
    }>
      <PokerRoom />
    </Suspense>
  );
}
