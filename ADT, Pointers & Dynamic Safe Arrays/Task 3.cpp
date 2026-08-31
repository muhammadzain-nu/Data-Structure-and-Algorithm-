#include <iostream>
#include <cstring>
#include <cstdlib>
using namespace std;

class image {
public:
    int ncols;
    int nrows;
    int **imagedata;

public:
    image() {
        ncols = 0;
        nrows = 0;
        imagedata = 0;
    }

    image(int rows, int cols) {
        nrows = rows;
        ncols = cols;
        imagedata = new int*[nrows];
        for (int i = 0; i < nrows; i++) {
            imagedata[i] = new int[ncols];
            for (int j = 0; j < ncols; j++) {
                imagedata[i][j] = 0; 
            }
        }
    }

    ~image() {
        if (imagedata != 0) {
            for (int i = 0; i < nrows; i++) {
                if (imagedata[i] != 0) {
                    delete[] imagedata[i];
                    imagedata[i] = 0;
                }
            }
            delete[] imagedata;
            imagedata = 0;
        }
    }

    void insert() {
        for (int i = 0; i < nrows; i++) {
            for (int j = 0; j < ncols; j++) {
                cout << "Enter the element Number" << endl;
                cin >> imagedata[i][j];
            }
        }
    }

    int &operator()(int rows, int cols) {
        if (rows < 0 || rows >= nrows || cols < 0 || cols >= ncols) {
            cout << "Array Out of Bounds" << endl;
            exit(0);
        }
        return imagedata[rows][cols];
    }

    image(const image& other) {
        ncols = other.ncols;
        nrows = other.nrows;
        imagedata = new int*[nrows];
        for (int i = 0; i < nrows; i++) {
            imagedata[i] = new int[ncols];
            memcpy(imagedata[i], other.imagedata[i], sizeof(int) * ncols);
        }
    }

    image &operator=(const image& other) {
        if (this == &other) {
            return *this;
        }

        if (imagedata != 0) {
            for (int i = 0; i < nrows; i++) {
                delete[] imagedata[i];
            }
            delete[] imagedata;
        }

        nrows = other.nrows;
        ncols = other.ncols;
        imagedata = new int*[nrows];
        for (int i = 0; i < nrows; i++) {
            imagedata[i] = new int[ncols];
            memcpy(imagedata[i], other.imagedata[i], sizeof(int) * ncols);
        }

        return *this;
    }

   
    void kernel() {
        int kernal[3][3];
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                kernal[i][j] = 1;
            }
        }

        int outRows = nrows - 2;
        int outCols = ncols - 2;

        if (outRows <= 0 || outCols <= 0) {
            cout << "Image too small for 3x3 kernel" << endl;
            return;
        }

        int **result = new int*[outRows];
        for (int i = 0; i < outRows; i++) {
            result[i] = new int[outCols];
        }

        for (int i = 0; i < outRows; i++) {
            for (int j = 0; j < outCols; j++) {
                int sum = 0;
                for (int k = 0; k < 3; k++) {
                    for (int l = 0; l < 3; l++) {
                        sum += imagedata[i + k][j + l] * kernal[k][l];
                    }
                }
                result[i][j] = sum;
            }
        }

        for (int i = 0; i < outRows; i++) {
            for (int j = 0; j < outCols; j++) {
                cout << " " << result[i][j];
            }
            cout << "\n";
        }

        for (int i = 0; i < outRows; i++) {
            delete[] result[i];
        }
        delete[] result;
    }
};

int main() {
    image img(5, 5);

    int val = 10;
    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < 5; j++) {
            img(i, j) = val;
            val += 10;
        }
    }

    img.kernel();

    return 0;
}
