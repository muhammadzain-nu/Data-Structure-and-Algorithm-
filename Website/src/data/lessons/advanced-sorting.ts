import type { Lesson } from "../lesson-types";

export const lesson: Lesson = {
  slug: "advanced-sorting",
  title: "Advanced Sorting — Merge Sort & Quick Sort",
  tagline: "Divide-and-conquer sorting — the algorithms that beat Θ(n²).",
  overview: {
    what: "Merge sort recursively splits the array in halves, sorts each, and merges them — guaranteed O(n log n) time, O(n) extra space, stable. Quick sort partitions around a pivot and recurses on each side — average O(n log n) in-place, but worst-case O(n²) on adversarial input; not stable in standard form. Together they form the foundation of every production sort routine (Timsort, IntroSort).",
    why: "Almost every real-world sort you'll call is a hybrid of these two ideas. Knowing exactly when each shines, how to implement them correctly (especially partition), and how to pick a pivot is the difference between an O(n log n) routine and a TLE on a contest.",
    applications: [
      "std::sort = IntroSort = QuickSort → HeapSort fallback → InsertionSort for small subarrays",
      "Java Arrays.sort(Object[]) = TimSort (merge-sort variant adaptive to runs)",
      "External sorting on disk uses k-way merge (generalized merge sort)",
      "Inversion counting, closest pair, k-th order statistic all build on merge/quick patterns",
    ],
    prerequisites: ["Elementary sorting", "Recursion", "Big-O including recurrence solving (Master theorem informal)"],
  },
  outcomes: [
    "Implement merge sort and quick sort correctly with all corner cases",
    "Solve the recurrence T(n) = 2T(n/2) + O(n) and explain why it gives O(n log n)",
    "Choose a pivot strategy (first, last, random, median-of-three) and justify the choice",
    "Make quick sort robust against worst-case inputs",
    "Use merge sort to count inversions in O(n log n)",
  ],
  concept: [
    { heading: "Divide and conquer template", body: "1) Divide the input into smaller subproblems. 2) Conquer (recursively solve them). 3) Combine the subresults into the final answer. For merge sort, divide is trivial (split index), combine is the merge step. For quick sort, divide is the partition (does the real work), combine is trivial (concatenate)." },
    { heading: "Merge sort mechanics", body: "mergeSort(a, l, r): if l ≥ r return. mid = (l+r)/2. mergeSort(a, l, mid). mergeSort(a, mid+1, r). merge(a, l, mid, r). Merge walks two sorted halves with two pointers, writing into an O(n) auxiliary buffer, then copies back. Stable because we choose left-side element on ties." },
    { heading: "Why O(n log n)", body: "Recurrence T(n) = 2T(n/2) + Θ(n) (merge dominates). Recursion tree has log₂n levels, each doing Θ(n) merge work → Θ(n log n) total. Master theorem case 2 confirms." },
    { heading: "Quick sort mechanics — Lomuto partition", body: "Pick last element as pivot. i = lo - 1. For j from lo to hi-1: if a[j] ≤ pivot, ++i and swap(a[i], a[j]). Finally swap(a[i+1], a[hi]). Pivot now at i+1; left part ≤ pivot, right part > pivot. Recurse on each side. Simple but does more swaps than necessary." },
    { heading: "Hoare partition", body: "Two pointers i = lo, j = hi. Advance i while a[i] < pivot, decrement j while a[j] > pivot; swap if i < j; repeat. Returns j. More cache-friendly, fewer swaps. The pivot is NOT guaranteed to be at the partition boundary — recursion uses (lo, j) and (j+1, hi)." },
    { heading: "Pivot selection", body: "First/last: O(n²) on sorted input. Random: expected O(n log n) with vanishing variance; one of the best practical choices. Median-of-three: median of a[lo], a[mid], a[hi] — works well on real data, beats sorted-input adversary. Median-of-medians: deterministic O(n) selection guarantees O(n log n) worst case but heavy constants." },
    { heading: "Quick sort's worst case", body: "Always picking the smallest/largest as pivot reduces the partition to size n-1, giving T(n) = T(n-1) + O(n) = O(n²). Sorted input + first-pivot is the classic trap. Avoid with randomization or median-of-three." },
    { heading: "In-place vs out-of-place", body: "Quick sort is in-place (O(log n) stack for recursion). Merge sort uses O(n) auxiliary; in-place merge exists but with O(n log² n) time. This is why quick is preferred for huge in-memory sorts and merge for disk sorts where stability and predictability matter more than space." },
  ],
  visual: [
    { title: "Merge sort recursion tree", description: "Top: full array. Splits visually into halves down to single elements (leaves). On the way back up, sibling pairs merge into longer sorted runs. Color shows the current merge frontier." },
    { title: "Merge step two-pointer animation", description: "Two horizontal halves with marching pointers. Whichever points to the smaller value writes to the output buffer below; pointer advances. Trailing values copy in bulk at the end." },
    { title: "Quick sort partition (Lomuto)", description: "Array with pivot highlighted at the end. Two cursors i and j walk left to right. Whenever a[j] ≤ pivot, swap and advance i. Final swap places the pivot, splitting the array into the colored 'less' and 'greater' regions." },
    { title: "Pivot strategies side-by-side", description: "Four panels: first-pivot, last-pivot, random-pivot, median-of-three. Same sorted input. The first two degenerate to a long chain (O(n²)); the other two produce balanced trees." },
    { title: "Inversion counting", description: "Merge sort visualization where each 'right side wins' event during the merge increments an inversion counter equal to the number of remaining left elements." },
  ],
  code: [
    {
      lang: "cpp",
      title: "C++ — Merge Sort",
      code: `void merge(std::vector<int>& a, int l, int m, int r) {
    std::vector<int> tmp(r - l + 1);
    int i = l, j = m + 1, k = 0;
    while (i <= m && j <= r)
        tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];   // <= keeps stability
    while (i <= m) tmp[k++] = a[i++];
    while (j <= r) tmp[k++] = a[j++];
    for (int t = 0; t < k; ++t) a[l + t] = tmp[t];
}

void mergeSort(std::vector<int>& a, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    merge(a, l, m, r);
}`,
      explain: "The <= comparison (not <) is what makes merge sort stable. Avoid integer overflow with l + (r - l) / 2.",
    },
    {
      lang: "cpp",
      title: "C++ — Quick Sort with randomized pivot (Lomuto)",
      code: `int partition(std::vector<int>& a, int lo, int hi) {
    int rand_idx = lo + rand() % (hi - lo + 1);    // randomize pivot
    std::swap(a[rand_idx], a[hi]);
    int pivot = a[hi], i = lo - 1;
    for (int j = lo; j < hi; ++j)
        if (a[j] <= pivot) std::swap(a[++i], a[j]);
    std::swap(a[i + 1], a[hi]);
    return i + 1;
}

void quickSort(std::vector<int>& a, int lo, int hi) {
    if (lo >= hi) return;
    int p = partition(a, lo, hi);
    quickSort(a, lo, p - 1);
    quickSort(a, p + 1, hi);
}`,
      explain: "Randomizing the pivot defeats adversarial inputs in expectation. Without it, sorted input + last-element pivot is the canonical worst case.",
    },
    {
      lang: "java",
      title: "Java — Hoare-partition quick sort",
      code: `static void quickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int p = a[lo + (hi - lo) / 2];
    int i = lo - 1, j = hi + 1;
    while (true) {
        do { i++; } while (a[i] < p);
        do { j--; } while (a[j] > p);
        if (i >= j) break;
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }
    quickSort(a, lo, j);            // note: j, not j-1
    quickSort(a, j + 1, hi);
}`,
      explain: "Hoare's scheme is faster in practice (fewer swaps). Critical detail: the recursive call uses lo..j and j+1..hi — NOT j-1.",
    },
  ],
  complexity: [
    { operation: "Merge sort", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
    { operation: "Quick sort (random pivot)", best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n) stack" },
    { operation: "Quick sort (first-element pivot)", best: "O(n log n)", average: "O(n log n)", worst: "O(n²) on sorted", space: "O(n) stack worst" },
    { operation: "Inversion count via merge", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
  ],
  comparisons: [
    {
      a: "Merge Sort",
      b: "Quick Sort",
      rows: [
        { criterion: "Worst case", a: "O(n log n)", b: "O(n²)" },
        { criterion: "Average case", a: "O(n log n)", b: "O(n log n) with smaller constants" },
        { criterion: "Space", a: "O(n) auxiliary", b: "O(log n) stack" },
        { criterion: "Stable?", a: "Yes", b: "No (standard form)" },
        { criterion: "Cache friendly?", a: "Moderate", b: "Excellent" },
        { criterion: "In place?", a: "No (practical)", b: "Yes" },
      ],
    },
  ],
  worked: [
    {
      difficulty: "Easy",
      question: "Draw the recursion tree for merge sort on [38, 27, 43, 3, 9, 82, 10].",
      solution: "Split into [38,27,43,3] and [9,82,10]. Recurse. Leaves are singletons. Merging bottom-up: [27,38] [3,43] → [3,27,38,43]; [9,82] [10] → [9,10,82]. Final merge: [3,9,10,27,38,43,82].",
    },
    {
      difficulty: "Medium",
      question: "Partition [10, 80, 30, 90, 40, 50, 70] using Lomuto with pivot=70 (last). Show i, j at each step.",
      solution: "i=-1. j=0,a[0]=10≤70 → i=0 swap(a[0],a[0]). j=1,80>70. j=2,30≤70 → i=1 swap(a[1],a[2]): [10,30,80,90,40,50,70]. j=3,90>70. j=4,40≤70 → i=2 swap(a[2],a[4]): [10,30,40,90,80,50,70]. j=5,50≤70 → i=3 swap(a[3],a[5]): [10,30,40,50,80,90,70]. End: swap(a[4],a[6]): [10,30,40,50,70,90,80]. Return 4.",
    },
    {
      difficulty: "Hard",
      question: "Count inversions in [2, 4, 1, 3, 5] using merge sort.",
      solution: "Modify merge: when picking from right, add (mid - i + 1) to inversion count (remaining left elements are all larger than the chosen right element). Walking through, inversions = 3: (2,1), (4,1), (4,3). Total time O(n log n).",
    },
  ],
  practice: {
    easy: [
      { q: "Run merge sort on [5,2,4,7,1,3,2,6] and trace the merge calls." },
      { q: "Implement merge sort iteratively (bottom-up) using widths 1, 2, 4, ..." },
      { q: "Modify quick sort to stop recursing when subarray size ≤ 10, switching to insertion sort." },
      { q: "Write a function that returns true if the array is already sorted (used by adaptive quick sort optimization)." },
      { q: "Implement the in-place partition using Hoare's scheme." },
    ],
    medium: [
      { q: "Implement quick sort with median-of-three pivot selection." },
      { q: "Implement 3-way quicksort for arrays with many duplicates (Dutch national flag partition)." },
      { q: "Sort a linked list using merge sort in O(n log n) without extra arrays." },
      { q: "Find the k-th smallest element in O(n) average using QuickSelect." },
      { q: "Count inversions of an array of size n in O(n log n)." },
    ],
    hard: [
      { q: "Prove that any deterministic quick sort has Θ(n²) worst case on some input." },
      { q: "Implement IntroSort: start with quick sort, switch to heap sort if recursion exceeds 2·log₂n." },
      { q: "External merge sort: sort 10 GB of integers using only 100 MB of RAM. Outline the multi-pass algorithm." },
      { q: "Show that the partition step of quick sort can be done in parallel; analyze the speedup." },
      { q: "Find the closest pair of points in 2D using divide-and-conquer in O(n log n)." },
    ],
    fast: [
      { q: "FAST exam-style: Trace quick sort with first-element pivot on [1,2,3,4,5]. Identify the worst-case behavior." },
      { q: "Given an array with many duplicates, justify choosing 3-way quicksort over standard quicksort using inversion analysis." },
      { q: "Write a merge function for k sorted arrays using a min-heap in O(N log k) where N is total elements." },
    ],
    interview: [
      { q: "Sort an array of 0s, 1s, 2s in one pass (Dutch national flag)." },
      { q: "Given an array nearly sorted (every element at most k positions out of place), sort in O(n log k)." },
    ],
  },
  challenges: [
    { q: "Implement a deterministic O(n) median selection (median-of-medians) and use it inside quick sort to guarantee O(n log n) worst-case." },
    { q: "Dry-run quick sort with last-element pivot on [3,1,4,1,5,9,2,6,5,3,5]; count recursive calls." },
    { q: "Debug: a candidate's quick sort hangs on input full of equal keys. Identify the bug and fix using 3-way partition." },
  ],
  interactive: [
    { title: "Merge sort tree explorer", description: "Click any node to expand/collapse its recursion subtree; arrows animate the merge step in slow motion." },
    { title: "Pivot picker playground", description: "Choose first / last / random / median-of-three; see the partition tree balance change on the same input." },
    { title: "Quickselect game", description: "Find the k-th smallest in fewest partitions; UI tracks your average performance." },
  ],
  assessment: {
    mcqs: [
      { q: "Worst case of quick sort with random pivot:", options: ["O(n log n)", "O(n²) with low probability", "O(n²) always", "O(n)"], answer: 1 },
      { q: "Merge sort's space complexity:", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 2 },
      { q: "Which is stable?", options: ["Quick sort (standard)", "Merge sort", "Heap sort", "Selection sort"], answer: 1 },
      { q: "Partition in Lomuto scheme returns the:", options: ["Pivot's final index", "Smallest element's index", "Original pivot index", "Midpoint"], answer: 0 },
      { q: "Median-of-three's primary benefit:", options: ["Reduces space", "Avoids worst case on nearly-sorted input", "Makes quick sort stable", "Halves comparisons"], answer: 1 },
    ],
    truefalse: [
      { q: "Merge sort always has O(n log n) time complexity.", answer: true },
      { q: "Quick sort is faster than merge sort on average because of better cache locality.", answer: true },
      { q: "An in-place merge step can be done in O(n) time.", answer: false, explain: "In-place merge takes O(n log n) or extra cleverness; not O(n)." },
      { q: "Choosing the median as pivot guarantees O(n log n) for quick sort.", answer: true },
    ],
    coding: [
      { q: "Implement merge sort for a singly linked list in O(n log n) time." },
      { q: "Implement quick sort with the 3-way partition (Dutch national flag)." },
    ],
    dryrun: [
      { q: "Trace quick sort with random pivot=middle on [9,4,7,2,8,1,5,3,6]. List partitions at each level." },
      { q: "Trace merge sort on [4,3,2,1]; count comparisons across all merge calls." },
    ],
    conceptual: [
      { q: "Explain why merge sort is preferred for sorting linked lists over quick sort." },
      { q: "Why does randomization defeat adversarial inputs for quick sort?" },
    ],
  },
  commonMistakes: [
    "Using < instead of <= in the merge comparison, breaking stability",
    "Picking the last element as pivot and getting O(n²) on sorted input",
    "Recursing on (lo, j-1) with Hoare partition (should be (lo, j))",
    "Allocating the auxiliary buffer inside merge() on every call instead of once",
    "Forgetting to handle equal keys in quick sort (causes O(n²) on arrays of duplicates)",
    "Integer overflow in (l + r) / 2 on huge arrays",
  ],
};
