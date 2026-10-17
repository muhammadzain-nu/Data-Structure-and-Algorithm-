#include <iostream>
using namespace std;
string s = "ABCD";
void permutation(int index) {
    if (index == s.length()) {
        cout <<s<< endl;
        return;
    }

    for (int i = index; i < s.length(); i++) {
        swap(s[index], s[i]);

        permutation(index + 1);

        swap(s[index], s[i]); 
    }
}
	
int main() {
    permutation(0);
    return 0;
}	
	

