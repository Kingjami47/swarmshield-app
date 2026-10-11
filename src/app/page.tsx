import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  Shield, ShieldCheck, ShieldAlert, Flame, Lock, Scale, FileSignature, Github, ExternalLink,
  CheckCircle2, Circle, LoaderCircle, BookOpen, ListTree, Trophy, AlertTriangle, Coins, Users,
} from "lucide-react";
import { FeeSimulator, RugShieldChart, DeadlineCountdown } from "@/components/shield/interactive";
import { Architecture } from "@/components/shield/architecture";
import {
  PROJECT, ADDRESSES, HOOK_PARAMS, TEST_GROUPS, LAUNCH_STEPS, CRITERIA, REPO_TREE,
} from "@/lib/shield-data";

const NAV = [
  ["Problem", "#problem"], ["Mechanics", "#mechanics"], ["Simulator", "#simulator"],
  ["Rug shield", "#rug"], ["Architecture", "#architecture"], ["Tests", "#tests"],
  ["Launch plan", "#launch"], ["Criteria", "#criteria"], ["Repo", "#repo"],
] as const;

function SectionTitle({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="mb-6 mt-16">
      <h2 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
        <span className="text-amber-400">{icon}</span> {title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">{sub}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="dark flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      {/* ------------------------------ Header ------------------------------ */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <a href="#top" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
              <Shield className="h-4.5 w-4.5 text-zinc-950" />
            </span>
            Swarm<span className="-ml-1.5 text-amber-400">Shield</span>
          </a>
          <nav aria-label="Sections" className="ml-4 hidden flex-wrap gap-1 lg:flex">
            {NAV.map(([label, href]) => (
              <a key={href} href={href}
                className="rounded-md px-2.5 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100">
                {label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <DeadlineCountdown />
          </div>
        </div>
      </header>

      <main id="top" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16">
        {/* ------------------------------ Hero ------------------------------ */}
        <section className="pt-14 sm:pt-20">
          <div className="flex items-start justify-between gap-8">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-amber-700/50 bg-amber-950/50 text-amber-300 hover:bg-amber-950/50">
                  Uniswap v4 Hook
                </Badge>
                <Badge variant="outline" className="border-zinc-700 text-zinc-300">IMD Oracle consumer</Badge>
                <Badge variant="outline" className="border-zinc-700 text-zinc-300">Ethereum mainnet</Badge>
                <Badge variant="outline" className="border-zinc-700 text-zinc-300">Ownerless</Badge>
              </div>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">
                The swarm-verified
                <br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                  liquidity guard
                </span>
              </h1>
            </div>
            <Image
              src="/img/avatar_v2.png"
              alt="SwarmShield emblem — a shield with a honeycomb lattice"
              width={176} height={176}
              priority
              className="hidden rounded-2xl border border-zinc-800 shadow-[0_0_60px_-15px] shadow-amber-600/40 md:block"
            />
          </div>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            {PROJECT.name} is a Uniswap v4 hook that prices swarm trust into a pool. It starts in
            <span className="text-rose-400"> protected mode</span> — expensive to trade — and only earns
            <span className="text-emerald-400"> trusted terms</span> when a quorum of independent IMD agents confirms,
            with an EIP-712 attestation, that the project is authentic and not another copycat.
          </p>
          <p className="mt-3 font-mono text-sm text-zinc-500">{PROJECT.sub}</p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { v: `${PROJECT.testsPassing}/18`, l: "forge tests passing", c: "text-emerald-400" },
              { v: "3", l: "on-chain mechanics", c: "text-amber-400" },
              { v: "0", l: "owner / admin keys", c: "text-zinc-100" },
              { v: `${HOOK_PARAMS.oraclePriceImd} IMD`, l: "to trigger a verdict", c: "text-zinc-100" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className={`font-mono text-2xl font-bold ${s.c}`}>{s.v}</div>
                <div className="mt-1 text-xs text-zinc-500">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------ Problem ------------------------------ */}
        <section id="problem">
          <SectionTitle
            icon={<AlertTriangle className="h-6 w-6" />}
            title="The problem: trust lives in a website table"
            sub="IMD Radar already flags 17+ copycats, fake tokens and ticker squatters in the Identity MD ecosystem. Anyone can clone a launch, and traders have no on-chain signal to tell the real one from the fake. SwarmShield moves that verdict into the pool itself — enforced by code, priced into every swap."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: <AlertTriangle className="h-5 w-5 text-rose-400" />, t: "17+ flagged copycats", d: "IMD Radar's safety page tracks impersonators and ticker squatters — and its review queue says \"swarm analysis: coming soon\". We ship exactly that." },
              { icon: <Users className="h-5 w-5 text-amber-400" />, t: "Badges are gameable", d: "A \"verified\" badge minted by a team proves nothing. A quorum-signed verdict from independent agents, expiring in 30 days, is evidence." },
              { icon: <Scale className="h-5 w-5 text-emerald-400" />, t: "Pools can defend themselves", d: "Uniswap v4 hooks let the pool react to trust: risky pools cost more, verified pools cost less, and nobody can rug fast." },
            ].map((c) => (
              <Card key={c.t} className="border-zinc-800 bg-zinc-900/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-zinc-100">{c.icon} {c.t}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-zinc-400">{c.d}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ------------------------------ Mechanics ------------------------------ */}
        <section id="mechanics">
          <SectionTitle
            icon={<BookOpen className="h-6 w-6" />}
            title="Mechanics — four rules, enforced by the hook"
            sub="Every number below is a constructor parameter in SwarmShieldHook.sol and is covered by the test suite. There is no owner able to change any of them after deployment."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-zinc-800 bg-zinc-900/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-zinc-100"><Scale className="h-5 w-5 text-amber-400" /> Trust-priced LP fee</CardTitle>
                <CardDescription className="text-zinc-500">beforeSwap · dynamic-fee pools</CardDescription>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-zinc-400">
                The hook returns the LP fee with the override flag: <span className="font-mono text-rose-300">{HOOK_PARAMS.protectedLpFee} (2%)</span> while unverified,
                <span className="font-mono text-emerald-300"> {HOOK_PARAMS.trustedLpFee} (0.30%)</span> once a positive quorum verdict is stored.
                On static-fee pools v4-core ignores the override and the hook degrades gracefully — trust pricing continues via the surcharge.
              </CardContent>
            </Card>
            <Card className="border-zinc-800 bg-zinc-900/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-zinc-100"><Flame className="h-5 w-5 text-rose-400" /> Protection surcharge — burns</CardTitle>
                <CardDescription className="text-zinc-500">beforeSwap + beforeSwapReturnDelta</CardDescription>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-zinc-400">
                While unverified, every swap pays an extra <span className="font-mono text-rose-300">{HOOK_PARAMS.surchargeBps} bps (1%)</span> taken as a hook delta
                inside the swap&apos;s lock (no settlement bricking), clamped to the PoolManager&apos;s real balance.
                Permissionless <span className="font-mono text-zinc-300">flush()</span> sends it to <span className="font-mono text-zinc-300">0xdEaD</span> — an unverified pool bleeds to the burn address.
              </CardContent>
            </Card>
            <Card className="border-zinc-800 bg-zinc-900/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-zinc-100"><Lock className="h-5 w-5 text-amber-400" /> Rug shield</CardTitle>
                <CardDescription className="text-zinc-500">beforeRemoveLiquidity</CardDescription>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-zinc-400">
                Liquidity removals are capped at <span className="font-mono text-amber-300">{HOOK_PARAMS.rugShieldBps} bps (10%)</span> of current in-range liquidity
                per 24h UTC bucket, with geometric decay — a rug becomes a 10-days-minimum affair. Adds and fee collects
                (<span className="font-mono text-zinc-300">liquidityDelta == 0</span>) are never blocked. The deployer has no fast exit either.
              </CardContent>
            </Card>
            <Card className="border-zinc-800 bg-zinc-900/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-zinc-100"><ShieldCheck className="h-5 w-5 text-emerald-400" /> Swarm verification</CardTitle>
                <CardDescription className="text-zinc-500">verify() · onOracleResult · submit</CardDescription>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-zinc-400">
                Anyone pays <span className="font-mono text-zinc-300">{HOOK_PARAMS.oraclePriceImd} IMD</span> to Intake v2 and asks the fixed question: does the launch registry
                and <span className="font-mono text-zinc-300">{PROJECT.handle}</span> identify the same deployer, with no impersonation evidence? A panel of
                {" "}<span className="font-mono text-zinc-300">{HOOK_PARAMS.panelSize}</span> agents answers bool with quorum <span className="font-mono text-zinc-300">{HOOK_PARAMS.quorum}</span>;
                the EIP-712 attestation is verified on-chain, grants trusted terms for <span className="font-mono text-zinc-300">{HOOK_PARAMS.verdictTtlDays} days</span>, and can flip back.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ------------------------------ Simulator ------------------------------ */}
        <section id="simulator">
          <SectionTitle
            icon={<Coins className="h-6 w-6" />}
            title="Try it — the fee difference, live"
            sub="Toggle the pool between protected and trusted and drag the swap size. The percentages are the exact values encoded in the hook; USD figures are illustrative notionals."
          />
          <FeeSimulator />
        </section>

        {/* ------------------------------ Rug shield ------------------------------ */}
        <section id="rug">
          <SectionTitle
            icon={<Lock className="h-6 w-6" />}
            title="The exit curve — why 10% per day works"
            sub="Binary LP locks are gameable and trap honest LPs. A rate-limited, geometric exit lets everyone leave — just not in one block. Here is the maximum cumulative withdrawal over time."
          />
          <RugShieldChart />
        </section>

        {/* ------------------------------ Architecture ------------------------------ */}
        <section id="architecture">
          <SectionTitle
            icon={<ListTree className="h-6 w-6" />}
            title="How it fits together"
            sub="Three flows run through one immutable contract: trading pays for trust, the swarm grants it, and the rug shield makes exits honest."
          />
          <Architecture />
          <div className="mt-4 grid gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 font-mono text-xs text-zinc-500 sm:grid-cols-2">
            <div>PoolManager&nbsp;&nbsp;<span className="text-zinc-400">{ADDRESSES.poolManager}</span></div>
            <div>Intake v2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-zinc-400">{ADDRESSES.intake}</span></div>
            <div>IMD token&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-zinc-400">{ADDRESSES.imd}</span></div>
            <div>Surcharge sink<span className="text-zinc-400">{ADDRESSES.burn}</span></div>
          </div>
        </section>

        {/* ------------------------------ Tests ------------------------------ */}
        <section id="tests">
          <SectionTitle
            icon={<CheckCircle2 className="h-6 w-6" />}
            title={`Test suite — ${PROJECT.testsPassing}/18 green`}
            sub="forge test (via-ir, solc 0.8.26, cancun). Every mechanic above is asserted, including every way a fake verdict gets rejected."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {TEST_GROUPS.map((g) => (
              <Card key={g.group} className="border-zinc-800 bg-zinc-900/60">
                <CardHeader>
                  <CardTitle className="text-base text-zinc-100">{g.group}</CardTitle>
                  <CardDescription className="text-zinc-500">{g.blurb}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {g.tests.map((t) => (
                    <div key={t.name} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <div>
                        <div className="break-words font-mono text-xs text-zinc-200">{t.name}</div>
                        <div className="mt-0.5 text-xs leading-relaxed text-zinc-500">{t.proves}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ------------------------------ Launch plan ------------------------------ */}
        <section id="launch">
          <SectionTitle
            icon={<LoaderCircle className="h-6 w-6" />}
            title="Launch plan — where we are, what's next"
            sub="Two of seven steps are done and verified. The next blocker is the GitHub push, then everything runs through the IMD protocol."
          />
          <div className="space-y-3">
            {LAUNCH_STEPS.map((s) => (
              <div key={s.n} className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="flex flex-col items-center">
                  {s.status === "done" ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  ) : s.status === "active" ? (
                    <LoaderCircle className="h-6 w-6 animate-spin text-amber-400" style={{ animationDuration: "2.5s" }} />
                  ) : (
                    <Circle className="h-6 w-6 text-zinc-600" />
                  )}
                  {s.n < LAUNCH_STEPS.length && <div className="mt-2 w-px flex-1 bg-zinc-800" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-zinc-100">{s.n}. {s.title}</span>
                    <Badge variant="outline" className={
                      s.status === "done" ? "border-emerald-800 text-emerald-400"
                        : s.status === "active" ? "border-amber-800 text-amber-400"
                          : "border-zinc-700 text-zinc-500"
                    }>
                      {s.status === "done" ? "done" : s.status === "active" ? "in progress" : "pending"}
                    </Badge>
                    <Badge variant="outline" className="border-zinc-800 text-zinc-500">{s.owner}</Badge>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------ Criteria ------------------------------ */}
        <section id="criteria">
          <SectionTitle
            icon={<Trophy className="h-6 w-6" />}
            title="Hackathon criteria — all four covered"
            sub="Verified verbatim from the organizer's post (Oct 7, 2026). Judging: IMD agents rank places 6–15, the human jury picks the top 5."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {CRITERIA.map((c) => (
              <Card key={c.n} className="border-zinc-800 bg-zinc-900/60">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base text-zinc-100">
                      <span className="mr-2 font-mono text-amber-400">#{c.n}</span>{c.title}
                    </CardTitle>
                    <Badge variant="outline" className={
                      c.status === "ready" ? "shrink-0 border-emerald-800 text-emerald-400"
                        : c.status === "in-progress" ? "shrink-0 border-amber-800 text-amber-400"
                          : "shrink-0 border-zinc-700 text-zinc-500"
                    }>
                      {c.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-zinc-400">{c.how}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ------------------------------ Repo ------------------------------ */}
        <section id="repo">
          <SectionTitle
            icon={<Github className="h-6 w-6" />}
            title="The repository — push-ready"
            sub={`Single clean commit ${PROJECT.commit} (20 files), pinned submodules, deterministic bytecode per the IMD launch requirement. Packaged as swarmshield_v1.3.zip (98KB).`}
          />
          <Card className="border-zinc-800 bg-zinc-900/60">
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {REPO_TREE.map((f, i) => (
                  <div key={f.path} className={i % 2 ? "bg-zinc-950/40" : ""}>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 px-4 py-2">
                      <span className="font-mono text-xs text-amber-300/90">{f.path}</span>
                      <span className="text-xs text-zinc-500">{f.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href="https://explorer.imd.fun/launch"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-5 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90"
            >
              explorer.imd.fun/launch <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="https://imdradar.site/hackathon"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-700 px-5 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-900"
            >
              imdradar.site/hackathon <ExternalLink className="h-4 w-4" />
            </a>
            <span className="font-mono text-xs text-zinc-600">repo URL: {PROJECT.repoPlaceholder}</span>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-zinc-600">
            <ShieldAlert className="h-3.5 w-3.5" />
            Fee simulator figures are illustrative notionals for understanding the mechanics — not a price promise. The product is risk pricing, not returns.
          </p>
        </section>
      </main>

      {/* ------------------------------ Footer ------------------------------ */}
      <footer className="mt-auto border-t border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-xs text-zinc-500">
          <span className="flex items-center gap-1.5 font-semibold text-zinc-400">
            <Shield className="h-3.5 w-3.5 text-amber-400" /> SwarmShield {PROJECT.symbol}
          </span>
          <span>The swarm guards the pool.</span>
          <span>Built for the Identity MD Hackathon · Oct 7–21, 2026</span>
          <span className="ml-auto font-mono">MIT · commit {PROJECT.commit} · {PROJECT.handle}</span>
        </div>
      </footer>
    </div>
  );
}
