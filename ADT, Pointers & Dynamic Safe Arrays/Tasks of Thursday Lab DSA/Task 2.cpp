#include <iostream>
using namespace std;
int main(){
	int row=4, col=5;
	

	
int **matrix= new int*[row];
for(int i=0;i<col;i++){
	matrix[i] = new int[col];
}
cout<<"Memory ALlocated"<< endl;
//input function
for(int i=0;i<row;i++){
	for(int j=0;j<col;j++){
		cout<<"Enter the Status of Student:"<< i+1 << "and Day:"<< j+1 <<endl;
		cin>>matrix[i][j];
	}
}
int arr[4];

//display function
	for(int i=0;i<row;i++){
		arr[i]=0;
	for(int j=0;j<col;j++){
		cout<<matrix[i][j];
		if(matrix[i][j]==1){
			arr[i]++;
		}
	}
	cout<<"\n";
}
for(int i=0;i<row;i++){
	
cout<<"The student" << i+1 << "Was present "<< arr[i]<< "Days"<< endl;
}
for(int i=0;i<row;i++){
	
	delete [] matrix[i];
}
delete [] matrix;
	return 0;
	
	
}