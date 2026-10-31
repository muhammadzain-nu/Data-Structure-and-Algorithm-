#include <iostream>
#include <string>
using namespace std;

struct Parcel {
    int trackingNumber;
    string sender;
    string destination;
    int regionCode;
};

int getMax(Parcel arr[], int n) {
    int maximum = arr[0].trackingNumber;

    for (int i = 1; i < n; i++) {
        if (arr[i].trackingNumber > maximum)
            maximum = arr[i].trackingNumber;
    }

    return maximum;
}

void countingSort(Parcel arr[], int n, int exp) {

    Parcel* output = new Parcel[n];
    int count[10] = {0};

    for (int i = 0; i < n; i++) {
        int digit = (arr[i].trackingNumber / exp) % 10;
        count[digit]++;
    }

    for (int i = 1; i < 10; i++)
        count[i] += count[i - 1];

    for (int i = n - 1; i >= 0; i--) {

        int digit = (arr[i].trackingNumber / exp) % 10;

        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }

    for (int i = 0; i < n; i++)
        arr[i] = output[i];

    delete[] output;
}

void radixSort(Parcel arr[], int n) {

    int maximum = getMax(arr, n);

    for (int exp = 1; maximum / exp > 0; exp *= 10) {
        countingSort(arr, n, exp);
    }
}
//Part B
struct Node {
    Parcel data;
    Node* next;

    Node(Parcel p) {
        data = p;
        next = nullptr;
    }
};

Node* getMiddle(Node* head) {

    if (head == nullptr)
        return head;

    Node* slow = head;
    Node* fast = head->next;

    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }

    return slow;
}
Node* mergeLists(Node* a, Node* b) {

    if (a == nullptr)
        return b;

    if (b == nullptr)
        return a;

    Node* result;

    if (a->data.regionCode <= b->data.regionCode) {

        result = a;
        result->next = mergeLists(a->next, b);
    }
    else {

        result = b;
        result->next = mergeLists(a, b->next);
    }

    return result;
}

Node* mergeSort(Node* head) {

    if (head == nullptr || head->next == nullptr)
        return head;

    Node* middle = getMiddle(head);

    Node* secondHalf = middle->next;
    middle->next = nullptr;

    Node* left = mergeSort(head);
    Node* right = mergeSort(secondHalf);

    return mergeLists(left, right);
}

void insertEnd(Node*& head, Parcel p) {

    Node* newNode = new Node(p);

    if (head == nullptr) {
        head = newNode;
        return;
    }

    Node* temp = head;

    while (temp->next != nullptr)
        temp = temp->next;

    temp->next = newNode;
}

void displayList(Node* head) {

    while (head != nullptr) {

        cout << head->data.trackingNumber
             << " | "
             << head->data.sender
             << " | "
             << head->data.destination
             << " | Region: "
             << head->data.regionCode
             << endl;

        head = head->next;
    }
}

int main() {

    Node* head = nullptr;

    insertEnd(head, {1005, "Ali", "Karachi", 3});
    insertEnd(head, {1002, "Ahmed", "Lahore", 1});
    insertEnd(head, {1008, "Sara", "Islamabad", 2});
    insertEnd(head, {1009, "Hassan", "Multan", 1});
    insertEnd(head, {1010, "Zara", "Karachi", 3});

    head = mergeSort(head);

    cout << "Parcels Sorted By Region:\n";

    displayList(head);

    return 0;
}

