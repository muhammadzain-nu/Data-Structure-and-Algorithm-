import type { Lesson } from "../lesson-types";

export const lesson: Lesson = {
  slug: "hashing",
  title: "Hashing & Collision Resolution",
  tagline: "How we get O(1) lookups — and how it falls apart when we don't.",
  overview: {
    what: "Hashing maps keys to array indices via a hash function. A hash table stores (key, value) pairs in slots indexed by the hash, providing average O(1) insert, lookup, and delete. When two keys hash to the same slot — a collision — we resolve it by chaining (linked list per slot) or open addressing (probe to next empty slot). Rehashing rebuilds the table at a larger size when load factor grows too high.",
    why: "Hash tables are the most-used data structure in production code: std::unordered_map, HashMap, dict, JavaScript objects, Python sets, Redis, every cache layer. Understanding why they hit O(1) average and O(n) worst (and how to keep your hashes friendly) is essential for performance debugging.",
    applications: [
      "Symbol tables in compilers and interpreters",
      "Database indexes (hash indexes for equality lookup)",
      "Caches (LRU, memcached, Redis)",
      "Set membership, deduplication",
      "Bloom filters, distributed hashing (consistent hashing, CDN, sharding)",
    ],
    prerequisites: ["Modular arithmetic", "Arrays and linked lists (for chaining)", "Big-O including amortized analysis"],
  },
  outcomes: [
    "Define hash function, collision, load factor, and rehashing",
    "Implement chaining and open addressing (linear, quadratic, double hashing)",
    "Choose a good hash function (avoid clustering, distribute uniformly)",
    "Analyze expected lookup time as a function of load factor",
    "Implement dynamic resizing when load factor exceeds a threshold",
  ],
  concept: [
    { heading: "Hash function basics", body: "h: K → {0, 1, ..., m-1}. Properties of a good hash: deterministic, fast to compute, distributes uniformly across slots, uses all bits of the key. Common: h(k) = k mod m (m prime); h(k) = ⌊m(kA mod 1)⌋ (multiplicative); for strings: polynomial rolling hash with a prime base." },
    { heading: "Why m should be prime", body: "If m is a power of 2, h(k) = k mod m only uses the low bits of k. If keys have low-bit structure (e.g. all even), clustering is severe. A prime m mixes all bits and is more robust to patterns." },
    { heading: "Load factor α", body: "α = n / m (number of elements / number of slots). For chaining, expected chain length is α; lookup is O(1 + α). For open addressing, expected probes ≈ 1/(1 - α). Industry-standard threshold for resize: α > 0.75 (Java HashMap) or α > 0.5–0.7 (open addressing)." },
    { heading: "Collision resolution — chaining", body: "Each slot stores a linked list (or dynamic array) of entries. Insert: hash → append (or check duplicate). Lookup: hash → walk the list comparing keys. Simple, no clustering issues, but with cache cost from pointer chasing." },
    { heading: "Open addressing — probe sequences", body: "Linear: h(k, i) = (h(k) + i) mod m. Simple, but primary clustering — long runs of occupied slots form. Quadratic: h(k, i) = (h(k) + c1·i + c2·i²) mod m. Reduces primary clustering but introduces secondary. Double hashing: h(k, i) = (h1(k) + i·h2(k)) mod m. Best distribution; h2(k) must be nonzero and coprime to m." },
    { heading: "Lazy deletion in open addressing", body: "Cannot just mark slot empty — would break search for keys that probed past it. Use a tombstone marker: slot is empty for insertion but treated as occupied for search. Rehash periodically to clean tombstones." },
    { heading: "Rehashing", body: "When α exceeds threshold, allocate a new table of size ~2m (next prime), re-insert every element using the new hash. Amortized O(1) per insert if doubling. Without rehashing, performance degrades unbounded as n grows." },
    { heading: "Worst case", body: "All keys hash to the same slot → O(n) per operation. Mitigations: cryptographic-ish hash for adversarial input (preventing DoS); SipHash is used by Python and Rust by default. Java HashMap switches chains to red-black trees beyond a threshold." },
  ],
  visual: [
    { title: "Chaining visualization", description: "Array of slots, each with a linked list dangling below. Inserting a key animates the hash computation, the chosen slot lighting up, and the new node attaching at the head of its chain." },
    { title: "Linear probing animation", description: "Same array; collisions cause the inserted node to walk right slot-by-slot until finding empty. Primary clustering becomes visible as runs lengthen." },
    { title: "Quadratic vs linear vs double hashing", description: "Three side-by-side tables with identical inputs. Watch clustering form on linear, mild on quadratic, near-uniform on double hashing." },
    { title: "Rehashing event", description: "Load factor meter climbs as elements insert; at threshold, the table doubles, every element rehashes to its new slot. Cost spike then amortizes away." },
    { title: "Hash distribution heatmap", description: "Pick a hash function; insert 1000 keys. A heatmap shows occupancy per slot. Bad hashes show hot spots; good ones look uniform." },
  ],
  code: [
    {
      lang: "cpp",
      title: "C++ — Hash table with separate chaining",
      code: `template <typename K, typename V>
class HashMap {
    struct Entry { K key; V val; };
    std::vector<std::list<Entry>> table;
    size_t n = 0;
    constexpr static double MAX_LOAD = 0.75;

    size_t idx(const K& k) const {
        return std::hash<K>{}(k) % table.size();
    }
    void rehash(size_t newCap) {
        std::vector<std::list<Entry>> old = std::move(table);
        table.assign(newCap, {});
        n = 0;
        for (auto& bucket : old)
            for (auto& e : bucket) put(e.key, e.val);
    }
public:
    HashMap(size_t cap = 16) : table(cap) {}

    void put(const K& k, const V& v) {
        auto& bucket = table[idx(k)];
        for (auto& e : bucket)
            if (e.key == k) { e.val = v; return; }
        bucket.push_back({k, v});
        ++n;
        if ((double)n / table.size() > MAX_LOAD) rehash(table.size() * 2);
    }

    bool get(const K& k, V& out) const {
        for (auto& e : table[idx(k)])
            if (e.key == k) { out = e.val; return true; }
        return false;
    }

    bool erase(const K& k) {
        auto& bucket = table[idx(k)];
        for (auto it = bucket.begin(); it != bucket.end(); ++it)
            if (it->key == k) { bucket.erase(it); --n; return true; }
        return false;
    }
};`,
      explain: "Each bucket is a std::list. put first checks for an existing key (update), then appends. Load factor monitored after each insert.",
    },
    {
      lang: "cpp",
      title: "C++ — Open addressing with linear probing & tombstones",
      code: `template <typename K, typename V>
class OAMap {
    enum State { EMPTY, OCC, TOMB };
    struct Slot { K key; V val; State st = EMPTY; };
    std::vector<Slot> t;
    size_t n = 0;
    size_t idx(const K& k) const { return std::hash<K>{}(k) % t.size(); }
public:
    OAMap(size_t cap = 16) : t(cap) {}

    void put(K k, V v) {
        if ((double)n / t.size() > 0.5) rehash();
        size_t i = idx(k);
        while (t[i].st == OCC && !(t[i].key == k)) i = (i + 1) % t.size();
        if (t[i].st != OCC) ++n;
        t[i] = {k, v, OCC};
    }

    bool get(const K& k, V& out) const {
        size_t i = idx(k), start = i;
        while (t[i].st != EMPTY) {
            if (t[i].st == OCC && t[i].key == k) { out = t[i].val; return true; }
            i = (i + 1) % t.size();
            if (i == start) break;
        }
        return false;
    }

    bool erase(const K& k) {
        size_t i = idx(k), start = i;
        while (t[i].st != EMPTY) {
            if (t[i].st == OCC && t[i].key == k) { t[i].st = TOMB; --n; return true; }
            i = (i + 1) % t.size();
            if (i == start) break;
        }
        return false;
    }

private:
    void rehash() {
        std::vector<Slot> old = std::move(t);
        t.assign(old.size() * 2, {});
        n = 0;
        for (auto& s : old) if (s.st == OCC) put(s.key, s.val);
    }
};`,
      explain: "Tombstones prevent the search from terminating early past deleted keys. Lower load factor threshold (0.5) for open addressing because performance degrades sharply near full.",
    },
    {
      lang: "java",
      title: "Java — Polynomial rolling hash for strings",
      code: `static long hash(String s, long base, long mod) {
    long h = 0;
    for (int i = 0; i < s.length(); i++)
        h = (h * base + s.charAt(i)) % mod;
    return h;
}
// Typical choice: base = 31, mod = 1_000_000_007 (or a Mersenne prime)`,
      explain: "Polynomial hashing treats the string as a base-31 number mod a large prime. Used in Rabin-Karp substring search.",
    },
  ],
  complexity: [
    { operation: "Insert / Lookup / Delete (chaining, α ≤ 0.75)", best: "O(1)", average: "O(1)", worst: "O(n) all collide", space: "O(n)" },
    { operation: "Insert / Lookup / Delete (open addressing, α ≤ 0.5)", best: "O(1)", average: "≈ 1/(1-α)", worst: "O(n)", space: "O(n)" },
    { operation: "Rehash", best: "O(n)", average: "O(n) amortized to O(1)", worst: "O(n) on the resizing insert", space: "O(n)" },
    { operation: "Build a hash set from n items", best: "O(n)", average: "O(n)", worst: "O(n²) on adversarial input", space: "O(n)" },
  ],
  comparisons: [
    {
      a: "Chaining",
      b: "Open Addressing",
      rows: [
        { criterion: "Memory per entry", a: "Higher (pointers)", b: "Lower" },
        { criterion: "Cache friendliness", a: "Poor (pointer chasing)", b: "Excellent" },
        { criterion: "Load factor tolerance", a: "Up to ~0.75 or even >1", b: "Must stay < 0.75 (ideally < 0.5)" },
        { criterion: "Deletion", a: "Trivial (remove from list)", b: "Needs tombstones" },
      ],
    },
    {
      a: "Linear Probing",
      b: "Double Hashing",
      rows: [
        { criterion: "Implementation", a: "Trivial", b: "Two hash functions" },
        { criterion: "Cache", a: "Best (sequential)", b: "Worst (jumps)" },
        { criterion: "Clustering", a: "Severe primary", b: "Minimal" },
        { criterion: "Theoretical performance", a: "Degrades fast as α → 1", b: "Closest to uniform hashing" },
      ],
    },
  ],
  worked: [
    {
      difficulty: "Easy",
      question: "Hash table of size 7 with h(k) = k mod 7. Insert 50, 700, 76, 85, 92. Show the table using separate chaining.",
      solution: "h(50)=1, h(700)=0, h(76)=6, h(85)=1, h(92)=1. Buckets: [0]→700, [1]→50→85→92, [6]→76. Others empty.",
    },
    {
      difficulty: "Medium",
      question: "Same inputs with linear probing on table size 7. Show final table.",
      solution: "Insert 50 at 1. 700 at 0. 76 at 6. 85 → slot 1 occupied → probe 2 (empty) → place 85. 92 → slot 1 → 2 (occupied) → 3 (empty) → place 92. Final: [0]700, [1]50, [2]85, [3]92, [6]76.",
    },
    {
      difficulty: "Hard",
      question: "Show that expected number of probes for unsuccessful search in a hash table with uniform hashing is 1/(1-α).",
      solution: "Sum over i = 0,1,... of probability that first i probes hit occupied slots: (n/m) · ((n-1)/(m-1)) · ... · ((n-i+1)/(m-i+1)) ≤ α^i. Expected probes = Σ α^i = 1/(1 - α). For α = 0.5: 2 probes; α = 0.9: 10 probes — explosion as α → 1.",
    },
  ],
  practice: {
    easy: [
      { q: "Hash 'apple', 'banana', 'cherry' using a simple sum-of-chars mod 13. Identify any collision." },
      { q: "Implement a hash set for ints with chaining and table size 11." },
      { q: "Compute load factor for a table with size 16 and n=12 elements." },
      { q: "What happens if hash function returns negative integers? Show a fix." },
      { q: "Build a frequency counter for an input string using a hash map." },
    ],
    medium: [
      { q: "Implement quadratic probing with c1=0, c2=1. When does it fail to find an empty slot even when one exists?" },
      { q: "Implement rehashing when load factor exceeds 0.75; double the table to the next prime." },
      { q: "Detect and prevent insertion of duplicate keys." },
      { q: "Build a two-sum solver using a hash map in O(n)." },
      { q: "Implement an LRU cache using HashMap + doubly linked list." },
    ],
    hard: [
      { q: "Implement Cuckoo hashing with two hash functions and re-insert chain handling." },
      { q: "Implement Robin Hood hashing (linear probing variant minimizing variance)." },
      { q: "Design a consistent hashing ring for distributing keys across N servers." },
      { q: "Implement a Bloom filter with k hash functions; analyze false-positive rate." },
      { q: "Build a Rabin-Karp substring search using polynomial rolling hash." },
    ],
    fast: [
      { q: "FAST exam-style: Insert keys 89, 18, 49, 58, 69 into a size-10 table using linear probing. Show the final table." },
      { q: "Same keys using double hashing with h1(k) = k mod 10 and h2(k) = 7 − (k mod 7). Show the final table." },
      { q: "Justify choosing a prime table size. Provide a counter-example with size 8 showing severe clustering." },
    ],
    interview: [
      { q: "Design Twitter's timeline cache using sharded hash tables. Discuss consistent hashing for resharding." },
      { q: "Detect the first non-repeating character in a string in O(n)." },
    ],
  },
  challenges: [
    { q: "Implement Hopscotch hashing and compare empirically vs linear probing on uniform and skewed inputs." },
    { q: "Dry-run: insert 20 random ints into a size-7 table with linear probing. Plot probe length distribution." },
    { q: "Debug: a candidate's open-addressing erase clears the slot directly; lookups then fail. Identify and fix using tombstones." },
  ],
  interactive: [
    { title: "Hash function lab", description: "Pick a hash, an input distribution, and a table size; visualize occupancy heatmap and collision rate." },
    { title: "Probe sequence explorer", description: "Insert keys; toggle linear / quadratic / double hashing; arrows trace each probe path." },
    { title: "Resize animation", description: "Watch load factor rise; at threshold the table doubles and every key animates to its new home." },
  ],
  assessment: {
    mcqs: [
      { q: "Load factor α =", options: ["m / n", "n / m", "n + m", "log(n)/log(m)"], answer: 1 },
      { q: "Linear probing primarily suffers from:", options: ["Secondary clustering", "Primary clustering", "Memory overhead", "Slow hash computation"], answer: 1 },
      { q: "Why use a prime table size?", options: ["Smaller memory", "Better distribution of keys", "Faster modular arithmetic", "Easier to implement"], answer: 1 },
      { q: "What does rehashing do?", options: ["Sorts the table", "Reduces collisions by doubling table & reinserting", "Changes the hash function", "Deletes old entries"], answer: 1 },
      { q: "Open addressing requires:", options: ["Linked lists", "Tombstone markers for deletion", "Two hash functions only", "Prime number of entries"], answer: 1 },
    ],
    truefalse: [
      { q: "Average lookup in a well-designed hash table is O(1).", answer: true },
      { q: "Worst-case lookup in a hash table is always O(1).", answer: false },
      { q: "Chaining handles high load factors better than open addressing.", answer: true },
      { q: "Java's HashMap uses red-black trees for long chains.", answer: true },
    ],
    coding: [
      { q: "Implement put, get, erase for a chaining hash map with dynamic resize at α > 0.75." },
      { q: "Implement linear probing with tombstone deletion." },
    ],
    dryrun: [
      { q: "Insert 7, 17, 27, 37, 47 into size-10 table with h(k)=k%10. Show table with linear and with quadratic probing." },
      { q: "Trace insert of 'cat', 'tac', 'act' if h sums char codes mod 7; identify collisions." },
    ],
    conceptual: [
      { q: "Why does open addressing performance collapse as load factor → 1?" },
      { q: "When would you choose chaining over open addressing?" },
    ],
  },
  commonMistakes: [
    "Choosing a power-of-2 table size with a hash that only uses low bits",
    "Forgetting to handle negative hash values (need abs or unsigned)",
    "Clearing a slot directly in open addressing — breaks subsequent searches",
    "Not resizing on load factor → unbounded degradation",
    "Using a slow hash function (e.g. crypto) on a hot path",
    "Treating hash table as ordered — iteration order is undefined",
  ],
};
