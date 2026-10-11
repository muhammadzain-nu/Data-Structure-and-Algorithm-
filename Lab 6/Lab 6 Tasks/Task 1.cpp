#include <iostream>
using namespace std;

class Stack {
    int arr[8];
    int top;

public:
    Stack() : top(-1) {}

    void push(int value) {
        if (top == 7) {
            cout << "Stack Overflow\n";
            return;
        }
        arr[++top] = value;
        displayTop();
    }

    void undo() {
        if (top == -1) {
            cout << "Undo failed: Stack is empty\n";
            return;
        }
        top--;
        displayTop();
    }

    void displayTop() {
        if (top == -1)
            cout << "Current top: Stack is empty\n";
        else
            cout << "Current top: " << arr[top] << '\n';
    }

    void displayStack() {
        cout << "Remaining operations (top to bottom): ";
        for (int i = top; i >= 0; i--)
            cout << arr[i] << " ";
        cout << '\n';
    }
};

int main() {
    Stack s;

    int operations[] = {12, 25, 17, 31, 44, 19};

    for (int x : operations)
        s.push(x);

    cout << "\nUndo three times:\n";
    s.undo();
    s.undo();
    s.undo();

    cout << "\nNew operation:\n";
    s.push(52);

    cout << "\nUndo twice:\n";
    s.undo();
    s.undo();

    cout << '\n';
    s.displayStack();

    return 0;
}
