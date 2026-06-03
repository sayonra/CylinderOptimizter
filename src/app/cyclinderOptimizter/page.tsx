"use client";
import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Lang = "en" | "km";
type CylType = "6kg" | "12kg" | "15kg" | "50kg";
type Qtys = Record<CylType, number>;

interface CylSpec {
  key: CylType;
  label: string;
  kg: number;
  dMm: number;
  hMm: number;
  tarKg: number;
  upright: boolean;
  color: string;
  textColor: string;
  noteEn: string;
  noteKm: string;
}

interface Translations {
  appSub: string;
  containerInfo: string;
  volUsed: string;
  ofContainer: string;
  cylinders: string;
  totalUnits: string;
  lpgContent: string;
  gasWeight: string;
  grossWeight: string;
  inclTare: string;
  volUtilisation: string;
  maxFit: string;
  perLayer: string;
  layers: string;
  tare: string;
  unit: string;
  suggestBtn: string;
  summaryTitle: string;
  copyBtn: string;
  copiedBtn: string;
  safetyTitle: string;
  safeLoad: string;
  kg: string;
  gross: string;
  volUtil: string;
  warnExceeds: string;
  warnPayload: string;
  warnVol: string;
  blogTitle: string;
  blogQtyHeader: string;
  blogCylinder: string;
  blogUnits: string;
  blogTotal: string;
  blogLpg: string;
  blogGross: string;
  blogVolUtil: string;
  blogTonnes: string;
  blogLoadNotes: string;
  blogNote6: string;
  blogNote12: string;
  blogNote15: string;
  blogNote50: string;
  blogSafety: string;
  blogSafe1: string;
  blogSafe2: string;
  blogSafe3: string;
  blogSafe4: string;
  blogSafe5: string;
  safetyNotes: string[];
}

// ─── i18n ─────────────────────────────────────────────────────────────────────

