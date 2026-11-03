#include <iostream>
#include <vector>
using namespace std;

struct Request {
    int id;
    int priority;
    int order;
};

class PriorityQueue {
    vector<Request> heap;
    int counter = 0;

    bool compare(Request a, Request b) {
        if (a.priority == b.priority)
            return a.order < b.order;

        return a.priority < b.priority;
    }

    void heapifyUp(int index) {
        while (index > 0) {
            int parent = (index - 1) / 2;

            if (compare(heap[index], heap[parent])) {
                swap(heap[index], heap[parent]);
                index = parent;
            }
            else {
                break;
            }
        }
    }

    void heapifyDown(int index) {
        int size = heap.size();

        while (true) {
            int smallest = index;

            int left = 2 * index + 1;
            int right = 2 * index + 2;

            if (left < size && compare(heap[left], heap[smallest]))
                smallest = left;

            if (right < size && compare(heap[right], heap[smallest]))
                smallest = right;

            if (smallest != index) {
                swap(heap[index], heap[smallest]);
                index = smallest;
            }
            else {
                break;
            }
        }
    }

public:

    void insert(int id, int priority) {
        Request r;

        r.id = id;
        r.priority = priority;
        r.order = counter++;

        heap.push_back(r);

        heapifyUp(heap.size() - 1);
    }

    Request extractMin() {
        if (heap.empty()) {
            cout << "Queue is empty!" << endl;
            return {-1, -1, -1};
        }

        Request result = heap[0];

        heap[0] = heap.back();
        heap.pop_back();

        if (!heap.empty())
            heapifyDown(0);

        return result;
    }

    void peek() {
        if (heap.empty()) {
            cout << "Queue is empty!" << endl;
            return;
        }

        cout << "Next Request ID: " << heap[0].id
             << " Priority: " << heap[0].priority << endl;
    }

    void display() {
        for (int i = 0; i < heap.size(); i++) {
            cout << "ID: " << heap[i].id
                 << " Priority: " << heap[i].priority << endl;
        }
    }
};

int main() {
    PriorityQueue q;

    q.insert(101, 3);
    q.insert(102, 1);
    q.insert(103, 2);
    q.insert(104, 1);
    q.insert(105, 4);
    q.insert(106, 2);

    cout << "Emergency Queue:\n";
    q.display();

    cout << "\nNext Most Urgent Request:\n";
    q.peek();

    cout << "\nProcessing Request:\n";

    Request r = q.extractMin();

    cout << "Processed ID: " << r.id
         << " Priority: " << r.priority << endl;

    cout << "\nUpdated Queue:\n";
    q.display();

    return 0;
}
