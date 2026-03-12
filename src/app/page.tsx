import { TimerSection } from "@/components/timer/TimerSection";
import { MenuSection } from "@/components/menu/MenuSection";

export default function Home() {
  return (
    <div className="flex h-screen bg-zinc-950">
      <div className="flex-1 border-r border-zinc-800">
        <MenuSection />
      </div>
      <div className="flex-1">
        <TimerSection />
      </div>
    </div>
  );
};
