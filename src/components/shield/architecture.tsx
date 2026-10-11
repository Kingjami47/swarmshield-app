import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDown, ArrowRight, Coins, FileSignature, Flame, Lock, ShieldCheck, Users, Vote, Scale, Undo2,
} from "lucide-react";

function Node({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "amber" | "emerald" | "rose" }) {
  const tones = {
    default: "border-zinc-700 bg-zinc-900 text-zinc-200",
    amber: "border-amber-800/60 bg-amber-950/40 text-amber-300",
    emerald: "border-emerald-800/60 bg-emerald-950/40 text-emerald-300",
    rose: "border-rose-900/60 bg-rose-950/40 text-rose-300",
  } as const;
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium sm:text-sm ${tones[tone]}`}>
      {children}
    </div>
  );
}

function Flow({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
        {icon} {label}
      </div>
      <div className="flex flex-col items-stretch gap-1.5">
        {children}
      </div>
    </div>
  );
}

function VArrow({ note }: { note?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-0.5 text-zinc-600">
      <ArrowDown className="h-3.5 w-3.5" />
      {note && <span className="font-mono text-[10px] uppercase tracking-wide">{note}</span>}
    </div>
  );
}

export function Architecture() {
  return (
    <Card className="border-zinc-800 bg-zinc-900/60">
      <CardHeader>
        <CardTitle className="text-zinc-100">Architecture — three flows, one ownerless hook</CardTitle>
        <CardDescription className="text-zinc-400">
          SwarmShieldHook sits beside the pool, enforced by Uniswap v4&apos;s permission flags
          (<span className="font-mono text-zinc-300">0x288</span>). No owner, no admin, no upgrades — the oracle question is immutable after construction.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-3">
        <Flow label="1 · Trade (every swap)" icon={<Scale className="h-4 w-4 text-amber-400" />}>
          <Node>Swapper</Node>
          <VArrow />
          <Node>PoolManager <span className="font-mono text-[10px] text-zinc-500">v4-core</span></Node>
          <VArrow note="beforeSwap" />
          <Node tone="amber">
            <Scale className="h-3.5 w-3.5" /> Fee override
            <span className="font-mono text-[10px]">2% → 0.30% when trusted</span>
          </Node>
          <VArrow note="if unverified" />
          <Node tone="rose">
            <Coins className="h-3.5 w-3.5" /> +1% surcharge via hook delta (taken inside the lock)
          </Node>
          <VArrow note="flush() — permissionless" />
          <Node tone="rose"><Flame className="h-3.5 w-3.5" /> 0xdEaD — the burn</Node>
        </Flow>

        <Flow label="2 · Verify (swarm verdict)" icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}>
          <Node>Anyone (permissionless)</Node>
          <VArrow note="verify() — 0.5 IMD" />
          <Node><FileSignature className="h-3.5 w-3.5" /> Intake v2 <span className="font-mono text-[10px] text-zinc-500">0xa43e…DE82</span></Node>
          <VArrow note="oracle.request" />
          <Node tone="amber"><Users className="h-3.5 w-3.5" /> Agent panel — 7 seats, investigates deployer + registry + X</Node>
          <VArrow note="quorum 5/7" />
          <Node tone="emerald"><Vote className="h-3.5 w-3.5" /> EIP-712 attestation → onOracleResult</Node>
          <VArrow note="ecrecover + TTL 30d" />
          <Node tone="emerald"><ShieldCheck className="h-3.5 w-3.5" /> isTrusted = true → fees drop</Node>
        </Flow>

        <Flow label="3 · Provide / exit liquidity" icon={<Lock className="h-4 w-4 text-rose-400" />}>
          <Node>LP</Node>
          <VArrow note="modifyLiquidity" />
          <Node><Undo2 className="h-3.5 w-3.5" /> beforeRemoveLiquidity</Node>
          <VArrow note="rug shield check" />
          <Node tone="amber">
            <Lock className="h-3.5 w-3.5" /> ≤10% of in-range liquidity per 24h bucket
          </Node>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <Node tone="emerald"><ShieldCheck className="h-3.5 w-3.5" /> within cap → pass</Node>
            <Node tone="rose"><Flame className="h-3.5 w-3.5" /> over cap → revert</Node>
          </div>
          <VArrow note="adds + collects" />
          <Node><ShieldCheck className="h-3.5 w-3.5" /> never blocked (liquidityDelta == 0 passes)</Node>
        </Flow>
      </CardContent>
      <CardContent className="border-t border-zinc-800/60">
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-zinc-500">
          <Badge variant="outline" className="border-zinc-700 text-zinc-400">hook flags 0x288</Badge>
          <Badge variant="outline" className="border-zinc-700 text-zinc-400">dynamic fee 0x800000</Badge>
          <Badge variant="outline" className="border-zinc-700 text-zinc-400">EIP-712 domain &quot;IdentityMD Oracle&quot; v2</Badge>
          <Badge variant="outline" className="border-zinc-700 text-zinc-400">200k callback gas budget</Badge>
          <span className="ml-auto flex items-center gap-1"><ArrowRight className="h-3 w-3" /> full constructor args in LAUNCH_SPEC.md §1</span>
        </div>
      </CardContent>
    </Card>
  );
}
