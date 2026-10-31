
#include <iostream>
using namespace std;

#define ROWS 6
#define COLS 8
#define COURSES 4

string course[COURSES] = {
    "Programming",
    "Database Systems",
    "Operating Systems",
    "Computer Networks"
};

int seat[COURSES];
bool colUsed[COLS];

int count = 0;
bool isSafe(int row, int col, int courseNo) {
    if (row == 3 && col == 3) {
        return false;
    }
    for (int i = 0; i < courseNo; i++) {

        int prevRow = i;
        int prevCol = seat[i];

        if (prevCol == col) {
            return false;
        }
        if (abs(prevRow - row) == abs(prevCol - col)) {
            return false;
        }
    }

    return true;
}
void assignSeats(int courseNo) {

    if (courseNo == COURSES) {

        count++;

        cout << "\nArrangement " << count << ":\n";

        for (int i = 0; i < COURSES; i++) {
            cout << course[i] << " -> Row "
                 << i << ", Column " << seat[i] << endl;
        }

        return;
    }
    if (courseNo == 0) {

        int row = 0;

        for (int col = 0; col < COLS; col++) {

            if (isSafe(row, col, courseNo)) {

                seat[courseNo] = col;
                colUsed[col] = true;

                assignSeats(courseNo + 1);
                colUsed[col] = false;
            }
        }
    }

    else {

        int row = courseNo;

        for (int col = 0; col < COLS; col++) {

            if (isSafe(row, col, courseNo)) {

                seat[courseNo] = col;
                colUsed[col] = true;

                assignSeats(courseNo + 1);
                colUsed[col] = false;
            }
        }
    }
}

int main() {

    assignSeats(0);

    if (count == 0) {
        cout << "\nNo valid seating arrangement exists.\n";
    }
    else {
        cout << "\nTotal valid arrangements: " << count << endl;
    }

    return 0;
}

