#include <iostream>
using namespace std;
int main(){
	int n=0;
	cout<<"Enter the Number of Students-(The number should be between 5-15"<<endl;
	while(n<5 || n>15){
		cin>>n;
		if(n<5|| n>15){
			cout<<"Enter a Valid number 5-15"<<endl;
					}
	}
	int Marks[n];
	for(int i=0;i<n;i++){
		cout<<"\n Marks of student ID:  "<<i<<": ";
		cin>>Marks[i];
	}
	int total=0;
	int comparisons=0;
	for(int i = 1; i < n; i++) {
    int key = Marks[i]; 
    int j = i - 1;
    int comparision = 0;

    while(j >= 0 && Marks[j] < key) {
        Marks[j + 1] = Marks[j];
        j = j - 1;
        comparision++;
    }
    Marks[j + 1] = key;
    cout << "Total Comparisions Made in Shift: " << i << " are : " << comparision << endl;    
}
	for(int i=0;i<n;i++){
		total+=Marks[i];
}
	double average=total/n;
	cout<<"Display:"<<endl;
	cout<<"The Highest Marks Achieved are: "<<Marks[0]<<endl;
	cout<<"The least Marks Are: "<< Marks[n-1]<<endl;
	cout<<"The average marks are: "<< average<<endl;
	for(int i=0;i<n;i++){
		if(Marks[i]>90){
			cout<<"High Achiever Student ID: "<< i<< endl;
		}else{
			break;
		}
	}
	cout<<"The Sorted Array:";
	for(int i=0;i<n;i++){
		cout<<Marks[i]<<" ";
	}
}
