import type { Lesson } from "../lesson-types";

export const lesson: Lesson = {
  slug: "recursion-stack-queue",
  title: "Recursion, Stack & Queue",
  tagline: "Self-similar problems and the ADTs that simulate their call frames.",
  overview: {
    what: "Recursion solves a problem by reducing it to smaller instances of itself, terminating at base cases. A Stack is a LIFO ADT supporting push/pop/top. A Queue is a FIFO ADT supporting enqueue/dequeue/front. Stacks naturally simulate the call stack of recursion; queues drive level-order processing and scheduling. Backtracking is recursive search with state restoration: try, recurse, undo.",
    why: "Recursion expresses tree, graph, divide-and-conquer, and combinatorial algorithms with breathtaking clarity. Stacks and queues are foundational to compilers (expression evaluation), OS (scheduling), graph algorithms (DFS/BFS), and constraint solving (Sudoku, N-Queens). Replacing recursion with an explicit stack avoids stack-overflow crashes on deep inputs.",
    applications: [
      "Compilers — parsing expressions, function calls, syntax trees",
      "OS — process scheduling (queues), call stack",
      "Graph traversal — DFS uses a stack, BFS uses a queue",
      "Backtracking solvers — Sudoku, N-Queens, maze, subset sum, permutations",
      "Web browsers — back/forward via stacks; print job queues; message queues in distributed systems",
    ],
    prerequisites: ["Functions and parameters", "Arrays or linked lists", "Pointers (for linked stack/queue)"],
  },
  outcomes: [
    "Identify base case + recursive case in a problem; write a correct recursion",
    "Distinguish direct, indirect, head, tail, tree, and mutual recursion",
    "Implement stack and queue with both array and linked list backends",
    "Convert any recursion into iteration using an explicit stack",
    "Apply backtracking to combinatorial problems with pruning",
  ],
  concept: [
    { heading: "Anatomy of recursion", body: "Every correct recursion has: (1) a base case that returns without recursing, (2) a recursive case that makes progress toward the base, (3) a combine step that uses the sub-result. Missing any one causes infinite recursion (stack overflow) or wrong output." },
    { heading: "Types of recursion", body: "Direct: a function calls itself. Indirect/mutual: A calls B calls A. Tail: the recursive call is the last action — compilers can optimize to a loop (Java doesn't, C++ may). Head: the recursive call happens before other work in the function body. Tree: function makes multiple recursive calls (Fibonacci, divide and conquer). Nested: argument to recursive call is itself a recursive call (Ackermann)." },
    { heading: "Recursion costs", body: "Each call allocates a stack frame holding parameters, locals, and return address. Depth d → O(d) auxiliary space. Naive Fibonacci makes 2^n calls with massive overlap — memoize or iterate to fix. Recursion is not free; replace with iteration when the depth threatens the stack." },
    { heading: "Backtracking", body: "Recursive enumeration with state mutation and undo. Pattern: choose, recurse, unchoose. Pruning (rejecting branches that cannot succeed) is what turns exponential time into something tractable in practice." },
    { heading: "Stack ADT", body: "Operations: push(x), pop(), top(), empty(), size(). LIFO order. Implementations: dynamic array (push_back/pop_back O(1) amortized) or singly linked list (push/pop at head O(1) true). Used for: expression evaluation, undo, function calls, DFS, parenthesis matching." },
    { heading: "Queue ADT", body: "Operations: enqueue(x), dequeue(), front(), empty(). FIFO order. Implementations: circular array (O(1) both ends, fixed capacity unless resized), doubly linked list, or two-stack trick (amortized O(1) per op). Used for: BFS, scheduling, buffering, level-order traversal." },
    { heading: "Simulating recursion with a stack", body: "Push the initial state. Loop: pop a state, do work, push child states. This converts depth-d recursion into a loop with explicit O(d) heap-allocated stack — avoids the language stack overflow on very deep inputs (e.g. n = 10⁶)." },
  ],
  visual: [
    { title: "Recursion call stack animation", description: "Function frames stack vertically. Each recursive call pushes a new frame with its arguments; returning pops the top. Tail-call optimization (when shown) reuses the frame instead of pushing." },
    { title: "Factorial trace", description: "factorial(4) → factorial(3) → ... → factorial(0)=1. Frames unwind, multiplying as they return." },
    { title: "Fibonacci tree", description: "fib(5) draws a binary tree of recursive calls. Duplicate subtrees (fib(3) computed twice) flash red — visualizes why memoization helps." },
    { title: "N-Queens backtracking grid", description: "An 8x8 chessboard. A queen drops into row 0, attacks light up. Next row tries each column, skipping attacked squares. On dead-end, the placed queen lifts off and the next column is tried. Counter shows backtracks." },
    { title: "Stack & queue side-by-side", description: "Two containers side by side. The same insertion order (1,2,3,4) produces 4,3,2,1 from the stack and 1,2,3,4 from the queue." },
    { title: "Circular queue array", description: "An array with two indices, front and back, wrapping around. Each enqueue advances back; each dequeue advances front. Full vs empty distinguished by a size counter." },
  ],
  code: [
    {
      lang: "cpp",
      title: "C++ — Stack and Queue from scratch",
      code: `template <typename T>
class Stack {
    std::vector<T> v;
public:
    void push(const T& x) { v.push_back(x); }
    void pop()            { v.pop_back(); }
    T&   top()            { return v.back(); }
    bool empty() const    { return v.empty(); }
    size_t size() const   { return v.size(); }
};

template <typename T>
class Queue {                 // circular array implementation
    std::vector<T> buf;
    size_t head = 0, tail = 0, cnt = 0;
public:
    Queue(size_t cap = 16) : buf(cap) {}
    void enqueue(const T& x) {
        if (cnt == buf.size()) resize();
        buf[tail] = x;
        tail = (tail + 1) % buf.size();
        ++cnt;
    }
    T dequeue() {
        T x = buf[head];
        head = (head + 1) % buf.size();
        --cnt;
        return x;
    }
    bool empty() const { return cnt == 0; }
private:
    void resize() {
        std::vector<T> bigger(buf.size() * 2);
        for (size_t i = 0; i < cnt; ++i)
            bigger[i] = buf[(head + i) % buf.size()];
        buf = std::move(bigger);
        head = 0; tail = cnt;
    }
};`,
      explain: "Stack delegates to vector — push_back/pop_back are O(1) amortized. Queue uses a circular buffer to keep both ends O(1); when full, it rebuilds in linear order so head wraps reset.",
    },
    {
      lang: "cpp",
      title: "C++ — Backtracking: N-Queens",
      code: `bool place(std::vector<int>& cols, int r, int n) {
    if (r == n) return true;                       // base: all rows placed
    for (int c = 0; c < n; ++c) {
        bool safe = true;
        for (int i = 0; i < r; ++i)
            if (cols[i] == c || abs(cols[i] - c) == r - i) { safe = false; break; }
        if (!safe) continue;
        cols[r] = c;                               // choose
        if (place(cols, r + 1, n)) return true;    // recurse
        // implicit unchoose: overwritten on next iteration
    }
    return false;
}`,
      explain: "cols[r] holds the column of the queen in row r. Safety check rejects same column and same diagonal. The choose/recurse/(unchoose) pattern is the backtracking skeleton.",
    },
    {
      lang: "java",
      title: "Java — Recursion to iteration with explicit stack",
      code: `static int factorial(int n) {              // recursive
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

static int factorialIter(int n) {          // iterative using a stack
    Deque<Integer> st = new ArrayDeque<>();
    while (n > 1) { st.push(n); n--; }
    int acc = 1;
    while (!st.isEmpty()) acc *= st.pop();
    return acc;
}`,
      explain: "The explicit stack mirrors what the language would do under the hood, but the heap (not the function call stack) holds frames — no StackOverflowError on huge n.",
    },
  ],
  complexity: [
    { operation: "Stack push/pop (array)", best: "O(1) amortized", average: "O(1)", worst: "O(n) on resize", space: "O(n)" },
    { operation: "Queue enqueue/dequeue (circular array)", best: "O(1) amortized", average: "O(1)", worst: "O(n) on resize", space: "O(n)" },
    { operation: "Naive Fibonacci", best: "O(2^n)", average: "O(2^n)", worst: "O(2^n)", space: "O(n)" },
    { operation: "Memoized Fibonacci", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)" },
    { operation: "N-Queens backtracking", best: "Ω(n)", average: "exponential", worst: "O(n!)", space: "O(n)" },
  ],
  comparisons: [
    {
      a: "Recursion",
      b: "Iteration with explicit stack",
      rows: [
        { criterion: "Memory location", a: "Call stack (limited)", b: "Heap (large)" },
        { criterion: "Readability", a: "Often cleaner", b: "More verbose" },
        { criterion: "Max depth supported", a: "~10⁴–10⁵", b: "Limited by RAM" },
        { criterion: "Overhead per call", a: "Frame + return", b: "Two pointer ops" },
      ],
    },
    {
      a: "Stack",
      b: "Queue",
      rows: [
        { criterion: "Order", a: "LIFO", b: "FIFO" },
        { criterion: "DFS / BFS", a: "DFS", b: "BFS" },
        { criterion: "Use case", a: "Function calls, undo, parentheses", b: "Scheduling, BFS, buffering" },
        { criterion: "Array implementation", a: "Single end", b: "Circular / two ends" },
      ],
    },
  ],
  worked: [
    {
      difficulty: "Easy",
      question: "Evaluate the postfix expression '5 1 2 + 4 * + 3 -' using a stack.",
      solution: "Push 5. Push 1. Push 2. '+' → pop 1,2 push 3. Push 4. '*' → pop 3,4 push 12. '+' → pop 5,12 push 17. Push 3. '-' → pop 17,3 push 14. Result: 14.",
    },
    {
      difficulty: "Medium",
      question: "Write a recursion to count subsets of an array that sum to S. Identify base and recursive cases.",
      solution: "count(i, rem): if rem == 0 return 1 (found one). If i == n return 0 (exhausted). Recursive case: count(i+1, rem) + count(i+1, rem - a[i]). Two choices per element → O(2^n). With memoization on (i, rem) it becomes O(n·S).",
    },
    {
      difficulty: "Hard",
      question: "Use a single queue to implement a stack: push must be O(n), pop O(1).",
      solution: "On push(x): enqueue x, then rotate — dequeue the previous (size-1) elements and re-enqueue them. New element is now at the front. pop = dequeue (O(1)). top = front (O(1)). Costs O(n) per push.",
    },
  ],
  practice: {
    easy: [
      { q: "Write a recursion to compute the sum of digits of n." },
      { q: "Reverse a string using a stack." },
      { q: "Use a stack to check if a parenthesis string '({[]})' is balanced." },
      { q: "Implement a queue using two stacks." },
      { q: "Compute n-th Fibonacci recursively, then iteratively, and compare times for n=35." },
    ],
    medium: [
      { q: "Convert an infix expression to postfix using the shunting-yard algorithm." },
      { q: "Implement a min-stack: O(1) push, pop, getMin." },
      { q: "Generate all permutations of a string using backtracking." },
      { q: "Print all subsets of an n-element array." },
      { q: "Implement a circular queue with fixed capacity in C++ without using std::queue." },
    ],
    hard: [
      { q: "Solve N-Queens for n=8 and count the number of distinct solutions." },
      { q: "Solve a 9x9 Sudoku puzzle using backtracking with pruning." },
      { q: "Convert a deep recursion (depth 10⁶) into iteration using an explicit stack." },
      { q: "Largest rectangle in a histogram using a monotonic stack in O(n)." },
      { q: "Sliding window maximum in O(n) using a deque." },
    ],
    fast: [
      { q: "FAST-style: Trace the call stack for permute('abc') step by step, showing the active frames at the deepest point." },
      { q: "Implement an arithmetic expression evaluator supporting + - * / and parentheses on infix input using two stacks (operators and operands)." },
      { q: "Given a maze represented as a grid, count distinct paths from (0,0) to (n-1, m-1) moving only right/down using recursion. Add memoization." },
    ],
    interview: [
      { q: "Tower of Hanoi: print the moves to transfer n disks from A to C using B." },
      { q: "Implement a queue using a circular buffer in C; expose isFull and isEmpty correctly." },
    ],
  },
  challenges: [
    { q: "Implement the Knight's tour on an n×n board using Warnsdorff's heuristic and compare with naive backtracking." },
    { q: "Dry-run: trace fib(6) and count how many times fib(2) is computed." },
    { q: "Debug: a candidate's queue (circular array) reports 'full' when it has just one element after wraparound. Identify the bug." },
  ],
  interactive: [
    { title: "Recursion stack visualizer", description: "Type any recursive function; watch frames pile up and unwind with values inspected at each step." },
    { title: "Backtracking step-through", description: "Step through N-Queens or Sudoku one decision at a time; choose to manually try a branch or accept the algorithm's choice." },
    { title: "Stack vs queue race", description: "Same insertion order, two containers — watch the difference in output sequence." },
  ],
  assessment: {
    mcqs: [
      { q: "Which traversal uses a queue?", options: ["DFS", "BFS", "Inorder", "Postorder"], answer: 1 },
      { q: "A tail-recursive call can theoretically be optimized to:", options: ["A goto/loop", "A stack frame", "A heap allocation", "A coroutine"], answer: 0 },
      { q: "Naive Fibonacci complexity:", options: ["O(n)", "O(n log n)", "O(2^n)", "O(n²)"], answer: 2 },
      { q: "Best way to implement a queue with two stacks for amortized O(1) per op:", options: ["Push on s1, pop from s2 (transfer when s2 empty)", "Push and pop on s1 only", "Push on s2, pop from s1", "Cannot be done"], answer: 0 },
      { q: "Which is required for a recursion to terminate?", options: ["Tail call", "Base case reachable from every path", "Memoization", "Iterative wrapper"], answer: 1 },
    ],
    truefalse: [
      { q: "DFS can be implemented either with recursion or with an explicit stack.", answer: true },
      { q: "A circular queue with capacity k can hold k+1 elements.", answer: false, explain: "Capacity is k, period." },
      { q: "Backtracking always has exponential time complexity.", answer: false, explain: "With strong pruning it can be polynomial on many instances." },
      { q: "Java guarantees tail-call optimization.", answer: false },
    ],
    coding: [
      { q: "Implement isBalanced(s) for parenthesis matching across (, [, {." },
      { q: "Print all paths from root to leaf of a binary tree using recursion + backtracking." },
    ],
    dryrun: [
      { q: "Trace the call stack for hanoi(3, A, C, B). List the moves printed in order." },
      { q: "Trace a circular queue of capacity 4 with operations: enq 1, enq 2, enq 3, deq, enq 4, enq 5, deq, deq. Show front, back, count after each." },
    ],
    conceptual: [
      { q: "Why must a recursive function eventually return without recursing?" },
      { q: "Give one situation where iteration is strictly better than recursion and one where recursion is clearly better." },
    ],
  },
  commonMistakes: [
    "Missing base case → infinite recursion → stack overflow",
    "Forgetting to undo state in backtracking (mutating without restoration)",
    "Confusing front/back wraparound in circular queues",
    "Computing recursive subproblems repeatedly (Fibonacci without memo)",
    "Returning a reference to a local stack variable",
    "Calling top() / front() on an empty container without checking empty()",
  ],
};
