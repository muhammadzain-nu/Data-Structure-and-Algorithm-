import type { Lesson } from "../lesson-types";

export const lesson: Lesson = {
  slug: "graphs",
  title: "Graphs, MST & Shortest Paths",
  tagline: "Modeling relationships — and the algorithms that traverse them.",
  overview: {
    what: "A graph G = (V, E) is a set of vertices V and edges E ⊆ V × V. Edges may be directed or undirected, weighted or unweighted. Representations: adjacency matrix (V² space, O(1) edge test) and adjacency list (V+E space, faster iteration over neighbors). Core algorithms: DFS, BFS, topological sort (DAGs), Kruskal/Prim for Minimum Spanning Tree, and Dijkstra / Bellman-Ford / Floyd-Warshall for shortest paths.",
    why: "Graphs model almost every real-world network: roads, the web, social networks, dependencies, circuits, computational pipelines. Mastering graph algorithms is the single highest-leverage topic for interviews and competitive programming, and a prerequisite for every advanced topic (network flow, matching, NP-hard problems).",
    applications: [
      "Google Maps shortest path (Dijkstra)",
      "Network routing (link-state, distance-vector)",
      "Dependency resolution / build systems (topological sort)",
      "Web crawling, social network analysis (BFS/DFS)",
      "Image segmentation (graph cuts), recommendation (random walks)",
    ],
    prerequisites: ["Recursion", "Queues and stacks", "Heaps (for Dijkstra)", "Disjoint set / union-find (for Kruskal)"],
  },
  outcomes: [
    "Choose adjacency matrix vs adjacency list given V, E, and operation mix",
    "Implement DFS and BFS recursively and iteratively",
    "Compute topological order on a DAG",
    "Find an MST using both Kruskal and Prim, and choose between them",
    "Solve single-source shortest path using Dijkstra (and know its limitations)",
  ],
  concept: [
    { heading: "Vocabulary", body: "Directed vs undirected. Weighted vs unweighted. Connected vs disconnected. Cycle, path, walk. Tree = connected acyclic graph with |V|-1 edges. DAG = directed acyclic graph. Dense (|E| ≈ V²) vs sparse (|E| = O(V))." },
    { heading: "Representations", body: "Adjacency matrix: V×V bool/int matrix. O(1) edge test, O(V) neighbor iteration. Wastes O(V²) memory when sparse. Adjacency list: array of lists; one entry per edge. O(V+E) memory, O(deg(v)) neighbor iteration, O(deg(v)) edge test. Standard choice for sparse graphs." },
    { heading: "BFS", body: "Use a queue. Visit vertices in order of distance (number of edges) from the source. Computes single-source shortest path in unweighted graphs. O(V+E). Used for: shortest paths in unweighted graphs, level-order processing, connected component discovery." },
    { heading: "DFS", body: "Use recursion or a stack. Go deep before wide. Classifies edges into tree, back (cycle indicator!), forward, cross. Used for: cycle detection, topological sort, strongly connected components (Tarjan/Kosaraju), bridges and articulation points. O(V+E)." },
    { heading: "Topological sort", body: "Linear ordering of DAG vertices such that for every edge u→v, u comes before v. Kahn's algorithm: repeatedly extract a vertex with in-degree 0, decrement in-degrees of its neighbors. DFS approach: postorder traversal, reverse the order. Both O(V+E). Used for build systems, course prerequisites, task scheduling." },
    { heading: "Minimum Spanning Tree", body: "Given a weighted undirected connected graph, find a subset of edges forming a tree that connects all vertices with minimum total weight. Kruskal: sort edges, greedily add the next cheapest edge that doesn't form a cycle (use Union-Find). Prim: grow a tree from a starting vertex, always adding the cheapest edge crossing the cut." },
    { heading: "Dijkstra's shortest path", body: "Single-source shortest paths in a graph with non-negative weights. Maintain a priority queue of (distance, vertex). Repeatedly extract the closest unsettled vertex, relax outgoing edges. With a binary heap: O((V+E) log V). With a Fibonacci heap: O(E + V log V). Fails on negative weights — must use Bellman-Ford then (O(VE))." },
    { heading: "Floyd-Warshall", body: "All-pairs shortest paths in O(V³). DP: dist[k][i][j] = shortest path using only intermediate vertices in {0..k}. Handles negative weights (no negative cycles). Used when V is small (≤ few hundred)." },
  ],
  visual: [
    { title: "BFS frontier wave", description: "Source pulses out concentric rings of color, one ring per BFS level. The queue at the bottom shows vertices entering and leaving in FIFO order." },
    { title: "DFS depth dive", description: "Recursion frames stack vertically; the cursor dives one edge at a time, backtracking when it hits a dead end. Tree/back/forward edges are color-coded." },
    { title: "Topological sort with Kahn", description: "Vertices with in-degree 0 are highlighted; one extracts at a time; outgoing edges fade and successors' in-degree counters decrement." },
    { title: "Kruskal MST construction", description: "Edges drawn in sorted order; each addition tested against a union-find structure shown beside the graph; cycle-forming edges flash red and are skipped." },
    { title: "Dijkstra step", description: "Priority queue on the side. The closest unsettled vertex extracts (turns green); its neighbors' tentative distances relax (decrease); the PQ reorders." },
  ],
  code: [
    {
      lang: "cpp",
      title: "C++ — BFS and DFS (adjacency list)",
      code: `using Graph = std::vector<std::vector<int>>;

void bfs(const Graph& g, int s) {
    std::vector<int> dist(g.size(), -1);
    std::queue<int> q;
    dist[s] = 0; q.push(s);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : g[u])
            if (dist[v] == -1) { dist[v] = dist[u] + 1; q.push(v); }
    }
}

void dfs(const Graph& g, int u, std::vector<bool>& seen) {
    seen[u] = true;
    for (int v : g[u]) if (!seen[v]) dfs(g, v, seen);
}`,
      explain: "BFS uses a queue and a dist array initialized to -1. DFS uses a seen array and recursion; for graphs with depth > 10⁵, use an explicit stack to avoid stack overflow.",
    },
    {
      lang: "cpp",
      title: "C++ — Dijkstra with min-heap",
      code: `using Edge = std::pair<int, int>;  // (weight, dest)
using Adj  = std::vector<std::vector<Edge>>;

std::vector<long long> dijkstra(const Adj& g, int src) {
    std::vector<long long> dist(g.size(), LLONG_MAX);
    std::priority_queue<std::pair<long long,int>,
                        std::vector<std::pair<long long,int>>,
                        std::greater<>> pq;
    dist[src] = 0;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;            // stale entry — skip
        for (auto [w, v] : g[u])
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
    }
    return dist;
}`,
      explain: "We push duplicates instead of using decrease-key (simpler, still O(E log V)). The 'if (d > dist[u]) continue' line skips stale heap entries left behind after relaxation.",
    },
    {
      lang: "cpp",
      title: "C++ — Kruskal MST with Union-Find",
      code: `struct DSU {
    std::vector<int> par, rk;
    DSU(int n) : par(n), rk(n, 0) { std::iota(par.begin(), par.end(), 0); }
    int find(int x) { return par[x] == x ? x : par[x] = find(par[x]); }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (rk[a] < rk[b]) std::swap(a, b);
        par[b] = a;
        if (rk[a] == rk[b]) ++rk[a];
        return true;
    }
};

long long kruskal(int n, std::vector<std::tuple<int,int,int>>& edges) {
    std::sort(edges.begin(), edges.end());            // sort by weight
    DSU d(n);
    long long cost = 0; int taken = 0;
    for (auto [w, u, v] : edges) {
        if (d.unite(u, v)) { cost += w; if (++taken == n - 1) break; }
    }
    return cost;
}`,
      explain: "Sort edges, scan in order, use union-find to detect cycles. With path compression + union by rank, near-O(α(n)) per op — essentially constant.",
    },
    {
      lang: "java",
      title: "Java — Topological sort via Kahn's algorithm",
      code: `static List<Integer> topo(List<List<Integer>> g) {
    int n = g.size();
    int[] indeg = new int[n];
    for (List<Integer> nbrs : g) for (int v : nbrs) indeg[v]++;
    Deque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
    List<Integer> order = new ArrayList<>();
    while (!q.isEmpty()) {
        int u = q.poll();
        order.add(u);
        for (int v : g.get(u)) if (--indeg[v] == 0) q.add(v);
    }
    return order.size() == n ? order : null;       // null => cycle
}`,
      explain: "Kahn's algorithm: process sources, remove them, repeat. If we can't process all vertices, the graph has a cycle.",
    },
  ],
  complexity: [
    { operation: "BFS / DFS", best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
    { operation: "Topological sort", best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)", space: "O(V)" },
    { operation: "Kruskal MST", best: "O(E log E)", average: "O(E log E)", worst: "O(E log E)", space: "O(V)" },
    { operation: "Prim MST (binary heap)", best: "O(E log V)", average: "O(E log V)", worst: "O(E log V)", space: "O(V+E)" },
    { operation: "Dijkstra (binary heap)", best: "O((V+E) log V)", average: "O((V+E) log V)", worst: "O((V+E) log V)", space: "O(V+E)" },
    { operation: "Bellman-Ford", best: "O(VE)", average: "O(VE)", worst: "O(VE)", space: "O(V)" },
    { operation: "Floyd-Warshall", best: "O(V³)", average: "O(V³)", worst: "O(V³)", space: "O(V²)" },
  ],
  comparisons: [
    {
      a: "Adjacency Matrix",
      b: "Adjacency List",
      rows: [
        { criterion: "Memory", a: "O(V²)", b: "O(V+E)" },
        { criterion: "Edge query", a: "O(1)", b: "O(deg)" },
        { criterion: "Iterate neighbors", a: "O(V)", b: "O(deg)" },
        { criterion: "Best for", a: "Dense graphs", b: "Sparse graphs" },
      ],
    },
    {
      a: "BFS",
      b: "DFS",
      rows: [
        { criterion: "Container", a: "Queue", b: "Stack / recursion" },
        { criterion: "Order", a: "Level by level", b: "Deep first" },
        { criterion: "Shortest path (unweighted)", a: "Yes", b: "No" },
        { criterion: "Use cases", a: "Bipartite check, level traversal", b: "Topo, SCC, bridges" },
      ],
    },
    {
      a: "Kruskal",
      b: "Prim",
      rows: [
        { criterion: "Approach", a: "Edge-based, global", b: "Vertex-based, grow tree" },
        { criterion: "Data structure", a: "Sorted edges + DSU", b: "Priority queue" },
        { criterion: "Best for", a: "Sparse graphs", b: "Dense graphs (with matrix + linear key updates: O(V²))" },
      ],
    },
  ],
  worked: [
    {
      difficulty: "Easy",
      question: "Given graph with vertices {A,B,C,D} and edges A-B, A-C, B-D, run BFS from A. List vertices in visit order.",
      solution: "Queue: [A]. Visit A; enqueue B,C → [B,C]. Visit B; enqueue D → [C,D]. Visit C → [D]. Visit D → []. Order: A,B,C,D.",
    },
    {
      difficulty: "Medium",
      question: "Find MST of K4 with edge weights AB=1, AC=4, AD=3, BC=2, BD=5, CD=6 using Kruskal.",
      solution: "Sort: AB(1), BC(2), AD(3), AC(4), BD(5), CD(6). Add AB (union A,B). Add BC (union with C). Add AD (union with D). Stop (3 edges, n-1). Cost = 1+2+3 = 6.",
    },
    {
      difficulty: "Hard",
      question: "Run Dijkstra from S on: S→A=4, S→B=1, B→A=2, A→C=3, B→C=5. Compute dist[] to all vertices.",
      solution: "Init: dist=[0,∞,∞,∞]. PQ=[(0,S)]. Pop S; relax: dist[A]=4, dist[B]=1. PQ=[(1,B),(4,A)]. Pop B; relax: dist[A]=min(4,1+2)=3, dist[C]=1+5=6. PQ=[(3,A),(4,A stale),(6,C)]. Pop A(3); relax dist[C]=min(6,3+3)=6 (tied). PQ pops (4,A) stale skip, then (6,C). Final: S=0, A=3, B=1, C=6.",
    },
  ],
  practice: {
    easy: [
      { q: "Convert an edge list to an adjacency list in O(V+E)." },
      { q: "Count the number of connected components in an undirected graph." },
      { q: "Check if a graph is bipartite using BFS coloring." },
      { q: "Detect cycle in an undirected graph using DFS." },
      { q: "Print the BFS traversal starting from a given vertex." },
    ],
    medium: [
      { q: "Detect cycle in a directed graph using DFS colors (white/gray/black)." },
      { q: "Find the shortest path in a weighted DAG using topological order + relaxation in O(V+E)." },
      { q: "Compute strongly connected components using Kosaraju's two-pass DFS." },
      { q: "Find bridges in an undirected graph using DFS in O(V+E)." },
      { q: "Compute the diameter of a tree in O(V) using two BFS passes." },
    ],
    hard: [
      { q: "Implement Tarjan's algorithm for articulation points." },
      { q: "Implement Dijkstra with decreaseKey using an indexed priority queue." },
      { q: "Find shortest path in a graph with negative weights (no negative cycle) using Bellman-Ford and report negative cycle if any." },
      { q: "Implement Floyd-Warshall and reconstruct paths." },
      { q: "Solve: given a 2D grid with obstacles, find shortest path from top-left to bottom-right with 4-directional movement using BFS." },
    ],
    fast: [
      { q: "FAST exam-style: Run topological sort on the DAG with edges: 5→2, 5→0, 4→0, 4→1, 2→3, 3→1. Provide a valid ordering and show the indegree array at each step." },
      { q: "Compare Kruskal vs Prim on a dense vs sparse graph; justify which is faster and by how much." },
      { q: "Dry-run Dijkstra on a 5-vertex weighted graph and provide the final dist[] table." },
    ],
    interview: [
      { q: "Word ladder: minimum number of single-letter transformations to convert begin into end (only valid dictionary words allowed). Use BFS." },
      { q: "Course Schedule II: given prereqs as edges, return a valid course order or empty if cycle." },
    ],
  },
  challenges: [
    { q: "Implement Johnson's algorithm for all-pairs shortest paths on sparse graphs with negative weights." },
    { q: "Dry-run Prim's algorithm on a 6-vertex weighted graph starting from a specified vertex." },
    { q: "Debug: a candidate's Dijkstra uses an unsorted array as 'priority queue' → O(V²). Convert to heap and re-analyze." },
  ],
  interactive: [
    { title: "Graph builder", description: "Click to add vertices, drag to draw edges; switch directed/weighted; run any algorithm and watch animation." },
    { title: "Dijkstra step-by-step", description: "Pick a source; press 'next' to extract closest vertex and relax; PQ contents shown alongside." },
    { title: "MST race", description: "Run Kruskal and Prim side-by-side on the same graph; first to V-1 edges wins." },
  ],
  assessment: {
    mcqs: [
      { q: "Which graph representation is best for sparse graphs?", options: ["Adjacency matrix", "Adjacency list", "Edge list", "Incidence matrix"], answer: 1 },
      { q: "BFS finds shortest paths in:", options: ["Weighted graphs", "Unweighted graphs", "Both", "Neither"], answer: 1 },
      { q: "Topological sort requires the graph to be:", options: ["Connected", "Directed acyclic", "Undirected", "Weighted"], answer: 1 },
      { q: "Dijkstra fails on:", options: ["Disconnected graphs", "Dense graphs", "Graphs with negative weights", "Trees"], answer: 2 },
      { q: "Kruskal's MST algorithm uses:", options: ["Priority queue", "Union-Find (DSU)", "Adjacency matrix", "DFS"], answer: 1 },
    ],
    truefalse: [
      { q: "Adjacency matrix uses O(V²) space regardless of edges.", answer: true },
      { q: "DFS uses a queue.", answer: false, explain: "DFS uses a stack (or recursion); BFS uses a queue." },
      { q: "An MST may have multiple valid solutions if edge weights tie.", answer: true },
      { q: "Dijkstra with a binary heap runs in O(V² log V).", answer: false, explain: "It is O((V+E) log V)." },
    ],
    coding: [
      { q: "Implement BFS that returns the shortest path from s to t (the actual sequence of vertices)." },
      { q: "Implement Kruskal's MST returning the list of edges chosen and total cost." },
    ],
    dryrun: [
      { q: "Dry-run BFS from vertex 0 on a graph with edges: 0-1, 0-2, 1-3, 2-3, 3-4, 4-5. List visit order and distances." },
      { q: "Dry-run Dijkstra on the same graph with weights {0-1:2, 0-2:5, 1-3:1, 2-3:1, 3-4:3, 4-5:2}. Show dist[] evolution." },
    ],
    conceptual: [
      { q: "Why does Dijkstra fail with negative weights? Give a concrete counter-example." },
      { q: "Why is Prim's complexity O(E log V) with a binary heap?" },
    ],
  },
  commonMistakes: [
    "Using DFS to find shortest paths in unweighted graphs (should be BFS)",
    "Forgetting to handle disconnected graphs (need to restart traversal from each unvisited vertex)",
    "Running Dijkstra on a graph with negative weights",
    "Using adjacency matrix on V = 10⁵ (memory explosion)",
    "Forgetting path compression in union-find → O(log² n) instead of α(n)",
    "Modifying the priority of an item in the heap directly — use push-and-skip-stale instead",
  ],
};
