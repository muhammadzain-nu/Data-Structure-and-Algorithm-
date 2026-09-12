#include <iostream>
#include <vector>

using namespace std;

void shellSort(vector<int>& arr) {
    int n=arr.size();
    int pass=1;
    for (int gap=n/2;gap>0;gap/=2) {
        int comparisons=0;
        int shifts=0;
        for (int i = gap; i < n; i++) {
            int temp=arr[i];
            int j=i;
            while (j>=gap) {
                comparisons++;
                if (arr[j-gap]>temp) {
                    arr[j]=arr[j-gap]; 
                    shifts++;
                    j -= gap;
                } else {
                    break;
                }
            }
            arr[j] = temp;
        }
        cout << "Pass " << pass++ << " (Gap = " << gap << "):\n";
        cout << "  Array State: ";
        for (int k=0;k<n;k++) {
            cout << arr[k] << " ";
        }
        cout << "\n  Comparisons: " << comparisons;
        cout << "\n  Shifts:      " << shifts << "\n\n";
    }
}

int main() {
    vector<int> loads = {90, 20, 80, 30, 70, 40, 60, 50, 10};
    cout << "Initial Load Values: ";
    for (int val : loads) {
        cout << val << " ";
    }
    cout<<endl;
    shellSort(loads);
    return 0;
}
