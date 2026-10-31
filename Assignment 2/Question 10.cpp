
#include <iostream>
using namespace std;

int digits[] = {1, 2, 3, 4, 5};
int totalDigits = 5;

int N = 3;
int S = 9;

int combination[100];
int count = 0;
void generate(int start, int index, int sum) {
    if (index == N) {

        if (sum == S) {
            count++;

            for (int i = 0; i < N; i++) {
                cout << combination[i] << " ";
            }

            cout << endl;
        }

        return;
    }
    for (int i = start; i < totalDigits; i++) {

        combination[index] = digits[i];

        generate(i + 1, index + 1, sum + digits[i]);

        combination[index] = 0;
    }
}

int main() {

    generate(0, 0, 0);

    if (count == 0) {
        cout << "No valid combination exists." << endl;
    }
    else {
        cout << "\nTotal valid combinations: " << count << endl;
    }

    return 0;
}

