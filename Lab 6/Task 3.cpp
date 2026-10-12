#include <iostream>
using namespace std;
#define n 4
int board[n][n]={0};
bool isSafe(int row, int col){
	for(int i=0;i<row;i++){
		if(board[i][col]==1){
			return false;
		}
	}
	
	for(int i=0;i<col;i++){
		if(board[row][i]==1){
			return false;
		}
	}
	
	for(int i=row-1, j=col-1;i>=0&&j>=0;i--,j--){
		if(board[i][j]==1){
			return false;
		}
	}
		for(int i=row-1, j=col+1;i>=0 && j<n;i--, j++){
			if(board[i][j]==1){
				return false;
			}
		}
	
		return true;
}
void print(){
	for(int i=0;i<n;i++){
		
		for(int j=0;j<n;j++){
			cout<<board[i][j];
		}
		cout<<endl;
	}
}
bool solvenQueen(int row){
	if(row==n){
		return true;
	}
	for(int col=0;col<n;col++){
		if(isSafe(row, col)){
			board[row][col]=1;
			if(solvenQueen(row+1)){
				return true;
			}
			board[row][col]=0;
		}
		
	}
return false;
}
int main(){
	

if(solvenQueen(0)){
	print();
}else{
	cout<<"Cant solve";
}
return 0;
}
