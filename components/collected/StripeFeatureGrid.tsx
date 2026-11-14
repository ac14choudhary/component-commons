"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import PointerBorder, { clearBorderPointer, trackBorderPointer } from "@/components/PointerBorder";
import styles from "./StripeFeatureGrid.module.css";

type Theme = "light" | "dark";
type Feature = {
  kind: "payments" | "billing" | "commerce" | "issuing" | "crypto" | "connect";
  title: string;
  description: string;
  primary: [label: string, url: string];
  secondary: [label: string, url: string];
  highlights: string[];
};

const features: Feature[] = [
  {
    kind: "payments",
    title: "Accept and optimize payments globally—online and in person",
    description: "Offer a familiar checkout wherever your customers shop, with local payment methods and tools to improve conversion.",
    primary: ["Explore Payments", "https://stripe.com/payments"],
    secondary: ["See pricing", "https://stripe.com/pricing#payments"],
    highlights: ["Simplify checkout", "Reach customers in new markets", "Improve acceptance and prevent fraud", "Connect online and in-person sales"],
  },
  {
    kind: "billing",
    title: "Enable any billing model",
    description: "Set up subscriptions or usage-based pricing and give customers a simple way to pay as their needs change.",
    primary: ["Explore Billing", "https://stripe.com/billing"],
    secondary: ["See pricing", "https://stripe.com/billing/pricing"],
    highlights: ["Combine fixed and usage-based pricing", "Offer local payment methods", "Recover failed payments", "Launch new plans quickly"],
  },
  {
    kind: "commerce",
    title: "Monetize through agentic commerce",
    description: "Make your catalog available where customers are shopping with AI assistants, with tools to support checkout and protect transactions.",
    primary: ["Explore agentic commerce", "https://docs.stripe.com/agentic-commerce"],
    secondary: ["Contact sales", "https://go.stripe.global/agentic-commerce-contact-sales"],
    highlights: ["Offer products through AI assistants", "Protect payments with fraud controls", "Keep your customer relationships", "Connect to your existing catalog and checkout"],
  },
  {
    kind: "issuing",
    title: "Create a card issuing program",
    description: "Create physical and virtual cards that fit your business, with tools to manage spending and support compliance.",
    primary: ["Explore Issuing", "https://stripe.com/issuing"],
    secondary: ["See pricing", "https://stripe.com/issuing#pricing"],
    highlights: ["Issue commercial or consumer cards", "Set spending controls", "Manage your card program", "Integrate with your platform"],
  },
  {
    kind: "crypto",
    title: "Access borderless money movement with stablecoins and crypto",
    description: "Bring stablecoin payments and payouts into your product to move funds across borders and serve customers in more markets.",
    primary: ["Explore stablecoins and crypto", "https://stripe.com/use-cases/crypto"],
    secondary: ["Contact sales", "https://stripe.com/use-cases/crypto#request-invite"],
    highlights: ["Move money across borders", "Offer stablecoin payouts", "Launch in more markets", "Add ways to buy crypto within your product"],
  },
  {
    kind: "connect",
    title: "Embed payments in your platform",
    description: "Let the businesses on your platform accept payments, manage payouts, and sell to customers in more places.",
    primary: ["Explore Connect", "https://stripe.com/connect"],
    secondary: ["See pricing", "https://stripe.com/connect/pricing"],
    highlights: ["Onboard connected accounts", "Embed payment tools", "Manage balances and payouts", "Support customers across markets"],
  },
];

function WindowBar({ address }: { address: string }) {
  return <div className={styles.windowBar}><i /><i /><i /><span>{address}</span></div>;
}

