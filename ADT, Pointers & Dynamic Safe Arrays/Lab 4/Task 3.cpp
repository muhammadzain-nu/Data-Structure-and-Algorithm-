#include <iostream>
#include <algorithm>
using namespace std;
int getNextGap(int gap) {
    gap = (gap * 10) / 13; 
    if (gap < 1) return 1;
    return gap;
}
void combSort(int arr[], int n) {
    int gap = n;
    bool swapped = true;
    int iteration = 1;
    while (gap > 1 || swapped) {
        gap = getNextGap(gap);
        swapped = false;
        for (int i = 0; i < n - gap; i++) {
            if (arr[i] > arr[i + gap]) {
                swap(arr[i], arr[i + gap]);
                swapped = true;
            }
        }
        cout << "Iteration " << iteration++ << " (Gap = " << gap << "): ";
        for (int k = 0; k < n; k++) {
            cout << arr[k] << " ";
        }
        cout << endl;
    }
}

int main() {
    int quantities[] = {10, 20, 30, 40, 5, 50, 60, 70};
    int n = sizeof(quantities) / sizeof(quantities[0]);
    cout << "Initial Values: ";
    for (int i = 0; i < n; i++) cout << quantities[i] << " ";
    cout << "\n\n";
    combSort(quantities, n);
    cout << "\nFinal Sorted Values: ";
    for (int i = 0; i < n; i++) cout << quantities[i] << " ";
    cout << endl;
    return 0;
}
