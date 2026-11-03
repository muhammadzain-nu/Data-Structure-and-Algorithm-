#include <iostream>
using namespace std;

int swaps = 0;

void swapElements(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;

    swaps++;
}

void display(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
}

void heapify(int arr[], int n, int index) {
    int largest = index;

    int left = 2 * index + 1;
    int right = 2 * index + 2;

    if (left < n && arr[left] > arr[largest])
        largest = left;

    if (right < n && arr[right] > arr[largest])
        largest = right;

    if (largest != index) {
        swapElements(arr[index], arr[largest]);

        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {

    // Build Max Heap
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    cout << "Max Heap: ";
    display(arr, n);

    // Extract elements
    for (int i = n - 1; i > 0; i--) {

        swapElements(arr[0], arr[i]);

        heapify(arr, i, 0);

        cout << "After extraction: ";
        display(arr, n);
    }
}

int main() {

    int arr[] = {42, 17, 63, 28, 51, 9, 36, 74, 23};

    int n = sizeof(arr) / sizeof(arr[0]);

    cout << "Original Array: ";
    display(arr, n);

    heapSort(arr, n);

    cout << "\nSorted Array: ";
    display(arr, n);

    cout << "\nTotal Swaps: " << swaps << endl;

    return 0;
}
