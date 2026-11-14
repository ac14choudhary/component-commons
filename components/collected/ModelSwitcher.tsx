"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./ModelSwitcher.module.css";

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--ms-mono" });

type Kind = "keyword" | "plain" | "punctuation" | "operator" | "string" | "function" | "builtin" | "class-name";
/** A piece of code and how it's coloured, split where Prism splits it on the original. */
export type Token = [kind: Kind, text: string];
/** A model in the list: its name, its provider's key, and its id at that provider. */
export type Model = [name: string, provider: string, id: string];

export type Capability = {
  /** The tab's label. */
  label: string;
  /** The AI SDK function the example imports and calls. */
  fn: string;
  /** Imported as experimental_<fn> and renamed to <fn>. */
  experimental?: boolean;
  /** The provider's method for this kind of model without the gateway, as in openai.image(); none for text. */
  method?: string;
  /** What the call returns, destructured. */
  result: string;
  /** The call's input: its key and its value as tokens. */
  input: [key: string, value: Token[]];
  /** What the example logs, e.g. "image.base64". */
  log: string;
  /** The first is selected when the tab opens. */
  models: Model[];
};

type Provider = { name: string; letter: string; gateway?: string; pkg?: string };

// Providers by the variable the code imports. `gateway` is the prefix of their models on the
// AI Gateway and `pkg` their package's name, where those differ from the key.
const PROVIDERS: Record<string, Provider> = {
  openai: { name: "OpenAI", letter: "O" },
  anthropic: { name: "Anthropic", letter: "A" },
  google: { name: "Google", letter: "G" },
  xai: { name: "Grok", letter: "X", gateway: "spacexai" },
  mistral: { name: "Mistral", letter: "M" },
  meta: { name: "Meta", letter: "M" },
  perplexity: { name: "Perplexity", letter: "P" },
  deepseek: { name: "DeepSeek", letter: "D" },
  cohere: { name: "Cohere", letter: "C" },
  amazon: { name: "Amazon", letter: "A", pkg: "amazon-bedrock" },
  alibaba: { name: "Alibaba", letter: "A" },
  moonshot: { name: "Moonshot AI", letter: "M", gateway: "moonshotai" },
  zai: { name: "Z.ai", letter: "Z" },
  bfl: { name: "Black Forest Labs", letter: "B" },
  bytedance: { name: "ByteDance", letter: "B" },
};

const providerOf = (key: string): Provider => PROVIDERS[key] ?? { name: key, letter: key.charAt(0).toUpperCase() };

const prompt = (text: string): Capability["input"] => ["prompt", [["string", `'${text}'`]]];

