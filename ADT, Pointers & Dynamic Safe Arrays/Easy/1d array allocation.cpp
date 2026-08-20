#include <iostream>
using namespace std;
int main(){
	int* arr;
	int n;
	cin>>n;
	arr = new int[n];
	for(int i=0;i<n;i++){
		cout<<"Enter the Element number"<< i+1;
		cin>>arr[i];
	}
	for(int i=0;i<n;i++){
		cout<<arr[i];
	}
	
	delete[] arr;
	return 0;
}