const T: Record<Lang, Translations> = {
  en: {
    appSub: "40-foot container",
    containerInfo: "Interior: 11,930 × 2,250 × 2,280 mm · Max payload 26,500 kg",
    volUsed: "Volume used",
    ofContainer: "of container",
    cylinders: "Cylinders",
    totalUnits: "total units",
    lpgContent: "LPG content",
    gasWeight: "gas weight",
    grossWeight: "Gross weight",
    inclTare: "incl. tare",
    volUtilisation: "Container volume utilisation",
    maxFit: "Max fit",
    perLayer: "per layer",
    layers: "layer(s)",
    tare: "tare",
    unit: "kg/unit",
    suggestBtn: "✦ Suggest optimal mix",
    summaryTitle: "Loading summary",
    copyBtn: "⎘ Copy text",
    copiedBtn: "✓ Copied",
    safetyTitle: "Sea shipping safety",
    safeLoad: "Safe load",
    kg: "kg gross",
    gross: "kg gross",
    volUtil: "volume utilised",
    warnExceeds: "exceeds max fit of",
    warnPayload: "kg exceeds 26,500 kg payload limit",
    warnVol: "Volume >95% — insufficient space for dunnage bracing",
    blogTitle: "=== 40-Foot Container — LPG Cylinder Loading Summary ===",
    blogQtyHeader: "Cylinder Quantities:",
    blogCylinder: "cylinder",
    blogUnits: "units",
    blogTotal: "Total cylinders   :",
    blogLpg: "Total LPG content :",
    blogGross: "Est. gross weight :",
    blogVolUtil: "Volume utilisation:",
    blogTonnes: "tonnes",
    blogLoadNotes: "Loading Notes:",
    blogNote6: "6KG  — Loaded horizontally in palletised steel cages, max 2 layers.",
    blogNote12: "12KG — Upright on ISO pallets, shrink-wrapped, max 2 pallet layers.",
    blogNote15: "15KG — Upright on ISO pallets, shrink-wrapped, max 2 pallet layers.",
    blogNote50: "50KG — Upright single layer, timber cradles bolted to container floor.",
    blogSafety: "Safety:",
    blogSafe1: "All valve protectors / caps must be fitted before loading.",
    blogSafe2: "IMO Class 2.1 (Flammable Gas) — UN 1075 (LPG).",
    blogSafe3: "Hazmat placards required on all 4 sides of container.",
    blogSafe4: "Dunnage / air bags on all side walls to prevent movement.",
    blogSafe5: "Max payload: 26,500 kg.",
    safetyNotes: [
      "All valve protectors / caps must be fitted before loading.",
      "6KG cylinders: horizontal in steel cages, max 2 layers, ratchet strapped every 600 mm.",
      "12KG & 15KG: upright on ISO pallets, shrink-wrapped + banded, max 2 pallet layers.",
      "50KG: upright single layer only, in timber cradles bolted to container floor.",
      "IMO Class 2.1 (Flammable Gas) — UN 1075 (LPG). Hazmat placards on all 4 sides.",
      "Dunnage / air bags on all side walls to prevent lateral movement.",
      "Container must be clean, dry, and free of any ignition sources.",
    ],
  },
  km: {
    appSub: "ធុងដឹកទំនិញ ៤០ ហ្វីត",
    containerInfo: "ទំហំខាងក្នុង: ១១,៩៣០ × ២,២៥០ × ២,២៨០ មមីលីម៉ែត្រ · ទំងន់អតិបរមា ២៦,៥០០ គីឡូក្រាម",
    volUsed: "កន្លែងប្រើ",
    ofContainer: "នៃធុង",
    cylinders: "គីឡូ​ស៊ីឡាំង",
    totalUnits: "សរុបចំនួន",
    lpgContent: "មាតិកា LPG",
    gasWeight: "ទំងន់ហ្គាស",
    grossWeight: "ទំងន់សរុប",
    inclTare: "រួមទាំងតារ",
    volUtilisation: "ការប្រើប្រាស់ទំហំធុងដឹក",
    maxFit: "ចំនួនអតិបរមា",
    perLayer: "ក្នុងមួយស្រទាប់",
    layers: "ស្រទាប់",
    tare: "ទំងន់ធុង",
    unit: "គីឡូ/គ្រឿង",
    suggestBtn: "✦ ស្នើចំនួនល្អបំផុត",
    summaryTitle: "សង្ខេបការដឹក",
    copyBtn: "⎘ ចម្លងអត្ថបទ",
    copiedBtn: "✓ បានចម្លង",
    safetyTitle: "សុវត្ថិភាពដឹកតាមសមុទ្រ",
    safeLoad: "ការដឹកដែលមានសុវត្ថិភាព",
    kg: "គីឡូក្រាមសរុប",
    gross: "គីឡូក្រាមសរុប",
    volUtil: "ទំហំប្រើប្រាស់",
    warnExceeds: "លើសចំនួនអតិបរមា",
    warnPayload: "គីឡូក្រាម លើសទំងន់ ២៦,៥០០ គីឡូក្រាម",
    warnVol: "ទំហំ >៩៥% — កន្លែងមិនគ្រប់គ្រាន់សម្រាប់ការបង្ការ",
    blogTitle: "=== ធុងដឹក ៤០ ហ្វីត — សង្ខេបការដឹក LPG ===",
    blogQtyHeader: "ចំនួនស៊ីឡាំង៖",
    blogCylinder: "ស៊ីឡាំង",
    blogUnits: "គ្រឿង",
    blogTotal: "ស៊ីឡាំងសរុប       :",
    blogLpg: "មាតិកា LPG សរុប   :",
    blogGross: "ទំងន់សរុបប៉ាន់ស្មាន :",
    blogVolUtil: "ការប្រើប្រាស់ទំហំ  :",
    blogTonnes: "តោន",
    blogLoadNotes: "កំណត់ចំណាំការដឹក៖",
    blogNote6: "6KG  — ដាក់ផ្តេកក្នុងកន្ត្រករ ចំនួនអតិបរមា ២ ស្រទាប់។",
    blogNote12: "12KG — ដាក់ឈរនៅលើ ISO pallets, ស្រទាប់អតិបរមា ២។",
    blogNote15: "15KG — ដាក់ឈរនៅលើ ISO pallets, ស្រទាប់អតិបរមា ២។",
    blogNote50: "50KG — ដាក់ឈរ ១ ស្រទាប់ប៉ុណ្ណោះ ក្នុង cradles ឈើ។",
    blogSafety: "សុវត្ថិភាព៖",
    blogSafe1: "ស៊ីឡាំងទាំងអស់ត្រូវដាក់គម្របបិទវ៉ាល់មុនពេលដឹក។",
    blogSafe2: "IMO ថ្នាក់ ២.១ (ហ្គាសឆេះ) — UN 1075 (LPG)។",
    blogSafe3: "ត្រូវតំបន់ Hazmat នៅ ៤ ជ្រុងធុង។",
    blogSafe4: "ប្រើថង់ខ្យល់/ទ្រនាប់នៅជ្រុងទាំងអស់ដើម្បីការពារការចល័ត។",
    blogSafe5: "ទំងន់អតិបរមា: ២៦,៥០០ គីឡូក្រាម។",
    safetyNotes: [
      "ស៊ីឡាំងទាំងអស់ត្រូវដាក់គម្របបិទវ៉ាល់មុនពេលដឹក។",
      "ស៊ីឡាំង 6KG: ដាក់ផ្តេកក្នុងកន្ត្រករដែក អតិបរមា ២ ស្រទាប់ ចងខ្សែរ ratchet រៀងរាល់ ៦០០ មមីលីម៉ែត្រ។",
      "ស៊ីឡាំង 12KG & 15KG: ដាក់ឈរនៅលើ ISO pallets, ចោះ shrink-wrap, អតិបរមា ២ ស្រទាប់ pallets។",
      "ស៊ីឡាំង 50KG: ដាក់ឈរ ១ ស្រទាប់ ក្នុង timber cradles ភ្ជាប់ជាមួយតម្រុយនៃធុង។",
      "IMO ថ្នាក់ ២.១ (ហ្គាសឆេះ) — UN 1075 (LPG). Hazmat placards នៅ ៤ ជ្រុងធុង។",
      "ប្រើថង់ខ្យល់/ទ្រនាប់នៅជ្រុងទាំងអស់ ដើម្បីការពារការចល័ត។",
      "ធុងត្រូវស្អាត, ស្ងួត, និងគ្មានប្រភពដែចេញខ្លះ។",
    ],
  },
};