/** The original's five tabs and models, as captured. */
export const CAPABILITIES: Capability[] = [
  {
    label: "Text",
    fn: "generateText",
    result: "text",
    input: prompt("Explain the concept of quantum entanglement."),
    log: "text",
    models: [
      ["GPT-6.1 Terra", "openai", "gpt-6.1-terra"],
      ["Claude Haiku 5.5", "anthropic", "claude-haiku-5.5"],
      ["Gemini 4 Argon", "google", "gemini-4-argon"],
      ["Grok 4.7", "xai", "grok-4.7"],
      ["Mistral Large 4", "mistral", "mistral-large-4"],
      ["Muse Spark Open", "meta", "muse-spark-open"],
      ["Sonar", "perplexity", "sonar"],
      ["DeepSeek V4.1 Flash 1017", "deepseek", "deepseek-v4.1-flash-1017"],
      ["Command A", "cohere", "command-a"],
      ["Nova 2 Lite", "amazon", "nova-2-lite"],
      ["Qwen 3.8 Max Prime", "alibaba", "qwen3.8-max-prime"],
      ["Kimi K3.1 Pro", "moonshot", "kimi-k3.1-pro"],
      ["GLM 5.3 FlashX Legal", "zai", "glm-5.3-flashx-legal"],
    ],
  },
  {
    label: "Image",
    fn: "generateImage",
    method: "image",
    result: "image",
    input: prompt("A teddy bear wearing a black hat hiking in the mountains"),
    log: "image.base64",
    models: [
      ["GPT Image 2.6 Flare", "openai", "gpt-image-2.6-flare"],
      ["GPT Image 2.6 Sunburst", "openai", "gpt-image-2.6-sunburst"],
      ["Grok Imagine Image", "xai", "grok-imagine-image"],
      ["Grok Imagine Image 2.0", "xai", "grok-imagine-image-2.0"],
      ["Muse Image 1.0", "meta", "muse-image-1.0"],
      ["FLUX 3 Image", "bfl", "flux-3-image"],
      ["FLUX 3 Image Klein", "bfl", "flux-3-image-klein"],
      ["Seedream 5.0 Lite", "bytedance", "seedream-5.0-lite"],
    ],
  },
  {
    label: "Speech",
    fn: "generateSpeech",
    method: "speech",
    result: "audio",
    input: ["text", [["string", `"You can build and host many different types of applications"`]]],
    log: "audio",
    models: [
      ["TTS-1", "openai", "tts-1"],
      ["TTS-1 HD", "openai", "tts-1-hd"],
      ["Gemini 3.8 Flash TTS", "google", "gemini-3.8-flash-tts"],
      ["Gemini 3.8 Flash-Lite TTS", "google", "gemini-3.8-flash-lite-tts"],
      ["Grok TTS", "xai", "grok-tts"],
      ["Voxtral TTS 3", "mistral", "voxtral-mini-tts-3"],
    ],
  },
  {
    label: "Transcription",
    fn: "transcribe",
    method: "transcription",
    result: "text",
    input: [
      "audio",
      [["keyword", "new"], ["plain", " "], ["class-name", "URL"], ["punctuation", "("], ["string", "'https://example.com/audio.mp3'"], ["punctuation", ")"]],
    ],
    log: "text",
    models: [
      ["GPT Live Transcribe", "openai", "gpt-live-transcribe"],
      ["GPT Transcribe", "openai", "gpt-transcribe"],
      ["GPT-4o mini Transcribe", "openai", "gpt-4o-mini-transcribe"],
      ["gpt-realtime-whisper", "openai", "gpt-realtime-whisper"],
      ["Gemini 3.5 Transcribe", "google", "gemini-3.5-transcribe"],
      ["Gemini 3.5 Transcribe Live", "google", "gemini-3.5-transcribe-live"],
      ["Grok STT", "xai", "grok-stt"],
      ["Voxtral Mini Transcribe 3", "mistral", "voxtral-mini-transcribe-3"],
    ],
  },
  {
    label: "Video",
    fn: "generateVideo",
    experimental: true,
    method: "video",
    result: "video",
    input: prompt("A hippo chasing a cheetah through New York"),
    log: "video.base64",
    models: [
      ["Veo 3.1 Fast Generate", "google", "veo-3.1-fast-generate-001"],
      ["Veo 3.1 Lite Generate", "google", "veo-3.1-lite-generate-001"],
      ["Grok Imagine Video 1.5", "xai", "grok-imagine-video-1.5"],
      ["Grok Imagine Video 1.5 Lite", "xai", "grok-imagine-video-1.5-lite"],
      ["Wan v3.0 Video", "alibaba", "wan-v3.0-video"],
      ["Wan v3.0 Video Prime", "alibaba", "wan-v3.0-video-prime"],
      ["Flux 3", "bfl", "flux-3-video"],
      ["Seedance 2.0 Mini", "bytedance", "seedance-2.0-mini"],
    ],
  },
];

const kw = (text: string): Token => ["keyword", text];
const pl = (text: string): Token => ["plain", text];
const pu = (text: string): Token => ["punctuation", text];
const op = (text: string): Token => ["operator", text];
const str = (text: string): Token => ["string", text];
const fn = (text: string): Token => ["function", text];

