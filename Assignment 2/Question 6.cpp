
#include <iostream>
#include <string>
#include <iomanip>
using namespace std;

struct Student {
    int id;
    string name;
    string department;
    float cgpa;
};

void merge(Student arr[], int left, int mid, int right) {

    int n1 = mid - left + 1;
    int n2 = right - mid;

    Student L[100], R[100];

    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];

    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {

        if (L[i].cgpa >= R[j].cgpa) {
            arr[k] = L[i];
            i++;
        }
        else {
            arr[k] = R[j];
            j++;
        }

        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(Student arr[], int left, int right) {

    if (left >= right)
        return;

    int mid = left + (right - left) / 2;

    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);

    merge(arr, left, mid, right);
}

string getAward(float cgpa) {

    if (cgpa >= 3.90)
        return "Rector's List";

    else if (cgpa >= 3.50)
        return "Dean's List";

    else
        return "No Award";
}

void displayMeritList(Student arr[], int n) {

    cout << "\n========== FINAL MERIT LIST ==========\n";

    cout << left
         << setw(8) << "Rank"
         << setw(10) << "ID"
         << setw(15) << "Name"
         << setw(15) << "Department"
         << setw(10) << "CGPA"
         << "Award" << endl;

    cout << string(80, '-') << endl;

    for (int i = 0; i < n; i++) {

        cout << left
             << setw(8) << i + 1
             << setw(10) << arr[i].id
             << setw(15) << arr[i].name
             << setw(15) << arr[i].department
             << fixed << setprecision(2)
             << setw(10) << arr[i].cgpa
             << getAward(arr[i].cgpa)
             << endl;
    }
}

int main() {

    const int N = 30;

    Student students[N] = {

        {101, "Ali", "CS", 3.80},
        {102, "Ahmed", "SE", 3.50},
        {103, "Sara", "AI", 3.95},
        {104, "Hassan", "CS", 3.20},
        {105, "Ayesha", "SE", 4.00},

        {106, "Usman", "AI", 3.70},
        {107, "Fatima", "CS", 3.90},
        {108, "Bilal", "SE", 3.40},
        {109, "Zara", "AI", 3.85},
        {110, "Hamza", "CS", 3.60},

        {111, "Noor", "SE", 3.95},
        {112, "Danish", "AI", 3.10},
        {113, "Maham", "CS", 3.50},
        {114, "Saad", "SE", 3.75},
        {115, "Hira", "AI", 4.00},

        {116, "Zain", "CS", 4.00},
        {117, "Muneeb", "SE", 3.80},
        {118, "Eman", "AI", 3.65},
        {119, "Taha", "CS", 3.45},
        {120, "Laiba", "SE", 3.90},

        {121, "Rayyan", "AI", 3.55},
        {122, "Amna", "CS", 3.25},
        {123, "Fahad", "SE", 3.85},
        {124, "Iqra", "AI", 3.70},
        {125, "Arham", "CS", 3.15},

        {126, "Mishal", "SE", 3.95},
        {127, "Omer", "AI", 3.60},
        {128, "Anaya", "CS", 3.50},
        {129, "Raza", "SE", 3.35},
        {130, "Dua", "AI", 3.75}
    };

    mergeSort(students, 0, N - 1);

    displayMeritList(students, N);

    return 0;
}

