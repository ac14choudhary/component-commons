"use client";

import { IBM_Plex_Mono, Inter } from "next/font/google";
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import styles from "./CopilotSurfaces.module.css";

const sans = Inter({ subsets: ["latin"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const DURATIONS = [15867, 18567, 18700];

type Platform = "mac-arm" | "mac-intel" | "win-arm" | "win-x64" | "linux";

type Download = { id: Platform; label: string; href: string };

const DOWNLOADS: Download[] = [
  { id: "mac-arm", label: "Download for macOS (Silicon)", href: "https://gh.io/copilot-app-mac" },
  { id: "mac-intel", label: "Download for macOS (Intel)", href: "https://gh.io/copilot-app-mac-intel" },
  { id: "win-arm", label: "Download for Windows (ARM)", href: "https://gh.io/copilot-app-win-arm" },
  { id: "win-x64", label: "Download for Windows (x64)", href: "https://gh.io/copilot-app-win64" },
  { id: "linux", label: "Download for Linux", href: "https://gh.io/copilot-app-linux" },
];

const CLI_ITEMS = [
  { title: "Install with script", command: "curl -fsSL https://gh.io/copilot-install | bash" },
  { title: "Install with WinGet", command: "winget install GitHub.Copilot" },
  { title: "Install with Homebrew", command: "brew install copilot-cli" },
  { title: "Install with npm", command: "npm install -g @github/copilot" },
];

const IDE_ITEMS = [
  { label: "Visual Studio Code", href: "vscode://github.copilot-chat" },
  { label: "Visual Studio", href: "https://visualstudio.microsoft.com/github-copilot" },
  { label: "Xcode", href: "https://github.com/github/CopilotForXcode?locale=en-US" },
  { label: "JetBrains IDEs", href: "https://plugins.jetbrains.com/plugin/17718-github-copilot" },
  { label: "Neovim", href: "https://github.com/github/copilot.vim?locale=en-US" },
  { label: "Eclipse", href: "https://marketplace.eclipse.org/content/github-copilot#details" },
  { label: "Raycast", href: "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/start-copilot-sessions" },
];

const SURFACES = [
  { title: "GitHub Copilot Desktop App", icon: "app" as const },
  { title: "GitHub Copilot CLI", icon: "cli" as const },
  { title: "GitHub Copilot in Visual Studio Code", icon: "code" as const },
];

type Props = {
  theme?: "light" | "dark";
  /** Advance on each surface's video duration. The live page leaves this to a click. */
  auto?: boolean;
  /** Milliseconds each surface stays up when auto is on. Measured from the three videos. */
  durations?: number[];
  /** Force a download target. Otherwise the visitor's platform is used. */
  platform?: Platform;
  /** Open this surface first. */
  defaultIndex?: number;
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return reduced;
}

function usePlatform(override?: Platform) {
  const [detected, setDetected] = useState<Platform>("linux");
  useEffect(() => {
    if (override) return;
    const ua = navigator.userAgent;
    const os = /Windows/i.test(ua) ? "windows" : /Mac/i.test(ua) ? "mac" : "linux";
    const fallback: Platform = os === "mac" ? "mac-intel" : os === "windows" ? "win-x64" : "linux";
    const hints = (navigator as Navigator & { userAgentData?: { getHighEntropyValues: (keys: string[]) => Promise<{ architecture?: string }> } }).userAgentData;
    let cancel = false;
    const apply = (value: Platform) => {
      if (!cancel) setDetected(value);
    };
    if (!hints?.getHighEntropyValues) {
      apply(fallback);
      return () => {
        cancel = true;
      };
    }
    hints
      .getHighEntropyValues(["architecture"])
      .then((value) => {
        const arm = /arm/i.test(value.architecture || "");
        apply(os === "mac" ? (arm ? "mac-arm" : "mac-intel") : os === "windows" ? (arm ? "win-arm" : "win-x64") : "linux");
      })
      .catch(() => apply(fallback));
    return () => {
      cancel = true;
    };
  }, [override]);
  return override ?? detected;
}

function AppIcon() {
  return (
    <svg className={styles.mark} viewBox="0 0 20 20" aria-hidden="true">
      <rect x="3" y="3" width="14" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 10.2h6M10 7.2v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CliIcon() {
  return (
    <svg className={styles.mark} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 6.5 8 10l-4 3.5M10 14.5h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className={styles.mark} viewBox="0 0 20 20" aria-hidden="true">
      <path d="m7.2 6-3.2 4 3.2 4M12.8 6l3.2 4-3.2 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 6.2 8 10.2l4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PauseGlyph({ paused }: { paused: boolean }) {
  return paused ? (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6.2 3.2v9.6L13 8 6.2 3.2Z" fill="currentColor" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5 3h1.4v10H5zM9.6 3H11v10H9.6z" fill="currentColor" />
    </svg>
  );
}

const ICONS = { app: AppIcon, cli: CliIcon, code: CodeIcon };

const TRAIL = ["#5FED83", "#C898FD", "#DA7210", "#8DD6FF", "#0FBF3E", "#5FB9FF", "#08872B"];
const LEFT_DOTS = [
  { x: 0, y: 0, color: "#0fbf3e", still: true },
  { x: 1, y: 0, color: "#0d6731", still: false },
  { x: 1, y: 1, color: "#8b40f5", still: true },
  { x: 0, y: 1, color: "#0377ff", still: false },
];
const RIGHT_DOTS = [
  { x: 0, y: 0, color: "#d56101", still: false },
  { x: 1, y: 0, color: "#be7d00", still: true },
  { x: 0, y: 1, color: "#0d6731", still: true },
  { x: 1, y: 1, color: "#0a50db", still: false },
];

type TrailCell = { id: number; x: number; y: number; size: number; color: string; exiting: boolean };

function usePointerGrid() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const wide = window.matchMedia("(min-width: 1012px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setOn(fine.matches && wide.matches && !reduce.matches);
    sync();
    fine.addEventListener("change", sync);
    wide.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      wide.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);
  return on;
}

function Corner({ dots, className, animate }: { dots: typeof LEFT_DOTS; className: string; animate: boolean }) {
  return (
    <div className={`${styles.dots} ${className}`} data-animate={animate ? "true" : "false"}>
      {dots.map((dot, index) => (
        <span
          key={`${dot.x}-${dot.y}`}
          className={styles.dot}
          data-still={dot.still ? "true" : "false"}
          style={{ left: `${dot.x * 50}%`, top: `${dot.y * 50}%`, background: dot.color, ["--i" as string]: index }}
        />
      ))}
    </div>
  );
}

function Grid() {
  const host = useRef<HTMLDivElement>(null);
  const active = usePointerGrid();
  const [cells, setCells] = useState<TrailCell[]>([]);
  const geom = useRef({ size: 10, cols: 0, rows: 0 });

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      const cols = Math.ceil(width / 10);
      const size = cols > 0 ? width / cols : 0;
      const rows = size > 0 ? Math.ceil(Math.max(0, height) / size) : 0;
      const prev = geom.current;
      geom.current = { size, cols, rows };
      el.style.setProperty("--cell", `${size}px`);
      if (prev.cols !== 0 && (prev.cols !== cols || prev.rows !== rows)) setCells([]);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!el || !active) return;
    const occupied = new Set<number>();
    const timers = new Set<number>();
    let last: { x: number; y: number } | null = null;
    let seq = 0;
    let frame = 0;
    let point: { x: number; y: number } | null = null;

    const drop = (id: number, key: number) => {
      occupied.delete(key);
      setCells((list) => list.filter((cell) => cell.id !== id));
    };

    const paint = (x: number, y: number) => {
      const { cols, size } = geom.current;
      const key = y * cols + x;
      if (occupied.has(key)) {
        last = { x, y };
        return;
      }
      if (last && last.x === x && last.y === y) return;
      last = { x, y };
      occupied.add(key);
      const id = ++seq;
      const color = TRAIL[Math.floor(Math.random() * TRAIL.length)] ?? TRAIL[0];
      setCells((list) => {
        const next = [...list, { id, x, y, size, color, exiting: false }];
        if (next.length <= 48) return next;
        next.slice(0, next.length - 48).forEach((cell) => occupied.delete(cell.y * cols + cell.x));
        return next.slice(next.length - 48);
      });
      const hold = 100 + Math.random() * 100;
      const exitTimer = window.setTimeout(() => {
        setCells((list) => list.map((cell) => (cell.id === id ? { ...cell, exiting: true } : cell)));
      }, hold);
      const removeTimer = window.setTimeout(() => drop(id, key), hold + 100);
      timers.add(exitTimer);
      timers.add(removeTimer);
    };

    const flush = () => {
      frame = 0;
      if (!point) return;
      const rect = el.getBoundingClientRect();
      const { x, y } = point;
      const player = el.parentElement?.querySelector(`.${styles.player}`);
      if (player) {
        const box = player.getBoundingClientRect();
        const overWindow = x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
        if (overWindow) el.setAttribute("data-dim", "true");
        else el.removeAttribute("data-dim");
      }
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return;
      const { size, cols, rows } = geom.current;
      if (size <= 0) return;
      const originX = rect.left + (rect.width - cols * size) / 2;
      const originY = rect.top + (rect.height - rows * size) / 2;
      const cx = Math.floor((x - originX) / size);
      const cy = Math.floor((y - originY) / size);
      if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return;
      paint(cx, cy);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = window.requestAnimationFrame(flush);
    };
    const onLeave = () => {
      last = null;
    };

    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      occupied.clear();
    };
  }, [active]);

  return (
    <div className={styles.grid} ref={host} data-animate={active ? "true" : "false"} aria-hidden="true">
      <div className={styles.trail}>
        {cells.map((cell) => (
          <span
            key={cell.id}
            className={styles.pixel}
            data-exit={cell.exiting ? "true" : "false"}
            style={{ left: cell.x * cell.size, top: cell.y * cell.size, width: cell.size, height: cell.size, background: cell.color }}
          />
        ))}
      </div>
      <Corner dots={LEFT_DOTS} className={styles.dotsLeft} animate={active} />
      <Corner dots={RIGHT_DOTS} className={styles.dotsRight} animate={active} />
    </div>
  );
}

function DesktopArt() {
  const rows = [
    ["#4542", "Feature: Multi-repo sessions"],
    ["#1133", "Simplify our marketing landing pages"],
    ["#1528", "[Bug] Prerelease update check hides a SAML error"],
    ["#1270", "Support multiple auth connections"],
    ["#6003", "[Bug] Opening an existing PR fails a Git fetch"],
  ];
  return (
    <div className={styles.desk}>
      <aside className={styles.side}>
        <div className={styles.sideTop}>
          <span className={styles.lights}><i /><i /><i /></span>
        </div>
        <div className={`${styles.navBtn} ${styles.navOn}`}>Home</div>
        <div className={styles.navBtn}>Pull requests</div>
        <div className={styles.navBtn}>Automations</div>
        <div className={styles.navBtn}>Customize</div>
        <div className={styles.group}>Projects</div>
        <div className={styles.navBtn}>Launch planning</div>
        <div className={styles.group}>Sessions</div>
        <div className={styles.navBtn}>trail-atlas</div>
        <div className={`${styles.navBtn} ${styles.navOn}`}>Top issues</div>
        <div className={styles.user}><span className={styles.avatar} /> Hank Zoeng</div>
      </aside>
      <div className={styles.main}>
        <div className={styles.bubble}>Check the top 5 issues in this repo and open a session with a plan for each</div>
        <div>I picked the five newest open issues and opened a fix session for each.</div>
        <table className={styles.table}>
          <thead><tr><th>#</th><th>Title</th></tr></thead>
          <tbody>
            {rows.map(([id, title]) => (
              <tr key={id}><td>{id}</td><td>{title}</td></tr>
            ))}
          </tbody>
        </table>
        <div className={styles.composer}>
          Ask anything. Use / for commands or & for sessions…
          <div className={styles.composerRow}><span>+ Interactive</span><span>Standard</span></div>
        </div>
      </div>
    </div>
  );
}

function CliArt() {
  return (
    <div className={styles.cli}>
      <div className={styles.cliTabs}>
        <span className={styles.cliOn}>Current</span>
        <span>Sessions</span>
        <span>Issues</span>
        <span>Pull requests</span>
        <span>Gists</span>
      </div>
      <div className={styles.cliCard}>
        <div>
          <div className={styles.cliMark} />
          Copilot v1.0.94-5 uses AI. Check for mistakes.
          <div className={styles.f}>/experimental</div>
        </div>
        <div>
          <strong>Getting started</strong>
          <div>Use the tabs above to explore sessions and pull requests.</div>
          <div><span className={styles.f}>/init</span> — Initialize Copilot instructions</div>
          <div><span className={styles.f}>/model</span> — Switch models, or use Auto</div>
        </div>
      </div>
      <p>No copilot-instructions.md found. Run /init to generate.</p>
      <p><span className={styles.k}>Tip:</span> /mcp — Manage MCP server configuration</p>
      <div className={styles.prompt}>~/repos/budget-tracker [main]<br />/plan <span className={styles.s}>prompt</span></div>
      <div className={styles.cliFoot}><span>Interactive · Manual approval</span><span>Auto · Balance</span></div>
    </div>
  );
}

function line(n: number, body: ReactNode) {
  return (
    <div key={n}><i>{n}</i><span>{body}</span></div>
  );
}

function CodeArt() {
  const k = (t: string) => <span className={styles.k}>{t}</span>;
  const s = (t: string) => <span className={styles.s}>{t}</span>;
  const f = (t: string) => <span className={styles.f}>{t}</span>;
  return (
    <div className={styles.code}>
      <div className={styles.activity} aria-hidden="true">
        <span>◻</span><span>⌕</span><span>⎇</span><span>▣</span>
      </div>
      <div className={styles.tree}>
        <b>trail-atlas</b>
        <span>.copilot</span>
        <span>public</span>
        <span>src</span>
        <span>components</span>
        <span>data</span>
        <span>App.jsx</span>
        <span>main.jsx</span>
        <span>search.js</span>
        <span>styles.css</span>
        <span>tests</span>
        <span className={styles.treeOn}>search.test.js</span>
        <span>.gitignore</span>
        <span>index.html</span>
        <span>package.json</span>
        <span>README.md</span>
        <span>vite.config.js</span>
      </div>
      <div className={styles.editor}>
        <div className={styles.editorTabs}>
          <span>App.jsx</span>
          <span>search.js</span>
          <span className={styles.editorOn}>search.test.js</span>
        </div>
        <div className={styles.lines}>
          {line(1, <>{k("import")} {"{ test }"} {k("from")} {s("'node:test'")};</>)}
          {line(2, <>{k("import")} assert {k("from")} {s("'node:assert/strict'")};</>)}
          {line(3, <>{k("import")} {"{ searchTrails }"} {k("from")} {s("'../src/search.js'")};</>)}
          {line(4, "")}
          {line(5, <>{k("const")} trails = [</>)}
          {line(6, <>{"  { id: "}{s("'pine-ridge'")}{", name: "}{s("'Pine Ridge Loop'")}{" },"}</>)}
          {line(7, <>{"  { id: "}{s("'cedar-creek'")}{", name: "}{s("'Cedar Creek Trail'")}{" },"}</>)}
          {line(8, "];")}
          {line(9, "")}
          {line(10, <>{f("test")}({s("'finds a trail by name'")}, () =&gt; {"{"}</>)}
          {line(11, <>{"  "}{k("const")}{" result = "}{f("searchTrails")}{"(trails, "}{s("'Pine'")}{");"}</>)}
          {line(12, <>{"  assert."}{f("deepEqual")}{"(result.matches, [trails[0]]);"}</>)}
          {line(13, "});")}
          {line(14, "")}
          {line(15, <>{f("test")}({s("'ignores case and extra spaces'")}, () =&gt; {"{"}</>)}
          {line(16, <>{"  "}{k("const")}{" result = "}{f("searchTrails")}{"(trails, "}{s("' PINE '")}{");"}</>)}
          {line(17, <>{"  assert."}{f("deepEqual")}{"(result.matches, [trails[0]]);"}</>)}
          {line(18, "});")}
        </div>
      </div>
      <aside className={styles.chat}>
        <div className={styles.chatHead}>Chat</div>
        <div className={styles.chatBody}>
          <p>Plan how to make trail search ignore case and extra spaces.</p>
          <p>Completed 4 steps in 4s</p>
          <p>Implemented the plan in search.js and added the regression test in search.test.js. Both tests pass. Review the diff and keep the changes.</p>
        </div>
        <div className={styles.ask}>
          <span className={styles.f}>JS</span> search.test.js
          <div>Chat with Copilot</div>
          <small>+ Agent · Auto</small>
          <small>Plan · Manual permissions</small>
        </div>
      </aside>
    </div>
  );
}

const ARTS = [DesktopArt, CliArt, CodeArt];

function SplitButton({
  primary,
  label,
  href,
  menuLabel,
  open,
  onToggle,
  menu,
}: {
  primary: boolean;
  label: string;
  href: string;
  menuLabel: string;
  open: boolean;
  onToggle: () => void;
  menu: ReactNode;
}) {
  const tone = primary ? styles.primary : styles.secondary;
  return (
    <div className={styles.cta}>
      <div className={styles.split}>
        <a className={`${styles.mainBtn} ${tone}`} href={href}>
          {label}
        </a>
        <button
          type="button"
          className={`${styles.chevBtn} ${tone}`}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={menuLabel}
          onClick={onToggle}
        >
          <Chevron />
        </button>
      </div>
      {open ? menu : null}
    </div>
  );
}

export default function CopilotSurfaces({
  theme = "dark",
  auto = true,
  durations = DURATIONS,
  platform: platformProp,
  defaultIndex = 0,
}: Props) {
  const reduced = useReducedMotion();
  const platform = usePlatform(platformProp);
  const headingId = useId();
  const [index, setIndex] = useState(defaultIndex);
  const [paused, setPaused] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const remain = useRef(durations[index] ?? DURATIONS[0]);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const count = SURFACES.length;
  const active = ((index % count) + count) % count;
  const download = DOWNLOADS.find((item) => item.id === platform) ?? DOWNLOADS[4];
  const playing = auto && !paused && !reduced;

  useEffect(() => {
    remain.current = durations[active] ?? DURATIONS[active];
  }, [active, durations]);

  useEffect(() => {
    if (!playing) return;
    const wait = remain.current;
    const started = performance.now();
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % count);
    }, wait);
    return () => {
      remain.current = Math.max(0, wait - (performance.now() - started));
      window.clearTimeout(timer);
    };
  }, [playing, active, count]);

  useEffect(() => {
    if (openMenu === null) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  const select = (next: number) => {
    setIndex(next);
    setPaused(false);
    setOpenMenu(null);
  };

  const onTabKey = (event: ReactKeyboardEvent) => {
    const key = event.key;
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(key)) return;
    event.preventDefault();
    const next = key === "Home" ? 0 : key === "End" ? count - 1 : key === "ArrowRight" ? (active + 1) % count : (active + count - 1) % count;
    select(next);
    tabsRef.current[next]?.focus();
  };

  const copyCommand = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(command);
    } catch {
      setCopied(null);
    }
  };

  const Art = ARTS[active];
  const duration = durations[active] ?? DURATIONS[active];
  const fill = playing ? "play" : "full";

  const menuFor = (surface: number) => {
    if (surface === 0) {
      return (
        <ul className={styles.menu} role="menu">
          {DOWNLOADS.map((item) => (
            <li key={item.id} role="none">
              <a role="menuitem" href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      );
    }
    if (surface === 1) {
      return (
        <ul className={styles.menu} role="menu">
          {CLI_ITEMS.map((item) => (
            <li key={item.command} role="none">
              <button type="button" role="menuitem" className={styles.menuCopy} onClick={() => copyCommand(item.command)}>
                <span>
                  {item.title}
                  <small>{item.command}</small>
                </span>
                <span className={styles.copied}>{copied === item.command ? "Copied" : "Copy"}</span>
              </button>
            </li>
          ))}
        </ul>
      );
    }
    return (
      <ul className={styles.menu} role="menu">
        {IDE_ITEMS.map((item) => (
          <li key={item.label} role="none">
            <a role="menuitem" href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    );
  };

  const buttonFor = (surface: number, primary: boolean) => {
    if (surface === 0) {
      return (
        <SplitButton
          primary={primary}
          label={download.label}
          href={download.href}
          menuLabel="GitHub Copilot App download options menu"
          open={openMenu === 0}
          onToggle={() => setOpenMenu(openMenu === 0 ? null : 0)}
          menu={menuFor(0)}
        />
      );
    }
    if (surface === 1) {
      return (
        <SplitButton
          primary={primary}
          label="Install in CLI"
          href="https://docs.github.com/en/copilot/get-started/cli-quickstart#installation"
          menuLabel="Copilot CLI install options"
          open={openMenu === 1}
          onToggle={() => setOpenMenu(openMenu === 1 ? null : 1)}
          menu={menuFor(1)}
        />
      );
    }
    return (
      <SplitButton
        primary={primary}
        label="Open in Visual Studio Code"
        href="vscode://github.copilot-chat"
        menuLabel="Open in IDE"
        open={openMenu === 2}
        onToggle={() => setOpenMenu(openMenu === 2 ? null : 2)}
        menu={menuFor(2)}
      />
    );
  };

  const stage = (mobile: boolean) => (
    <div className={mobile ? styles.mStage : styles.stage}>
      {mobile ? null : <Grid />}
      <div className={mobile ? undefined : styles.panel}>
        <div className={styles.player}>
          <div className={styles.art} key={active} aria-hidden="true">
            <Art />
          </div>
          <button
            type="button"
            className={styles.pause}
            aria-label={paused ? "Play video" : "Pause video"}
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
          >
            <PauseGlyph paused={paused} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section
      ref={rootRef}
      className={`${sans.className} ${mono.variable} ${styles.root}`}
      style={{ "--mono": "var(--font-mono), ui-monospace, monospace" } as CSSProperties}
      data-collected="copilot-surfaces"
      data-theme={theme}
      data-paused={paused ? "true" : "false"}
    >
      <h2 id={headingId} className={styles.sr}>GitHub Copilot</h2>
      <div className={styles.bleed} aria-hidden="true" />
      <div className={styles.stack}>
        {stage(false)}
        <div className={styles.tabs} role="tablist" aria-orientation="horizontal" aria-labelledby={headingId} onKeyDown={onTabKey}>
          {SURFACES.map((surface, surfaceIndex) => {
            const selected = surfaceIndex === active;
            const Icon = ICONS[surface.icon];
            return (
              <div className={styles.item} data-selected={selected ? "true" : "false"} key={surface.title}>
                <span
                  className={styles.track}
                  data-fill={selected ? fill : undefined}
                  style={selected && fill === "play" ? ({ "--dur": `${duration}ms` } as CSSProperties) : undefined}
                />
                <button
                  ref={(node) => { tabsRef.current[surfaceIndex] = node; }}
                  type="button"
                  className={styles.tab}
                  role="tab"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(surfaceIndex)}
                >
                  <Icon />
                  <h3 className={styles.label}>{surface.title}</h3>
                </button>
              </div>
            );
          })}
        </div>
        <div className={styles.actions}>
          {SURFACES.map((surface, surfaceIndex) => (
            <div className={styles.action} key={surface.title}>
              {buttonFor(surfaceIndex, surfaceIndex === active)}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.accordion}>
        {stage(true)}
        {SURFACES.map((surface, surfaceIndex) => {
          const selected = surfaceIndex === active;
          const Icon = ICONS[surface.icon];
          return (
            <div className={styles.accItem} data-selected={selected ? "true" : "false"} key={surface.title}>
              <button
                type="button"
                className={styles.summary}
                aria-expanded={selected}
                onClick={() => select(surfaceIndex)}
              >
                <Icon />
                <h3 className={styles.label}>{surface.title}</h3>
                <Chevron className={styles.chev} />
              </button>
              {selected ? <div className={styles.accBody}>{buttonFor(surfaceIndex, true)}</div> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
