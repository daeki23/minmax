# Midnight, Zero-Knowledge Proofs and Verifiable Credentials for Private-but-Verifiable Health Achievements

_Research report for MINMAX · 2026-10-02 · status: draft, independently fact-checked afterwards_

## Summary for the founder

- **Midnight is live but very young.** The federated mainnet produced its genesis block on 30 March 2026, run by named corporate node operators (Google Cloud, MoneyGram, eToro, Pairpoint by Vodafone, Blockdaemon and others). Permissionless smart-contract deployment only opened on **28 September 2026**, four days ago. Decentralisation (the Mōhalu phase) has not happened yet [1][2][5] (confidence: high).
- **Midnight is not ready for consumer mobile.** The official FAQ says proofs come from a local Docker "proof server" and that mobile support was unavailable at launch. Native mobile wallets are alpha or beta. A developer issue filed on 22 Sep 2026 reports prover keys of 90–570 MB per circuit, which makes client-side proving impractical for anything that verifies signatures [5][9][10] (confidence: high).
- **Midnight's tooling is still pre-1.0 and changing fast.** Compact is at 0.35.0 (29 Sep 2026) with breaking changes, and it targets a ledger version that is not deployed yet. Composability (v9) is promised for "later this year" [8][11] (confidence: high).
- **There are two real UX advances.** Apps can sponsor fees in DUST, so users never need to hold NIGHT tokens, and embedded wallets let users sign in with email or a social login (Dynamic). These remove the worst blockchain friction, but they arrived only in Sept 2026 [4][13] (confidence: medium).
- **The standards path is mature and free today.** SD-JWT is RFC 9901 (Nov 2025), OpenID4VP 1.0 is Final (July 2025) and W3C VC 2.0 has been a Recommendation since May 2025. BBS (unlinkable selective disclosure) is still a Candidate Recommendation Draft. EUDI wallets are due in every Member State by 24 Dec 2026, but ZK proofs are explicitly *post-launch* there [15][16][18][19][20] (confidence: high).
- **Client-side ZK threshold proofs on phones are practical now without a blockchain.** Mopro reports Noir proofs on iPhone in about 0.3–2.2 s for circuits of a relevant size. Google open-sourced Longfellow-ZK for proving predicates over ordinary ECDSA-signed mdoc credentials, and the EU wallet project ships an iOS library for it [21][23][32] (confidence: medium-high).
- **The weak link is data origin, not cryptography.** No wearable vendor I could find signs individual health records. App Attest and Play Integrity prove the *app and device* are genuine, not the *data*. zkTLS against Garmin Connect is technically possible (TLSNotary proxy mode takes 1–2 s) but conflicts with Garmin's developer agreement, which bans scraping, and it is fragile [26][35][36][37] (confidence: medium).
- **GDPR pushes health data off-chain.** EDPB Guidelines 02/2025 v2.0 (adopted 7 July 2026) say personal data generally should not be stored on a blockchain. They count even salted or keyed hashes as personal data, prefer permissioned chains, and require erasure by design. Only perfectly hiding commitments or proofs belong on-chain [38] (confidence: high).
- **Recommendation:** ship Phase 0 (MINMAX-signed coarse claims) at launch. Add SD-JWT VC through OpenID4VCI in 2027. Add on-device ZK threshold proofs only when a verifier asks for them. Treat Midnight as an optional Phase 3 anchor, reviewed again in mid-2027. Its unique contribution is public, server-independent verifiability with app-paid fees, not better data trust.

## Findings

### 1. Midnight Network status (as of 2026-10-02)

**Timeline and governance.** In February 2026 Midnight announced its federated mainnet node operators: Google Cloud, Blockdaemon, Shielded Technologies, AlphaTON, Pairpoint by Vodafone, eToro and MoneyGram, with launch planned for March 2026 [1]. The FAQ says mainnet runs "under a federated governance model with up to 13 trusted node operators initially", promises "no chain resets" and plans gradual decentralisation [5]. Secondary sources date the genesis block to 30 March 2026; the official release overview lists Ledger 8.0 as live on Preview, Preprod and Mainnet [7][12] (confidence: high). The Mōhalu phase (Cardano stake-pool operators and the DUST Capacity Exchange) was described as Q2–Q3 2026 and is now reported as Q4 2026 [12] (confidence: medium, aggregator source).

