import type { Lesson } from "../lesson-types";

export const lesson: Lesson = {
  slug: "heaps-priority-queues",
  title: "Heaps & Priority Queues",
  tagline: "The 'fastest minimum/maximum' data structure — in O(1).",
  overview: {
    what: "A binary heap is a complete binary tree that satisfies the heap property: in a max-heap, every parent ≥ its children; in a min-heap, every parent ≤ its children. Stored as an array (parent at i, children at 2i+1 and 2i+2), it gives O(1) access to the min/max and O(log n) insert and extract. A Priority Queue (PQ) is an ADT whose 'next' element is always the highest-priority one — binary heaps are the standard implementation.",
    why: "Priority queues power Dijkstra's shortest path, Prim's MST, Huffman coding, A* pathfinding, OS process scheduling, event-driven simulations, top-k queries, and median streams. Heapsort gives an in-place O(n log n) sort. Building a heap in O(n) from an arbitrary array is one of the most elegant analyses in DSA.",
    applications: [
      "Dijkstra's & Prim's algorithms with O((V+E) log V)",
      "Huffman coding for compression",
      "OS schedulers (priority-based)",
      "Streaming median / top-k via two heaps",
      "Event-driven simulation queues",
    ],
    prerequisites: ["Arrays", "Binary trees (concept of complete tree)", "Big-O on tree operations"],
  },
  outcomes: [
    "Map a complete binary tree onto an array using index arithmetic",
    "Implement heap insert (sift-up) and extract (sift-down)",
    "Build a heap in O(n) using bottom-up heapify",
    "Implement heapsort in-place in O(n log n)",
    "Use a priority queue to solve top-k, median maintenance, and shortest path problems",
  ],
  concept: [
    { heading: "Complete binary tree as array", body: "Node at index i: parent = (i-1)/2, left child = 2i+1, right child = 2i+2. The tree fills level by level, left to right — no holes. Storage is contiguous: no pointers, excellent cache locality." },
    { heading: "Heap property", body: "Max-heap: A[parent(i)] ≥ A[i]. Min-heap: A[parent(i)] ≤ A[i]. The root holds the max (or min) — but the heap is NOT sorted; only the parent-child ordering is enforced." },
    { heading: "Insert (sift-up)", body: "Append the new element at the end (last array slot). Compare with parent; if heap-property violated, swap. Repeat until at root or parent OK. Path length ≤ tree height = O(log n)." },
    { heading: "Extract-max / extract-min (sift-down)", body: "Save A[0] as result. Move the last element to position 0 (filling the hole). Sift-down: compare with the larger child (max-heap); swap if violated; repeat. O(log n)." },
    { heading: "Build-heap in O(n)", body: "Naive: insert n times → O(n log n). Optimal: start from the last non-leaf (index n/2 - 1) and sift-down to index 0. Each sift-down costs O(h_i) where h_i is the height of subtree rooted at i. Sum: Σ h_i ≤ n. This is the classic 'why is it O(n) and not O(n log n)?' analysis." },
    { heading: "Heapsort", body: "Build a max-heap from the array in O(n). Repeatedly swap A[0] with A[n-1], shrink heap by 1, sift-down A[0]. After n-1 iterations, array is sorted ascending. In-place, O(n log n) worst case, but poor cache locality vs quicksort, and not stable." },
    { heading: "Priority queue ADT", body: "Interface: insert(x, priority), extractMax (or Min), peek, decreaseKey(node, newPriority), size. Common implementations: binary heap (textbook), pairing heap (fast in practice), Fibonacci heap (theoretical O(1) decreaseKey)." },
    { heading: "Decrease-key for Dijkstra", body: "When a shorter path is found, the vertex's priority decreases. With a binary heap, this is O(log n) if you can locate the node (store positions in an external array). Many implementations push duplicates and ignore stale entries — simpler, still O(E log V)." },
  ],
  visual: [
    { title: "Array ↔ tree mapping", description: "Side-by-side array and tree. Hovering an array cell highlights the corresponding tree node and vice versa; index arithmetic appears in tooltips." },
    { title: "Sift-up animation", description: "New element appears at the bottom-right; arrows trace the swap-with-parent path, with the violation highlighted in red until restored." },
    { title: "Sift-down animation", description: "Root replaced with last element. The 'hole' walks down, swapping with the larger child; bars rearrange as the heap-property propagates." },
    { title: "Build-heap O(n) demonstration", description: "Start with a random array. The cursor moves from index n/2-1 to 0; at each, sift-down animates. A running cost counter stays bounded by 2n." },
    { title: "Heapsort step-through", description: "Phase 1: build-heap shown. Phase 2: extract-and-place-at-end loop. The sorted suffix paints green and grows leftward." },
    { title: "Two-heaps median demo", description: "A max-heap (lower half) and min-heap (upper half) side by side. Each new number routes to one; rebalance if sizes differ by 2. Median = top of larger heap or average." },
  ],
  code: [
    {
      lang: "cpp",
      title: "C++ — Max-heap with all core operations",
      code: `class MaxHeap {
    std::vector<int> a;
    void siftUp(int i) {
        while (i > 0) {
            int p = (i - 1) / 2;
            if (a[p] >= a[i]) break;
            std::swap(a[p], a[i]);
            i = p;
        }
    }
    void siftDown(int i) {
        int n = a.size();
        while (true) {
            int l = 2*i + 1, r = 2*i + 2, best = i;
            if (l < n && a[l] > a[best]) best = l;
            if (r < n && a[r] > a[best]) best = r;
            if (best == i) break;
            std::swap(a[i], a[best]);
            i = best;
        }
    }
public:
    void push(int x) { a.push_back(x); siftUp(a.size() - 1); }

    int pop() {
        int top = a.front();
        a.front() = a.back();
        a.pop_back();
        if (!a.empty()) siftDown(0);
        return top;
    }

    int peek() const { return a.front(); }
    bool empty() const { return a.empty(); }

    static MaxHeap heapify(std::vector<int> v) {  // O(n) build
        MaxHeap h;
        h.a = std::move(v);
        for (int i = (int)h.a.size() / 2 - 1; i >= 0; --i) h.siftDown(i);
        return h;
    }
};`,
      explain: "Two private helpers — siftUp and siftDown — implement the heap discipline. heapify is O(n) by sifting bottom-up; doing n pushes would be O(n log n).",
    },
    {
      lang: "cpp",
      title: "C++ — In-place Heapsort",
      code: `void siftDown(int* a, int i, int n) {
    while (true) {
        int l = 2*i + 1, r = 2*i + 2, best = i;
        if (l < n && a[l] > a[best]) best = l;
        if (r < n && a[r] > a[best]) best = r;
        if (best == i) return;
        std::swap(a[i], a[best]);
        i = best;
    }
}

void heapSort(int* a, int n) {
    for (int i = n/2 - 1; i >= 0; --i) siftDown(a, i, n);   // build max-heap
    for (int end = n - 1; end > 0; --end) {
        std::swap(a[0], a[end]);            // largest to its sorted slot
        siftDown(a, 0, end);                 // restore heap on shrunk array
    }
}`,
      explain: "Two phases: O(n) build, then n-1 extractions each O(log n) → O(n log n). In-place, but not stable.",
    },
    {
      lang: "java",
      title: "Java — Streaming median with two heaps",
      code: `class MedianStream {
    PriorityQueue<Integer> lo = new PriorityQueue<>(Comparator.reverseOrder()); // max-heap
    PriorityQueue<Integer> hi = new PriorityQueue<>();                          // min-heap

    public void add(int x) {
        if (lo.isEmpty() || x <= lo.peek()) lo.add(x); else hi.add(x);
        // rebalance: lo.size() must be hi.size() or hi.size()+1
        if (lo.size() < hi.size()) lo.add(hi.poll());
        else if (lo.size() > hi.size() + 1) hi.add(lo.poll());
    }

    public double median() {
        if (lo.size() == hi.size()) return (lo.peek() + hi.peek()) / 2.0;
        return lo.peek();
    }
}`,
      explain: "Lower half kept as max-heap (so lo.peek() is the largest of the small ones); upper half as min-heap. Sizes balanced so lo has either equal count or one extra.",
    },
  ],
  complexity: [
    { operation: "Insert (push)", best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(n)" },
    { operation: "Extract max/min (pop)", best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(n)" },
    { operation: "Peek", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)" },
    { operation: "Build-heap (heapify)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)" },
    { operation: "Heapsort", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(1)" },
    { operation: "DecreaseKey (binary heap)", best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "—" },
  ],
  comparisons: [
    {
      a: "Heap",
      b: "BST",
      rows: [
        { criterion: "Max/min access", a: "O(1)", b: "O(log n)" },
        { criterion: "Search arbitrary key", a: "O(n)", b: "O(log n)" },
        { criterion: "Storage", a: "Array, no pointers", b: "Pointers" },
        { criterion: "Use case", a: "Priority queue, scheduling", b: "Ordered map" },
      ],
    },
    {
      a: "Heapsort",
      b: "Quicksort",
      rows: [
        { criterion: "Worst case", a: "O(n log n)", b: "O(n²)" },
        { criterion: "Cache friendliness", a: "Poor", b: "Excellent" },
        { criterion: "Stable", a: "No", b: "No (standard)" },
        { criterion: "Practical speed", a: "Slower", b: "Faster" },
      ],
    },
  ],
  worked: [
    {
      difficulty: "Easy",
      question: "Insert 5, 3, 9, 1, 7 into an empty max-heap. Show the array after each insertion.",
      solution: "[5]. [5,3]. [9,3,5] (sift-up). [9,3,5,1]. [9,7,5,1,3] (insert 7 at end → sift-up: 7>3 swap → 7 at index 1).",
    },
    {
      difficulty: "Medium",
      question: "Prove that build-heap is O(n).",
      solution: "A heap of size n has at most ⌈n/2^(h+1)⌉ nodes at height h. Sift-down cost at height h is O(h). Total: Σ_{h=0..log n} ⌈n/2^(h+1)⌉ · O(h) = O(n · Σ h/2^h) = O(n · 2) = O(n). The convergent series Σ h/2^h = 2 is the key.",
    },
    {
      difficulty: "Hard",
      question: "Given an unsorted array of n ints, find the k largest in O(n log k) using a min-heap.",
      solution: "Maintain a min-heap of size at most k. For each element x: if heap size < k, push x. Else if x > heap.peek(), pop, push x. After processing all n, heap contains the k largest. Time: O(n log k). Space: O(k). Beats sort (O(n log n)) when k << n.",
    },
  ],
  practice: {
    easy: [
      { q: "Write parent(i), left(i), right(i) index formulas." },
      { q: "Convert array [4, 10, 3, 5, 1] into a max-heap; show steps." },
      { q: "Extract the max twice from a heap; show the resulting array." },
      { q: "Implement isMaxHeap(arr) verifying the property." },
      { q: "Use std::priority_queue / PriorityQueue to sort an array." },
    ],
    medium: [
      { q: "Implement decreaseKey(i, newVal) on a min-heap; identify edge cases." },
      { q: "Solve: given a stream of integers, return the k-th largest element seen so far on each new addition." },
      { q: "Merge k sorted arrays in O(N log k) where N is total elements." },
      { q: "Convert a max-heap to a min-heap in O(n)." },
      { q: "Implement a heap-based priority queue with custom comparator." },
    ],
    hard: [
      { q: "Implement Dijkstra's shortest path using a min-heap; handle the 'stale entry' optimization." },
      { q: "Build a Huffman coding tree for a given character frequency table." },
      { q: "Implement a meldable heap (pairing heap or skew heap) supporting O(log n) amortized meld." },
      { q: "Solve the 'sliding window median' problem in O(n log k)." },
      { q: "Given a binary heap, find the k-th smallest element in O(k log k)." },
    ],
    fast: [
      { q: "FAST exam-style: Apply build-heap on [21, 5, 6, 1, 3, 14, 11, 8, 10, 9]. Show the heap after each sift-down." },
      { q: "Implement heapSort and trace its operation on [4, 10, 3, 5, 1]." },
      { q: "Compare heapsort and quicksort on n=10⁶ random ints; estimate which is faster in practice and why, despite same big-O." },
    ],
    interview: [
      { q: "Find the median of a data stream with O(log n) per insertion and O(1) median query." },
      { q: "Given a nearly-sorted array (every element within k positions of sorted), sort it in O(n log k)." },
    ],
  },
  challenges: [
    { q: "Implement a Fibonacci heap supporting O(1) amortized insert and decreaseKey." },
    { q: "Dry-run heapify on [21,5,6,1,3,14,11,8,10,9]; count comparisons and swaps." },
    { q: "Debug: a candidate's siftDown uses left child only when both children violate, producing a corrupt heap. Identify and fix." },
  ],
  interactive: [
    { title: "Heap builder", description: "Insert keys via input; tree and array views update in lockstep with each sift-up highlighted." },
    { title: "Heapsort race", description: "Race heapsort against quicksort on the same array; counters of comparisons and swaps shown live." },
    { title: "Median stream simulator", description: "Add numbers; two heaps animate the rebalance; median updates with each insertion." },
  ],
  assessment: {
    mcqs: [
      { q: "Index of left child of node at index i (0-indexed):", options: ["2i", "2i+1", "2i-1", "i/2"], answer: 1 },
      { q: "Build-heap time complexity:", options: ["O(n)", "O(n log n)", "O(log n)", "O(n²)"], answer: 0 },
      { q: "Heapsort space complexity:", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], answer: 2 },
      { q: "A max-heap stores the maximum at:", options: ["The last index", "The root", "Any leaf", "The middle"], answer: 1 },
      { q: "Decrease-key in a binary heap costs:", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 1 },
    ],
    truefalse: [
      { q: "A heap is always a complete binary tree.", answer: true },
      { q: "A sorted array is always a valid max-heap.", answer: false, explain: "Sorted descending → yes; ascending → no." },
      { q: "Heapsort is stable.", answer: false },
      { q: "The k-th largest element can be found in O(n log k) using a min-heap of size k.", answer: true },
    ],
    coding: [
      { q: "Implement insert, extractMax, and heapify on an integer max-heap." },
      { q: "Implement the streaming median problem using two heaps." },
    ],
    dryrun: [
      { q: "Heapify [3, 9, 2, 1, 4, 5] into a max-heap; show array after each step." },
      { q: "Heapsort the resulting heap; show array after each extraction." },
    ],
    conceptual: [
      { q: "Why is build-heap O(n) but n successive inserts O(n log n)?" },
      { q: "Why is a heap not used for general search?" },
    ],
  },
  commonMistakes: [
    "Mixing up parent/child index formulas (off-by-one)",
    "Sifting down to the smaller child in a max-heap (or larger in min-heap)",
    "Calling extract on empty heap without checking",
    "Doing n inserts and reporting O(n) build time",
    "Forgetting to shrink the heap when extracting (heapsort)",
    "Assuming heap is sorted — it isn't",
  ],
};
