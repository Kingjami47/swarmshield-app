// SwarmShield dashboard data — all values sourced from the contract repo
// (README.md, LAUNCH_SPEC.md, test/SwarmShieldHook.t.sol @ commit 62b7b02)

export const PROJECT = {
  name: "SwarmShield",
  symbol: "SHIELD",
  tagline: "The swarm-verified liquidity guard",
  sub: "Trust, priced into every swap.",
  description:
    "A Uniswap v4 hook that prices swarm trust into a pool. Launched through the Identity MD protocol on Ethereum mainnet for the first IMD Hackathon.",
  handle: "@SwarmShieldIMD",
  repoPlaceholder: "https://github.com/<YOUR_GITHUB>/swarmshield",
  commit: "62b7b02",
  testsPassing: 18,
} as const;

export const ADDRESSES = {
  poolManager: "0xE03A1074c86CFeDd5C142C4F04F1a1536e203543",
  intake: "0xa43e6F75ee006411F79Ac1C84120606C2330DE82",
  imd: "0xD34a99Bc0f67aE1bbd63C660e6d0b0dd03E263B7",
  burn: "0x000000000000000000000000000000000000dEaD",
  oracleSigner: "0x5598aa9146215bc13eb26f2c692ad1461fd32982",
} as const;

export const HOOK_PARAMS = {
  flagsHex: "0x288",
  flags: [
    { name: "beforeSwap", bit: "1 << 7" },
    { name: "beforeSwapReturnDelta", bit: "1 << 3" },
    { name: "beforeRemoveLiquidity", bit: "1 << 9" },
  ],
  protectedLpFee: 20000, // 2%
  trustedLpFee: 3000, // 0.30%
  surchargeBps: 100, // 1%, burned
  rugShieldBps: 1000, // 10% of in-range liquidity per 24h bucket
  verdictTtlDays: 30,
  oraclePriceImd: 0.5,
  panelSize: 7,
  quorum: 5,
  solc: "0.8.26",
  evmVersion: "cancun",
} as const;

export type TestGroup = {
  group: string;
  blurb: string;
  tests: { name: string; proves: string }[];
};

export const TEST_GROUPS: TestGroup[] = [
  {
    group: "Pricing & surcharge",
    blurb: "The fee path is the product: expensive while unverified, cheap once trusted, and a swap can never brick.",
    tests: [
      {
        name: "test_HookAddressHasRequiredFlags",
        proves: "Deployed address carries permission flags 0x288 in its low bits (CREATE2-mined).",
      },
      {
        name: "test_UnverifiedSwap_TakesSurcharge_DynamicPool",
        proves: "Unverified swap on a dynamic-fee pool pays 2% LP fee + the 1% surcharge via a hook delta taken inside the lock.",
      },
      {
        name: "test_StaticPool_OverrideIgnored_SurchargeOnly",
        proves: "On static-fee pools v4-core ignores the override — the hook degrades gracefully to surcharge-only pricing.",
      },
      {
        name: "test_NativeSurcharge_ExactIn",
        proves: "The surcharge works on the native ETH path, clamped to the PoolManager's real balance.",
      },
      {
        name: "test_TrustedSwap_NoSurcharge_BetterFee",
        proves: "After a positive verdict the same swap pays 0.30% and zero surcharge (read from the Swap event).",
      },
    ],
  },
  {
    group: "Swarm verdict flow",
    blurb: "End-to-end oracle round trip with a real EIP-712 signature, plus every way a fake verdict gets rejected.",
    tests: [
      {
        name: "test_Verify_PullsHalfIMDFromPayer",
        proves: "verify() pulls exactly 0.5 IMD from the caller and pays Intake v2 for the oracle request.",
      },
      {
        name: "test_Verdict_FlipsTrust_ThenExpires",
        proves: "Quorum attestation flips isTrusted() — and the verdict expires after the 30-day TTL.",
      },
      {
        name: "test_NegativeVerdict_StaysProtected",
        proves: "A false or sub-quorum verdict never grants trusted terms; the pool stays in protected mode.",
      },
      {
        name: "test_Submit_PermissionlessRetry",
        proves: "Anyone can re-submit a delivered attestation — no griefing vector if the callback is missed.",
      },
      {
        name: "test_FailureHook_ClearsPending",
        proves: "onOracleFailure clears the pending request without granting trust; failures are unsigned.",
      },
      {
        name: "test_Replay_Reverts",
        proves: "The same attestation cannot be replayed for a second request.",
      },
      {
        name: "test_BadSignature_Reverts",
        proves: "Attestations not signed by the live oracle-1 signer are rejected (ecrecover check).",
      },
      {
        name: "test_WeakPanel_Reverts",
        proves: "agreed < quorum (5 of 7) is rejected before any state change.",
      },
      {
        name: "test_NonBoolAnswer_Reverts",
        proves: "Only bool answers are accepted — the question is yes/no by construction.",
      },
    ],
  },
  {
    group: "Integrity & rug shield",
    blurb: "The hook cannot be tricked by non-PoolManager callers, wrong pools — and liquidity cannot leave fast.",
    tests: [
      {
        name: "test_InvalidPool_SwapReverts",
        proves: "Swaps routed through the hook from an unexpected pool id revert.",
      },
      {
        name: "test_OnlyPoolManager_CanCallHookEntries",
        proves: "verify-callback and hook entries reject callers that are not the PoolManager.",
      },
      {
        name: "test_RugShield_CapsDailyRemoval",
        proves: "LP removals are capped at 10% of in-range liquidity per UTC-day bucket, with geometric decay; adds and collects pass.",
      },
      {
        name: "test_Flush_SendsToBurn",
        proves: "Permissionless flush() sends accumulated surcharges to 0xdEaD — an unverified pool bleeds to the burn address.",
      },
    ],
  },
];

