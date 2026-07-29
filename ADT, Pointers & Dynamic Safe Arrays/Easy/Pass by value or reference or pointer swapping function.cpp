#include <iostream>
using namespace std;
void v_swap(int a, int b){
	int temp;
	temp=a;
	a=b;
	b=temp;
	cout<<"Pass by value Swap"<<a<<b<<"\n";
}
void r_swap(int& a, int& b){
	int temp;
	temp=a;
	a=b;
	b=temp;
	cout<<"Pass by reference Swap"<<a<<b<<"\n";
}
void p_swap(int *a, int *b){
	int temp;
	temp=*a;
	*a=*b;
	*b=temp;
	cout<<"Pass by pointer swap "<<*a<<*b<<"\n";//prints 10,20 because r has swapped those already
}
int main(){
	int a=10;
	int b=20;
	v_swap(a,b);
	cout << "In main after v_swap -> a: " << a << ", b: " << b << "\n\n"; // Stays 10, 20
	int *p=&a;
	int *c=&b;
	r_swap(a,b);
	cout << "In main after r_swap -> a: " << a << ", b: " << b << "\n\n"; // Becomes 20, 10
	p_swap(p,c);
	cout << "In main after p_swap -> a: " << a << ", b: " << b << "\n\n"; // Swaps back to 10, 20
}
