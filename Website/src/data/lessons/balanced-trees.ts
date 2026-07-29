import type { Lesson } from "../lesson-types";

export const lesson: Lesson = {
  slug: "balanced-trees",
  title: "Balanced Trees — AVL, 2-3 & B-Trees",
  tagline: "Self-balancing trees that guarantee O(log n) — forever.",
  overview: {
    what: "AVL trees are BSTs that maintain the invariant: for every node, |height(left) − height(right)| ≤ 1. After each insert/delete, rotations restore balance. 2-3 trees allow nodes with 2 or 3 children and 1 or 2 keys, kept perfectly balanced by splitting up. B-trees are the multi-way generalization optimized for disk: each node holds many keys, branching factor in the hundreds, designed to minimize disk I/Os.",
    why: "A vanilla BST can degenerate to O(n) per operation. Real systems (databases, file systems, in-memory ordered maps) cannot accept that. AVL guarantees O(log n) operations strictly. B-trees power every major database index (MySQL InnoDB, PostgreSQL, MongoDB, file systems like NTFS, HFS+, ext4).",
    applications: [
      "std::map and std::set use Red-Black trees (a close cousin of AVL)",
      "Java's TreeMap = Red-Black tree",
      "B-trees / B+ trees in every relational database index",
      "File systems: B-tree-based directory indexes",
      "2-3 trees as the theoretical model behind Red-Black trees",
    ],
    prerequisites: ["BST operations", "Tree height and rotations intuition", "Big-O on logarithmic recurrences"],
  },
  outcomes: [
    "Compute balance factor of any node and identify imbalanced nodes",
    "Apply LL, RR, LR, RL rotations correctly",
    "Insert and delete into an AVL tree maintaining balance",
    "Trace insertions into 2-3 trees and B-trees, performing splits/merges",
    "Compare AVL vs Red-Black vs B-tree by use case (in-memory vs disk)",
  ],
  concept: [
    { heading: "Why balance matters", body: "BST operations are O(h). If h = O(log n), great. If h = O(n) (skewed), terrible. Balanced trees enforce h = O(log n) by detecting imbalance and rotating to restore it." },
    { heading: "AVL balance factor", body: "BF(node) = height(left) − height(right). AVL requires |BF| ≤ 1 for every node. After insert/delete walks back up, recompute heights and check BF. If |BF| > 1, rotate." },
    { heading: "Four rotation cases", body: "LL (left-left heavy): right rotation. RR: left rotation. LR (left subtree, right-heavy child): left-rotate the child, then right-rotate the node. RL: right-rotate the child, then left-rotate. Each rotation is O(1) — only a few pointer changes." },
    { heading: "AVL insert and delete", body: "Insert: BST-insert, then walk up updating heights and rotating at the first imbalanced ancestor. Delete: BST-delete, walk up; may require multiple rotations (unlike insert, which needs at most one). Worst-case h = 1.44·log₂(n+2), so AVL is among the tightest balanced trees." },
    { heading: "2-3 tree", body: "A perfectly balanced multi-way tree. Every node is a 2-node (1 key, 2 children) or 3-node (2 keys, 3 children). All leaves at the same depth. Insertion never grows a single subtree — it grows the entire tree upward by splitting when a node overflows." },
    { heading: "2-3 insertion", body: "Find the appropriate leaf. If it's a 2-node, promote to 3-node. If a 3-node, split into two 2-nodes and promote the middle key into the parent; recurse upward. If the root splits, the tree grows by one level." },
    { heading: "B-tree", body: "Generalization with branching factor t (each node holds [t-1, 2t-1] keys, [t, 2t] children). Designed for disk: nodes match disk pages (4 KB). Tree height is O(log_t n) — with t = 100, even a billion records fit in 5 levels. Each operation does O(log_t n) disk reads." },
    { heading: "B-tree operations", body: "Search: at each node, binary search keys, descend to correct child. Insert: search to leaf, insert; if overflow, split node, promote median to parent, recurse upward. Delete: more complex — may underflow, requiring borrow from sibling or merge of two siblings with a parent key brought down." },
  ],
  visual: [
    { title: "AVL rotation animation", description: "Show a tree becoming unbalanced after an insertion. The imbalanced node highlights in red. Arrows draw the rotation: child becomes new root, old root becomes child, middle subtree swings to the other side. Heights recompute and BF returns to ≤ 1." },
    { title: "All four AVL rotation cases", description: "A 4-panel grid demonstrates LL, RR, LR, RL on small trees. Each panel shows before/after and highlights the rotated subtree." },
    { title: "2-3 insertion with split-up", description: "Insert keys one at a time. When a 3-node tries to accept a fourth key, it splits visually: the middle key floats up to its parent (which may also split, cascading)." },
    { title: "B-tree disk metaphor", description: "Each B-tree node is a disk page; arrows from RAM to disk show only O(log_t n) pages loaded per query. A counter compares with a binary tree's O(log_2 n) page loads." },
    { title: "AVL vs Red-Black side-by-side", description: "Same insertion sequence into both trees; AVL is slightly shorter but does more rotations on insert. Counters track height and total rotations." },
  ],
  code: [
    {
      lang: "cpp",
      title: "C++ — AVL Tree with all four rotations",
      code: `struct Node {
    int key, h = 1;
    Node *l = nullptr, *r = nullptr;
    Node(int k) : key(k) {}
};

int H(Node* n) { return n ? n->h : 0; }
int BF(Node* n) { return n ? H(n->l) - H(n->r) : 0; }
void upd(Node* n) { n->h = 1 + std::max(H(n->l), H(n->r)); }

Node* rotR(Node* y) {
    Node *x = y->l, *T = x->r;
    x->r = y; y->l = T;
    upd(y); upd(x);
    return x;
}
Node* rotL(Node* x) {
    Node *y = x->r, *T = y->l;
    y->l = x; x->r = T;
    upd(x); upd(y);
    return y;
}

Node* insert(Node* n, int k) {
    if (!n) return new Node(k);
    if (k < n->key) n->l = insert(n->l, k);
    else if (k > n->key) n->r = insert(n->r, k);
    else return n;                          // duplicate
    upd(n);

    int bf = BF(n);
    if (bf > 1 && k < n->l->key) return rotR(n);                         // LL
    if (bf < -1 && k > n->r->key) return rotL(n);                        // RR
    if (bf > 1 && k > n->l->key) { n->l = rotL(n->l); return rotR(n); }  // LR
    if (bf < -1 && k < n->r->key) { n->r = rotR(n->r); return rotL(n); } // RL
    return n;
}`,
      explain: "After BST-insert, walk back up updating heights and checking balance factor. Each of the four imbalance signatures triggers a unique rotation. Each rotation is O(1) pointer surgery; the whole insert is O(log n).",
    },
    {
      lang: "java",
      title: "Java — B-tree search and split",
      code: `class BTreeNode {
    int n;                    // number of keys
    int[] keys;
    BTreeNode[] children;
    boolean leaf;
    final int t;              // minimum degree

    BTreeNode(int t, boolean leaf) {
        this.t = t; this.leaf = leaf;
        keys = new int[2*t - 1];
        children = new BTreeNode[2*t];
    }

    BTreeNode search(int k) {
        int i = 0;
        while (i < n && k > keys[i]) i++;
        if (i < n && k == keys[i]) return this;
        return leaf ? null : children[i].search(k);
    }

    void splitChild(int i, BTreeNode y) {       // y = children[i], full
        BTreeNode z = new BTreeNode(y.t, y.leaf);
        z.n = t - 1;
        for (int j = 0; j < t - 1; j++) z.keys[j] = y.keys[j + t];
        if (!y.leaf)
            for (int j = 0; j < t; j++) z.children[j] = y.children[j + t];
        y.n = t - 1;
        for (int j = n; j >= i + 1; j--) children[j + 1] = children[j];
        children[i + 1] = z;
        for (int j = n - 1; j >= i; j--) keys[j + 1] = keys[j];
        keys[i] = y.keys[t - 1];
        n++;
    }
}`,
      explain: "Each B-tree node stores up to 2t-1 keys. Splitting a full child y: middle key (y.keys[t-1]) promotes to parent; right half forms new sibling z; parent now has one more key and one more child.",
    },
  ],
  complexity: [
    { operation: "AVL search/insert/delete", best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(n)" },
    { operation: "AVL height bound", best: "≈ log₂ n", average: "≈ 1.2 log n", worst: "≤ 1.44 log₂(n+2)", space: "—" },
    { operation: "2-3 tree all ops", best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(n)" },
    { operation: "B-tree all ops (disk)", best: "O(log_t n) I/Os", average: "O(log_t n)", worst: "O(log_t n)", space: "O(n)" },
  ],
  comparisons: [
    {
      a: "AVL Tree",
      b: "Red-Black Tree",
      rows: [
        { criterion: "Balance criterion", a: "|BF| ≤ 1 (strict)", b: "Color rules (looser)" },
        { criterion: "Height bound", a: "≤ 1.44 log n", b: "≤ 2 log n" },
        { criterion: "Search speed", a: "Slightly faster (shorter)", b: "Slightly slower" },
        { criterion: "Insert/delete rotations", a: "More (stricter balance)", b: "Fewer" },
        { criterion: "Use cases", a: "Lookup-heavy workloads", b: "General-purpose (std::map, TreeMap)" },
      ],
    },
    {
      a: "AVL Tree (in-memory)",
      b: "B-Tree (disk)",
      rows: [
        { criterion: "Branching factor", a: "2", b: "100s" },
        { criterion: "Optimized for", a: "RAM access", b: "Disk pages" },
        { criterion: "Height for 10⁹ keys", a: "≈ 43", b: "≈ 5" },
        { criterion: "Operation cost dominated by", a: "Comparisons", b: "Disk I/O" },
      ],
    },
  ],
  worked: [
    {
      difficulty: "Easy",
      question: "Insert 10, 20, 30 into an empty AVL tree. Show rotation.",
      solution: "Insert 10. Insert 20 (right child). Insert 30 (right of 20). BF(10) = -2 → RR case → rotL(10): 20 becomes root, 10 left, 30 right. Final tree: 20(10, 30).",
    },
    {
      difficulty: "Medium",
      question: "Insert 10, 30, 20 into an empty AVL tree. Identify rotation type and show steps.",
      solution: "Insert 10, then 30 (right). Insert 20 (left of 30). BF(10) = -2; 20 < 30 so RL case. First rotR(30): 30's left subtree becomes new structure → child 20, with 30 as right child. Then rotL(10): 20 becomes root, 10 left, 30 right.",
    },
    {
      difficulty: "Hard",
      question: "Insert into a 2-3 tree: 50, 30, 70, 20, 40, 60, 80, 10. Show splits.",
      solution: "50 alone. 30 → 3-node [30,50]. 70 → split: middle 50 up, [30] and [70] children. 20 → [20,30]. 40 → split [20,30,40]: 30 up; new root [30,50] with children [20],[40],[70]. 60 → [60,70]. 80 → split [60,70,80]: 70 up; root becomes [30,50,70] over four 2-node leaves. 10 → leaf [10,20]. Final: root [30,50,70] with leaves [10,20], [40], [60], [80].",
    },
  ],
  practice: {
    easy: [
      { q: "Compute balance factor for each node of a given AVL tree." },
      { q: "Implement rotR and rotL functions and trace on a 3-node tree." },
      { q: "Identify the rotation case (LL, RR, LR, RL) for given imbalance patterns." },
      { q: "Insert 5 keys into a 2-3 tree and show node types after each insertion." },
      { q: "Compute the height of a B-tree of minimum degree t storing n keys (formula)." },
    ],
    medium: [
      { q: "Insert 25 random keys into an AVL tree and report the final height. Compare with vanilla BST." },
      { q: "Implement AVL deletion handling multi-rotation propagation up the tree." },
      { q: "Write a function isAVL(root) that verifies the height-balance invariant." },
      { q: "Search a key in a B-tree of degree t = 50 with 1 million records — count comparisons and node loads." },
      { q: "Convert a sorted array into a height-balanced BST recursively." },
    ],
    hard: [
      { q: "Implement an AVL tree with parent pointers; use them to make iterator next() amortized O(1)." },
      { q: "Implement a B-tree split-on-overflow during insertion (full handler)." },
      { q: "Prove that AVL height ≤ 1.44 log₂(n+2) using Fibonacci-tree counting argument." },
      { q: "Implement deletion in a B-tree handling underflow (borrow from sibling or merge)." },
      { q: "Implement a left-leaning Red-Black tree based on 2-3 tree semantics." },
    ],
    fast: [
      { q: "FAST exam-style: Insert 30, 20, 10, 25, 5, 35, 40 into an empty AVL tree. Show the tree after each insert and identify rotations." },
      { q: "Given a 2-3 tree, insert key K and trace the split cascade. Show all intermediate trees." },
      { q: "Why is the height of an AVL tree O(log n)? Sketch the Fibonacci-tree argument formally." },
    ],
    interview: [
      { q: "Explain Red-Black tree invariants and why they ensure O(log n) operations." },
      { q: "Why do databases prefer B+ trees over BSTs for indexes? Discuss disk I/O." },
    ],
  },
  challenges: [
    { q: "Implement an order-statistic AVL tree (each node stores subtree size) supporting kth() and rank() in O(log n)." },
    { q: "Dry-run: insert 1..15 sequentially into AVL; count total rotations." },
    { q: "Debug: a candidate's AVL insert updates the height before recursing, breaking balance. Fix and explain." },
  ],
  interactive: [
    { title: "AVL rotation simulator", description: "Type any insertion sequence; tree animates, highlighting imbalanced nodes and performing the correct rotation in slow motion." },
    { title: "2-3 split cascade", description: "Insert keys and watch overflow splits propagate up; the tree grows upward when the root splits." },
    { title: "B-tree disk visualizer", description: "Adjust degree t; UI computes node count, tree height, and disk I/Os for a chosen n." },
  ],
  assessment: {
    mcqs: [
      { q: "AVL balance factor allowed range:", options: ["[0,1]", "[-1,1]", "[-2,2]", "Any"], answer: 1 },
      { q: "LR imbalance requires:", options: ["1 left rotation", "1 right rotation", "Left then right rotation", "Right then left rotation"], answer: 2 },
      { q: "Height of an AVL tree with n nodes is bounded by:", options: ["O(√n)", "O(log n)", "O(n)", "O(n log n)"], answer: 1 },
      { q: "B-tree of minimum degree t has at most how many keys per node?", options: ["t", "t-1", "2t-1", "2t"], answer: 2 },
      { q: "2-3 tree leaves are:", options: ["At varying depths", "Always at the same depth", "Always 2-nodes", "Always 3-nodes"], answer: 1 },
    ],
    truefalse: [
      { q: "AVL deletion can require more than one rotation.", answer: true },
      { q: "Red-Black trees have lower height bound than AVL trees.", answer: false },
      { q: "B-trees are designed for in-memory storage.", answer: false, explain: "They are designed for disk-resident data." },
      { q: "Every 2-3 tree is also a B-tree.", answer: true, explain: "It's a B-tree of minimum degree 2." },
    ],
    coding: [
      { q: "Implement AVL::insert with all four rotations." },
      { q: "Implement B-tree::searchKey with binary search inside each node." },
    ],
    dryrun: [
      { q: "Insert into AVL: 50, 25, 75, 10, 30, 60, 80, 5. Show tree + rotations." },
      { q: "Insert into 2-3 tree: 1, 2, 3, 4, 5, 6, 7. Show splits." },
    ],
    conceptual: [
      { q: "Why does AVL require strict balance while Red-Black tolerates more skew?" },
      { q: "When would you choose AVL over Red-Black?" },
    ],
  },
  commonMistakes: [
    "Confusing the four rotation cases (especially LR vs RL direction)",
    "Updating heights before performing rotations",
    "Forgetting that AVL deletion may need rotations all the way to the root",
    "Treating 2-3 tree like BST and growing one subtree (must split-up)",
    "Confusing B-tree minimum degree t with branching factor (2t)",
    "Not recomputing height after a rotation",
  ],
};
