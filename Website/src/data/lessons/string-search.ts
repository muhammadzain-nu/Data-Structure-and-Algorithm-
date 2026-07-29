import type { Lesson } from "../lesson-types";

export const lesson: Lesson = {
  slug: "string-search",
  title: "String Search Algorithms",
  tagline: "From the naive O(nm) to KMP's linear-time elegance.",
  overview: {
    what: "Given a text T of length n and a pattern P of length m, find all occurrences of P in T. Brute force scans every position. Rabin-Karp uses hashing to skip quickly. Boyer-Moore exploits bad-character and good-suffix heuristics — sublinear in many practical cases. Knuth-Morris-Pratt (KMP) preprocesses P to avoid re-comparing already-matched characters, giving O(n+m) worst case.",
    why: "Every grep, every find-in-file, every IDE search, every web search, every DNA matcher, every spam filter, every plagiarism detector uses one of these algorithms. KMP and Z-algorithm appear in nearly every competitive programming contest. Boyer-Moore's variants are baked into gnu grep and most production string-search libraries.",
    applications: [
      "grep, find-in-file, IDE 'Find in project'",
      "DNA/protein sequence matching",
      "Plagiarism detection",
      "Intrusion detection signatures",
      "Distributed dedup and content-aware chunking",
    ],
    prerequisites: ["Arrays and indexing", "Modular arithmetic (Rabin-Karp)", "Loop invariants"],
  },
  outcomes: [
    "Implement brute force, Rabin-Karp, Boyer-Moore, and KMP",
    "Compute the KMP failure function for a pattern",
    "Compute the bad-character table for Boyer-Moore",
    "Analyze average vs worst-case behavior of each algorithm",
    "Choose the right algorithm for a given alphabet size and pattern length",
  ],
  concept: [
    { heading: "Brute force", body: "For each starting position i in T (0 ≤ i ≤ n-m), compare P[0..m-1] with T[i..i+m-1]. On mismatch, advance i by 1. Worst case O(nm) — e.g. T = 'aaaa...a', P = 'aaab' — comparison runs m chars at every shift. Average O(n) on random text but pathological on repetitive patterns." },
    { heading: "Rabin-Karp", body: "Compute a rolling hash of the first window T[0..m-1] and of P. Compare hashes — if equal, verify with char-by-char (to handle hash collisions). Slide window by one: subtract leaving char's contribution, multiply by base, add entering char. O(n+m) expected; O(nm) worst with adversarial hash collisions. Excellent for multi-pattern search and substring sets." },
    { heading: "Boyer-Moore intuition", body: "Compare pattern with text from RIGHT to LEFT. On mismatch, use two heuristics to shift the pattern far right: (1) bad-character: align the mismatched text char with its rightmost occurrence in P. (2) good-suffix: align the matched suffix with its previous occurrence in P. Best case O(n/m) — sublinear! Worst case O(nm) without enhancements; with Galil rule, worst case O(n)." },
    { heading: "Bad-character heuristic", body: "Precompute last[c] = last index where c appears in P (or -1 if absent). On mismatch at P[j] vs T[i+j], shift pattern by max(1, j - last[T[i+j]]). If T[i+j] doesn't appear in P at all, shift past it entirely." },
    { heading: "KMP — failure function", body: "fail[i] = length of the longest proper prefix of P[0..i] that is also a suffix. Computed in O(m). During search, on mismatch at P[j] vs T[i], set j = fail[j-1] (don't advance i). This reuses the work already done. Both pointers never decrease → O(n + m) total." },
    { heading: "Z-algorithm", body: "Computes for each i the length of the longest substring starting at T[i] that matches a prefix of T. Linear time. Search for P in T: build string P + '#' + T; if Z[i] = m for some i > m, occurrence at i - m - 1." },
    { heading: "Aho-Corasick", body: "Multi-pattern generalization of KMP: build a trie of all patterns, add 'failure' links (KMP-style), walk text once. Finds all occurrences of all patterns in O(n + sum |P| + #matches)." },
  ],
  visual: [
    { title: "Brute-force slide", description: "Text and pattern stack vertically. Pattern slides right one position at a time; comparisons paint green (match) or red (mismatch); after a mismatch, the pattern jumps by 1." },
    { title: "Rabin-Karp rolling hash", description: "A 'window' rectangle moves across the text; hash value updates as one char leaves and one enters. When hash equals pattern hash, a verification flicker confirms the match (or reveals a hash collision)." },
    { title: "KMP failure function build", description: "Pattern shown horizontally; a moving cursor computes fail[i] by extending the previous longest prefix-suffix. Arrows visualize the 'fall back' to fail[j-1] on mismatch." },
    { title: "KMP search", description: "Two indices i (text) and j (pattern). On mismatch, j jumps to fail[j-1] (visualized as backward arrow) without touching i. Total i+j-progress is monotone — explains O(n+m)." },
    { title: "Boyer-Moore right-to-left", description: "Pattern overlays text; comparisons start from the right. On mismatch, animate the bad-character shift — pattern jumps far right, sometimes past several positions." },
  ],
  code: [
    {
      lang: "cpp",
      title: "C++ — Brute force and Rabin-Karp",
      code: `void bruteSearch(const std::string& T, const std::string& P) {
    int n = T.size(), m = P.size();
    for (int i = 0; i <= n - m; ++i) {
        int j = 0;
        while (j < m && T[i+j] == P[j]) ++j;
        if (j == m) std::cout << "match at " << i << '\\n';
    }
}

void rabinKarp(const std::string& T, const std::string& P) {
    const long long base = 256, mod = 1000000007LL;
    int n = T.size(), m = P.size();
    if (m > n) return;
    long long pHash = 0, tHash = 0, h = 1;
    for (int i = 0; i < m - 1; ++i) h = (h * base) % mod;
    for (int i = 0; i < m; ++i) {
        pHash = (base * pHash + P[i]) % mod;
        tHash = (base * tHash + T[i]) % mod;
    }
    for (int i = 0; i <= n - m; ++i) {
        if (pHash == tHash) {
            int j = 0;
            while (j < m && T[i+j] == P[j]) ++j;
            if (j == m) std::cout << "match at " << i << '\\n';
        }
        if (i < n - m) {
            tHash = (base * (tHash - T[i] * h) + T[i + m]) % mod;
            if (tHash < 0) tHash += mod;
        }
    }
}`,
      explain: "Brute is a textbook double loop. Rabin-Karp's rolling hash subtracts the leaving character (weighted by h = base^(m-1)) and folds in the entering one — O(1) per shift.",
    },
    {
      lang: "cpp",
      title: "C++ — KMP with failure function",
      code: `std::vector<int> buildFail(const std::string& P) {
    int m = P.size();
    std::vector<int> fail(m, 0);
    int k = 0;
    for (int i = 1; i < m; ++i) {
        while (k > 0 && P[k] != P[i]) k = fail[k-1];
        if (P[k] == P[i]) ++k;
        fail[i] = k;
    }
    return fail;
}

void kmp(const std::string& T, const std::string& P) {
    auto fail = buildFail(P);
    int n = T.size(), m = P.size(), j = 0;
    for (int i = 0; i < n; ++i) {
        while (j > 0 && P[j] != T[i]) j = fail[j-1];
        if (P[j] == T[i]) ++j;
        if (j == m) {
            std::cout << "match at " << i - m + 1 << '\\n';
            j = fail[j-1];
        }
    }
}`,
      explain: "fail[i] = longest proper prefix of P[0..i] equal to a suffix. In search, mismatches use fail[] to slide P forward without re-comparing matched chars. i only advances; j only resets — total O(n+m).",
    },
    {
      lang: "java",
      title: "Java — Boyer-Moore bad-character",
      code: `static int[] badCharTable(String p) {
    int[] last = new int[256];
    Arrays.fill(last, -1);
    for (int i = 0; i < p.length(); i++) last[p.charAt(i)] = i;
    return last;
}

static void bmSearch(String t, String p) {
    int n = t.length(), m = p.length();
    int[] last = badCharTable(p);
    int s = 0;
    while (s <= n - m) {
        int j = m - 1;
        while (j >= 0 && p.charAt(j) == t.charAt(s + j)) j--;
        if (j < 0) {
            System.out.println("match at " + s);
            s += (s + m < n) ? m - last[t.charAt(s + m)] : 1;
        } else {
            s += Math.max(1, j - last[t.charAt(s + j)]);
        }
    }
}`,
      explain: "Compare right-to-left. On mismatch, the bad-character rule shifts the pattern so the mismatched text char aligns with its rightmost occurrence in the pattern.",
    },
  ],
  complexity: [
    { operation: "Brute force", best: "O(n)", average: "O(n+m)", worst: "O(nm)", space: "O(1)" },
    { operation: "Rabin-Karp", best: "O(n+m)", average: "O(n+m)", worst: "O(nm)", space: "O(1)" },
    { operation: "Boyer-Moore (bad-char only)", best: "O(n/m)", average: "Sub-linear in practice", worst: "O(nm)", space: "O(σ)" },
    { operation: "Boyer-Moore (good-suffix + Galil)", best: "O(n/m)", average: "Sub-linear", worst: "O(n)", space: "O(σ+m)" },
    { operation: "KMP", best: "O(n+m)", average: "O(n+m)", worst: "O(n+m)", space: "O(m)" },
    { operation: "Aho-Corasick (k patterns)", best: "O(n+Σm+z)", average: "Same", worst: "Same", space: "O(Σm·σ)" },
  ],
  comparisons: [
    {
      a: "KMP",
      b: "Boyer-Moore",
      rows: [
        { criterion: "Direction", a: "Left to right", b: "Right to left" },
        { criterion: "Worst case", a: "O(n+m) guaranteed", b: "O(nm) without Galil; O(n) with" },
        { criterion: "Average behavior", a: "Linear", b: "Sub-linear (skips many positions)" },
        { criterion: "Best for", a: "Adversarial/repetitive text", b: "Large alphabet, long patterns" },
      ],
    },
    {
      a: "Rabin-Karp",
      b: "KMP",
      rows: [
        { criterion: "Approach", a: "Hashing", b: "Failure function" },
        { criterion: "Multi-pattern", a: "Excellent (precompute hashes)", b: "Use Aho-Corasick" },
        { criterion: "Verification on hash hit", a: "Required (avoid false matches)", b: "Not needed (exact)" },
      ],
    },
  ],
  worked: [
    {
      difficulty: "Easy",
      question: "Run brute-force search for P='ABAB' in T='ABABDABACDABABCABAB'.",
      solution: "Match at index 0 (ABAB). Mismatch at i=1 (B!=A first char). Match at i=2? ABAB vs ABDA — mismatch. Continue. Matches at i=0, i=10, i=15.",
    },
    {
      difficulty: "Medium",
      question: "Build the KMP failure function for P='ABABCABAB'.",
      solution: "P: A B A B C A B A B. fail: 0 0 1 2 0 1 2 3 4. Reasoning: at i=2, A matches P[0] → 1. At i=3, B matches P[1] → 2. At i=4 C, k was 2 (P[2]=A != C); fall back via fail[1]=0; P[0]=A != C → fail[4]=0. Continue similarly.",
    },
    {
      difficulty: "Hard",
      question: "Use KMP to find all occurrences of P='ABABCABAB' in T='ABABDABABCABABCABAB'.",
      solution: "Failure function as above. Walk text: at i=4, mismatch D vs P[4]=C with j=4; j=fail[3]=2; D vs P[2]=A mismatch; j=fail[1]=0; D vs P[0]=A mismatch; i++. Continue and pick up match starting at index 5 ending at i=13, j=9. Then j=fail[8]=4; continue to find overlapping match at index 10. Total: matches at indices 5 and 10.",
    },
  ],
  practice: {
    easy: [
      { q: "Implement brute-force search and count comparisons for T='abcabc' P='cab'." },
      { q: "Compute the rolling hash for window 'abc' with base=31, mod=1e9+7." },
      { q: "Trace bad-character shifts for P='ABC' in T='AABCAABCBC'." },
      { q: "Compute KMP fail for P='AAAA'." },
      { q: "Count occurrences of P in T with overlapping matches allowed." },
    ],
    medium: [
      { q: "Implement Z-algorithm and use it to find all occurrences of P in T." },
      { q: "Solve: find the longest prefix of T that is also a suffix (use KMP fail array)." },
      { q: "Implement Aho-Corasick for 3 patterns in a single text scan." },
      { q: "Solve: check if string A is a rotation of string B in O(n)." },
      { q: "Find the shortest palindrome formed by prepending characters to a given string (use KMP on s + '#' + reverse(s))." },
    ],
    hard: [
      { q: "Implement Boyer-Moore with the good-suffix heuristic in addition to bad-character." },
      { q: "Construct a suffix automaton for the text and use it for pattern queries in O(m)." },
      { q: "Implement Manacher's algorithm for all palindromic substrings in O(n)." },
      { q: "Implement Rabin-Karp with two hash functions to make collisions negligibly rare." },
      { q: "Solve: find all distinct substrings of length k in O(n) using rolling hashes." },
    ],
    fast: [
      { q: "FAST exam-style: Build the failure function for P='AABAACAABAA'. Walk through carefully." },
      { q: "Compare worst-case behavior of KMP vs brute force on T='AAAA...A' (length n) and P='AAAB' (length m=4)." },
      { q: "Implement Rabin-Karp and detect a hash collision by handcrafting two strings that hash identically modulo 13." },
    ],
    interview: [
      { q: "Find the smallest substring of T that contains all characters of P." },
      { q: "Detect if a long DNA string contains any of a list of 1000 short patterns (Aho-Corasick)." },
    ],
  },
  challenges: [
    { q: "Implement Aho-Corasick and benchmark against running KMP k times." },
    { q: "Dry-run KMP search step-by-step for T='ababcabcabababd', P='ababd'." },
    { q: "Debug: a candidate's KMP fail array is off by one. Identify the boundary condition that causes it." },
  ],
  interactive: [
    { title: "KMP visualizer", description: "Type P and T; watch fail array build then animate i and j during search; mismatches snap j back via fail." },
    { title: "Rolling hash playground", description: "Drag a window across the text; see hash value update with mod operations." },
    { title: "Boyer-Moore shift demo", description: "Toggle bad-character / good-suffix; pattern jumps right by the visualized shift on each mismatch." },
  ],
  assessment: {
    mcqs: [
      { q: "Worst case complexity of brute-force string search:", options: ["O(n)", "O(n+m)", "O(nm)", "O(n log m)"], answer: 2 },
      { q: "KMP's worst case is:", options: ["O(nm)", "O(n+m)", "O(n log m)", "O(m²)"], answer: 1 },
      { q: "Rabin-Karp uses:", options: ["Failure function", "Trie", "Rolling hash", "Suffix tree"], answer: 2 },
      { q: "Boyer-Moore compares pattern characters from:", options: ["Left to right", "Right to left", "Middle outward", "Randomly"], answer: 1 },
      { q: "KMP's failure function fail[i] stores:", options: ["Length of longest proper prefix of P[0..i] that is also a suffix", "Position of mismatch", "Hash of substring", "Number of matches"], answer: 0 },
    ],
    truefalse: [
      { q: "Brute-force string search has no preprocessing.", answer: true },
      { q: "Rabin-Karp always finds correct matches with no false positives.", answer: false, explain: "Hash collisions require verification step." },
      { q: "KMP can be modified to find all overlapping matches.", answer: true },
      { q: "Boyer-Moore is preferred for very short patterns over large alphabets.", answer: false, explain: "Best when pattern is long and alphabet large; for short patterns the shift advantage shrinks." },
    ],
    coding: [
      { q: "Implement KMP fully (build + search) and return a list of match indices." },
      { q: "Implement Rabin-Karp with two independent hash functions." },
    ],
    dryrun: [
      { q: "Compute fail array for P='ABABABAA'." },
      { q: "Trace Boyer-Moore on T='ABAAABCD', P='ABC' with bad-character only." },
    ],
    conceptual: [
      { q: "Why is KMP linear and brute force quadratic?" },
      { q: "When does Boyer-Moore degrade to O(nm)?" },
    ],
  },
  commonMistakes: [
    "Confusing 'proper prefix' (excludes the full string) with 'prefix' in KMP",
    "Forgetting the hash verification step in Rabin-Karp",
    "Off-by-one in shifting the window after a match",
    "Using a hash function with too-small modulus and getting frequent collisions",
    "Implementing fail[0] wrong (must be 0)",
    "Forgetting to handle case m > n",
  ],
};
