#include <iostream>
using namespace std;
#define n 4
int puzzle[n][n]={{1,0,0,4},
{0,4,1,0},
{0,1,4,0},
{4,0,0,1}};
bool isSafe(int key, int row, int column){
	if(row==n || row==n){
		return false;
	}
	for(int i=0;i<n;i++){
		if(puzzle[i][column]==key){
			return false;
		}
		if(puzzle[row][i]==key){
			return false;
		}
	}
	int startRow = (row / 2) * 2;
    int startColumn = (column / 2) * 2;

    for (int i = startRow; i < startRow + 2; i++) {
    for (int j = startColumn; j < startColumn + 2; j++) {
        if (puzzle[i][j] == key)
            return false;
    }
}

return true;
}
bool SolvePuzzle(int row, int column){
	if (row == n)
    return true;

if (column == n)
    return SolvePuzzle(row + 1, 0);
	if (puzzle[row][column] != 0)
        return SolvePuzzle(row, column + 1);
	for(int i=1;i<=n;i++){
	
		
		if(isSafe(i,row,column)){
			puzzle[row][column]=i;
		
		    if (SolvePuzzle(row, column + 1))
                return true;

            puzzle[row][column] = 0;
        }
	}
	
	return false;
}
int main(){
	if(SolvePuzzle(0,0)){
		for(int i=0;i<n;i++){
			for(int j=0;j<n;j++){
				cout<<puzzle[i][j]<<" ";
			}
			cout<<endl;
		}
	}else{
		cout<<"Cant solve";
	}
}
