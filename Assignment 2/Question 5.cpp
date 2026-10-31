#include <iostream>
#include <queue>
#include <vector>
#include <string>
using namespace std;

struct Job {
    string name;
    int priority;
    int arrival;
};
struct Compare {
    bool operator()(Job a, Job b) {
        if (a.priority != b.priority)
            return a.priority > b.priority;

        return a.arrival > b.arrival;
    }
};

class PriorityQueue {
private:
    priority_queue<Job, vector<Job>, Compare> pq;
    int counter = 0;

public:
    void push(string job, int priority) {
        pq.push({job, priority, counter++});
    }
    string pop() {
        if (pq.empty())
            return "Queue Empty";

        string result = pq.top().name;
        pq.pop();
        return result;
    }
    string peek() {
        if (pq.empty())
            return "Queue Empty";

        return pq.top().name;
    }

    bool empty() {
        return pq.empty();
    }
};

int main() {
    PriorityQueue pq;
    pq.push("J1", 3);
    pq.push("J2", 1);
    pq.push("J3", 2);

    cout << "Step 4 POP: " << pq.pop() << endl;

    pq.push("J4", 1);
    pq.push("J5", 3);

    cout << "Step 7 POP: " << pq.pop() << endl;

    cout << "Step 8 POP: " << pq.pop() << endl;

    
    pq.push("J6", 2);

    for (int i = 10; i <= 12; i++) {
        cout << "Step " << i << " POP: "
             << pq.pop() << endl;
    }

    return 0;
}

