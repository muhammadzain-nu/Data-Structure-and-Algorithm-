#include <iostream>
using namespace std;

int arr[] = {2, 3, 5, 6, 8};
int n = 5;
int target = 9;

bool subsetSum(int index, int sum) {
    if (sum == target)
     return true;

    if (index == n || sum > target)
    return false;
    if (subsetSum(index + 1, sum + arr[index])) {
	       cout << arr[index] << " ";
       return true;
    }
    if (subsetSum(index+1, sum))
        return true;

    return false;
}

int main() {
    cout << "Subset: ";
    if (!subsetSum(0, 0))
        cout << "No valid subset exists";

    return 0;
}
