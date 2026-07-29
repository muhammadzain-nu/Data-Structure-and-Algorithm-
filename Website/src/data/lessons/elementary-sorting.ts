import type { Lesson } from "../lesson-types";

export const lesson: Lesson = {
  slug: "elementary-sorting",
  title: "Elementary Sorting Techniques",
  tagline: "Bubble, Selection, Insertion, Radix, Shell, Comb — the algorithms every DSA student must master.",
  overview: {
    what: "Elementary sorting algorithms order a sequence using simple comparison or distribution rules. We study six: Bubble (adjacent swaps), Selection (repeatedly pick minimum), Insertion (build sorted prefix), Shell (gapped insertion), Comb (gapped bubble), and Radix (digit-by-digit distribution — non-comparison).",
    why: "Sorting is the second most common operation after searching. These algorithms teach loop invariants, stability, in-place vs out-of-place, adaptivity, and the comparison-sort lower bound of Ω(n log n). They also lay the groundwork for advanced sorts (merge, quick, heap) and library functions like std::sort.",
    applications: [
      "Insertion sort is used inside std::sort and Timsort for small subarrays (n < ~16)",
      "Radix sort beats comparison sorts for fixed-width integer keys",
      "Shell sort is used in embedded systems where code size matters and average n is moderate",
      "Sorting is a preprocessing step for binary search, deduplication, and many greedy algorithms",
    ],
    prerequisites: ["Arrays and indices", "Big-O notation", "Basic loop reasoning (invariants)"],
  },
  outcomes: [
    "Implement all six algorithms from scratch in C++ and Java",
    "Prove correctness using a loop invariant",
    "Distinguish stable from unstable sorts and explain why it matters",
    "Choose the right algorithm given a constraint (size, distribution, memory)",
    "Recognize the comparison-sort lower bound and why radix sort can beat it",
  ],
  concept: [
    { heading: "What does 'sorted' mean?", body: "An array A of length n is sorted in non-decreasing order if A[i] ≤ A[i+1] for all valid i. A sort is stable if equal keys keep their original relative order — essential when sorting records by a secondary key." },
    { heading: "Bubble sort", body: "Repeatedly pass through the array, swapping adjacent out-of-order pairs. After pass k, the largest k elements have 'bubbled' to the end. With an early-exit flag, best case becomes O(n) on already-sorted input." },
    { heading: "Selection sort", body: "For each position i from 0 to n-1, scan A[i..n-1] for the minimum and swap into position i. Performs the same Θ(n²) comparisons regardless of input, but exactly n-1 swaps — the fewest of any in-place sort. Not stable in its naive form." },
    { heading: "Insertion sort", body: "Maintain a sorted prefix A[0..i-1]. Insert A[i] by shifting larger elements right. Best case O(n) on nearly-sorted input; this is why it's the gold standard for small or partially sorted arrays and why it's used as the base case in introsort." },
    { heading: "Shell sort", body: "A generalization of insertion sort: pre-sort the array using a sequence of gaps (e.g. n/2, n/4, …, 1). Each gap-pass moves elements long distances cheaply, reducing the work the final 1-gap pass must do. With Ciura's gap sequence, complexity is empirically ≈ O(n^1.25)." },
    { heading: "Comb sort", body: "A bubble sort variant that uses a shrinking gap (typically gap /= 1.3). Eliminates 'turtles' (small values near the end) that hurt classic bubble sort. Average performance is closer to O(n² / 2^p) for p passes." },
    { heading: "Radix sort", body: "Non-comparison sort for integers (or fixed-width strings). LSD (least significant digit first) repeatedly distributes elements into 10 (or b) buckets by one digit, then collects. Requires a stable inner sort (counting sort). Complexity O(d·(n+b)) where d is digits, b is base. Beats Ω(n log n) because it does not compare keys." },
    { heading: "Lower bound for comparison sorts", body: "Any sort that only compares pairs makes a decision tree with n! leaves; tree depth ≥ log₂(n!) = Ω(n log n). No comparison sort can do better in the worst case." },
  ],
  visual: [
    { title: "Bubble sort animation", description: "Vertical bars representing values. On each pass, adjacent pairs are highlighted, compared, and swapped if needed (bars exchange position with a smooth slide). The current 'sorted tail' is shaded green and grows after each pass." },
    { title: "Selection sort animation", description: "A pink cursor marks the current minimum candidate as it scans right. When the pass ends, the minimum swaps into the boundary position. The sorted prefix grows leftward, shaded green." },
    { title: "Insertion sort animation", description: "The current card A[i] lifts out and slides left, displacing larger cards right one slot at a time, until it lands in its sorted slot. Watch the sorted prefix grow." },
    { title: "Shell sort gap visualization", description: "Color-coded subarrays at gap g show which elements participate in each insertion sub-sort. As g shrinks, the colors merge until g=1 sorts the whole array." },
    { title: "Radix sort buckets", description: "Ten labelled buckets (0–9). On each pass, items fly into the bucket matching the current digit; then collected left-to-right back into the array. Repeat for each digit position. Stability is shown by equal-digit items preserving their order." },
  ],
  code: [
    {
      lang: "cpp",
      title: "C++ — All six sorts",
      code: `#include <algorithm>
#include <vector>

void bubbleSort(std::vector<int>& a) {
    int n = a.size();
    for (int i = 0; i < n - 1; ++i) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; ++j)
            if (a[j] > a[j+1]) { std::swap(a[j], a[j+1]); swapped = true; }
        if (!swapped) return;            // already sorted → early exit
    }
}

void selectionSort(std::vector<int>& a) {
    int n = a.size();
    for (int i = 0; i < n - 1; ++i) {
        int min = i;
        for (int j = i + 1; j < n; ++j) if (a[j] < a[min]) min = j;
        std::swap(a[i], a[min]);
    }
}

void insertionSort(std::vector<int>& a) {
    for (int i = 1; i < (int)a.size(); ++i) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) { a[j+1] = a[j]; --j; }
        a[j+1] = key;
    }
}

void shellSort(std::vector<int>& a) {
    int n = a.size();
    for (int gap = n / 2; gap > 0; gap /= 2)
        for (int i = gap; i < n; ++i) {
            int tmp = a[i], j = i;
            while (j >= gap && a[j - gap] > tmp) { a[j] = a[j - gap]; j -= gap; }
            a[j] = tmp;
        }
}

void combSort(std::vector<int>& a) {
    int n = a.size(), gap = n;
    bool swapped = true;
    while (gap > 1 || swapped) {
        gap = std::max(1, (int)(gap / 1.3));
        swapped = false;
        for (int i = 0; i + gap < n; ++i)
            if (a[i] > a[i + gap]) { std::swap(a[i], a[i + gap]); swapped = true; }
    }
}

void radixSort(std::vector<int>& a) {            // non-negative ints
    int mx = *std::max_element(a.begin(), a.end());
    for (int exp = 1; mx / exp > 0; exp *= 10) {
        std::vector<int> out(a.size()), cnt(10, 0);
        for (int v : a) cnt[(v / exp) % 10]++;
        for (int i = 1; i < 10; ++i) cnt[i] += cnt[i-1];
        for (int i = a.size() - 1; i >= 0; --i)  // iterate backwards for stability
            out[--cnt[(a[i] / exp) % 10]] = a[i];
        a = out;
    }
}`,
      explain: "Bubble's early exit makes best case O(n). Insertion shifts (not swaps) — half the writes. Shell's gap loop is identical to insertion with stride. Radix's reverse loop preserves stability, which is required for correctness across digit passes.",
    },
    {
      lang: "java",
      title: "Java — Insertion & Radix",
      code: `static void insertionSort(int[] a) {
    for (int i = 1; i < a.length; i++) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) { a[j+1] = a[j]; j--; }
        a[j+1] = key;
    }
}

static void radixSort(int[] a) {
    int max = Arrays.stream(a).max().getAsInt();
    for (int exp = 1; max / exp > 0; exp *= 10) {
        int[] out = new int[a.length];
        int[] cnt = new int[10];
        for (int v : a) cnt[(v / exp) % 10]++;
        for (int i = 1; i < 10; i++) cnt[i] += cnt[i-1];
        for (int i = a.length - 1; i >= 0; i--)
            out[--cnt[(a[i] / exp) % 10]] = a[i];
        System.arraycopy(out, 0, a, 0, a.length);
    }
}`,
      explain: "Java translation is mechanical. The only subtlety is Arrays.stream(a).max() for max digit count.",
    },
  ],
  complexity: [
    { operation: "Bubble", best: "O(n) with flag", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    { operation: "Selection", best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    { operation: "Insertion", best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    { operation: "Shell (Ciura)", best: "O(n log n)", average: "≈O(n^1.25)", worst: "O(n^1.5)", space: "O(1)" },
    { operation: "Comb", best: "O(n log n)", average: "O(n² / 2^p)", worst: "O(n²)", space: "O(1)" },
    { operation: "Radix (LSD)", best: "O(d(n+b))", average: "O(d(n+b))", worst: "O(d(n+b))", space: "O(n+b)" },
  ],
  comparisons: [
    {
      a: "Insertion Sort",
      b: "Selection Sort",
      rows: [
        { criterion: "Best case", a: "O(n)", b: "O(n²)" },
        { criterion: "Number of swaps", a: "O(n²)", b: "O(n)" },
        { criterion: "Stable?", a: "Yes", b: "No (naive)" },
        { criterion: "Adaptive?", a: "Yes", b: "No" },
      ],
    },
    {
      a: "Radix Sort",
      b: "Comparison Sort",
      rows: [
        { criterion: "Compares keys?", a: "No", b: "Yes" },
        { criterion: "Beats Ω(n log n)?", a: "Yes for fixed-width keys", b: "No" },
        { criterion: "Works on any comparable type?", a: "No — needs digit structure", b: "Yes" },
        { criterion: "Extra space", a: "O(n+b)", b: "O(1) for in-place" },
      ],
    },
  ],
  worked: [
    {
      difficulty: "Easy",
      question: "Sort [5, 2, 4, 6, 1, 3] using insertion sort. Show the array after each iteration of the outer loop.",
      solution: "i=1: [2,5,4,6,1,3]. i=2: [2,4,5,6,1,3]. i=3: [2,4,5,6,1,3] (6 already in place). i=4: [1,2,4,5,6,3]. i=5: [1,2,3,4,5,6].",
    },
    {
      difficulty: "Medium",
      question: "How many comparisons does selection sort make on an already-sorted array of size n? Justify.",
      solution: "Exactly n(n-1)/2. Selection sort always scans the unsorted suffix to find a minimum regardless of order; the comparison count is data-independent. Swap count, however, is 0 if you skip self-swaps.",
    },
    {
      difficulty: "Hard",
      question: "Radix-sort [170, 45, 75, 90, 802, 24, 2, 66] using base 10. Show buckets after each digit pass.",
      solution: "Pass d=1 (ones): bucket0={170,90}, b2={802,2}, b4={24}, b5={45,75}, b6={66}. Collected: [170,90,802,2,24,45,75,66]. Pass d=10: b0={802,2}, b2={24}, b4={45}, b6={66}, b7={170,75}, b9={90}. Collected: [802,2,24,45,66,170,75,90]. Pass d=100: b0={2,24,45,66,75,90}, b1={170}, b8={802}. Result: [2,24,45,66,75,90,170,802].",
    },
  ],
  practice: {
    easy: [
      { q: "Count the number of swaps bubble sort performs on [4,3,2,1]." },
      { q: "Modify selection sort to find the maximum instead and place it at the end." },
      { q: "Write a one-line check for whether an array is already sorted (then bubble sort can return immediately)." },
      { q: "Run insertion sort on a 5-element array and tabulate how many shifts each iteration performs." },
      { q: "Implement comb sort and print the gap before each pass." },
    ],
    medium: [
      { q: "Modify insertion sort to use binary search to find the insertion point. What is the new comparison count? What about shifts?" },
      { q: "Make selection sort stable without using extra arrays." },
      { q: "Implement Shell sort with both n/2 and Knuth's (3k+1) sequences; compare empirically on random inputs." },
      { q: "Sort an array of strings of equal length using radix sort, MSD instead of LSD." },
      { q: "Given an array where every element is at most k positions away from its sorted position, which elementary sort is best and why?" },
    ],
    hard: [
      { q: "Prove the loop invariant of insertion sort and use it to prove correctness." },
      { q: "Explain why Shell sort's worst-case complexity depends on the gap sequence; cite two sequences with different bounds." },
      { q: "Adapt radix sort to handle negative integers." },
      { q: "Combine insertion sort with merge sort: stop recursion when n ≤ 16 and insertion-sort instead. Discuss the constant-factor improvement." },
      { q: "Implement bucket sort for uniformly distributed floats in [0, 1)." },
    ],
    fast: [
      { q: "FAST exam-style: Trace bubble sort with the early-exit flag on [3, 1, 4, 1, 5, 9, 2, 6]. List the array after each pass and the flag value." },
      { q: "Given five sorts (bubble, selection, insertion, shell, radix), which would you choose for n = 10⁶ uniformly-random 32-bit ints? Justify with complexity and constants." },
      { q: "A student claims selection sort is stable. Provide a 4-element counter-example." },
    ],
    interview: [
      { q: "Implement insertion sort on a singly linked list, in-place, O(n²)." },
      { q: "Given an array of 0s, 1s, and 2s, sort it in-place in one pass (Dutch national flag). Discuss why this is faster than a comparison sort here." },
    ],
  },
  challenges: [
    { q: "Hybrid: implement TimSort's run-detection plus insertion sort merging for small runs." },
    { q: "Dry-run radix sort on a 16-element array; count total reads and writes and compare to merge sort's count." },
    { q: "Debug: a candidate's bubble sort does n full passes regardless of input. Diagnose and produce a fixed, adaptive version." },
  ],
  interactive: [
    { title: "Sort race", description: "Pick two algorithms; click 'race' on an input of size n. Live bar chart shows comparisons and swaps as the sorts progress." },
    { title: "Stable vs unstable demo", description: "Sort an array of (key, label) pairs by key. Toggle stability on/off to see how labels reorder." },
    { title: "Radix bucket drag", description: "Manually drag elements into the correct bucket on each digit pass — wrong drops are explained." },
  ],
  assessment: {
    mcqs: [
      { q: "Which sort has the best best-case complexity?", options: ["Bubble (no flag)", "Selection", "Insertion", "Radix"], answer: 2 },
      { q: "Selection sort performs how many swaps?", options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"], answer: 2 },
      { q: "Which sort is NOT a comparison sort?", options: ["Quick", "Merge", "Radix", "Shell"], answer: 2 },
      { q: "Shell sort's complexity depends on:", options: ["Input size only", "The gap sequence", "Whether keys are integers", "CPU cache size"], answer: 1 },
      { q: "Which sort is most adaptive?", options: ["Selection", "Insertion", "Comb", "Radix"], answer: 1 },
    ],
    truefalse: [
      { q: "Bubble sort can run in O(n) on already-sorted input if the swap flag is used.", answer: true },
      { q: "Radix sort can sort arbitrary doubles efficiently.", answer: false, explain: "It needs digit structure; floating-point ordering needs special bit tricks." },
      { q: "Insertion sort is the preferred algorithm for n < ~16 within larger sorts.", answer: true },
      { q: "Selection sort is stable by default.", answer: false },
    ],
    coding: [
      { q: "Implement insertion sort that returns the number of inversions in the input." },
      { q: "Implement radix sort handling negative integers." },
    ],
    dryrun: [
      { q: "Bubble sort with early exit on [2,1,3,4]. How many passes execute?" },
      { q: "Shell sort with gaps {3,1} on [9,7,5,3,1,2,4,6,8]. Show the array after each gap-pass." },
    ],
    conceptual: [
      { q: "Why must the inner sort of LSD radix be stable?" },
      { q: "When would you prefer selection sort over insertion sort?" },
    ],
  },
  commonMistakes: [
    "Forgetting the early-exit flag in bubble sort and reporting O(n²) on sorted input",
    "Swapping with self in selection sort and breaking stability",
    "Off-by-one in insertion sort's inner while loop (j >= 0 check)",
    "Using a non-stable inner sort in radix and getting wrong results",
    "Picking a poor gap sequence in Shell sort and getting near-O(n²)",
    "Applying radix sort to data without a clear digit/key structure",
  ],
};