const importLine = (names: Token[], from: string): Token[] => [kw("import"), pl(" "), pu("{"), ...names, pu("}"), pl(" "), kw("from"), pl(" "), str(`'${from}'`), pu(";")];

/** The example's code, a line per array: with the gateway the model is a string, without it the provider's own call. */
function codeFor(cap: Capability, [, key, id]: Model, gateway: boolean): Token[][] {
  const provider = providerOf(key);
  const call = cap.experimental ? [pl(` experimental_${cap.fn} `), kw("as"), pl(` ${cap.fn} `)] : [pl(` ${cap.fn} `)];
  const model: Token[] = gateway
    ? [pl(" "), str(`'${provider.gateway ?? key}/${id}'`)]
    : [...(cap.method ? [pl(` ${key}`), pu("."), fn(cap.method)] : [pl(" "), fn(key)]), pu("("), str(`'${id}'`), pu(")")];
  const logged = cap.log.split(".").flatMap((part, i) => (i ? [pu("."), pl(part)] : [pl(part)]));
  return [
    importLine(call, "ai"),
    ...(gateway ? [] : [importLine([pl(` ${key} `)], `@ai-sdk/${provider.pkg ?? key}`)]),
    [],
    [kw("const"), pl(" "), pu("{"), pl(` ${cap.result} `), pu("}"), pl(" "), op("="), pl(" "), kw("await"), pl(" "), fn(cap.fn), pu("("), pu("{")],
    [pl("  model"), op(":"), ...model, pu(",")],
    [pl(`  ${cap.input[0]}`), op(":"), pl(" "), ...cap.input[1], pu(",")],
    [pu("}"), pu(")"), pu(";")],
    [],
    [["builtin", "console"], pu("."), fn("log"), pu("("), ...logged, pu(")"), pu(";")],
  ];
}

const textOf = (tokens: Token[]) => tokens.map(([, text]) => text).join("");
const sourceOf = (lines: Token[][]) => lines.map(textOf).join("\n");

/** A short hash of the code, so a line anchor in the URL names the code it points into. */
function hashOf(text: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(16).padStart(8, "0");
}

