#include <iostream>
using namespace std;

void reverse(string s, int index) {
    if (index < 0)
        return;

    cout << s[index];
    reverse(s, index - 1);
}

int main() {
    string s = "HELLO";
    reverse(s, s.length() - 1);
    return 0;
}