**Smart contracts.** The official September "State of the Network" post (28 Sep 2026) says: "Permissionless smart contract deployment is now live on Midnight mainnet", without a required security review, and "Applications can now also deploy contracts on behalf of end users" [2]. On 1 Oct 2026, press coverage quoted CTO Sebastien Guillemot as saying the "v8 release enables private contracts, with composability (v9) coming after", possibly within 2026. Node 1.0.3 (26 Sep) was called the last major technical release before that [11]. How the official "permissionless deployment is live" relates to "v8 enables private contracts" is not clear from public sources (**unverified**). For MINMAX this means the feature set is changing week to week.

**Tokens and fees.** NIGHT has a fixed supply of 24 billion and launched in December 2025. Holding NIGHT generates DUST, a shielded, **non-transferable**, decaying resource that pays fees. DUST "can be delegated to power applications for users" [6]. The FAQ says 1 NIGHT generates up to 5 DUST over 7 days and that fees are dynamic with load [5] (confidence: high). On 14 Sep 2026 Midnight described fee sponsorship through the Capacity Exchange (users can pay in tokens like USDM "behind the scenes") and embedded wallets through Dynamic, with email or social sign-in [4]. The Sept post mentions a "Relay Club pilot enabling sponsored DUST fees through API" [2]. A developer tutorial from May 2026 shows two-phase balancing, in which a backend wallet adds DUST to a user's transaction, demonstrated on Preview testnet [13]. NIGHT's price is volatile: a reported 86% weekly rise around 1 Oct 2026 [11]. **I found no published fiat cost per transaction** (unverified).

**Compact and SDK maturity.** Compact is a TypeScript-like DSL with a 0.x version history: 0.18 → 0.35.0, released 29 Sep 2026. The 0.35.0 release adds breaking changes to `createCircuitContext` and `crossContractCall` and targets "ledger 9", which is not yet on public networks. 0.31 is recommended "for contracts deployed today" [8]. At mainnet launch the compatible stack was Compact 0.28, midnight-js 3.0 and wallet-sdk 1.0 (search snippet of [7]; confidence: medium).

**Proving and wallets.** This is the decisive constraint. The FAQ says: "At launch, a local proof server is provided to run proofs locally ... via a Docker container", and mobile is unavailable until "alternative proof-serving options" such as in-browser or TEE-hosted proving arrive [5]. The June 2026 wallet reference lists Lace (browser extension only, needs a proof server), 1AM (browser with in-browser WASM proving; mobile in beta), Kuira (Android, *alpha*, on-device proving "in seconds"), Gero, Ctrl and urble. It notes account abstraction is "not native to Midnight as of June 2026" [9]. GitHub issue #203 (22 Sep 2026) reports prover keys of 90.2 MB for the simplest circuits, about 180 MB with shielded coins, and 235–570 MB once secp256k1 signatures are verified in-circuit, totalling 10.4 GB for one deployment. It concludes that client-side proving is impractical and hosted proof servers are required [10] (confidence: high for the numbers reported; these come from a complex DeFi/bridge contract, so a simple threshold circuit would sit near the ~90 MB floor). A hosted proof server sees the private inputs (the witness), which defeats the privacy goal for health data.

**Ecosystem.** The September report lists wallets (Gero 2.7.1 with dApp support), a token launchpad on Preprod, hackathon invoice apps and enterprise partners [2]. Press reports a UK bank planning tokenised deposits [12]. Health examples are prototypes only, such as the WeOwnHealth clinical-trial matching repo cited in competitors.md. **I found no shipping consumer health or fitness dApp on Midnight** (confidence: medium).

