#include <iostream>

using namespace std;

struct Node {
    int data;
    Node* prev;
    Node* next;
    Node(int val) : data(val), prev(nullptr), next(nullptr) {}
};

class CircularDoublyLinkedList {
private:
    Node* head = nullptr;

public:

    void insertEnd(int val) {
        Node* newNode = new Node(val);
        if (!head) {
            head = newNode;
            head->next = head;
            head->prev = head;
            return;
        }
        Node* tail = head->prev;
        newNode->next = head;
        newNode->prev = tail;
        tail->next = newNode;
        head->prev = newNode;
    }

    void insertBegin(int val) {
        insertEnd(val);
        head = head->prev; }

    void insertAtPosition(int val, int pos) {
        if (pos <= 1 || !head) {
            insertBegin(val);
            return;
        }

        Node* curr = head;
        for (int i = 1; i < pos - 1 && curr->next != head; ++i) {
            curr = curr->next;
        }

        if (curr->next == head && pos > 2) {
            insertEnd(val);
        } else {
            Node* newNode = new Node(val);
            newNode->next = curr->next;
            newNode->prev = curr;
            curr->next->prev = newNode;
            curr->next = newNode;
        }
    }


    void deleteNode(int val) {
        if (!head) return;

        Node* curr = head;

        do {
            if (curr->data == val) {

                if (curr->next == curr) {
                    delete curr;
                    head = nullptr;
                    return;
                }

                curr->prev->next = curr->next;
                curr->next->prev = curr->prev;

                if (curr == head) head = curr->next;

                delete curr;
                return;
            }
            curr = curr->next;
        } while (curr != head);
    }

    void printList() const {
        if (!head) {
            cout << "[List is empty]\n";
            return;
        }

        Node* curr = head;
        do {
            cout << curr->data << " <-> ";
            curr = curr->next;
        } while (curr != head);
        cout << "(head)\n";
    }
};

int main() {
    CircularDoublyLinkedList cdll;
    cdll.insertEnd(10);
    cdll.insertEnd(20);
    cdll.insertBegin(5);
    cdll.insertAtPosition(15, 3); 

    cout << "CDLL: ";
    cdll.printList();

    cdll.deleteNode(15);
    cout << "After deleting 15: ";
    cdll.printList();

    return 0;
}
