import { useState } from "react";
import { LiquidActionButton } from "@/components/ui/liquid-action-button";
import { FloatingActionBar } from "@/components/ui/floating-action-bar";

const OPTIONS = [
  { id: "task", label: "Task", icon: "task_alt" },
  { id: "note", label: "Note", icon: "sticky_note_2" },
];

const NAV = [
  { id: "home", label: "Home", icon: "home" },
  { id: "search", label: "Search", icon: "search" },
  { id: "inbox", label: "Inbox", icon: "inbox" },
  { id: "settings", label: "Settings", icon: "settings" },
];

function App() {
  const [last, setLast] = useState<string | null>(null);
  const [section, setSection] = useState("home");

  // FLAGGED: demo backdrop uses the user-supplied palette #33B1EA / #9973E2 /
  // #E96890 / #EC5A67 directly; tokens.json has no matching color tokens.
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-[radial-gradient(circle_at_20%_20%,#33b1ea_0%,transparent_50%),radial-gradient(circle_at_80%_25%,#9973e2_0%,transparent_50%),radial-gradient(circle_at_35%_85%,#e96890_0%,transparent_50%),radial-gradient(circle_at_85%_80%,#ec5a67_0%,transparent_50%),linear-gradient(135deg,#33b1ea,#9973e2_45%,#e96890_75%,#ec5a67)] p-8">
      {/* FLAGGED: 120px = 5 × size/spaceLayoutSectionGapMd (24px). No single
          token is wide enough to clear the open tray (84px pill + 12px gap),
          so the row gap is derived to keep the right button uncovered. */}
      <div className="flex items-center gap-30">
        <LiquidActionButton options={OPTIONS} onSelect={(id) => setLast(`${id} (left)`)} />
        <LiquidActionButton
          tone="glass"
          options={OPTIONS}
          onSelect={(id) => setLast(`${id} (right)`)}
        />
      </div>
      <p className="text-sm text-white/70">
        {last ? `Selected: ${last}` : "Tap + to expand"}
        {" · "}
        {`Section: ${section}`}
      </p>

      <FloatingActionBar
        items={NAV}
        value={section}
        onValueChange={setSection}
        action={
          <LiquidActionButton
            tone="glass"
            options={OPTIONS}
            onSelect={(id) => setLast(`${id} (bar)`)}
          />
        }
      />
    </main>
  );
}

export default App;
