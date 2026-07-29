#include <iostream>
using namespace std;
int main(){
	int x;
	int* ptr= new int;
	ptr=&x;
	*ptr=42;
	cout<<x;
	delete ptr;
	return 0;
}
