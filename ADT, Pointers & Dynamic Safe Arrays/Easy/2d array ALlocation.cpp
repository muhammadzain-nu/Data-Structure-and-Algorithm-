#include <iostream>
using namespace std;
int main(){
	int row, col;
	
	cout<<"Enter rows"<< endl;
	cin>>row;
cout<<"Enter columns"<< endl ;
cin>>col;
int **matrix= new int*[row];
for(int i=0;i<col;i++){
	matrix[i] = new int[col];
}
cout<<"Memory ALlocated"<< endl;
//input function
for(int i=0;i<row;i++){
	for(int j=0;j<col;j++){
		cout<<"Enter the element of row:"<< i << "and column:"<< j <<endl;
		cin>>matrix[i][j];
	}
}
//display function
	for(int i=0;i<row;i++){
	for(int j=0;j<col;j++){
		cout<<matrix[i][j];
	}
	cout<<"\n";
}for(int i=0;i<row;i++){
	
	delete [] matrix[i];
}
delete [] matrix;
	
	return 0;
}