const markets = [
  {
    id: "jp", merchant: "Studio Shop に支払う", amount: "¥5,000", note: "タップ、挿入、またはスワイプして支払う",
    gift: "ギフトカード", total: "合計", next: "続行", email: "メールアドレス", address: "taro.yamada@example.com",
    or: "または", method: "支払い方法", card: "カード", number: "カード番号", expiry: "有効期限", security: "セキュリティコード",
    wallet: "デジタルウォレット", alternative: "コンビニ決済", order: "注文概要", membership: "スタジオ会員", subtotal: "小計",
    price: "¥1,886", tax: "JCT", taxAmount: "¥189", orderTotal: "¥2,075",
  },
  {
    id: "us", merchant: "Pay Studio Shop", amount: "$52.00", note: "Tap, insert, or swipe to pay",
    gift: "Gift card", total: "Total", next: "Continue", email: "Email address", address: "jane.diaz@example.com",
    or: "or", method: "Payment method", card: "Card", number: "Card number", expiry: "Expiration", security: "Security code",
    wallet: "Digital wallet", alternative: "Pay in installments", order: "Order summary", membership: "Studio membership", subtotal: "Subtotal",
    price: "$24.00", tax: "Tax", taxAmount: "$2.40", orderTotal: "$26.40",
  },
  {
    id: "de", merchant: "Bei Studio Shop bezahlen", amount: "49,00 €", note: "Karte auflegen, einstecken oder durchziehen",
    gift: "Geschenkkarte", total: "Gesamt", next: "Weiter", email: "E-Mail-Adresse", address: "lea.weber@example.com",
    or: "oder", method: "Zahlungsart", card: "Karte", number: "Kartennummer", expiry: "Gültig bis", security: "Sicherheitscode",
    wallet: "Digitale Geldbörse", alternative: "Kauf auf Rechnung", order: "Bestellübersicht", membership: "Studio-Mitgliedschaft", subtotal: "Zwischensumme",
    price: "22,00 €", tax: "MwSt.", taxAmount: "4,18 €", orderTotal: "26,18 €",
  },
];