**Risk assessment for a consumer app.** The risks are: (1) tooling is pre-1.0 with breaking changes; (2) there is no production-grade mobile proving path; (3) security is federated (trust in about 9–13 named companies), which the EDPB's preference for permissioned chains actually favours, but which weakens the "trustless" argument; (4) the token is volatile, though DUST sponsorship isolates users from it; (5) MiCA and "crypto" brand perception among mainstream and health audiences (not researched here); (6) single-ecosystem lock-in: Compact contracts do not port. Overall: **not a launch dependency; acceptable as a 2027+ experiment** (confidence: medium).

### 2. Alternatives for selective disclosure

| Option | Status (2026-10-02) | What it gives MINMAX | Mobile UX / cost |
|---|---|---|---|
| **SD-JWT (RFC 9901) + SD-JWT VC** | SD-JWT is RFC 9901 since 19 Nov 2025 [16]; SD-JWT VC is an IETF draft (‑14 seen; later revisions reported in search, unverified) [17] | Signed claim set; holder reveals chosen claims. Thresholds must be pre-computed as boolean claims ("vo2max_gte_50": true) | Trivial: ordinary ES256 signatures, free libraries. Presentations are linkable across verifiers unless MINMAX issues batches of single-use credentials |
| **W3C VC 2.0 + Data Integrity BBS** | VC 2.0 is a Recommendation (May 2025) [14]; BBS cryptosuite is a Candidate Recommendation Draft dated 10 Sep 2026, with optional features "at risk" pending the IETF BBS RFC [15] | Unlinkable derived proofs and selective disclosure | Few production wallets. Pairing-curve crypto is not in Apple's or Android's secure hardware |
| **OpenID4VCI / OpenID4VP** | OID4VP 1.0 "Status: Final", published 9 July 2025, supports W3C VC, mdoc and SD-JWT VC, plus a Digital Credentials API binding [18] | Standard issuance and presentation protocol, so third-party wallets work | Mature libraries (walt.id and others) |
| **EUDI Wallet** | Every Member State must have one operational by 24 Dec 2026; regulated private sectors (incl. healthcare, insurance) must accept it by 24 Dec 2027 for strong authentication [19]. ZKP "is expected to be introduced following the launch" [20] | Future distribution channel for MINMAX attestations as (non-qualified) EAAs | Requires relying-party registration; ZK not available at launch |
| **Longfellow-ZK (Google)** | Open-sourced 3 Jul 2025 [21]; Google Wallet accepts `mso_mdoc_zk` requests [22]; the EU wallet project publishes an iOS library [23] | ZK predicate proofs over **standard ECDSA-signed mdoc**, with no issuer change and no chain | Built for phones; MINMAX would need a custom circuit for "value ≥ threshold" (effort unverified) |
| **Privado ID / Billions** | Privado ID (ex-Polygon ID) now feeds the Billions app (June 2025) with "ZK-Query" credentials [30] | Off-the-shelf ZK credentials | Pulls MINMAX into a token-centred identity network |
| **Semaphore v4** | Stable PSE protocol for anonymous group membership plus nullifiers [31] | "Anonymous member of the VO2max ≥ 50 group" for leaderboards or votes | Noir Semaphore proof: 0.8 s iPhone, 4.0 s Pixel 6 [32]; needs a group registry (on-chain or a server) |
| **Noir (+ mopro)** | Mopro benchmarks (nargo 1.0.0-beta.3): Keccak 349 ms on iOS / 1.3 s on Pixel 6; zkEmail 1.3 s / 4.8 s; Anon Aadhaar 2.2 s / 8.2 s [32] | General custom circuits (e.g. verify the MINMAX signature, then check the threshold) | Native mobile proving is fast enough for an interactive "share" flow |
| **Aztec** | Alpha Network launched in 2026 with client-side proving, but warns of "known critical vulnerabilities as audits continue" [34] | Alternative public private-state chain | Not production-ready |
| **zkVMs (SP1, RISC Zero)** | Optimised for GPU-cluster proving (SP1 Hypercube: Ethereum blocks in real time on 16 RTX 5090s) [33] | Prove arbitrary Rust programs (e.g. the stat engine itself) | Server-side proving means the prover sees the raw data; wrong tool for private health data unless self-hosted |

