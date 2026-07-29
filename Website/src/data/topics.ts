export interface TopicMeta {
  slug: string;
  title: string;
  short: string;
  weeks: number;
  hours: number;
  clo: string;
  module: "Mid-term 1" | "Mid-term 2" | "Final";
  order: number;
}

export const topics: TopicMeta[] = [
  { slug: "adt-pointers", title: "ADT, Pointers & Dynamic Arrays", short: "Foundations: ADTs, pointers, references, Rule of Three, safe arrays.", weeks: 1, hours: 3, clo: "1", module: "Mid-term 1", order: 1 },
  { slug: "linked-lists", title: "Linked Lists & Searching", short: "Singly, doubly, circular lists. Linear, binary, interpolation search.", weeks: 1, hours: 3, clo: "1,3", module: "Mid-term 1", order: 2 },
  { slug: "elementary-sorting", title: "Elementary Sorting Techniques", short: "Bubble, Selection, Insertion, Radix, Shell, Comb sort.", weeks: 2, hours: 6, clo: "1,3", module: "Mid-term 1", order: 3 },
  { slug: "recursion-stack-queue", title: "Recursion, Stack & Queue", short: "Recursion types, backtracking, stack/queue ADTs and applications.", weeks: 1, hours: 3, clo: "1,2,3", module: "Mid-term 1", order: 4 },
  { slug: "advanced-sorting", title: "Advanced Sorting (Merge & Quick)", short: "Divide-and-conquer sorting: merge sort, quick sort, partitioning.", weeks: 1, hours: 3, clo: "3", module: "Mid-term 2", order: 5 },
  { slug: "binary-trees-bst", title: "Binary Trees & BSTs", short: "Full/complete binary trees, BST operations, skewness.", weeks: 2, hours: 7, clo: "1,2,3", module: "Mid-term 2", order: 6 },
  { slug: "balanced-trees", title: "Balanced Trees (AVL, 2-3, B-Trees)", short: "Keeping trees balanced: rotations, AVL, 2-3, B-trees.", weeks: 2, hours: 3, clo: "2,3", module: "Mid-term 2", order: 7 },
  { slug: "heaps-priority-queues", title: "Heaps & Priority Queues", short: "Binary heaps, heap operations, heapsort.", weeks: 1, hours: 3, clo: "1,3", module: "Final", order: 8 },
  { slug: "hashing", title: "Hashing & Collision Resolution", short: "Hash functions, chaining, open addressing, rehashing.", weeks: 1, hours: 3, clo: "1,3", module: "Final", order: 9 },
  { slug: "string-search", title: "String Search Algorithms", short: "Brute force, Rabin-Karp, Boyer-Moore, KMP.", weeks: 1, hours: 3, clo: "4", module: "Final", order: 10 },
  { slug: "graphs", title: "Graphs, MST & Shortest Paths", short: "Representations, traversals, topological sort, MST, Dijkstra.", weeks: 1, hours: 3, clo: "4", module: "Final", order: 11 },
];

export const getTopic = (slug: string) => topics.find((t) => t.slug === slug);
