import type { Lesson } from "../lesson-types";

export const lesson: Lesson = {
  slug: "binary-trees-bst",
  title: "Binary Trees & Binary Search Trees",
  tagline: "Hierarchical structure that powers searching, parsing, and almost every database index.",
  overview: {
    what: "A binary tree is a hierarchical structure in which each node has at most two children (left and right). Special forms include full, complete, perfect, balanced, and skewed trees. A Binary Search Tree (BST) imposes ordering: for every node, all keys in the left subtree are < node's key < all keys in the right subtree. This invariant supports O(h) search, insert, delete.",
    why: "Trees model recursion in the wild: file systems, DOM, expression trees, decision trees, syntax trees. BSTs are the conceptual ancestor of every ordered map and index (TreeMap, std::set, database B-tree indexes). Understanding skewness motivates the need for self-balancing trees (AVL, Red-Black).",
    applications: [
      "TreeMap / TreeSet (Java) and std::map / std::set (C++) — ordered key→value storage",
      "Database indexes — every B-tree is a generalization of a BST",
      "Compiler ASTs and expression evaluation",
      "Decision trees for ML and games (minimax with alpha-beta)",
      "Huffman trees for compression",
    ],
    prerequisites: ["Recursion", "Pointers / references", "Stack & queue (for iterative traversals)"],
  },
  outcomes: [
    "Distinguish full, complete, perfect, and balanced binary trees",
    "Implement BST insert, search, and delete (all three deletion cases)",
    "Perform inorder, preorder, postorder, and level-order traversal recursively and iteratively",
    "Compute height, diameter, lowest common ancestor",
    "Identify skewness and explain why it triggers the need for balancing",
  ],
  concept: [
    { heading: "Binary tree vocabulary", body: "Root: topmost node. Leaf: no children. Internal: at least one child. Height: edges on longest root-to-leaf path. Depth of v: edges from root to v. Height of empty tree = -1 by convention; single node = 0. Size = node count. Level = depth + 1 by some conventions." },
    { heading: "Special binary trees", body: "Full: every node has 0 or 2 children. Complete: every level full except possibly the last, which fills left-to-right. Perfect: full AND all leaves at the same depth (2^(h+1)-1 nodes). Balanced: heights of left and right subtrees differ by at most 1 at every node. Skewed: every node has only one child (degenerates to a linked list)." },
    { heading: "Binary search tree property", body: "For every node n: every key in left(n) < n.key < every key in right(n). This must hold recursively for ALL descendants, not just immediate children. Inorder traversal of a BST yields keys in sorted order." },
    { heading: "BST search", body: "Start at root. If key < root, recurse left. If key > root, recurse right. If equal, found. Time = O(h). For a balanced BST, h = O(log n); for a skewed BST, h = O(n)." },
    { heading: "BST insertion", body: "Search for the key; when you fall off (null), attach a new node there. Always inserts at a leaf. Cost O(h). Inserting sorted data into a vanilla BST produces a skewed tree." },
    { heading: "BST deletion — three cases", body: "Case 1: leaf — simply remove. Case 2: one child — splice child up to replace the node. Case 3: two children — find the inorder successor (min of right subtree) or predecessor, copy its key into the node, recursively delete that successor (which has at most one child)." },
    { heading: "Traversals", body: "Inorder (LNR): visits a BST in sorted order. Preorder (NLR): used to serialize the tree. Postorder (LRN): used to safely delete the tree. Level-order: BFS using a queue, prints level by level." },
    { heading: "Skewness and motivation for balance", body: "If keys arrive in sorted order, BST degenerates to a linked list with O(n) per operation. Worst-case performance is bound by tree height. Self-balancing trees (AVL, Red-Black) restructure on insert/delete to keep h = O(log n)." },
  ],
  visual: [
    { title: "BST insertion animation", description: "Keys insert one at a time. Each new key walks down from the root, lighting up the comparison path, and attaches as a leaf. The right subtree highlights when the comparison goes right, left otherwise." },
    { title: "Inorder traversal trace", description: "Recursive frames push down the left spine, pop and print, then recurse right. The output order materializes at the bottom in sorted sequence." },
    { title: "Three deletion cases", description: "Three side-by-side trees demonstrate each case: leaf removal, single-child splice, two-child successor swap. The successor 'walks' from the deletion node to the left spine of the right subtree." },
    { title: "Level-order BFS", description: "A queue at the bottom shows nodes entering and leaving. Each dequeue paints the node and enqueues its children. Levels appear in left-to-right order." },
    { title: "Skewed vs balanced", description: "Same 10 keys inserted in sorted order vs random order produce two trees side by side: one a tall chain (height 9), one a bushy log-height tree." },
  ],
  code: [
    {
      lang: "cpp",
      title: "C++ — BST implementation",
      code: `struct Node {
    int key;
    Node *left = nullptr, *right = nullptr;
    Node(int k) : key(k) {}
};

Node* insert(Node* root, int k) {
    if (!root) return new Node(k);
    if (k < root->key) root->left  = insert(root->left,  k);
    else if (k > root->key) root->right = insert(root->right, k);
    return root;
}

Node* search(Node* root, int k) {
    if (!root || root->key == k) return root;
    return k < root->key ? search(root->left, k) : search(root->right, k);
}

Node* minNode(Node* n) { while (n->left) n = n->left; return n; }

Node* erase(Node* root, int k) {
    if (!root) return nullptr;
    if (k < root->key)  root->left  = erase(root->left,  k);
    else if (k > root->key) root->right = erase(root->right, k);
    else {
        if (!root->left)  { Node* r = root->right; delete root; return r; }
        if (!root->right) { Node* l = root->left;  delete root; return l; }
        Node* succ = minNode(root->right);
        root->key = succ->key;
        root->right = erase(root->right, succ->key);
    }
    return root;
}

void inorder(Node* root, std::vector<int>& out) {
    if (!root) return;
    inorder(root->left, out);
    out.push_back(root->key);
    inorder(root->right, out);
}

int height(Node* root) {
    if (!root) return -1;
    return 1 + std::max(height(root->left), height(root->right));
}`,
      explain: "All operations follow the same shape: compare, recurse on the appropriate side, or terminate. Deletion is the only operation with three cases. Always reassign the returned subtree to root->left or root->right.",
    },
    {
      lang: "cpp",
      title: "C++ — Iterative level-order (BFS) traversal",
      code: `void levelOrder(Node* root) {
    if (!root) return;
    std::queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        Node* n = q.front(); q.pop();
        std::cout << n->key << ' ';
        if (n->left)  q.push(n->left);
        if (n->right) q.push(n->right);
    }
}`,
      explain: "BFS on a tree is the canonical queue use case. Replacing the queue with a stack gives DFS preorder.",
    },
    {
      lang: "java",
      title: "Java — Validate BST invariant",
      code: `static boolean isBST(Node root) { return check(root, null, null); }

private static boolean check(Node n, Integer lo, Integer hi) {
    if (n == null) return true;
    if (lo != null && n.key <= lo) return false;
    if (hi != null && n.key >= hi) return false;
    return check(n.left, lo, n.key) && check(n.right, n.key, hi);
}`,
      explain: "The naive 'check left.key < n.key < right.key' is WRONG — it fails on grandchildren. Carry the valid (lo, hi) range down the recursion.",
    },
  ],
  complexity: [
    { operation: "Search / Insert / Delete (balanced)", best: "O(log n)", average: "O(log n)", worst: "O(log n)", space: "O(log n) recursion" },
    { operation: "Search / Insert / Delete (skewed)", best: "O(1)", average: "O(n)", worst: "O(n)", space: "O(n)" },
    { operation: "Inorder traversal", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(h)" },
    { operation: "Level-order (BFS)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(w) — max width" },
    { operation: "Height computation", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(h)" },
  ],
  comparisons: [
    {
      a: "BST",
      b: "Hash Table",
      rows: [
        { criterion: "Search average", a: "O(log n)", b: "O(1)" },
        { criterion: "Ordered iteration", a: "Native (inorder)", b: "Not supported" },
        { criterion: "Range queries", a: "Yes (O(log n + k))", b: "No" },
        { criterion: "Worst case", a: "O(n) without balance", b: "O(n) on collisions" },
      ],
    },
    {
      a: "Balanced BST",
      b: "Skewed BST",
      rows: [
        { criterion: "Height", a: "O(log n)", b: "O(n)" },
        { criterion: "Search time", a: "O(log n)", b: "O(n)" },
        { criterion: "Cause", a: "Random / balanced insertion order", b: "Sorted insertion order" },
        { criterion: "Fix", a: "—", b: "AVL / Red-Black / treap" },
      ],
    },
  ],
  worked: [
    {
      difficulty: "Easy",
      question: "Insert 50, 30, 70, 20, 40, 60, 80 into an empty BST. Draw the result. Then list the inorder traversal.",
      solution: "Root 50. 30 left. 70 right. 20 left of 30. 40 right of 30. 60 left of 70. 80 right of 70. Inorder: 20, 30, 40, 50, 60, 70, 80.",
    },
    {
      difficulty: "Medium",
      question: "Delete 50 from the tree above. Show the new tree.",
      solution: "50 has two children. Inorder successor = min of right subtree = 60. Copy 60 into 50's slot. Delete original 60 (a leaf). Result root: 60; subtrees unchanged except 70's left now nullptr.",
    },
    {
      difficulty: "Hard",
      question: "Given preorder and inorder traversals, reconstruct the binary tree (assume unique keys).",
      solution: "First element of preorder is the root. Find it in inorder: keys to the left form the left subtree, to the right form the right subtree. Recursively reconstruct using corresponding preorder slices. Hash inorder positions for O(n) total.",
    },
  ],
  practice: {
    easy: [
      { q: "Count nodes in a binary tree recursively." },
      { q: "Find the maximum value in a BST." },
      { q: "Implement iterative inorder traversal using a stack." },
      { q: "Print all leaves of a binary tree." },
      { q: "Check if a binary tree is a full binary tree." },
    ],
    medium: [
      { q: "Compute the diameter of a binary tree (longest path between any two nodes) in O(n)." },
      { q: "Validate that a binary tree is a BST." },
      { q: "Find the lowest common ancestor of two keys in a BST." },
      { q: "Convert a sorted array into a balanced BST." },
      { q: "Print the right view of a binary tree." },
    ],
    hard: [
      { q: "Serialize and deserialize a binary tree (Leetcode-style)." },
      { q: "Find the k-th smallest element in a BST in O(h + k)." },
      { q: "Convert a binary tree into its mirror image in place." },
      { q: "Given two BSTs, merge them into a balanced BST in O(m+n)." },
      { q: "Find the inorder predecessor and successor of a key in a BST without parent pointers." },
    ],
    fast: [
      { q: "FAST exam-style: Insert keys 8, 3, 10, 1, 6, 14, 4, 7, 13 into an empty BST. Then delete 3 and show all three deletion sub-cases applied appropriately." },
      { q: "Write a recursive function isBalanced(root) that returns true if for every node, left and right subtree heights differ by at most 1, in O(n)." },
      { q: "Given a BST, write a function to find the LCA of two nodes using the BST property (no parent pointers, O(h))." },
    ],
    interview: [
      { q: "Find the LCA in a general binary tree (not BST) in O(n)." },
      { q: "Flatten a binary tree into a right-skewed linked list using preorder." },
    ],
  },
  challenges: [
    { q: "Implement a BST iterator with O(h) memory and amortized O(1) next() (Morris-like)." },
    { q: "Dry-run: insert random permutation of 1..15 into a BST and compute the resulting height." },
    { q: "Debug: a student's BST insertion produces 'duplicates' on equal keys — propose a policy decision and fix." },
  ],
  interactive: [
    { title: "BST playground", description: "Insert/delete keys via a text input; tree redraws live with traversal output panes underneath." },
    { title: "Skewness demo", description: "Try inserting sorted vs random vs reverse-sorted keys; height meter shows the disaster." },
    { title: "Build from traversals", description: "Given preorder + inorder, drag nodes into the reconstructed tree; UI verifies correctness." },
  ],
  assessment: {
    mcqs: [
      { q: "Inorder traversal of a BST yields:", options: ["Random order", "Sorted order", "Level order", "Reverse sorted order"], answer: 1 },
      { q: "Deleting a node with two children requires finding:", options: ["Any leaf", "The inorder successor or predecessor", "The root", "The deepest node"], answer: 1 },
      { q: "Maximum number of nodes in a perfect binary tree of height h:", options: ["h", "2h", "2^(h+1) - 1", "h²"], answer: 2 },
      { q: "Worst-case height of a BST with n nodes:", options: ["O(log n)", "O(√n)", "O(n)", "O(n log n)"], answer: 2 },
      { q: "Which traversal is naturally implemented with a queue?", options: ["Preorder", "Inorder", "Postorder", "Level-order"], answer: 3 },
    ],
    truefalse: [
      { q: "Every full binary tree is also complete.", answer: false, explain: "Full requires 0 or 2 children; complete requires last-level fill from left — they're independent properties." },
      { q: "A BST with all unique keys has a unique inorder traversal output.", answer: true },
      { q: "Deletion from a BST never increases the tree's height.", answer: false, explain: "Counterexample: removing a leaf from a perfect tree of height 2 can leave the same height; removing internal can reduce. But certain reshuffles via inorder-successor can leave height unchanged. The claim 'never increases' is true; the claim 'always reduces' is false." },
      { q: "Insertion order affects BST height.", answer: true },
    ],
    coding: [
      { q: "Write recursive functions for height, size, and isBalanced for a binary tree." },
      { q: "Implement BST::deleteKey(int k) correctly handling all three cases." },
    ],
    dryrun: [
      { q: "Trace BST deletion of key=50 from the tree 50(30(20,40),70(60,80))." },
      { q: "Trace level-order traversal on the same tree using a queue. Show queue state at each step." },
    ],
    conceptual: [
      { q: "Why does an inorder traversal of a BST produce sorted output?" },
      { q: "Give an insertion order that makes BST behave like a linked list. Why is this problematic?" },
    ],
  },
  commonMistakes: [
    "Validating BST by comparing only with immediate children (must use lo/hi range)",
    "Forgetting to reassign root->left = insert(...) — losing the new subtree",
    "Confusing complete vs full vs perfect binary trees",
    "Mishandling deletion case 3 (forgetting to recursively delete the successor)",
    "Allowing duplicates without a policy and breaking the strict inequality",
    "Computing height of empty tree as 0 instead of -1 (or vice versa) and breaking downstream formulas",
  ],
};