function Payments() {
  return (
    <>
      <div className={styles.paymentGlow} />
      {markets.map(market => (
        <div className={styles.paymentScene} data-market={market.id} key={market.id}>
          <div className={styles.terminal}>
            <div className={styles.terminalFace}>
              <span className={styles.contactless} />
              <span>{market.merchant}</span>
              <strong>{market.amount}</strong>
              <p>{market.note}</p>
              <div className={styles.terminalTotals}>
                <span>{market.gift} <b>{market.amount}</b></span><span>{market.total} <b>{market.amount}</b></span>
              </div>
              <div className={styles.payButton}>{market.next}</div>
            </div>
          </div>
          <div className={styles.checkout}>
            <WindowBar address="studio.example/checkout" />
            <div className={styles.shop}>STUDIO SHOP</div>
            <div className={styles.checkoutContent}>
              <div className={styles.checkoutForm}>
                <span>{market.email}</span>
                <div className={styles.field}>{market.address}</div>
                <div className={styles.wallets}><span>Quick pay</span><span>Wallet</span></div>
                <div className={styles.divider}>{market.or}</div>
                <span>{market.method}</span>
                <div className={styles.methods}>
                  <div><b>◉</b> {market.card}<div className={styles.field}>{market.number}</div><div className={styles.splitFields}><div className={styles.field}>{market.expiry}</div><div className={styles.field}>{market.security}</div></div></div>
                  <div>○　{market.wallet}</div>
                  <div>○　{market.alternative}</div>
                </div>
                <div className={styles.payButton}>{market.next}</div>
              </div>
              <div className={styles.order}>
                <strong>{market.order}</strong>
                <div className={styles.orderItem}><i /><span>{market.membership}<br />{market.price}</span></div>
                <span>{market.subtotal} <b>{market.price}</b></span>
                <span>{market.tax} <b>{market.taxAmount}</b></span>
                <span>{market.total} <b>{market.orderTotal}</b></span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

const bars = [4, 8, 15, 22, 32, 45, 25, 29, 13, 8, 33, 29, 41, 53, 43, 76, 100, 54, 41, 27, 34, 37, 32, 48, 59, 64, 75, 55, 40, 34, 39];

function Billing() {
  return (
    <>
      <div className={styles.billingGlow} />
      <div className={styles.billingScene}>
        <div className={styles.billBox}>
          <div className={styles.plan}><i /><div><strong>Pro Plan</strong><span>Billed monthly</span></div></div>
          <strong>Tokens</strong><span>$0.01 per 1,000 units</span>
          <strong className={styles.meterLabel}>Usage meter</strong><div className={styles.meter}><i /></div>
        </div>
        <div className={styles.billBox}>
          <span>Tokens used in the last 30 days</span><strong>2,010,569,010</strong>
          <div className={styles.bars}>{bars.map((height, index) => <i key={index} style={{ height: `${height}%`, "--bar-delay": `${index * 28}ms` } as CSSProperties} />)}</div>
        </div>
      </div>
    </>
  );
}

function ParticleArt({ globe }: { globe?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    const pen = element?.getContext("2d");
    if (!element || !pen) return;
    const scale = Math.min(2, window.devicePixelRatio || 1);
    element.width = 500 * scale;
    element.height = 500 * scale;
    pen.scale(scale, scale);
    let seed = globe ? 7203 : 4927;
    const next = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const colors = globe ? ["#9981ff", "#be87fa", "#f287ec", "#fd95b3", "#ffab92"] : ["#fb7eac", "#fba2ce", "#df78df", "#c56de1"];
    for (let i = 0; i < (globe ? 10500 : 3300); i++) {
      const angle = next() * Math.PI * 2;
      const noise = next() + next() - 1;
      const radius = globe ? 215 * Math.sqrt(next()) : 176 + 54 * noise;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const land = Math.sin(x / 32 + Math.sin(y / 37) * 2) + Math.cos(y / 41 + x / 56) + Math.sin((x + y) / 27) * .38;
      if (globe && land < -.2 && next() > .13) continue;
      const color = globe ? Math.min(4, Math.floor((x + 225) / 90)) : Math.floor(next() * colors.length);
      pen.fillStyle = colors[color];
      pen.globalAlpha = (.19 + .74 * next()) * (1 - Math.abs(noise) * .6);
      const dot = .55 + next() * (globe ? 1.05 : 1.6);
      pen.fillRect(250 + x, 250 + y, dot, dot);
    }
    if (globe) {
      pen.globalAlpha = .88;
      pen.strokeStyle = "#b86bff";
      pen.lineWidth = 1.25;
      pen.beginPath();
      pen.moveTo(90, 155);
      pen.bezierCurveTo(235, 25, 376, 33, 460, 144);
      pen.stroke();
    }
  }, [globe]);
  const drawing = <canvas className={globe ? undefined : styles.halo} ref={canvas} width="500" height="500" />;
  return globe ? <div className={styles.globe}>{drawing}<i className={styles.orbitPoint} /></div> : drawing;
}

function Commerce() {
  return (
    <>
      <ParticleArt />
      <div className={styles.chatScene}>
        <div className={styles.bubble}>I’m refreshing my wardrobe. Can you suggest some comfortable basics in a medium?</div>
        <div className={styles.bubble}>A soft tee and a lightweight hoodie would pair well. Here are two options to start with.</div>
        <div className={styles.chatShop}>
          <div className={styles.products}>
            <div><span className={styles.productPhoto}><i className={styles.shirt} /></span><strong>Everyday tee</strong><span>Blue · Medium</span><b>$26.00</b></div>
            <div><span className={styles.productPhoto}><i className={styles.hoodie} /></span><strong>Classic hoodie</strong><span>Navy · Medium</span><b>$48.00</b></div>
          </div>
          <div className={styles.buy}>Buy now</div>
        </div>
      </div>
    </>
  );
}

function Issuing() {
  return <div className={styles.creditCard}><div className={styles.creditChip}><i /><i /><i /><i /><i /><i /></div><span className={styles.contactless} /><b>DEBIT</b></div>;
}

const accountRows = [
  ["Vital Flow", "Canada", "$8,348.00", "$71,562.98"],
  ["Daybreak Yoga", "United States", "$1,502.00", "$7,880.00"],
  ["Sacred Space", "United Kingdom", "$1,247.00", "$24,569.09"],
  ["Jackson Yoga", "Australia", "$3,650.00", "$12,643.30"],
  ["Harmony Flow", "United States", "$30,930.00", "$294,669.65"],
  ["Balance Studio", "Canada", "$335.00", "$3,650.36"],
  ["Quiet Fire", "United Kingdom", "$388.00", "$1,568.87"],
];

function Connect() {
  return (
    <div className={styles.connectScene}>
      <div className={styles.dashboard}><WindowBar address="platform.example/dashboard" /><div className={styles.dashboardBody}>
        <div className={styles.sidebar}>Studio<br /><span>Overview</span><span>Payments</span><span>Accounts</span></div>
        <div className={styles.accounts}><strong>Connected accounts</strong><div className={styles.accountRow}><b>Account</b><b>Country</b><b>Balance</b><b>Volume</b></div>
          {accountRows.map(row => <div key={row[0]} className={styles.accountRow}>{row.map(cell => <span key={cell}>{cell}</span>)}</div>)}
        </div>
      </div></div>
      <div className={styles.receipt}><strong>Daybreak Yoga</strong><span>Unlimited membership</span><div className={styles.receiptTotal}><b>Yearly</b><b>$999.00</b></div><div className={styles.field}>◉　Card</div><div className={styles.field}>○　Pay in installments</div><div className={styles.buy}>Pay $999.00</div></div>
    </div>
  );
}

const illustrations = { payments: Payments, billing: Billing, commerce: Commerce, issuing: Issuing, crypto: () => <ParticleArt globe />, connect: Connect };

function Visual({ kind }: { kind: Feature["kind"] }) {
  const Illustration = illustrations[kind];
  return <div className={styles.art} aria-hidden="true"><Illustration /></div>;
}

export default function StripeFeatureGrid({ theme = "light" }: { theme?: Theme }) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [current, setCurrent] = useState<Feature | null>(null);

  useLayoutEffect(() => {
    const element = dialog.current;
    if (!current || !element || element.open) return;
    element.showModal();
    element.scrollTop = 0;
  }, [current]);

  const open = (event: MouseEvent<HTMLButtonElement>, feature: Feature) => {
    opener.current = event.currentTarget;
    const tile = event.currentTarget.closest("article");
    if (tile) clearBorderPointer(tile, true);
    setCurrent(feature);
  };

  return (
    <section className={styles.root} data-theme={theme} data-collected="stripe-feature-grid" aria-label="Payments and financial products">
      <div className={styles.grid}>
        {features.map(feature => (
          <article
            className={styles.tile}
            key={feature.kind}
            data-kind={feature.kind}
            onPointerEnter={event => trackBorderPointer(event.currentTarget, event)}
            onPointerMove={event => trackBorderPointer(event.currentTarget, event)}
            onPointerLeave={event => clearBorderPointer(event.currentTarget, true)}
            onPointerCancel={event => clearBorderPointer(event.currentTarget, true)}
          >
            <h3 id={`${id}-${feature.kind}`}>{feature.title}</h3>
            <div className={styles.surface}>
              <Visual kind={feature.kind} />
              <PointerBorder trackParent={false} />
            </div>
            <button type="button" className={styles.trigger} aria-labelledby={`${id}-${feature.kind}`} aria-haspopup="dialog" aria-controls={`${id}-dialog`} aria-expanded={current === feature} onClick={event => open(event, feature)}>
              <span className={styles.expand} aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>
      <dialog className={styles.dialog} ref={dialog} id={`${id}-dialog`} aria-labelledby={`${id}-title`} onClose={() => {
        setCurrent(null);
        opener.current?.focus({ preventScroll: true });
      }} onClick={event => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}>
        {current && (
          <div className={styles.panel} data-kind={current.kind}>
            <button type="button" className={styles.close} aria-label="Close dialog" onClick={() => dialog.current?.close()}>×</button>
            <div className={styles.dialogHeader}>
              <div>
                <h2 id={`${id}-title`}>{current.title}</h2>
                <p>{current.description}</p>
                <div className={styles.actions}><a href={current.primary[1]}>{current.primary[0]} ›</a><a href={current.secondary[1]}>{current.secondary[0]}</a></div>
              </div>
              <ul>{current.highlights.map(text => <li key={text}>{text}</li>)}</ul>
            </div>
            <div className={styles.dialogDemo} data-kind={current.kind}><Visual kind={current.kind} /></div>
          </div>
        )}
      </dialog>
    </section>
  );
}
