import type { Lesson } from "../lesson-types";

export const lesson: Lesson = {
  slug: "adt-pointers",
  title: "ADT, Pointers & Dynamic Safe Arrays",
  tagline: "The foundation every data structure stands on.",
  overview: {
    what: "An Abstract Data Type (ADT) is a mathematical model for a data type defined by its behavior — the set of operations and their semantics — independent of any concrete implementation. Pointers are variables that store memory addresses, letting us share, alias, and dynamically allocate objects. A Dynamic Safe Array is an array wrapper that grows on demand and obeys the Rule of Three / Five to manage owned heap memory without leaks.",
    why: "Every container in C++ and Java (vectors, lists, maps, trees, graphs) is built on these primitives. Understanding pointer semantics, ownership and pass-by-reference vs pass-by-value is the difference between writing memory-safe code and writing code that silently corrupts the heap.",
    applications: [
      "Implementing std::vector, ArrayList, std::string, smart pointers",
      "Building linked lists, trees, graphs (all use pointers/references)",
      "Designing APIs where ownership and aliasing must be explicit",
      "Avoiding double-free, dangling pointer, and shallow-copy bugs in systems code",
    ],
    prerequisites: [
      "Basic C++ or Java syntax: variables, functions, classes",
      "Familiarity with the stack vs heap memory model",
      "Knowing how to compile and run a small program",
    ],
  },
  outcomes: [
    "Define an ADT and distinguish it from a data structure",
    "Trace pass-by-value, pass-by-reference, and pass-by-pointer behavior on memory diagrams",
    "Implement copy constructor, copy-assignment operator, and destructor (Rule of Three)",
    "Build a templated dynamic array with bounds checking and amortized O(1) push_back",
    "Diagnose double-free, dangling pointer, memory leak, and shallow-copy bugs",
  ],
  concept: [
    { heading: "From intuition to definition", body: "Think of an ADT as a contract a vending machine offers: 'insert coin', 'press button', 'receive drink'. You don't care whether bottles are stacked vertically or stored in a carousel — only that the operations behave as promised. A data structure is the carousel: a concrete way to honor the contract." },
    { heading: "Pointers, references, and aliasing", body: "A pointer is a typed integer that names a byte address. A reference (C++ &) is a compiler-managed alias that must be bound at creation and cannot be rebound. Java references behave like C++ pointers without arithmetic — every non-primitive variable is implicitly a pointer to a heap object. Passing by value copies the object; passing by reference shares it; passing by pointer also shares it but lets you reassign which object you point to." },
    { heading: "Ownership and the Rule of Three", body: "When a class owns heap memory, the compiler-generated copy constructor and copy-assignment perform a shallow copy — both objects end up pointing at the same buffer. When either is destroyed, the buffer is freed; when the second is destroyed, you get a double-free. The Rule of Three says: if you define any of destructor / copy constructor / copy-assignment, define all three. Modern C++ extends this to the Rule of Five with the move constructor and move-assignment." },
    { heading: "Dynamic arrays — amortized O(1) growth", body: "A safe array stores a heap buffer, its size, and its capacity. When size == capacity, allocate a new buffer of capacity * 2, copy elements, and delete the old one. Doubling guarantees that n pushes cost O(n) total — amortized O(1) per push — because the geometric series 1 + 2 + 4 + … + n ≈ 2n." },
    { heading: "Edge cases", body: "Self-assignment (a = a), copying an empty array, growing from zero capacity, exception safety during reallocation, and integer overflow when capacity doubles past INT_MAX must all be handled explicitly." },
  ],
  visual: [
    { title: "Stack vs heap memory diagram", description: "Animated boxes show two regions side by side. A local variable int x = 5 lives in a stack frame; a heap allocation int* p = new int(7) draws an arrow from a stack box labeled 'p' into a heap box labeled '7'. When the function returns, the stack box vanishes but the heap box remains — visualizing the memory leak." },
    { title: "Pass-by-value vs pass-by-reference", description: "Three side-by-side simulations. In pass-by-value, a copy of the argument appears in the callee's frame and modifications do not propagate. In pass-by-reference, the callee's parameter is drawn as an arrow pointing back into the caller's variable. In pass-by-pointer, both arrows are visible and the callee can rebind its arrow." },
    { title: "Shallow vs deep copy", description: "Two MyArray objects A and B are shown. After B = A (shallow), both objects' data pointers converge on the same heap buffer. After B = A (deep), B's pointer goes to a fresh buffer with copied values. Then the destructor animation shows the double-free in the shallow case." },
    { title: "Dynamic-array growth animation", description: "Step through push_back calls. Each push fills a slot. When the array is full, a new buffer (twice the size) is allocated, elements are copied one by one (animated arrows), the old buffer is shaded red and removed. A running counter at the bottom shows total cost stays linear." },
  ],
  code: [
    {
      lang: "cpp",
      title: "C++ — Templated Dynamic Safe Array with Rule of Three",
      code: `#include <algorithm>
#include <stdexcept>

template <typename T>
class SafeArray {
    T* data_;        // owned heap buffer
    size_t size_;    // number of valid elements
    size_t cap_;     // allocated capacity

public:
    SafeArray() : data_(nullptr), size_(0), cap_(0) {}

    // Destructor — releases the owned buffer
    ~SafeArray() { delete[] data_; }

    // Copy constructor — deep copy
    SafeArray(const SafeArray& other)
        : data_(other.cap_ ? new T[other.cap_] : nullptr),
          size_(other.size_), cap_(other.cap_) {
        std::copy(other.data_, other.data_ + size_, data_);
    }

    // Copy assignment — copy-and-swap idiom, exception safe
    SafeArray& operator=(SafeArray other) {  // pass by value = copy
        std::swap(data_, other.data_);
        std::swap(size_, other.size_);
        std::swap(cap_,  other.cap_);
        return *this;
    }

    void push_back(const T& v) {
        if (size_ == cap_) reserve(cap_ ? cap_ * 2 : 4);
        data_[size_++] = v;
    }

    T& at(size_t i) {
        if (i >= size_) throw std::out_of_range("SafeArray::at");
        return data_[i];
    }

    size_t size() const { return size_; }

private:
    void reserve(size_t newCap) {
        T* buf = new T[newCap];
        std::copy(data_, data_ + size_, buf);
        delete[] data_;
        data_ = buf;
        cap_ = newCap;
    }
};`,
      explain: "Every operation that owns memory uses RAII: the destructor frees, the copy constructor allocates a fresh buffer, and the copy-and-swap idiom guarantees that operator= is strongly exception-safe (if new throws, *this is untouched). Doubling capacity gives amortized O(1) push_back.",
    },
    {
      lang: "java",
      title: "Java — Generic Dynamic Array (ArrayList from scratch)",
      code: `public class SafeArray<T> {
    private Object[] data;
    private int size;

    public SafeArray()          { data = new Object[4]; size = 0; }

    public void add(T value) {
        if (size == data.length) {
            Object[] bigger = new Object[data.length * 2];
            System.arraycopy(data, 0, bigger, 0, size);
            data = bigger;            // old array becomes garbage
        }
        data[size++] = value;
    }

    @SuppressWarnings("unchecked")
    public T get(int i) {
        if (i < 0 || i >= size)
            throw new IndexOutOfBoundsException("Index " + i);
        return (T) data[i];
    }

    public int size() { return size; }
}`,
      explain: "Java has no destructors — the garbage collector reclaims the old buffer once no reference points at it. There is no copy constructor distinction either: aliasing is the default. The cast to T is unchecked because of type erasure; the runtime stores Object[].",
    },
  ],
  complexity: [
    { operation: "push_back (amortized)", best: "O(1)", average: "O(1)", worst: "O(n) on grow", space: "O(n)" },
    { operation: "at(i) / get(i)", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(1)" },
    { operation: "copy constructor", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)" },
    { operation: "destructor", best: "O(n) for non-trivial T", average: "O(n)", worst: "O(n)", space: "O(1)" },
  ],
  comparisons: [
    {
      a: "Pass by value",
      b: "Pass by reference",
      rows: [
        { criterion: "Copies argument?", a: "Yes — full copy", b: "No — alias" },
        { criterion: "Modifications visible to caller?", a: "No", b: "Yes" },
        { criterion: "Cost for large objects", a: "Expensive O(n)", b: "Cheap O(1)" },
        { criterion: "Safety from accidental mutation", a: "High", b: "Use const& to keep" },
      ],
    },
    {
      a: "C++ raw pointer",
      b: "Java reference",
      rows: [
        { criterion: "Arithmetic allowed?", a: "Yes (p+1)", b: "No" },
        { criterion: "Manual delete?", a: "Yes — required", b: "No — GC handles it" },
        { criterion: "Can be null?", a: "Yes", b: "Yes" },
        { criterion: "Aliasing default", a: "Explicit", b: "Implicit for all objects" },
      ],
    },
  ],
  worked: [
    {
      difficulty: "Easy",
      question: "What does this print? `int a = 5; int& r = a; r = 10; cout << a;`",
      solution: "Prints 10. r is bound to a; assigning to r writes through the alias to a's storage.",
    },
    {
      difficulty: "Medium",
      question: "A student writes `MyVec b = a;` without defining a copy constructor. Both go out of scope. Explain the bug.",
      solution: "The compiler-generated copy constructor copies the pointer field bitwise. a.data and b.data alias the same heap buffer. Both destructors run delete[] data → double-free → undefined behavior, typically a crash or heap corruption. Fix: define a copy constructor that allocates and copies, or follow Rule of Three / use std::vector.",
    },
    {
      difficulty: "Hard",
      question: "Prove that doubling capacity gives amortized O(1) push_back, while grow-by-one gives O(n) per push.",
      solution: "Doubling: n pushes trigger growths at sizes 1, 2, 4, 8, …, n. Total copy work = 1 + 2 + 4 + … + n ≤ 2n. Amortized cost per push = 2n / n = O(1). Grow-by-one: each push beyond initial capacity copies all existing elements. Total work = 1 + 2 + 3 + … + n = n(n+1)/2 = O(n²). Amortized per push = O(n).",
    },
  ],
  practice: {
    easy: [
      { q: "Write a function `void inc(int& x)` that increments its argument. Show a call site." },
      { q: "Declare a pointer to int on the heap, assign 42, print it, and free it." },
      { q: "Predict the output of a swap function written with values, with pointers, and with references." },
      { q: "Write the destructor for a class that owns a single `char* name`." },
      { q: "Add bounds checking to an `operator[]` overload that throws on out-of-range." },
    ],
    medium: [
      { q: "Implement `SafeArray<int>::pop_back` that also shrinks the buffer when size < cap/4." },
      { q: "Write the move constructor and move-assignment for SafeArray (Rule of Five)." },
      { q: "Given two SafeArray objects, write `merge(const SafeArray& a, const SafeArray& b)` returning a new sorted array (assume inputs are sorted)." },
      { q: "Detect self-assignment in `operator=` and explain why copy-and-swap handles it automatically." },
      { q: "Convert the C++ SafeArray to an immutable variant where every mutator returns a new array." },
    ],
    hard: [
      { q: "Implement a small_vector that stores up to N elements inline (on the stack) and only allocates on overflow." },
      { q: "Make SafeArray exception-safe: if T's copy constructor throws during reserve(), leave the array unchanged." },
      { q: "Write a unique_ptr-style smart pointer with move-only semantics; explain why copy must be deleted." },
      { q: "Design an ADT for a 'BoundedQueue<T, capacity>' and discuss two implementations: circular array vs linked list." },
      { q: "Diagnose the bug: `void foo(SafeArray a) { ... }` is called millions of times in a loop and the program is slow. Fix the signature and explain." },
    ],
    fast: [
      { q: "FAST Spring '22 style: Write a class TextBuffer that owns a char*. Implement Rule of Three. State which operations would invoke each special member function in: `TextBuffer a(\"hi\"); TextBuffer b = a; b = a;`." },
      { q: "Given a snippet using SafeArray, draw the memory diagram at three points (before push, mid-reallocation, after). Mark which addresses are stack and which are heap." },
      { q: "Explain why returning a local C-style array by pointer is undefined behavior. Provide a corrected version using SafeArray." },
    ],
    interview: [
      { q: "Design std::vector from scratch. Discuss growth factor choice (2× vs 1.5×) and its effect on allocator reuse." },
      { q: "Without using std::vector, write a function that reads an unknown number of integers from stdin into a dynamic array and returns it. Discuss ownership transfer." },
    ],
  },
  challenges: [
    { q: "Implement a CopyOnWrite<T> wrapper: copies share storage until one writes. Use reference counting. Discuss thread-safety." },
    { q: "Given a SafeArray<int>, write `removeDuplicatesInPlace` in O(n log n) time and O(1) extra space (in addition to a sort)." },
    { q: "Identify three subtle bugs in a 30-line dynamic-array implementation (we will provide). For each, give a failing test case." },
  ],
  interactive: [
    { title: "Memory diagram playground", description: "Drag a pointer arrow from a stack box onto any heap object. Press 'free' to delete the heap object — dangling arrows turn red." },
    { title: "Build-your-own-vector", description: "Click 'push_back' repeatedly. Watch capacity double and arrows redirect to a fresh buffer. A running average cost graph appears below." },
    { title: "Rule-of-Three quiz", description: "Given five class snippets, mark which special members the compiler will generate and whether each is correct." },
  ],
  assessment: {
    mcqs: [
      { q: "Which of the following correctly distinguishes a reference from a pointer in C++?", options: ["A reference can be reseated; a pointer cannot.", "A reference must be initialized at declaration and cannot be reseated.", "A reference takes 8 bytes; a pointer takes 4.", "References cannot alias function parameters."], answer: 1, explain: "References must be bound at creation and refer to the same object for life." },
      { q: "Amortized cost of push_back with capacity doubling is:", options: ["O(log n)", "O(1)", "O(n)", "O(n log n)"], answer: 1 },
      { q: "Rule of Three says that if you define one of these, you should define all three:", options: ["constructor, destructor, operator+", "destructor, copy constructor, copy assignment", "move constructor, copy constructor, destructor", "constructor, assignment, operator=="], answer: 1 },
      { q: "What happens when a shallow copy of an owning class goes out of scope twice?", options: ["Memory leak", "Compile error", "Double free / undefined behavior", "Nothing — GC handles it"], answer: 2 },
      { q: "Which growth strategy keeps push_back O(1) amortized?", options: ["Add 1 slot", "Add 10 slots", "Multiply capacity by a constant > 1", "Use a linked list of buffers"], answer: 2 },
    ],
    truefalse: [
      { q: "A Java object variable is essentially a pointer.", answer: true },
      { q: "delete on a nullptr is undefined behavior in modern C++.", answer: false, explain: "delete nullptr is a no-op since C++03." },
      { q: "Pass-by-const-reference avoids copying and prevents mutation.", answer: true },
      { q: "Doubling capacity wastes at most 50% of allocated memory.", answer: true },
    ],
    coding: [
      { q: "Implement `SafeArray<T>::insert(size_t i, const T& v)` with O(n) shift and amortized O(1) growth." },
      { q: "Write a function that reverses a SafeArray in-place using only two indices and one temporary." },
    ],
    dryrun: [
      { q: "Trace push_back called 9 times on an empty SafeArray with starting capacity 1. List capacity, size, and total copies after each call." },
    ],
    conceptual: [
      { q: "Why does the copy-and-swap idiom give strong exception safety for free?" },
      { q: "Explain in two sentences why Java does not need a Rule of Three." },
    ],
  },
  commonMistakes: [
    "Forgetting the copy constructor and getting a double-free at end of scope",
    "Writing `delete data;` instead of `delete[] data;` for array allocations",
    "Returning a reference or pointer to a local stack variable",
    "Using a moved-from object as if it were still valid",
    "Growing by a constant (e.g. +10) and surprising O(n²) total cost",
    "Comparing pointers with == when you meant to compare pointed-to values",
  ],
};
