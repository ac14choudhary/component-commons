"use client";

import { Figtree } from "next/font/google";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./FeatureAccordion.module.css";

const figtree = Figtree({ subsets: ["latin"] });

// Measured on the original.
const TYPE_DELAY = 420;
const TYPE_CHAR = 12;
const TYPE_SETTLE = 125;

const vars = (values: Record<string, string | number>) => values as CSSProperties;

const stagger = (d: number, i = 0, step?: number, from?: string) =>
  vars({ "--d": `${d}ms`, "--i": i, ...(step !== undefined && { "--step": `${step}ms` }), ...(from && { "--from": from }) });

function Icon({ size, children, className }: { size: number; children: ReactNode; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const SidePanel = ({ size }: { size: number }) => (
  <Icon size={size}>
    <rect x="1.5" y="2.5" width="13" height="11" rx="3" />
    <path d="M10 2.5v11M12 5.5v1" />
  </Icon>
);
const Chevron = ({ size, className }: { size: number; className?: string }) => (
  <Icon size={size} className={className}>
    <path d="m6 3.5 4.5 4.5L6 12.5" />
  </Icon>
);
const Dots = ({ size }: { size: number }) => (
  <Icon size={size}>
    <path d="M3 8h.01M8 8h.01M13 8h.01" strokeWidth="2" />
  </Icon>
);
const Download = ({ size }: { size: number }) => (
  <Icon size={size}>
    <path d="M8 2v8M4.5 7 8 10.5 11.5 7M2.5 13.5h11" />
  </Icon>
);
const FileIcon = ({ size }: { size: number }) => (
  <Icon size={size}>
    <path d="M4 1.5h5.5L13 5v9.5H4zM9.5 1.5V5H13M6.5 8h4M6.5 11h4" />
  </Icon>
);
const Calendar = ({ size }: { size: number }) => (
  <Icon size={size}>
    <rect x="2" y="3" width="12" height="11" rx="2.5" />
    <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3M5 9.5h.01M8 9.5h.01M11 9.5h.01M5 12h.01M8 12h.01" />
  </Icon>
);

function Research() {
  return (
    <div className={`${styles.rs} ${styles.frame}`} aria-hidden="true">
      <div className={`${styles.rsCard} ${styles.frameCard}`}>
        <div className={styles.rsMain}>
          <div className={styles.rsHead}>
            <span>Endangered Indian Languages</span>
            <SidePanel size={11.25} />
          </div>
          <div className={`${styles.rsQ} ${styles.st}`} style={stagger(450)}>
            <div className={styles.rsQTop}>
              <span className={styles.rsMuted}>Questions</span>
              <span className={styles.rsPager}>
                <span className={styles.isOn}>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
              </span>
            </div>
            <p className={styles.rsAsk}>What should the research document cover?</p>
            <ol className={styles.rsOpts}>
              {[
                "Everything: one consolidated master report pulling the threads together",
                "Status and documentation of the languages (expand the first report)",
                "The year-on-year change and current activity",
                "The global and cross-border dimension",
                "Type what you have in mind",
              ].map((option, index) => (
                <li key={option} className={styles.st} style={stagger(650, index)}>
                  <span className={styles.rsFaint}>{index + 1}.</span>
                  <span className={index === 4 ? styles.rsFaint : undefined}>{option}</span>
                </li>
              ))}
            </ol>
            <div className={styles.rsActions}>
              <span>Skip</span>
              <span className={styles.rsNext}>Next</span>
            </div>
          </div>
        </div>
        <div className={styles.rsSide}>
          <div className={`${styles.rsSec} ${styles.rsSecProgress}`}>
            <span className={styles.rsH}>Progress</span>
            <span className={styles.rsFaint}>17/17</span>
            <Chevron size={8.44} />
          </div>
          <div className={styles.rsSec}>
            <span className={styles.rsH}>Artifacts</span>
            <span className={styles.rsFaint}>4</span>
            <Chevron size={8.44} className={styles.isDown} />
          </div>
          <ul className={styles.rsFiles}>
            {[
              ["Endangered-Languages-Outside-India.docx", "14 kB"],
              ["Endangered-Languages-Deck.html", "355.6 kB"],
              ["Endangered-Languages-Year-on-Year.docx", "17.8 kB"],
              ["Endangered-Languages-of-India.docx", "20.7 kB"],
            ].map(([name, size], index) => (
              <li key={name} className={styles.st} style={stagger(800, index, 120, "0.5rem 0")}>
                <span className={styles.rsFile}>
                  <FileIcon size={22.5} />
                  <span className={styles.rsFileText}>
                    <span className={styles.rsFileName}>{name}</span>
                    <span className={styles.rsFileSize}>{size}</span>
                  </span>
                  <Dots size={9.84} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const FUNNEL = [
  ["Visits", "54,300", "51,200", "+6.1%"],
  ["Sign-ups", "2,180", "3,410", "-36.1%"],
  ["Activated", "1,690", "2,010", "-15.9%"],
  ["Paid", "402", "468", "-14.1%"],
];
const SHEET_COLUMNS = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

function SheetRow({ index, title, span, cells, spanClass }: { index: number; title?: boolean; span?: string; cells?: string[]; spanClass?: string }) {
  const rowClass = `${styles.shRow} ${title ? styles.isTitle : ""} ${index === 3 ? styles.isTh : ""}`;
  const empties = 13 - (span ? 4 : (cells?.length ?? 0));
  return (
    <div className={rowClass} style={vars({ "--i": index })}>
      <span className={styles.shNum}>{index + 1}</span>
      {span && (
        <span className={`${styles.shSpan} ${spanClass ?? ""}`}>
          <b className={styles.st}>{span}</b>
        </span>
      )}
      {cells?.map((cell, column) => (
        <span
          key={column}
          className={`${column > 0 && index > 3 ? styles.isNum : ""} ${index === 5 && column === 3 ? styles.shFlag : ""}`}
        >
          <b className={styles.st}>{cell}</b>
        </span>
      ))}
      {Array.from({ length: empties }, (_, empty) => (
        <span key={`empty-${empty}`} />
      ))}
    </div>
  );
}

function DataAnalysis() {
  return (
    <div className={`${styles.da} ${styles.frame}`} aria-hidden="true">
      <div className={`${styles.daCard} ${styles.frameCard}`}>
        <div className={styles.daChat}>
          <div className={styles.daHead}>
            <span>Product Funnel Table</span>
            <SidePanel size={12} />
          </div>
          <div className={styles.daThread}>
            <p className={styles.st} style={stagger(400)}>
              I&apos;ll build this as a spreadsheet so the colour highlighting renders properly. Let me load the right skill.
            </p>
            <p className={`${styles.daMeta} ${styles.st}`} style={stagger(600)}>
              Ran code · Managed files · Used skill
            </p>
            <p className={styles.st} style={stagger(800)}>
              Done. I&apos;ve put it in <strong>weekly-funnel.xlsx</strong>.
            </p>
            <div className={`${styles.daTools} ${styles.st}`} style={stagger(950)}>
              <span>
                <Icon size={10.5}>
                  <rect x="5.5" y="5.5" width="8.5" height="8.5" rx="2" />
                  <path d="M3.5 10.5H2V2h8.5v1.5" />
                </Icon>
              </span>
              <span>
                <Download size={10.5} />
              </span>
              <span>
                <Icon size={10.5}>
                  <path d="M2 5.5V2h3.5M10.5 2H14v3.5M14 10.5V14h-3.5M5.5 14H2v-3.5" />
                </Icon>
              </span>
            </div>
            <table className={styles.daTable}>
              <thead>
                <tr className={styles.st} style={stagger(1000, 0, 80)}>
                  <th>Stage</th>
                  <th>This week</th>
                  <th>Last week</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {FUNNEL.map((row, index) => (
                  <tr key={row[0]} className={`${styles.st} ${index === 1 ? styles.isFlag : ""}`} style={stagger(1000, index + 1, 80)}>
                    {row.map((cell) => (
                      <td key={cell}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.daSide}>
          <div className={styles.daSheetHead}>
            <Chevron size={12} />
            <span className={styles.daFile}>weekly-funnel.xlsx</span>
            <Download size={10.5} />
            <Icon size={10.5}>
              <path d="M6 8.5a2.5 2.5 0 0 0 3.5.3l2.5-2.4A2.5 2.5 0 0 0 8.5 3l-1 1M10 7.5a2.5 2.5 0 0 0-3.5-.3L4 9.6A2.5 2.5 0 0 0 7.5 13l1-1" />
            </Icon>
          </div>
          <div className={styles.sh}>
            <div className={`${styles.shRow} ${styles.shCols}`}>
              {SHEET_COLUMNS.map((column) => (
                <span key={column || "corner"}>{column}</span>
              ))}
            </div>
            <SheetRow index={0} title span="Weekly Product Funnel, week of 6 Oct 2026" />
            <SheetRow index={1} span="Acme Fintech (dummy data) · weekly view · India" />
            <SheetRow index={2} />
            <SheetRow index={3} cells={["Stage", "This week", "Last week", "Change"]} />
            {FUNNEL.map((row, index) => (
              <SheetRow key={row[0]} index={index + 4} cells={row} />
            ))}
            <SheetRow index={8} />
            <SheetRow
              index={9}
              spanClass={styles.shInsight}
              span="Insight: Sign-ups fell 36% week-on-week because the Google Ads campaign hit its daily budget cap on Wednesday."
            />
            {Array.from({ length: 10 }, (_, index) => (
              <SheetRow key={index} index={index + 10} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const PROMPT = "Create a presentation from the endangered languages research. Keep it to 10 slides, with stats.";
const SLIDES = [
  "/demo/art/steps.webp",
  "/demo/art/echo.webp",
  "/demo/art/horizon.webp",
  "/demo/art/canopy.webp",
  "/demo/art/ribbon.webp",
];

function Presentations({ active }: { active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const rootElement = root.current;
    const textElement = text.current;
    if (!rootElement || !textElement) return;
    if (!active) {
      rootElement.removeAttribute("data-typed");
      textElement.textContent = PROMPT;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rootElement.setAttribute("data-typed", "");
      return;
    }
    textElement.textContent = "";
    const started = performance.now() + TYPE_DELAY;
    let frame = 0;
    let settle = 0;
    const tick = (now: number) => {
      const length = Math.max(0, Math.floor((now - started) / TYPE_CHAR));
      textElement.textContent = PROMPT.slice(0, length);
      if (length < PROMPT.length) {
        frame = requestAnimationFrame(tick);
      } else {
        settle = window.setTimeout(() => rootElement.setAttribute("data-typed", ""), TYPE_SETTLE);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, [active]);

  return (
    <div ref={root} className={styles.pr} aria-hidden="true">
      <div className={styles.prDeck}>
        {SLIDES.map((slide, index) => (
          <span key={slide} className={styles.prSlot} style={vars({ "--i": index })}>
            <Image src={slide} alt="" width={807} height={454} sizes="404px" />
          </span>
        ))}
      </div>
      <div className={styles.prComposer}>
        <div className={styles.prTray}>
          <div className={styles.prCanvas} />
          <span className={styles.prAgent}>
            <Icon size={8.8}>
              <path d="M8 1.5 9.8 6.2 14.5 8 9.8 9.8 8 14.5 6.2 9.8 1.5 8l4.7-1.8z" />
            </Icon>
            Presentation Agent
          </span>
        </div>
        <div className={styles.prField}>
          <p ref={text} className={styles.prText}>
            {PROMPT}
          </p>
          <div className={styles.prBar}>
            <span>
              <Icon size={8.8}>
                <path d="M13 7.5 8 12.5a3 3 0 0 1-4.5-4.2l5-5a2 2 0 0 1 3 2.8l-5 5a1 1 0 0 1-1.5-1.4L9.5 5" />
              </Icon>
            </span>
            <span className={styles.prGap} />
            <span>
              <Icon size={8.8}>
                <rect x="5.5" y="1.5" width="5" height="8" rx="2.5" />
                <path d="M3 7.5a5 5 0 0 0 10 0M8 12.5v2" />
              </Icon>
            </span>
            <span className={styles.prSend}>
              <Icon size={8.8}>
                <path d="M8 13V3M4 7l4-4 4 4" />
              </Icon>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const WORKFLOWS = [
  ["Timesheet submission", "Daily at 09:00", "Time manager", "Web", "Today at 09:00"],
  ["Morning daily checklist", "Daily at 10:00", "Time manager", "Web", "Today at 10:00"],
  ["Afternoon sync", "Daily at 14:00", "Ops lead", "Slack", "Today at 14:00"],
  ["Weekly report", "Weekly on Fri", "Finance team", "Email", "Fri at 16:30"],
  ["Monthly close", "Monthly on 1st", "Controller", "Portal", "1st at 08:00"],
];

function Workflows() {
  return (
    <div className={`${styles.wf} ${styles.frame}`} aria-hidden="true">
      <div className={styles.frameCard}>
        <table className={styles.wfTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Agent</th>
              <th>Target channel</th>
              <th>Next run</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {WORKFLOWS.map(([name, schedule, agent, channel, next], index) => (
              <tr key={name} className={styles.st} style={stagger(500, index, 120)}>
                <td>
                  <span className={styles.wfName}>
                    <span className={styles.wfTile}>
                      <Calendar size={16.36} />
                    </span>
                    {name}
                  </span>
                </td>
                <td>
                  <span className={`${styles.wfPill} ${styles.isGreen}`}>{schedule}</span>
                </td>
                <td>
                  <span className={`${styles.wfPill} ${styles.isGreen} ${styles.wfStatus}`}>Active</span>
                </td>
                <td>{agent}</td>
                <td>
                  <span className={styles.wfPill}>{channel}</span>
                </td>
                <td className={styles.wfNext}>{next}</td>
                <td className={styles.wfAct}>
                  <Dots size={14.31} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const APP_ROWS: { apps: string[]; duration: number; reverse?: boolean }[] = [
  { apps: ["Airtable", "Salesforce", "Asana", "Gmail", "Slack", "Github"], duration: 48 },
  { apps: ["Zoom", "Notion", "Figma", "Google Sheets", "Google Drive", "Airtable"], duration: 54, reverse: true },
  { apps: ["Zoom", "Confluence", "Miro", "Zoho Books", "Outlook", "Stripe", "Discord"], duration: 44 },
  { apps: ["Ashby", "Moz", "Reddit", "Linkedin", "Meta ads", "Mailchimp", "Discord"], duration: 58, reverse: true },
];

function Integrations() {
  return (
    <div className={styles.in} aria-hidden="true">
      {APP_ROWS.map(({ apps, duration, reverse }, row) => (
        <div
          key={row}
          className={`${styles.inRow} ${styles.st} ${reverse ? styles.isReverse : ""}`}
          style={{ ...stagger(450, row, 100, reverse ? "-2.5rem 0" : "2.5rem 0"), ...vars({ "--row": row }) }}
        >
          <div className={styles.inTrack} style={vars({ "--duration": `${duration}s` })}>
            {[...apps, ...apps].map((app, index) => (
              <span key={index} className={styles.inCard}>
                <span className={styles.inLogo}>{app[0]}</span>
                {app}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const PANELS = [
  {
    title: "Research",
    description: "Searches the web and your connected apps as it works, and re-plans when it learns something new.",
    glow: ["#e6651b", "#efabc5", "#fceaf0"],
    glowDark: ["#f0762a", "#8a2f55", "#2a1620"],
  },
  {
    title: "Data analysis",
    description: "Pulls the numbers from your data tools and writes the readout with the reason behind the change.",
    glow: ["#90c85b", "#c8e4b0", "#f2f8eb"],
    glowDark: ["#7fbf45", "#2f5a1c", "#172312"],
  },
  {
    title: "Presentations",
    description: "Drafts decks from live figures, such as a quarterly review built from your dashboard.",
    glow: ["#a7c0f1", "#d2dff9", "#e8effc"],
    glowDark: ["#6f90ea", "#2a3d7a", "#161d33"],
  },
  {
    title: "Workflow automations",
    description: "Runs daily reports and weekly summaries on a schedule, so the output is ready before you log on.",
    glow: ["#ffb94a", "#ffe8b7", "#fff8e6"],
    glowDark: ["#f5a93a", "#7a4f12", "#2a1f0d"],
  },
  {
    title: "Integrations",
    description: "Works inside more than 100 connected apps, from Slack and Gmail to Snowflake and GitHub.",
    glow: ["#4250d5", "#81a0e9", "#e8effc"],
    glowDark: ["#6272f2", "#2a3590", "#15183a"],
  },
];

type Props = {
  /** Index of the panel that starts open, 0–4. */
  defaultActive?: number;
  theme?: "light" | "dark";
};

export default function FeatureAccordion({ defaultActive = 0, theme = "light" }: Props) {
  const [active, setActive] = useState(defaultActive);
  const id = useId();

  // On phones the row is a snap scroller, and the panel that has snapped into place is the open one.
  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const row = event.currentTarget;
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const columns = Array.from(row.children) as HTMLElement[];
    const first = columns[0].offsetLeft;
    const distance = (column: HTMLElement) => Math.abs(column.offsetLeft - first - row.scrollLeft);
    const nearest = columns.reduce((best, column, index) => (distance(column) < distance(columns[best]) ? index : best), 0);
    setActive(nearest);
  };

  return (
    <div className={`${styles.row} ${figtree.className}`} data-collected="feature-accordion" data-theme={theme} onScroll={onScroll}>
      {PANELS.map((panel, index) => {
        const number = String(index + 1).padStart(2, "0");
        const isActive = index === active;
        const glow = theme === "dark" ? panel.glowDark : panel.glow;
        return (
          <article
            key={panel.title}
            className={styles.col}
            data-active={isActive || undefined}
            tabIndex={0}
            aria-labelledby={`${id}-${index}`}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setActive(index);
            }}
            onFocus={() => setActive(index)}
            onClick={() => setActive(index)}
          >
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.num}>{number}</span>
              <span className={styles.railFoot}>
                <span className={styles.railLabel}>{panel.title}</span>
                <Icon size={20}>
                  <path d="M8 2v12M2 8h12" strokeWidth="1" />
                </Icon>
              </span>
            </div>
            <div
              className={styles.glow}
              aria-hidden="true"
              style={vars({ "--cw-g1": glow[0], "--cw-g2": glow[1], "--cw-g3": glow[2] })}
            />
            <div className={styles.body}>
              <p className={styles.bodyNum} aria-hidden="true">
                {number}
              </p>
              <h3 id={`${id}-${index}`} className={styles.title}>
                {panel.title}
              </h3>
              <p className={styles.desc}>{panel.description}</p>
            </div>
            {index === 0 && <Research />}
            {index === 1 && <DataAnalysis />}
            {index === 2 && <Presentations active={isActive} />}
            {index === 3 && <Workflows />}
            {index === 4 && <Integrations />}
          </article>
        );
      })}
    </div>
  );
}
