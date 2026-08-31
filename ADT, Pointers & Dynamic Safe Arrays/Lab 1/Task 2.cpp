#include <iostream>
#include <cstring>
#include <cstdlib>
using namespace std;

class SafeArray {
    int ncols;
    int nrows;
    int *dynamicArray;

public:
    SafeArray() {
        ncols = 0;
        nrows = 0;
        dynamicArray = 0;
    }

    SafeArray(int rows, int cols) {
        nrows = rows;
        ncols = cols;
        dynamicArray = new int[nrows * ncols];
        for (int i = 0; i < nrows * ncols; i++) {
            dynamicArray[i] = 0; 
        }
    }

    ~SafeArray() {
        if (dynamicArray != 0) {
            delete[] dynamicArray;
            dynamicArray = 0;
        }
    }

    void insert() {
        for (int i = 0; i < nrows; i++) {
            for (int j = 0; j < ncols; j++) {
                cout << "Enter the element Number" << endl;
                cin >> dynamicArray[i * ncols + j];
            }
        }
    }

    int &operator()(int rows, int cols) {
        if (rows < 0 || rows >= nrows || cols < 0 || cols >= ncols) {
            cout << "Array Out of Bounds" << endl;
            exit(0);
        }
        return dynamicArray[rows * ncols + cols];
    }

    SafeArray(const SafeArray& other) {
        ncols = other.ncols;
        nrows = other.nrows;
        dynamicArray = new int[nrows * ncols];
        for (int i = 0; i < nrows * ncols; i++) {
            dynamicArray[i] = other.dynamicArray[i];
        }
    }

    SafeArray &operator=(const SafeArray& other) {
        if (this == &other) {
            return *this;
        }

        if (dynamicArray != 0) {
            delete[] dynamicArray;
        }

        nrows = other.nrows;
        ncols = other.ncols;
        dynamicArray = new int[nrows * ncols];

        memcpy(dynamicArray, other.dynamicArray, sizeof(int) * nrows * ncols);

        return *this;
    }
};

int main() {
    int columns;
    int rows;
    cout << "enter number of rows and cols" << endl;
    cin >> rows >> columns;

    SafeArray ob1(rows, columns);
    ob1.insert();

    SafeArray ob3(3, 3);
    ob3 = ob1; 
    ob3.insert();

    cout << ob1(1, 1) << endl;

    return 0;
}
