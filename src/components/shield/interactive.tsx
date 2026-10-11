"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ShieldAlert, ShieldCheck, Flame, ArrowRight, TrendingDown } from "lucide-react";
import { DEADLINE_ISO, HOOK_PARAMS } from "@/lib/shield-data";

/* ---------------------------------- Fee simulator ---------------------------------- */

const fmtUsd = (v: number) =>
  v >= 1000 ? `$${(v / 1000).toFixed(v >= 10000 ? 1 : 2)}k` : `$${v.toFixed(0)}`;

export function FeeSimulator() {
  const [trusted, setTrusted] = useState(false);
  const [swapUsd, setSwapUsd] = useState(5000);
  const [dailyVol, setDailyVol] = useState(50_000);

  const lpFeeBps = trusted ? HOOK_PARAMS.trustedLpFee : HOOK_PARAMS.protectedLpFee; // 3000 | 20000
  const surchargeBps = trusted ? 0 : HOOK_PARAMS.surchargeBps; // 0 | 100

  // Uniswap v4 fee units are parts-per-million (20000 = 2%); surcharge is real bps (100 = 1%)
  const lpFeePct = lpFeeBps / 1_000_000; // 0.02 | 0.003
  const surchargePct = surchargeBps / 10_000; // 0.01 | 0

  const lpFee = swapUsd * lpFeePct;
  const surcharge = swapUsd * surchargePct;
  const total = lpFee + surcharge;

  const savedRate = HOOK_PARAMS.protectedLpFee / 1_000_000 + HOOK_PARAMS.surchargeBps / 10_000 - HOOK_PARAMS.trustedLpFee / 1_000_000; // 0.027
  const savedPerSwap = swapUsd * savedRate;
  const savedYearly = dailyVol * savedRate * 365;

  const bar = (amount: number) => `${Math.min(100, (amount / (swapUsd * 0.031)) * 100)}%`;

  return (
    <Card className="border-zinc-800 bg-zinc-900/60">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-zinc-100">Fee simulator — what a swap actually costs</CardTitle>
            <CardDescription className="text-zinc-400">
              Exact numbers encoded in the hook: protected LP fee {(HOOK_PARAMS.protectedLpFee / 10_000).toFixed(2)}% + {HOOK_PARAMS.surchargeBps / 100}% burn surcharge → trusted LP fee {(HOOK_PARAMS.trustedLpFee / 10_000).toFixed(2)}%, no surcharge.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5">
            <span className="flex items-center gap-1.5 text-sm text-zinc-300">
              <ShieldAlert className="h-4 w-4 text-rose-400" /> Protected
            </span>
            <Switch checked={trusted} onCheckedChange={setTrusted} aria-label="Toggle pool trust state" />
            <span className="flex items-center gap-1.5 text-sm text-zinc-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Trusted
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Swap size (illustrative USD notional)</span>
            <span className="font-mono text-amber-400">{fmtUsd(swapUsd)}</span>
          </div>
          <Slider value={[swapUsd]} onValueChange={([v]) => setSwapUsd(v)} min={100} max={50_000} step={100} />
        </div>

        <div className="space-y-3">
          <CostRow
            label="LP fee (goes to liquidity providers)"
            amount={lpFee}
            pct={lpFeePct * 100}
            width={bar(lpFee)}
            color={trusted ? "bg-emerald-500" : "bg-amber-500"}
          />
          <CostRow
            label={trusted ? "Surcharge — none while trusted" : "Surcharge — burned to 0xdEaD"}
            amount={surcharge}
            pct={surchargePct * 100}
            width={bar(surcharge) || "0%"}
            color="bg-rose-500"
            burn={!trusted && surcharge > 0}
          />
          <div className="border-t border-zinc-800 pt-3">
            <CostRow
              label="Total cost of this swap"
              amount={total}
              pct={(total / swapUsd) * 100}
              width={bar(total)}
              color="bg-zinc-400"
              bold
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/30 p-4">
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <ArrowRight className="h-4 w-4" /> Trusted saves {fmtUsd(savedPerSwap)} on this swap
              <span className="text-zinc-500">({((savedPerSwap / swapUsd) * 100).toFixed(2)}%)</span>
            </div>
            <p className="mt-1.5 text-xs text-zinc-500">
              The swarm&apos;s verdict is paid for once (0.5 IMD) and saves money on every swap for 30 days.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Daily pool volume</span>
                <span className="font-mono text-zinc-200">{fmtUsd(dailyVol)}</span>
              </div>
              <Slider value={[dailyVol]} onValueChange={([v]) => setDailyVol(v)} min={5_000} max={500_000} step={5_000} />
            </div>
            <p className="mt-2 text-xs text-emerald-400">
              ≈ ${savedYearly.toLocaleString(undefined, { maximumFractionDigits: 0 })} / year saved at trusted terms.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CostRow({
  label,
  amount,
  pct,
  width,
  color,
  burn,
  bold,
}: {
  label: string;
  amount: number;
  pct: number;
  width: string;
  color: string;
  burn?: boolean;
  bold?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className={bold ? "font-medium text-zinc-200" : "text-zinc-400"}>
          {label} {burn && <Flame className="mb-0.5 inline h-3.5 w-3.5 text-rose-400" />}
        </span>
        <span className={`font-mono ${bold ? "font-semibold text-zinc-100" : "text-zinc-300"}`}>
          ${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          <span className="ml-2 text-zinc-500">{pct === 0 ? "0%" : `${pct.toFixed(pct < 1 ? 2 : 1)}%`}</span>
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width }} />
      </div>
    </div>
  );
}

/* ---------------------------------- Rug shield chart ---------------------------------- */

export function RugShieldChart() {
  const days = useMemo(() => Array.from({ length: 31 }, (_, d) => d), []);
  const W = 640, H = 260, PAD_L = 44, PAD_B = 30, PAD_T = 14, PAD_R = 12;
  const x = (d: number) => PAD_L + (d / 30) * (W - PAD_L - PAD_R);
  const y = (pct: number) => PAD_T + (1 - pct / 100) * (H - PAD_T - PAD_B);

  const shieldPath = days.map((d) => `${d === 0 ? "M" : "L"}${x(d).toFixed(1)},${y((1 - Math.pow(0.9, d)) * 100).toFixed(1)}`).join(" ");
  const shieldArea = `${shieldPath} L${x(30)},${y(0)} L${x(0)},${y(0)} Z`;

  const stats = [
    { d: 1, v: (1 - Math.pow(0.9, 1)) * 100 },
    { d: 10, v: (1 - Math.pow(0.9, 10)) * 100 },
    { d: 30, v: (1 - Math.pow(0.9, 30)) * 100 },
  ];

  return (
    <Card className="border-zinc-800 bg-zinc-900/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-100">
          <TrendingDown className="h-5 w-5 text-amber-400" /> Rug shield — a rug becomes a 10-day-minimum affair
        </CardTitle>
        <CardDescription className="text-zinc-400">
          LP removals capped at {HOOK_PARAMS.rugShieldBps / 100}% of in-range liquidity per 24h UTC bucket, with geometric decay —
          every day you can take at most 10% of what is left. Adds and fee collects are never blocked.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[520px]" role="img" aria-label="Cumulative withdrawable liquidity over 30 days: rug shield vs unprotected pool">
            {[0, 25, 50, 75, 100].map((p) => (
              <g key={p}>
                <line x1={PAD_L} x2={W - PAD_R} y1={y(p)} y2={y(p)} stroke="#27272a" strokeWidth="1" />
                <text x={PAD_L - 8} y={y(p) + 4} fill="#71717a" fontSize="11" textAnchor="end" fontFamily="monospace">{p}%</text>
              </g>
            ))}
            {[0, 10, 20, 30].map((d) => (
              <text key={d} x={x(d)} y={H - 8} fill="#71717a" fontSize="11" textAnchor="middle" fontFamily="monospace">day {d}</text>
            ))}
            <path d={`M${x(0)},${y(0)} L${x(0.5)},${y(100)} L${x(30)},${y(100)}`} fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5 4" />
            <text x={x(3)} y={y(96)} fill="#fb7185" fontSize="12" fontFamily="monospace">no protection: 100% gone day 1</text>
            <path d={shieldArea} fill="#f59e0b" opacity="0.12" />
            <path d={shieldPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
            <text x={x(13)} y={y(38)} fill="#fbbf24" fontSize="12" fontFamily="monospace">with rug shield</text>
          </svg>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          {stats.map((s) => (
            <div key={s.d} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <div className="font-mono text-lg font-semibold text-amber-400">{s.v.toFixed(1)}%</div>
              <div className="text-xs text-zinc-500">max removable by day {s.d}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          LPs can always exit — slowly and predictably. The deployer has no fast exit either. Enforced in
          <span className="mx-1 font-mono text-zinc-400">beforeRemoveLiquidity</span> per 24h UTC bucket.
        </p>
      </CardContent>
    </Card>
  );
}

/* ---------------------------------- Countdown ---------------------------------- */

export function DeadlineCountdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setNow(Date.now());
    const raf = requestAnimationFrame(update);
    const t = setInterval(update, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(t);
    };
  }, []);

  const deadline = useMemo(() => new Date(DEADLINE_ISO).getTime(), []);
  const left = now === null ? null : Math.max(0, deadline - now);

  const parts = left === null ? null : {
    d: Math.floor(left / 86_400_000),
    h: Math.floor((left % 86_400_000) / 3_600_000),
    m: Math.floor((left % 3_600_000) / 60_000),
    s: Math.floor((left % 60_000) / 1000),
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="border-amber-700/60 bg-amber-950/40 text-amber-400">
        Submissions close Oct 21
      </Badge>
      <span className="hidden font-mono text-sm text-zinc-300 sm:inline" suppressHydrationWarning>
        {parts ? `${parts.d}d ${String(parts.h).padStart(2, "0")}h ${String(parts.m).padStart(2, "0")}m ${String(parts.s).padStart(2, "0")}s left` : "—"}
      </span>
    </div>
  );
}
