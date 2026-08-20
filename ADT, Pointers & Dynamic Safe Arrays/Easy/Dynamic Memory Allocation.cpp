#include <iostream>
using namespace std;

void swap(int *a, int *b) {
    *a = *a + *b;
    *b = *a - *b;
    *a = *a - *b;
}

int main() {
    int x = 20;
    int y = 10;
    swap(&x, &y);
	    cout << "Swapped x=" << x << " y=" << y << endl; 
    return 0;
}
