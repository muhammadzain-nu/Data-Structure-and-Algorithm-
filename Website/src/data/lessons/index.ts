import { lesson as adtPointers } from "./adt-pointers";
import { lesson as linkedLists } from "./linked-lists";
import { lesson as elementarySorting } from "./elementary-sorting";
import { lesson as recursionStackQueue } from "./recursion-stack-queue";
import { lesson as advancedSorting } from "./advanced-sorting";
import { lesson as binaryTreesBst } from "./binary-trees-bst";
import { lesson as balancedTrees } from "./balanced-trees";
import { lesson as heapsPriorityQueues } from "./heaps-priority-queues";
import { lesson as hashing } from "./hashing";
import { lesson as stringSearch } from "./string-search";
import { lesson as graphs } from "./graphs";
import type { Lesson } from "../lesson-types";

export const lessons: Record<string, Lesson> = {
  [adtPointers.slug]: adtPointers,
  [linkedLists.slug]: linkedLists,
  [elementarySorting.slug]: elementarySorting,
  [recursionStackQueue.slug]: recursionStackQueue,
  [advancedSorting.slug]: advancedSorting,
  [binaryTreesBst.slug]: binaryTreesBst,
  [balancedTrees.slug]: balancedTrees,
  [heapsPriorityQueues.slug]: heapsPriorityQueues,
  [hashing.slug]: hashing,
  [stringSearch.slug]: stringSearch,
  [graphs.slug]: graphs,
};

export const getLesson = (slug: string) => lessons[slug];
