#include <iostream>
#include <stack>
using namespace std;

class MyQueue {
    stack<char> incoming, outgoing;

public:
    void enqueue(char item) {
        incoming.push(item);
    }

    char dequeue() {
        if (outgoing.empty()) {
            while (!incoming.empty()) {
                outgoing.push(incoming.top());
                incoming.pop();
            }
        }

        if (outgoing.empty()) {
            cout << "Queue is empty\n";
            return '\0';
        }

        char item = outgoing.top();
        outgoing.pop();
        return item;
    }
};

int main() {
    MyQueue q;

    q.enqueue('A');
    q.enqueue('B');

    cout << q.dequeue() << '\n';

    q.enqueue('C');

    cout << q.dequeue() << '\n';
    cout << q.dequeue() << '\n';

    return 0;
}
