#include <iostream>
using namespace std;

void printNumbers(int n) {
    if (n == 0)
        return;

    printNumbers(n - 1);
    cout << n << " ";
}

int main() {
    printNumbers(5);
    return 0;
}
