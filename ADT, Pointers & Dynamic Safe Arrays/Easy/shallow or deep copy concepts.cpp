#include <iostream>
#include <cstdlib>
using namespace std;

class Student {
    int size;
    int *marks;

public:
    Student(int s) {
        size = s;
        marks = new int[size];
        for (int i = 0; i < size; i++) {
            marks[i] = 0;
        }
    }

    Student(const Student &other) {
        if (this == &other) {
            exit(0);
        }
        size = other.size;
        marks = new int[size];
        for (int i = 0; i < size; i++) {
            marks[i] = other.marks[i];
        }
    }

    void setMark(int index, int value) {
        if (index >= 0 && index < size) {
            marks[index] = value;
        }
    }

    void display() {
        for (int i = 0; i < size; i++) {
            cout << "Marks: " << marks[i] << endl;
        }
    }

    ~Student() {
        delete [] marks;
    }
};

int main() {
    Student s1(3);
    s1.setMark(0, 30);
    s1.setMark(1, 40);
    s1.setMark(2, 50);
    
    Student s2 = s1;
    s1.display();
    s2.display();
    
    return 0;
}

