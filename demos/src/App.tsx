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

  // Backdrop palette lives in index.css (.rainbow-backdrop), from the Figma "rainbow" reference.
  return (
    <main className="rainbow-backdrop flex min-h-screen flex-col items-center justify-center gap-10 p-8">
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