export type Step = {
  n: number;
  title: string;
  detail: string;
  status: "done" | "active" | "pending";
  owner: "engineer (AI)" | "you" | "swarm" | "both";
};

export const LAUNCH_STEPS: Step[] = [
  {
    n: 1,
    title: "Contracts + test suite",
    detail: "SwarmShieldHook + OracleAttestation + IIntake rebuilt from the IMD oracle spec. forge test: 18/18 green (via-ir, solc 0.8.26, cancun). bytecode_hash=\"none\" set per IMD launch requirement.",
    status: "done",
    owner: "engineer (AI)",
  },
  {
    n: 2,
    title: "Oracle question validated live",
    detail: "POST /requests/check on api.imd.fun returned judged: true, blockers: [] for the exact bool question (panel 7, quorum 5, 30-day validity).",
    status: "done",
    owner: "engineer (AI)",
  },
  {
    n: 3,
    title: "Push repo to GitHub",
    detail: "swarmshield_v1.3.zip (98KB) is push-ready: single clean commit 62b7b02, pinned submodules (v4-core v4.0.0, forge-std v1.17.0, solmate), .gitmodules + foundry.lock consistent. Create empty repo → git remote add origin → push.",
    status: "active",
    owner: "you",
  },
  {
    n: 4,
    title: "launch.open via explorer.imd.fun",
    detail: "Paste launch/launch_open.json (fill repoUrl + baseCommit). Kind univ4_hook, chainId 1, pairWith eth, poolBps 9000. Cost: 0.5 IMD + launch costs. The swarm builds, reviews, audits and deploys.",
    status: "pending",
    owner: "you + swarm",
  },
  {
    n: 5,
    title: "X account @SwarmShieldIMD",
    detail: "Create the account with the prepared kit (name, bio, avatar, banner), pin the 5-post launch thread, keep posting per the 10-day content plan.",
    status: "active",
    owner: "you",
  },
  {
    n: 6,
    title: "First verify() → trusted flip",
    detail: "Fund the payer wallet with ≥0.5 IMD, call verify(), watch Intake event → panel investigates → attestation → isTrusted() flips, fees drop 2% → 0.30%. Screenshot the chain for the X thread.",
    status: "pending",
    owner: "both",
  },
  {
    n: 7,
    title: "Submit on IMD Radar",
    detail: "imdradar.site/hackathon before the deadline: project X account + contract address (token) + 20–1000 char description of IMD usage. Prizes pay to the deployer wallet.",
    status: "pending",
    owner: "you",
  },
];

export const CRITERIA = [
  {
    n: 1,
    title: "Launch through the IMD protocol during the build period",
    how: "launch.open, kind univ4_hook, Ethereum mainnet (chainId 1) via explorer.imd.fun/launch — the swarm builds and deploys from our repo.",
    status: "ready",
  },
  {
    n: 2,
    title: "V4 hook or custom contract with meaningful functionality",
    how: "Three on-chain mechanics (trust-priced fees, burn surcharge, rug shield) + a live oracle consumer. No owner, no admin — functionality far beyond a standard token.",
    status: "ready",
  },
  {
    n: 3,
    title: "Dedicated X account",
    how: "@SwarmShieldIMD — kit prepared (bio, avatar, banner, 5-post launch thread + 10-day content plan in BRANDING.md).",
    status: "in-progress",
  },
  {
    n: 4,
    title: "Submit via IMD Radar before the deadline",
    how: "imdradar.site/hackathon — entry needs the X account + contract address + 20–1000 char description (drafted, final address post-launch).",
    status: "pending",
  },
];

export const REPO_TREE = [
  { path: "src/SwarmShieldHook.sol", note: "the hook" },
  { path: "src/OracleAttestation.sol", note: "EIP-712 attestation verification (IdentityMD Oracle v2)" },
  { path: "src/interfaces/IIntake.sol", note: "Intake v2 interface" },
  { path: "script/DeploySepolia.s.sol", note: "CREATE2-mined deployment (flags 0x288)" },
  { path: "test/SwarmShieldHook.t.sol", note: "18 tests (all passing)" },
  { path: "test/mocks/MockERC20.sol", note: "test token" },
  { path: "launch/launch_open.json", note: "paste-ready launch.open body (2 placeholders)" },
  { path: "launch/RUNBOOK.md", note: "import → check → quote → fire" },
  { path: "LAUNCH_SPEC.md", note: "everything the swarm needs to launch this" },
  { path: "BRANDING.md", note: "X plan + launch thread" },
  { path: "foundry.toml", note: "bytecode_hash=\"none\" per IMD requirement" },
  { path: "foundry.lock + .gitmodules", note: "pinned deps: v4-core v4.0.0, forge-std v1.17.0, solmate 89365b8" },
];

// Deadline: Oct 21, 2026 end of day, West Africa Time (UTC+1)
export const DEADLINE_ISO = "2026-10-21T23:59:59+01:00";
