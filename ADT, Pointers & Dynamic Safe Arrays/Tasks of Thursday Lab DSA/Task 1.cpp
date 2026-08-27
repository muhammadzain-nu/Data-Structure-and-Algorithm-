#include <iostream>
using namespace std;
int main(){
	int* students;
	int n=10;
	int sum;
    students = new int[n];
	for(int i=0;i<n;i++){
		cout<<"Enter the Student marks"<< i+1;
		cin>>students[i];
		sum+=students[i];
		
	}
	int Hindex;
	int highest=students[0];
	for(int i=0;i<n;i++){
		if(highest<students[i]){
			highest=students[i];
			Hindex=i;
		}
	}
	//display function
	for(int i=0;i<n;i++){
		cout<<students[i];
	}
	cout<< "the total marks are "<< sum<<endl;
	cout<<"The highest marks obtained are "<<highest<< " BY "<<Hindex+1<<endl;
	
	delete[] students;
	return 0;
}