/** The line the URL anchors in this code, if any. */
function lineFromUrl(blockId: string) {
  const match = window.location.hash.match(/^#(.+)-L(\d+)$/);
  return match?.[1] === blockId ? Number(match[2]) : null;
}

// After a model change, what changed glows amber and fades: on each changed line, every token
// from the first changed character to the end of the line. Values from the original.
const GLOW = "color-mix(in oklab, var(--ms-amber-700) 28%, transparent)";
const FADE = "background-color 900ms cubic-bezier(0.2, 0, 0, 1)";
const GLOW_CLEARS_AFTER = 940;

function glow(el: HTMLElement) {
  el.style.transition = "none";
  el.style.backgroundColor = GLOW;
  el.style.borderRadius = "2px";
  el.style.padding = "0 2px";
  el.style.margin = "0 -2px";
  el.style.willChange = "background-color";
  void el.offsetWidth;
  el.style.transition = FADE;
  el.style.backgroundColor = "transparent";
  const clear = window.setTimeout(() => {
    for (const prop of ["transition", "backgroundColor", "borderRadius", "padding", "margin", "willChange"] as const) el.style[prop] = "";
  }, GLOW_CLEARS_AFTER);
  return () => window.clearTimeout(clear);
}

function glowChanges(code: HTMLElement, before: Token[][], after: Token[][]) {
  const rows = code.querySelectorAll<HTMLElement>("[data-tokens]");
  return after.flatMap((tokens, i) => {
    const row = rows[i];
    const was = textOf(before[i] ?? []);
    const now = textOf(tokens);
    if (!row || was === now) return [];
    let targets: HTMLElement[] = [row];
    if (was && now) {
      let start = 0;
      while (start < was.length && was[start] === now[start]) start++;
      let end = 0;
      const changed = tokens.flatMap(([, text], j) => {
        end += text.length;
        const span = row.children[j];
        return end > start && span instanceof HTMLElement ? [span] : [];
      });
      if (changed.length) targets = changed;
    }
    return targets.map(glow);
  });
}

// How long the copy button shows its check, measured on the original.
const COPIED_FOR = 1000;
// The phone icon row shows at most this many providers.
const MAX_PROVIDERS = 8;

const SearchIcon = () => (
  <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <circle cx="7" cy="7" r="4.75" />
    <path d="m10.5 10.5 3.25 3.25" />
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
    <rect x="5.25" y="5.25" width="8.5" height="8.5" rx="1.5" />
    <path d="M10.75 3.25a1 1 0 0 0-1-1h-6.5a1 1 0 0 0-1 1v6.5a1 1 0 0 0 1 1h2" />
  </svg>
);

const CheckIcon = ({ size }: { size: 14 | 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={size === 14 ? 1.7 : 1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m3 8.5 3.25 3.25L13 4.75" />
  </svg>
);

/** A provider's initial on a tile, in place of its logo. CSS draws the letter, so it stays out of the option's text. */
const Monogram = ({ provider }: { provider: string }) => <span className={styles.monogram} data-letter={providerOf(provider).letter} aria-hidden="true" />;

type Props = {
  /** The original follows the visitor's system setting; both sets of colours are its own. */
  theme?: "dark" | "light";
  /** The tabs, their code and their models. */
  capabilities?: Capability[];
  /** Whether the AI Gateway switch starts on. */
  defaultGateway?: boolean;
};

export default function ModelSwitcher({ theme = "dark", capabilities = CAPABILITIES, defaultGateway = true }: Props) {
  const [tab, setTab] = useState(0);
  const [pick, setPick] = useState(0);
  const [gateway, setGateway] = useState(defaultGateway);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const instance = useId().replace(/[^\w-]/g, "");
  const code = useRef<HTMLElement>(null);
  const before = useRef<Token[][] | null>(null);
  const copiedTimer = useRef(0);

  const cap = capabilities[tab] ?? capabilities[0];
  const model = cap.models[pick] ?? cap.models[0];
  const lines = useMemo(() => codeFor(cap, model, gateway), [cap, model, gateway]);
  // Like the original's: the code's hash, plus this instance, so two on a page don't clash.
  const blockId = `C${hashOf(sourceOf(lines))}${instance}`;
  const needle = query.toLowerCase();
  const listed = cap.models.flatMap((m, i) => (m[0].toLowerCase().includes(needle) ? [{ m, i }] : []));
  const providers = [...new Set(cap.models.map(([, key]) => key))].slice(0, MAX_PROVIDERS);

  // Only a new model lights up what changed; a new tab or the gateway switch don't.
  const choose = (index: number) => {
    if (index === pick) return;
    before.current = lines;
    setPick(index);
  };

  useLayoutEffect(() => {
    const was = before.current;
    before.current = null;
    if (!was || !code.current) return;
    const stops = glowChanges(code.current, was, lines);
    return () => stops.forEach((stop) => stop());
  }, [lines]);

  useEffect(() => () => window.clearTimeout(copiedTimer.current), []);

  // A line anchored in the URL lights up when its code first shows, as on the original.
  const firstId = useRef(blockId);
  useEffect(() => {
    const line = lineFromUrl(firstId.current);
    if (line) setActive(line);
  }, []);

  // Each tab gets a fresh code block: the lit line goes, unless the URL anchors the new code.
  const openTab = (i: number) => {
    const next = capabilities[i] ?? capabilities[0];
    setTab(i);
    setPick(0);
    setActive(lineFromUrl(`C${hashOf(sourceOf(codeFor(next, next.models[0], gateway)))}${instance}`));
  };

  const copy = () => {
    navigator.clipboard
      ?.writeText(sourceOf(lines))
      .then(() => {
        setCopied(true);
        window.clearTimeout(copiedTimer.current);
        copiedTimer.current = window.setTimeout(() => setCopied(false), COPIED_FOR);
      })
      .catch(() => {});
  };

  const anchor = (n: number) => {
    setActive(n);
    window.history.pushState(null, "", `#${blockId}-L${n}`);
  };

  return (
    <div className={`${geist.className} ${geistMono.variable} ${styles.root}`} data-collected="model-switcher" data-theme={theme}>
      <div className={styles.card}>
        <div role="tablist" aria-label="AI SDK capabilities" className={styles.tabs}>
          {capabilities.map((c, i) => (
            <button
              key={c.label}
              type="button"
              role="tab"
              aria-selected={i === tab}
              className={styles.tab}
              onClick={() => i !== tab && openTab(i)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className={styles.body}>
          <div className={styles.scroll}>
            <div role="group" aria-label={`${cap.label} example`} className={styles.block}>
              <button type="button" aria-label="Copy to clipboard" className={styles.copy} onClick={copy}>
                <span className={styles.copyIcons}>
                  <span className={styles.copyIcon} data-shown={copied}>
                    <CheckIcon size={16} />
                  </span>
                  <span className={styles.copyIcon} data-shown={!copied}>
                    <CopyIcon />
                  </span>
                </span>
              </button>
              <pre className={styles.pre}>
                <code ref={code} className={styles.code}>
                  {lines.map((tokens, i) => (
                    <div key={i} id={`${blockId}-L${i + 1}`} className={styles.line} data-active={active === i + 1 || undefined}>
                      <button type="button" tabIndex={-1} aria-hidden="true" className={styles.number} onClick={() => anchor(i + 1)}>
                        {i + 1}
                      </button>
                      <div className={styles.tokens} data-tokens="">
                        {tokens.length ? (
                          tokens.map(([kind, text], j) => (
                            <span key={j} data-t={kind}>
                              {text}
                            </span>
                          ))
                        ) : (
                          <span className={styles.blank}>{"\n"}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
          <div aria-hidden="true" className={styles.fade} />
        </div>
      </div>

      <div className={styles.gateway}>
        <label className={styles.switch} aria-label="Use with AI Gateway">
          <span>
            <span className={styles.switchText}>
              Use with <a href="https://vercel.com/ai-gateway">AI Gateway</a>
            </span>
          </span>
          <input className={styles.srOnly} type="checkbox" checked={gateway} onChange={(e) => setGateway(e.target.checked)} />
          <span className={styles.track} aria-hidden="true">
            <span className={styles.thumb} />
          </span>
        </label>
      </div>

      <div role="tablist" aria-label="Select model" className={styles.providers}>
        {providers.map((key) => {
          const selected = key === model[1];
          const { name } = providerOf(key);
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={`Use ${name}`}
              title={name}
              className={styles.provider}
              onClick={() => choose(cap.models.findIndex(([, k]) => k === key))}
            >
              {selected && <span aria-hidden="true" className={styles.pill} />}
              <span className={styles.providerIcon}>
                <Monogram provider={key} />
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.models}>
        <div className={styles.menu}>
          <label className={styles.search}>
            <SearchIcon />
            <input aria-label="Search models" className={styles.searchInput} placeholder="Search models..." type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <ul className={styles.list} role={listed.length ? "listbox" : undefined} aria-label={listed.length ? "Models" : undefined}>
            {listed.length ? (
              listed.map(({ m: [name, key], i }) => (
                <li key={name} role="none">
                  <button type="button" role="option" aria-selected={i === pick} className={styles.option} onClick={() => choose(i)}>
                    <span className={styles.optionIcon}>
                      <Monogram provider={key} />
                    </span>
                    <span className={styles.optionName}>{name}</span>
                    {i === pick && <CheckIcon size={14} />}
                  </button>
                </li>
              ))
            ) : (
              <li className={styles.empty}>
                Find more models on <a href="https://vercel.com/ai-gateway/models">AI Gateway</a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div role="status" aria-live="assertive" className={styles.srOnly}>
        {copied ? "Copied!" : ""}
      </div>
    </div>
  );
}
