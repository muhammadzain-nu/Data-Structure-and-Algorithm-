#include <iostream>
using namespace std;

void inc(int& x){
	x++;
}

int main(){
	int x=0;
	inc(x);
	cout<<x<<"\n";
	inc(x);
	cout<<x;
	return 0;
}

