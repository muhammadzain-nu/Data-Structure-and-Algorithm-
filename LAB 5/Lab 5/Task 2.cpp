#include <iostream>

using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class CircularSinglyLinkedList {
private:
    Node* tail = nullptr;

public:

    void insertEnd(int val) {
        Node* newNode = new Node(val);
        if (!tail) {
            tail = newNode;
            tail->next = tail;
        } else {
            newNode->next = tail->next;
            tail->next = newNode;
            tail = newNode;
        }
    }

    void insertBegin(int val) {
        Node* newNode = new Node(val);
        if (!tail) {
            tail = newNode;
            tail->next = tail;
        } else {
            newNode->next = tail->next;
            tail->next = newNode;
        }
    }

    void insertAtPosition(int val, int pos) {
        if (pos <= 1 || !tail) {
            insertBegin(val);
            return;
        }

        Node* curr = tail->next;
        for (int i = 1; i < pos - 1 && curr != tail; ++i) {
            curr = curr->next;
        }

        if (curr == tail) {
            insertEnd(val);
        } else {
            Node* newNode = new Node(val);
            newNode->next = curr->next;
            curr->next = newNode;
        }
    }

    void deleteNode(int val) {
        if (!tail) return;

        Node* curr = tail->next;
        Node* prev = tail;

    
        if (curr == tail && curr->data == val) {
            delete curr;
            tail = nullptr;
            return;
        }

        do {
            if (curr->data == val) {
                prev->next = curr->next;
                if (curr == tail) tail = prev;
                delete curr;
                return;
            }
            prev = curr;
            curr = curr->next;
        } while (curr != tail->next);
    }
    void printList() const {
        if (!tail) {
            cout << "[List is empty]\n";
            return;
        }

        Node* curr = tail->next;
        do {
            cout << curr->data << " -> ";
            curr = curr->next;
        } while (curr != tail->next);
        cout << "(head)\n";
    }
};

int main() {
    CircularSinglyLinkedList csll;
    csll.insertEnd(10);
    csll.insertEnd(20);
    csll.insertBegin(5);
    csll.insertAtPosition(15, 3);

    cout << "CSLL: ";
    csll.printList();

    csll.deleteNode(10);
    cout << "After deleting 10: ";
    csll.printList();

    return 0;
}
