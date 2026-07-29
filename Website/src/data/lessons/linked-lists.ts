import type { Lesson } from "../lesson-types";

export const lesson: Lesson = {
  slug: "linked-lists",
  title: "Linked Lists & Searching",
  tagline: "Pointers that build chains — and how we find things inside them.",
  overview: {
    what: "A linked list is a linear collection of nodes where each node stores a value and one or more pointers to neighboring nodes. Variants: singly linked (one next pointer), doubly linked (next + prev), and circular (last node points back to first). Searching is the task of locating a key: linear search scans sequentially; binary search exploits sorted random-access arrays; interpolation search predicts the position using value distribution.",
    why: "Linked lists are the cleanest pedagogy for pointer manipulation and the building block of stacks, queues, hash chains, adjacency lists, LRU caches, and the implementation of std::list. Search algorithms are the universal warm-up for algorithmic thinking — they introduce loop invariants, divide-and-conquer, and best/avg/worst analysis.",
    applications: [
      "OS process scheduling (doubly linked task queues)",
      "Browser history (doubly linked navigation)",
      "Music playlist with shuffle/loop (circular doubly linked)",
      "LRU cache (hash map + doubly linked list)",
      "Polynomial arithmetic (linked list of coefficient-exponent nodes)",
    ],
    prerequisites: ["Pointers and references", "Dynamic memory (new/delete or Java references)", "Basic recursion (for elegant traversal solutions)"],
  },
  outcomes: [
    "Implement singly, doubly, and circular linked lists with insert/remove/search/reverse",
    "Choose between array and linked list based on access patterns",
    "Write linear, binary, and interpolation search and analyze each",
    "Detect cycles in a linked list using Floyd's tortoise-and-hare",
    "Solve in-place reversal, middle-finding, and merging on linked lists",
  ],
  concept: [
    { heading: "Why pointers, not just arrays?", body: "Arrays give O(1) random access but O(n) insertion in the middle and require contiguous memory. Linked lists give O(1) insertion at a known position but O(n) access by index and pay a cache-locality penalty (every node is a separate allocation). The choice is workload-driven: many inserts/deletes at arbitrary positions → list; many random reads → array." },
    { heading: "Singly linked list anatomy", body: "Each node holds data and next. The list keeps a head pointer; the last node's next is nullptr. Traversal is one-directional. Inserting at head is O(1); inserting at tail is O(n) unless you also maintain a tail pointer." },
    { heading: "Doubly linked list", body: "Each node has prev and next. You can walk in either direction; deletion of a known node is O(1) without a separate 'previous' lookup. The price is one extra pointer per node and double the maintenance work on every mutation." },
    { heading: "Circular linked list", body: "The last node's next loops back to the head. Useful when traversal must endlessly cycle (round-robin scheduler, Josephus problem). Termination tests change from 'next == nullptr' to 'next == head'." },
    { heading: "Linear search", body: "Walk every element; return the first match. O(n) worst, O(1) best (item at front). Works on any sequence — sorted or unsorted, array or list. The baseline you must beat with anything else." },
    { heading: "Binary search", body: "On a sorted random-access array, compare the middle element to the key; recurse left or right. Each step halves the search space → O(log n). Fails on a linked list because we cannot reach the middle in O(1). Off-by-one in the mid calculation and the high = mid - 1 / low = mid + 1 update is the most common bug." },
    { heading: "Interpolation search", body: "If keys are uniformly distributed, predict the position by linear interpolation: pos = low + ((key - a[low]) * (high - low)) / (a[high] - a[low]). Average O(log log n), but worst-case O(n) on skewed distributions (e.g. exponential keys)." },
  ],
  visual: [
    { title: "Singly linked list insertion at position k", description: "Boxes connected by arrows shift one slot at a time. A new node animates in from above; its next arrow snaps to point at node k+1 first (to avoid losing the tail), then the previous node's next redirects to the new node." },
    { title: "Doubly linked deletion", description: "Two arrows fade out (prev and next of the doomed node), two new arrows fade in (skipping over). The deleted node turns red and dissolves." },
    { title: "Floyd's cycle detection", description: "Two animated runners labeled tortoise and hare advance through the list; hare moves twice per tick. If the list has a cycle, they collide on a shared node, highlighted in amber." },
    { title: "Binary search bisection", description: "A horizontal array with low, mid, high markers. On each step, half the array greys out, mid jumps to the new midpoint. A counter at the top counts comparisons; logarithmic decay is visible." },
    { title: "Interpolation vs binary on uniform vs skewed data", description: "Two arrays drawn side by side — one with evenly spaced values, one with exponential. Interpolation pointer leaps near the answer on uniform data, but oscillates on skewed data." },
  ],
  code: [
    {
      lang: "cpp",
      title: "C++ — Singly Linked List core operations",
      code: `template <typename T>
struct Node {
    T data;
    Node* next;
    Node(T v) : data(v), next(nullptr) {}
};

template <typename T>
class List {
    Node<T>* head = nullptr;
public:
    ~List() { while (head) { auto* n = head->next; delete head; head = n; } }

    void pushFront(T v) {
        auto* n = new Node<T>(v);
        n->next = head;
        head = n;
    }

    bool remove(T v) {
        Node<T>** cur = &head;          // pointer to pointer — handles head deletion cleanly
        while (*cur && (*cur)->data != v) cur = &(*cur)->next;
        if (!*cur) return false;
        Node<T>* victim = *cur;
        *cur = victim->next;
        delete victim;
        return true;
    }

    Node<T>* search(T v) const {
        for (Node<T>* p = head; p; p = p->next)
            if (p->data == v) return p;
        return nullptr;
    }

    void reverse() {                    // iterative, O(n) time, O(1) space
        Node<T>* prev = nullptr;
        Node<T>* cur  = head;
        while (cur) {
            Node<T>* nxt = cur->next;
            cur->next = prev;
            prev = cur;
            cur = nxt;
        }
        head = prev;
    }
};`,
      explain: "The pointer-to-pointer trick collapses the head-vs-interior special case into one loop. Reversal walks once flipping each next pointer; track three pointers because rewriting cur->next would lose the rest of the chain.",
    },
    {
      lang: "cpp",
      title: "C++ — Binary & Interpolation Search",
      code: `int binarySearch(const int* a, int n, int key) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;     // avoid overflow
        if (a[mid] == key) return mid;
        if (a[mid] <  key) lo = mid + 1;
        else                hi = mid - 1;
    }
    return -1;
}

int interpolationSearch(const int* a, int n, int key) {
    int lo = 0, hi = n - 1;
    while (lo <= hi && key >= a[lo] && key <= a[hi]) {
        if (lo == hi) return a[lo] == key ? lo : -1;
        int pos = lo + (long long)(key - a[lo]) * (hi - lo) / (a[hi] - a[lo]);
        if (a[pos] == key) return pos;
        if (a[pos] <  key) lo = pos + 1;
        else                hi = pos - 1;
    }
    return -1;
}`,
      explain: "Use lo + (hi - lo) / 2 instead of (lo + hi) / 2 to avoid integer overflow on large arrays. Interpolation casts to long long because (key - a[lo]) * (hi - lo) can overflow int.",
    },
    {
      lang: "java",
      title: "Java — Doubly Linked List",
      code: `public class DLL<T> {
    private static class Node<T> {
        T value; Node<T> prev, next;
        Node(T v) { value = v; }
    }
    private Node<T> head, tail;
    private int size;

    public void addLast(T v) {
        Node<T> n = new Node<>(v);
        n.prev = tail;
        if (tail != null) tail.next = n; else head = n;
        tail = n;
        size++;
    }

    public boolean remove(T v) {
        for (Node<T> p = head; p != null; p = p.next) {
            if (p.value.equals(v)) {
                if (p.prev != null) p.prev.next = p.next; else head = p.next;
                if (p.next != null) p.next.prev = p.prev; else tail = p.prev;
                size--;
                return true;
            }
        }
        return false;
    }

    public int size() { return size; }
}`,
      explain: "Maintaining both head and tail makes addLast O(1). The four-way null check on remove is the canonical doubly-linked deletion pattern.",
    },
  ],
  complexity: [
    { operation: "Singly LL: insert at head", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)" },
    { operation: "Singly LL: search", best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)" },
    { operation: "Doubly LL: delete known node", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)" },
    { operation: "Linear search", best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(1)" },
    { operation: "Binary search", best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(1) iter / O(log n) rec" },
    { operation: "Interpolation search (uniform)", best: "O(1)", average: "O(log log n)", worst: "O(n) skewed", space: "O(1)" },
  ],
  comparisons: [
    {
      a: "Array",
      b: "Linked List",
      rows: [
        { criterion: "Random access", a: "O(1)", b: "O(n)" },
        { criterion: "Insert at middle (position known)", a: "O(n) shift", b: "O(1)" },
        { criterion: "Memory overhead per element", a: "0", b: "1–2 pointers" },
        { criterion: "Cache friendliness", a: "Excellent", b: "Poor" },
      ],
    },
    {
      a: "Binary Search",
      b: "Interpolation Search",
      rows: [
        { criterion: "Requires sorted data", a: "Yes", b: "Yes" },
        { criterion: "Assumes distribution", a: "None", b: "Uniform" },
        { criterion: "Average time", a: "O(log n)", b: "O(log log n)" },
        { criterion: "Worst time", a: "O(log n)", b: "O(n)" },
      ],
    },
  ],
  worked: [
    {
      difficulty: "Easy",
      question: "Insert 7 at the front of the list 3 → 1 → 4. Draw the steps.",
      solution: "Create node(7). Set node.next = head (3). Set head = node(7). Result: 7 → 3 → 1 → 4. Cost O(1).",
    },
    {
      difficulty: "Medium",
      question: "Detect whether a linked list has a cycle without using extra memory.",
      solution: "Floyd's two pointers. tortoise = head, hare = head. Each step: tortoise = tortoise.next, hare = hare.next.next. If hare or hare.next is null, no cycle. If tortoise == hare, cycle exists. Correctness: in a cycle of length k, hare gains 1 step per iteration on tortoise modulo k, so they meet within k iterations after tortoise enters the cycle. Time O(n), space O(1).",
    },
    {
      difficulty: "Hard",
      question: "Reverse every k consecutive nodes of a singly linked list (e.g., k=3 turns 1→2→3→4→5→6→7 into 3→2→1→6→5→4→7).",
      solution: "For each group of k: detach k nodes, reverse them iteratively (3-pointer technique), splice back. Use a sentinel/dummy head to simplify joining. Count nodes first if you must avoid reversing a final partial group. Time O(n), space O(1) iterative.",
    },
  ],
  practice: {
    easy: [
      { q: "Count nodes in a singly linked list iteratively and recursively." },
      { q: "Print a linked list in reverse without modifying it (use recursion)." },
      { q: "Insert a node at the kth position; return false if k > size." },
      { q: "Delete every node with even value from a singly linked list." },
      { q: "Search a sorted array of 1 million ints with binary search; count comparisons." },
    ],
    medium: [
      { q: "Find the middle node of a singly linked list in one pass." },
      { q: "Merge two sorted singly linked lists into one sorted list in O(n+m)." },
      { q: "Detect cycle and return the node where the cycle starts." },
      { q: "Implement insertion at the end of a circular linked list with only a tail pointer." },
      { q: "Given a sorted array with duplicates, find the first and last index of a key using two binary searches." },
    ],
    hard: [
      { q: "Reverse a doubly linked list in place." },
      { q: "Given two unsorted linked lists representing numbers (head = most significant digit), return their sum as a list." },
      { q: "Implement an LRU cache with O(1) get and put using HashMap + doubly linked list." },
      { q: "Flatten a multi-level doubly linked list (each node may have a child pointer to another list)." },
      { q: "Given a sorted array of distinct integers, find a peak element in O(log n)." },
    ],
    fast: [
      { q: "FAST-style: Given a singly linked list, write removeNthFromEnd(n) in one pass without using length." },
      { q: "Implement a polynomial as a sorted linked list (descending exponent). Write multiply(p, q) producing a third polynomial." },
      { q: "Compare binary and interpolation search for the array [1, 2, 3, …, 10000]: which is faster and why? What about for [1, 2, 4, 8, 16, …]?" },
    ],
    interview: [
      { q: "Reverse a singly linked list in O(n) time and O(1) extra space — iteratively and recursively." },
      { q: "Given a linked list, partition it around a value x so that all nodes less than x come before all nodes ≥ x, preserving relative order." },
    ],
  },
  challenges: [
    { q: "Implement a skip list with O(log n) expected search/insert. Discuss how levels are chosen randomly." },
    { q: "Dry-run interpolation search on [10, 20, 30, 40, 50, 1000000] searching for 50. How many probes?" },
    { q: "Debug: a candidate's binarySearch loops forever on a 2-element array. Identify the off-by-one and fix it." },
  ],
  interactive: [
    { title: "Pointer surgery", description: "Drag arrows to rewire a singly linked list. The UI rejects illegal states (cycles you didn't intend, dangling nodes) and explains why." },
    { title: "Binary search visualizer", description: "Click low/high/mid markers to step through. Wrong choices highlight the broken loop invariant." },
    { title: "LRU cache simulator", description: "Type get/put commands; watch the doubly linked list reorder and the hash map update in real time." },
  ],
  assessment: {
    mcqs: [
      { q: "Which operation is O(n) in a singly linked list but O(1) in a doubly linked list given a node pointer?", options: ["Insertion at head", "Deletion of that node", "Length computation", "Reversal"], answer: 1 },
      { q: "Binary search requires:", options: ["Sorted data and random access", "Sorted data only", "Random access only", "Neither"], answer: 0 },
      { q: "Worst case of interpolation search:", options: ["O(log log n)", "O(log n)", "O(n)", "O(n log n)"], answer: 2 },
      { q: "Floyd's algorithm uses how many pointers?", options: ["1", "2", "3", "n"], answer: 1 },
      { q: "Best use case for a circular linked list:", options: ["Binary search", "Round-robin scheduling", "Stack implementation", "Hashing"], answer: 1 },
    ],
    truefalse: [
      { q: "Inserting at the head of a singly linked list is always O(1).", answer: true },
      { q: "Binary search works on a sorted linked list in O(log n).", answer: false, explain: "Reaching the middle is O(n) on a list." },
      { q: "Interpolation search can outperform binary search on uniformly distributed data.", answer: true },
      { q: "A circular doubly linked list with one node has node.next == node and node.prev == node.", answer: true },
    ],
    coding: [
      { q: "Write a function that returns true if a singly linked list is a palindrome, in O(n) time and O(1) extra space." },
      { q: "Implement a swap-pairs function that swaps adjacent nodes (1→2→3→4 becomes 2→1→4→3) without swapping values." },
    ],
    dryrun: [
      { q: "Trace binary search on [1, 3, 5, 7, 9, 11, 13] for key=11. List (lo, hi, mid) at each step." },
      { q: "Trace reversal of 1→2→3→4 using (prev, cur, nxt) pointers." },
    ],
    conceptual: [
      { q: "Why is mid = (lo + hi) / 2 considered unsafe in a 32-bit language?" },
      { q: "Give one real workload where a linked list outperforms a dynamic array and explain why." },
    ],
  },
  commonMistakes: [
    "Losing the rest of the list by writing cur->next = ... before saving it",
    "Forgetting to update tail (and prev links in DLL) on insert/remove",
    "Using `cur != null && cur.next != null` order in cycle detection — never reverse them",
    "Off-by-one in binary search: writing `hi = mid` instead of `hi = mid - 1` and infinite-looping",
    "Applying interpolation search to non-uniform or sparse data",
    "Returning the wrong index when the array has duplicates (first vs last occurrence)",
  ],
};
