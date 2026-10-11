#include <iostream>
#include <queue>
#include <stack>
using namespace std;

void reverseFirstK(queue<string>& q, int k) {
    if (k <= 0 || k > (int)q.size())
        return;

    stack<string> s;

    for (int i = 0; i < k; i++) {
        s.push(q.front());
        q.pop();
    }

    while (!s.empty()) {
        q.push(s.top());
        s.pop();
    }

    int remaining = (int)q.size() - k;

    for (int i = 0; i < remaining; i++) {
        q.push(q.front());
        q.pop();
    }
}

int main() {
    queue<string> q;

    for (int i = 1; i <= 7; i++)
        q.push("J" + to_string(i));

    reverseFirstK(q, 3);

    cout << "Queue after reversing first 3 jobs: ";

    while (!q.empty()) {
        cout << q.front() << " ";
        q.pop();
    }

    return 0;
}
