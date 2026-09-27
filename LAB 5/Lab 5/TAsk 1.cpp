#include <iostream>

using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

Node* segregateEvenOdd(Node* head) {
    if (!head || !head->next) return head;

    Node* evenHead = nullptr;
    Node* evenTail = nullptr;
    Node* oddHead = nullptr;
    Node* oddTail = nullptr;

    Node* curr = head;
    while (curr) {
        int val = curr->data;
        if (val % 2 == 0) {
            if (!evenHead) {
                evenHead = evenTail = curr;
            } else {
                evenTail->next = curr;
                evenTail = evenTail->next;
            }
        } else {
            if (!oddHead) {
                oddHead = oddTail = curr;
            } else {
                oddTail->next = curr;
                oddTail = oddTail->next;
            }
        }
        curr = curr->next;
    }

    if (!evenHead) return oddHead; 
    if (oddTail) oddTail->next = nullptr;
    
    evenTail->next = oddHead; 
    return evenHead;
}

void printList(Node* head) {
    while (head) {
        cout << head->data << "->";
        head = head->next;
    }
    cout << "NULL\n";
}

int main() {
    int n, val;
    cout << "Enter number of nodes: ";
    if (!(cin >> n) || n <= 0) return 0;

    Node* head = nullptr;
    Node* tail = nullptr;

    cout << "Enter node values: ";
    for (int i = 0; i < n; ++i) {
        cin >> val;
        Node* newNode = new Node(val);
        if (!head) head = tail = newNode;
        else { tail->next = newNode; tail = newNode; }
    }

    cout << "Original List: ";
    printList(head);

    head = segregateEvenOdd(head);

    cout << "Modified List: ";
    printList(head);

    return 0;
}