// ─── Cylinder specs (notes per lang) ─────────────────────────────────────────

const SPECS: CylSpec[] = [
  {
    key: "6kg", label: "6 KG", kg: 6, dMm: 310, hMm: 325, tarKg: 8, upright: false,
    color: "bg-sky-50 border-sky-200", textColor: "text-sky-700",
    noteEn: "ø300 mm × 315 mm — laid horizontally, stacked",
    noteKm: "ø300 មមីលីម៉ែត្រ × ៣១៥ មមីលីម៉ែត្រ — ដាក់ផ្តេក",
  },
  {
    key: "12kg", label: "12 KG", kg: 12, dMm: 310, hMm: 600, tarKg: 14, upright: true,
    color: "bg-emerald-50 border-emerald-200", textColor: "text-emerald-700",
    noteEn: "ø300 mm × 600 mm total height (594 + 6 mm clearance)",
    noteKm: "ø300 មមីលីម៉ែត្រ × ៦០០ មមីលីម៉ែត្រ (កម្ពស់សរុប)",
  },
  {
    key: "15kg", label: "15 KG", kg: 15, dMm: 330, hMm: 681, tarKg: 16, upright: true,
    color: "bg-amber-50 border-amber-200", textColor: "text-amber-700",
    noteEn: "ø320 mm × 671 mm — upright",
    noteKm: "ø320 មមីលីម៉ែត្រ × ៦៧១ មមីលីម៉ែត្រ — ដាក់ឈរ",
  },
  {
    key: "50kg", label: "50 KG", kg: 50, dMm: 375, hMm: 1415, tarKg: 35, upright: true,
    color: "bg-rose-50 border-rose-200", textColor: "text-rose-700",
    noteEn: "ø365 mm × 1397 mm — single layer only",
    noteKm: "ø365 មមីលីម៉ែត្រ × ១៣៩៧ មមីលីម៉ែត្រ — ១ ស្រទាប់ប៉ុណ្ណោះ",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CONTAINER = { L: 11930, W: 2250, H: 2280 };
const CVOL = CONTAINER.L * CONTAINER.W * CONTAINER.H;
const MAX_PAYLOAD_KG = 26500;

function maxQty(spec: CylSpec): number {
  const cols = Math.floor(CONTAINER.W / spec.dMm);
  const rows = Math.floor(CONTAINER.L / spec.dMm);
  const layers = Math.max(1, Math.floor(CONTAINER.H / spec.hMm));
  return cols * rows * layers;
}

function cylVol(spec: CylSpec, qty: number): number {
  const r = spec.dMm / 2;
  return Math.PI * r * r * spec.hMm * qty;
}

function packInfo(spec: CylSpec) {
  const cols = Math.floor(CONTAINER.W / spec.dMm);
  const rows = Math.floor(CONTAINER.L / spec.dMm);
  const layers = Math.max(1, Math.floor(CONTAINER.H / spec.hMm));
  return { cols, rows, layers };
}

function computeTotals(qtys: Qtys) {
  let totalVol = 0, totalGas = 0, totalGross = 0, totalCyl = 0;
  SPECS.forEach((s) => {
    const q = qtys[s.key];
    totalVol += cylVol(s, q);
    totalGas += s.kg * q;
    totalGross += (s.kg + s.tarKg) * q;
    totalCyl += q;
  });
  const volPct = Math.min(100, Math.round((totalVol / CVOL) * 100));
  return { totalGas, totalGross, totalCyl, volPct };
}

function buildBlogText(qtys: Qtys, t: Translations, lang: Lang): string {
  const { totalGas, totalGross, totalCyl, volPct } = computeTotals(qtys);
  const lines: string[] = [];
  lines.push(t.blogTitle + "\n");
  lines.push(t.blogQtyHeader);
  SPECS.forEach((s) => {
    const q = qtys[s.key];
    if (q > 0) {
      const name = lang === "km" ? `${s.label} ${t.blogCylinder}` : `${s.label} cylinder`;
      lines.push(`  • ${name} : ${q.toLocaleString()} ${t.blogUnits}`);
    }
  });
  lines.push("");
  lines.push(`${t.blogTotal} ${totalCyl.toLocaleString()} ${t.blogUnits}`);
  lines.push(`${t.blogLpg} ${(totalGas / 1000).toFixed(2)} ${t.blogTonnes}`);
  lines.push(`${t.blogGross} ${(totalGross / 1000).toFixed(2)} ${t.blogTonnes}`);
  lines.push(`${t.blogVolUtil} ${volPct}%`);
  lines.push("");
  lines.push(t.blogLoadNotes);
  lines.push(`  • ${t.blogNote6}`);
  lines.push(`  • ${t.blogNote12}`);
  lines.push(`  • ${t.blogNote15}`);
  lines.push(`  • ${t.blogNote50}`);
  lines.push("");
  lines.push(t.blogSafety);
  lines.push(`  • ${t.blogSafe1}`);
  lines.push(`  • ${t.blogSafe2}`);
  lines.push(`  • ${t.blogSafe3}`);
  lines.push(`  • ${t.blogSafe4}`);
  lines.push(`  • ${t.blogSafe5}`);
  return lines.join("\n");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-3 flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span className="text-2xl font-semibold text-white tabular-nums">{value}</span>
      <span className="text-xs text-gray-500">{sub}</span>
    </div>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  const color = pct > 90 ? "bg-red-400" : pct > 70 ? "bg-amber-400" : "bg-emerald-400";
  return (
    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden mt-1.5">
      <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

interface CylCardProps {
  spec: CylSpec;
  qty: number;
  lang: Lang;
  t: Translations;
  onChange: (key: CylType, val: number) => void;
}

function CylCard({ spec, qty, lang, t, onChange }: CylCardProps) {
  const max = maxQty(spec);
  const pct = max > 0 ? Math.min(100, Math.round((qty / max) * 100)) : 0;
  const pi = packInfo(spec);
  const note = lang === "km" ? spec.noteKm : spec.noteEn;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 transition-all hover:border-gray-500">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg ${spec.textColor} bg-gray-800 border border-gray-600 mb-1.5`}>
            {spec.label}
          </span>
          <p className="text-xs text-gray-500 leading-relaxed">{note}</p>
        </div>
        <span className="text-3xl font-bold text-white tabular-nums shrink-0">{qty}</span>
      </div>

      <input
        type="range"
        min={0}
        max={Math.min(max, 500)}
        step={1}
        value={qty}
        onChange={(e) => onChange(spec.key, parseInt(e.target.value))}
        className="w-full cursor-pointer accent-white"
      />

      <div className="flex justify-between text-xs text-gray-500 mt-1 mb-1.5">
        <span>0</span>
        <span>{t.maxFit}: <strong className="text-gray-300">{max}</strong></span>
        <span>{Math.min(max, 500)}</span>
      </div>

      <ProgressBar pct={pct} />

      <p className="text-xs text-gray-600 mt-1.5">
        {pi.cols}×{pi.rows} {t.perLayer} · {pi.layers} {t.layers} · {t.tare} {spec.tarKg} {t.unit}
      </p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CylinderOptimizer() {
  const [lang, setLang] = useState<Lang>("en");
  const [qtys, setQtys] = useState<Qtys>({ "6kg": 0, "12kg": 0, "15kg": 0, "50kg": 0 });
  const [copied, setCopied] = useState(false);

  const t = T[lang];

  const handleChange = useCallback((key: CylType, val: number) => {
    setQtys((prev) => ({ ...prev, [key]: val }));
  }, []);

  const { totalGas, totalGross, totalCyl, volPct } = computeTotals(qtys);

  const warnings: string[] = [];
  SPECS.forEach((s) => {
    if (qtys[s.key] > maxQty(s))
      warnings.push(`${s.label}: ${t.warnExceeds} ${maxQty(s)}`);
  });
  if (totalGross > MAX_PAYLOAD_KG)
    warnings.push(`${Math.round(totalGross).toLocaleString()} ${t.warnPayload}`);
  if (volPct > 95) warnings.push(t.warnVol);

  const blogText = buildBlogText(qtys, t, lang);

  const handleCopy = () => {
    navigator.clipboard.writeText(blogText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const suggestOptimal = () => {
    const vol6 = cylVol(SPECS[0], 200);
    const remaining = CVOL * 0.82 - vol6;
    const s50 = SPECS[3], s15 = SPECS[2], s12 = SPECS[1];
    let q50 = Math.min(maxQty(s50), Math.floor((remaining * 0.25) / cylVol(s50, 1)));
    let rem2 = remaining - q50 * cylVol(s50, 1);
    let q15 = Math.min(maxQty(s15), Math.floor((rem2 * 0.4) / cylVol(s15, 1)));
    let rem3 = rem2 - q15 * cylVol(s15, 1);
    let q12 = Math.min(maxQty(s12), Math.floor(rem3 / cylVol(s12, 1)));
    let gross = (6+8)*200 + (12+14)*q12 + (15+16)*q15 + (50+35)*q50;
    while (gross > 26000 && (q12 > 0 || q15 > 0 || q50 > 0)) {
      if (q50 > 0) q50--; else if (q15 > 0) q15--; else q12--;
      gross = (6+8)*200 + (12+14)*q12 + (15+16)*q15 + (50+35)*q50;
    }
    setQtys({ "6kg": 200, "12kg": q12, "15kg": q15, "50kg": q50 });
  };

  const volBarColor = volPct > 95 ? "bg-red-400" : volPct > 80 ? "bg-amber-400" : "bg-sky-500";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header + lang toggle */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs text-gray-500 tracking-widest uppercase mb-1">{t.appSub}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {lang === "en" ? "LPG Cylinder Optimizer" : "ឧបករណ៍គណនាស៊ីឡាំង LPG"}
            </h1>
            <p className="text-xs text-gray-400 mt-1">{t.containerInfo}</p>
          </div>
          {/* Language switcher */}
          <div className="flex gap-1 mt-1 shrink-0">
            {(["en", "km"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  lang === l
                    ? "bg-white text-gray-900 border-white"
                    : "bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-200"
                }`}
              >
                {l === "en" ? "EN" : "ខ្មែរ"}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <MetricCard label={t.volUsed} value={`${volPct}%`} sub={t.ofContainer} />
          <MetricCard label={t.cylinders} value={totalCyl.toLocaleString()} sub={t.totalUnits} />
          <MetricCard label={t.lpgContent} value={`${(totalGas / 1000).toFixed(2)} t`} sub={t.gasWeight} />
          <MetricCard label={t.grossWeight} value={`${(totalGross / 1000).toFixed(2)} t`} sub={t.inclTare} />
        </div>

        {/* Volume bar */}
        <div className="mb-5">
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-300 ${volBarColor}`} style={{ width: `${volPct}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>0%</span>
            <span>{t.volUtilisation}</span>
            <span>100%</span>
          </div>
        </div>

        {/* Status bar */}
        {warnings.length > 0 ? (
          <div className="bg-red-950/60 border border-red-800/60 text-red-300 rounded-xl px-4 py-3 text-xs mb-5 leading-relaxed">
            ⚠ {warnings.join("  ·  ")}
          </div>
        ) : totalCyl > 0 ? (
          <div className="bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 rounded-xl px-4 py-3 text-xs mb-5">
            ✓ {t.safeLoad} — {totalCyl.toLocaleString()} {t.totalUnits}, {Math.round(totalGross).toLocaleString()} {t.gross}, {volPct}% {t.volUtil}
          </div>
        ) : null}

        {/* Cylinder cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {SPECS.map((s) => (
            <CylCard key={s.key} spec={s} qty={qtys[s.key]} lang={lang} t={t} onChange={handleChange} />
          ))}
        </div>

        {/* Suggest */}
        <button
          onClick={suggestOptimal}
          className="w-full py-2.5 rounded-xl border border-gray-700 text-sm text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 transition-all mb-7"
        >
          {t.suggestBtn}
        </button>

        {/* Blog / summary output */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden mb-7">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/60">
            <span className="text-xs text-gray-400 tracking-widest uppercase">{t.summaryTitle}</span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                copied
                  ? "border-emerald-700 text-emerald-300 bg-emerald-950/40"
                  : "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {copied ? t.copiedBtn : t.copyBtn}
            </button>
          </div>
          <pre
            className="text-xs text-gray-300 leading-relaxed p-4 whitespace-pre-wrap font-mono overflow-auto max-h-80"
            style={{ fontFamily: lang === "km" ? "'Khmer OS', 'Hanuman', monospace" : "monospace" }}
          >
            {blogText}
          </pre>
        </div>

        {/* Safety notes */}
        <div className="border-t border-gray-800 pt-6 pb-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">{t.safetyTitle}</p>
          <ul className="space-y-2">
            {t.safetyNotes.map((note, i) => (
              <li key={i} className="flex gap-2.5 text-xs text-gray-400 leading-relaxed">
                <span className="text-gray-700 select-none mt-0.5">—</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}