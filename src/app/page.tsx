import { TimerSection } from "@/components/timer/TimerSection";
import { MenuSection } from "@/components/menu/MenuSection";

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <MenuSection />
      </div>
      <div className="flex-1">
        <TimerSection />
      </div>
    </div>
  );
};