(confidence: high for the standards' statuses; medium for third-party benchmarks)

### 3. Origin attestation: can anyone vouch that the data is real?

- **Vendors do not sign data.** I found no documentation that Apple HealthKit, Health Connect, Garmin, Oura, Polar or Whoop attach verifiable signatures to individual samples (confidence: medium, based on absence of evidence). Garmin's Health API delivers data to the developer's server over authenticated OAuth channels, so MINMAX can honestly say it "received this from Garmin's API". A third party cannot check that claim; it must trust MINMAX.
- **App Attest and Play Integrity.** Apple's App Attest lets a server check that requests come from a genuine, unmodified copy of the app on a real Apple device. Apple recommends it as one layer of defence rather than a complete guarantee, and it does not attest the content of user data [35] (confidence: medium, page summarised). Play Integrity returns app, device and account verdicts. Its default quota is 10,000 requests/day, and Google says it should not be "your sole anti-abuse mechanism" [36] (confidence: high). Both raise the cost of a fake client injecting values; neither stops a user from entering manual workouts in HealthKit, which a well-behaved app then reads.
- **zkTLS on Garmin Connect.** Technically feasible. TLSNotary proxy mode attests a 1 KB/2 KB exchange in 1.6 s natively over 5G (MPC mode 10.4 s) [26]. Its latest release is still a pre-release alpha (v0.1.0-alpha.15, seen in search [27]). Reclaim advertises "2–30s proof generation". Its pricing ranges from a free tier of 25 verifications/month to $1.00 (Solopreneur, $2,000/month) and about $0.10 (enterprise), and its catalogue lists no health providers [24]; it says a gnark migration cut mobile proof time from about 40 s to 4–5 s [25]. zkPass offers Proxy and MPC modes [28], and Opacity combines MPC with TEEs and raised a $12 M seed round [29]. **Realism for 2026: low.** Garmin offers no personal API. Its Connect Developer Program Agreement forbids building an application that uses "any robot, spider ... to scrape, retrieve, or index services provided by Garmin" [37]. Web endpoints change without notice, and proxy-mode attestors run in data centres that the server may block [26]. zkTLS also proves only "Garmin's server said X", not "the user's body did X".
- **Practical trust ladder for MINMAX.** The tier should come from the *ingestion path*: Garmin Health API received server-side counts as device-verified; HealthKit/Health Connect samples whose source bundle is the vendor's app, with no "user entered" flag, count as a weaker device tier; anything else counts as self-reported. App Attest / Play Integrity should gate the upload. MINMAX's signature on the resulting claim is the actual trust root.

### 4. GDPR vs immutable ledgers

The EDPB adopted Guidelines 02/2025 v2.0 on **7 July 2026** after public consultation [38][39]. They state:
- "In general, it is not advisable to store personal data on the blockchain, and it should not be stored in the content of transactions" [38].
- Salted or keyed hashes remain personal data, and "unsalted or unkeyed hashes should, in general, not be considered sufficient" for public chains [38].
- A commitment from "a perfectly hiding state-of-the art scheme" becomes "useless" once the original data and witness are deleted. This is the accepted pattern [38].
- "Organisations should favour permissioned blockchains" and explore other governance only for documented reasons [38].
- Erasure and objection "must be complied with by design". If the integrity property is not needed, "the EDPB recommends looking at other tools" [38].

Health data is special-category data (Art. 9), so a DPIA is mandatory in practice. For MINMAX: nothing derived from a measurement may go on a chain except a perfectly hiding commitment, a ZK proof or a nullifier, and the design has to show why a chain is *necessary* at all (confidence: high).

### 5. What Midnight uniquely adds (and what it does not)

**Adds:** (a) Third parties can check a claim against public contract state without contacting MINMAX's server and without MINMAX being able to rewrite history, which helps if MINMAX disappears or for adversarial verifiers. (b) Programmable private state plus nullifiers in one stack, enabling "this anonymous character holds the Engine-tier badge and has entered this season's tournament once". (c) Fee sponsorship and embedded wallets, so users never see a token [4][6]. (d) A governance profile (named, regulated operators) that is closer to the EDPB's permissioned preference than Ethereum L1 [1][38].

**Does not add:** better data provenance (the input is still a MINMAX attestation), anything SD-JWT plus a revocation list cannot do for one-to-one verification, or mobile-ready proving today [5][10]. Semaphore or Noir on an Ethereum L2 could also provide (a) and (b); Midnight's edge is (c) together with privacy as a protocol default.

## Implications for MINMAX

**Phase 0: signed claims, no chain (launch, Q4 2026 to Q1 2027).**
- The server issues compact claims ("VO2max ≥ 50 · device-verified · Garmin · 2026-09") signed with ES256 or Ed25519, carrying a claim ID, expiry and a revocation status, verifiable at a public MINMAX URL and as a QR code/share card.
- Gate uploads with App Attest / Play Integrity. Keep raw values in the user's account only. Cost: essentially zero beyond engineering time.
- Model claims as **pre-computed coarse booleans and bands** (the design already plans this), which makes Phases 1–2 a format change rather than a redesign.

**Phase 1: W3C VC / SD-JWT VC (2027).**
- Issue SD-JWT VC through OpenID4VCI to any compliant wallet (and to MINMAX's own in-app holder). Use a token status list for revocation. Issue batches of single-use credentials to limit cross-verifier linkability.
- Watch the EUDI EAA rules: private-sector acceptance obligations start 24 Dec 2027 [19], which may create B2B demand (insurers, employers), within the limits set in regulatory.md and wearable-integrations.md (Apple 5.1.3).

**Phase 2: client-side ZK threshold proofs (2027–2028, only with a named verifier).**
- Option A: Longfellow-style ZK over an ECDSA-signed mdoc (standard issuer and EUDI alignment) [21][22][23].
- Option B: a Noir circuit via mopro that verifies MINMAX's signature over the raw value and outputs only "≥ threshold" plus a verifier-scoped nullifier [32].
- Both run on-device in seconds and need no chain. This is the point where "the server never learns which threshold a user proved to whom" becomes true.

**Phase 3: public verifiability (2028+, demand-driven).**
- Use cases: anonymous public leaderboards, season tournaments with sybil resistance, a registry that survives MINMAX.
- Candidates: Midnight (if native mobile proving, Compact ≥ 1.0 and the Capacity Exchange are live), or Semaphore/Noir on a mature L2.
- On-chain content: only hiding commitments, proofs and nullifiers. A DPIA must justify the necessity [38].
- Cheap insurance now: one 2–3 day spike on Midnight Preprod with a sponsored-fee "badge registry" contract, to keep the option real and to have something to show Midnight grant programmes (grant availability is unverified).

**Marketing.** Do not claim "on-chain" or "blockchain-verified" before Phase 3. "Cryptographically signed by MINMAX, raw data never shared" is true from day one.

## Open questions

- What exactly does the Midnight "v8" release enable that the 28 Sep permissionless deployment did not (private state, custom tokens)? Official confirmation is needed [2][11].
- What is the prover-key size and proving time of a minimal Compact threshold circuit (no signature verification) on Kuira/1AM mobile? No public benchmark was found.
- What does a sponsored Midnight transaction actually cost in fiat, and is the Capacity Exchange live on mainnet?
- What is the effort to adapt Longfellow-ZK circuits for numeric "≥" predicates on custom mdoc namespaces?
- Would any insurer, employer or event organiser in DACH accept a MINMAX-issued attestation, and which format would it require? No demand signal yet (see competitors.md).
- Does HealthKit/Health Connect source metadata reliably distinguish vendor-written from user-entered data for all relevant types? This needs on-device testing.
- Will SD-JWT VC become an RFC before Phase 1, and when will the BBS cryptosuite and IETF BBS draft finalise?
- Is MINMAX, as issuer of non-qualified EAAs, subject to any eIDAS 2.0 obligations? This needs counsel.

## Sources

1. Midnight blog, "Expanding list of mainnet node operators revealed" (24 Feb 2026) — https://midnight.network/blog/expanding-list-of-mainnet-node-operators-revealed — accessed 2026-10-02
2. Midnight blog, "State of the Network – September 2026" (28 Sep 2026) — https://midnight.network/blog/state-of-the-network-september-2026 — accessed 2026-10-02
3. Midnight blog index — https://midnight.network/blog — accessed 2026-10-02
4. Midnight blog, "Building a seamless user journey through abstraction on Midnight" (14 Sep 2026) — https://midnight.network/blog/seamless-user-journey-through-abstraction — accessed 2026-10-02
5. Midnight FAQ — https://midnight.network/faq — accessed 2026-10-02
6. Midnight, NIGHT token page — https://midnight.network/night — accessed 2026-10-02
7. Midnight Docs, Release overview — https://docs.midnight.network/relnotes/overview — accessed 2026-10-02
8. Midnight Docs, Compact compiler release notes — https://docs.midnight.network/relnotes/compact — accessed 2026-10-02
9. Midnight Docs, Wallet reference (community wallets) — https://docs.midnight.network/sdks/community/wallets/community-wallets-reference — accessed 2026-10-02
10. GitHub midnightntwrk/servicedesk issue #203, "Prover keys of 90–570 MB per circuit make client-side proving impractical" (22 Sep 2026) — https://github.com/midnightntwrk/servicedesk/issues/203 — accessed 2026-10-02
11. 36Crypto, "Midnight's NIGHT Gains 86% as CTO Outlines Private Contract Upgrade" (1 Oct 2026) — https://36crypto.com/midnights-night-gains-86-as-cto-outlines-private-contract-upgrade/ — accessed 2026-10-02
12. CoinMarketCap (AI summary), "Latest Midnight News" — https://coinmarketcap.com/cmc-ai/midnight-network/latest-updates/ — accessed 2026-10-02 (secondary, low weight)
13. DEV Community, "DUST Sponsorship on Midnight: How One Wallet Pays Fees for Another User's Transaction" — https://dev.to/devroy/dust-sponsorship-on-midnight-how-one-wallet-pays-fees-for-another-users-transaction-1gmc — accessed 2026-10-02
14. W3C News, "The Verifiable Credentials 2.0 family of specifications is now a W3C Recommendation" — https://www.w3.org/news/2025/the-verifiable-credentials-2-0-family-of-specifications-is-now-a-w3c-recommendation — seen in search 2026-10-02
15. W3C, Data Integrity BBS Cryptosuites v1.0 (CRD, 10 Sep 2026) — https://www.w3.org/TR/vc-di-bbs/ — accessed 2026-10-02
16. RFC 9901, Selective Disclosure for JSON Web Tokens — https://www.rfc-editor.org/rfc/rfc9901.html — seen in search 2026-10-02
17. IETF, draft-ietf-oauth-sd-jwt-vc-14 — https://datatracker.ietf.org/doc/html/draft-ietf-oauth-sd-jwt-vc-14 — seen in search 2026-10-02
18. OpenID Foundation, OpenID for Verifiable Presentations 1.0 (Final, 9 Jul 2025) — https://openid.net/specs/openid-4-verifiable-presentations-1_0.html — accessed 2026-10-02
19. EADTrust, "EUDI Wallet: December 2026 Deadline" (updated 29 Sep 2026) — https://www.eadtrust.eu/en/blog/december-2026-deadline-eudi-wallet/ — accessed 2026-10-02
20. EUDI ARF discussion topic G, "Zero Knowledge Proof" (v1.4) — https://eudi.dev/latest/discussion-topics/g-zero-knowledge-proof/ — accessed 2026-10-02
21. Google, "Now open source: our Zero-Knowledge Proof (ZKP) libraries for age assurance" (3 Jul 2025) — https://blog.google/innovation-and-ai/technology/safety-security/opening-up-zero-knowledge-proof-technology-to-promote-privacy-in-age-assurance/ — accessed 2026-10-02
22. Google Wallet developers, "Online Acceptance of Digital Credentials" — https://developers.google.com/wallet/identity/verify/accepting-ids-from-wallet-online — seen in search 2026-10-02
23. GitHub eu-digital-identity-wallet/av-lib-ios-longfellow-zkp — https://github.com/eu-digital-identity-wallet/av-lib-ios-longfellow-zkp — seen in search 2026-10-02
24. Reclaim Protocol homepage and pricing — https://www.reclaimprotocol.org/ — accessed 2026-10-02
25. Reclaim Protocol blog, "Turbocharged Zero-Knowledge Proofs for Mobile" — https://blog.reclaimprotocol.org/posts/gnark-migration — seen in search 2026-10-02
26. TLSNotary blog, "Proxy mode benchmarks" (10 May 2026) — https://tlsnotary.org/blog/2026/05/10/blog-proxy-mode/ — accessed 2026-10-02
27. GitHub tlsnotary/tlsn releases — https://github.com/tlsnotary/tlsn/releases — seen in search 2026-10-02
28. zkPass docs, Introduction — https://docs.zkpass.org/overview/introduction — seen in search 2026-10-02
29. The Block, "Opacity Network raises $12 million seed round" — https://www.theblock.co/post/321160/opacity-network-funding-zk-data-verification — seen in search 2026-10-02
30. Biometric Update, "Billions app launches for privacy-preserving ID verification with Privado liveness" — https://www.biometricupdate.com/202506/billions-app-launches-for-privacy-preserving-id-verification-with-privado-liveness — seen in search 2026-10-02
31. Semaphore documentation — https://docs.semaphore.pse.dev/ — seen in search 2026-10-02
32. Mopro, Performance and Benchmarks — https://zkmopro.org/docs/0.2/performance/ — accessed 2026-10-02
33. Succinct blog, "SP1 Hypercube: Proving Ethereum in Real-Time" — https://blog.succinct.xyz/sp1-hypercube/ — seen in search 2026-10-02
34. The Defiant, "Aztec Launches Alpha Network, Ethereum's First L2 for Private Smart Contracts" — https://thedefiant.io/news/blockchains/aztec-launches-alpha-network-ethereum-s-first-l2-for-private-smart-contracts — accessed 2026-10-02
35. Apple Developer, "Establishing your app's integrity" (App Attest) — https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity — accessed 2026-10-02
36. Android Developers, Play Integrity API overview — https://developer.android.com/google/play/integrity/overview — accessed 2026-10-02
37. Garmin Connect Developer Program Agreement (PDF) — https://www8.garmin.com/en-US/GARMINCONNECTDEVELOPERPROGRAMAGREEMENT/GARMINCONNECTDEVELOPERPROGRAMAGREEMENT_EN.pdf — accessed 2026-10-02
38. EDPB, Guidelines 02/2025 on processing of personal data through blockchain technologies, v2.0 (adopted 7 Jul 2026) — https://www.edpb.europa.eu/system/files/2026-07/edpb_guidelines_202502_blockchain_v2_en.pdf — accessed 2026-10-02
39. EDPB news, "EDPB sheds light on anonymisation and web scraping for generative AI and adopts final version of guidelines on blockchain" (8 Jul 2026) — https://www.edpb.europa.eu/news/edpb-sheds-light-on-anonymisation-and-web-scraping-for-generative-ai-and-adopts-final-version_en — accessed 2026-10-02
