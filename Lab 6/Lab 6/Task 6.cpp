#include <iostream>
using namespace std;
#define n 4
int maze[n][n]={{1,1,1,1},
               { 1,1,1,1},
               {1,1,1,1},
			   {1, 1, 1, 1} };


bool isSafe(int column, int row){

	if( row>n-1 || column>n-1 ||row<0 || column<0){
		return false;
	}
	
	if(maze[row][column]==0 || maze[row][column]==-1){
		return false;
	}
	return true;
}

bool solve(string Result, int column, int row){
		if(row==n-1 && column==n-1 ){
	cout<<Result<<endl;
		return true;
	}
	
	if(!isSafe(column, row)){
		return false;
	}
	maze[row][column]=-1;
	solve(Result+"R",column+1, row);
	solve(Result+"D",column, row+1);	
	maze[row][column]=1;
}
int main(){
	string Result="";
	if(solve(Result,0,0)){
		cout<<"Solved";
	}else{
		cout<<"Path not Found";
	}
}
