#include <iostream>
using namespace std;
#define n 4
char arr[n]={0};
//Assuming index 0-3 have A,B,D,C colors Perspectively
void display(){
	for(int i=0;i<n;i++)
	{
		cout<<arr[i]<<" ";
	}
	cout<<endl;
}
bool isSafe(char c, int index){
	if(index==0){
		
		return true;
	}
	if(index==1)
	if(index==n-1){
		if(arr[0]==c){
			return false;
		}
	}
	
	if(arr[index-1]==c){
		return false;
	}
	if (index == 3) {
        if (arr[0] == c || arr[1] == c || arr[2] == c) return false;
    }
	return true;
}
bool assignColor(int index){
	if(index==n){
		display();
		return true;
	}
	if(isSafe('R', index)){
	    arr[index]='R';
	    assignColor(index+1);
	    arr[index]=0;
	}
	if(isSafe('G', index)){
	    arr[index]='G';
	    assignColor(index+1);
	    arr[index]=0;
		
	}
	if(isSafe('B', index)){
	    arr[index]='B';
	    assignColor(index+1);
	    arr[index]=0;
	}
	return true;
}
int main(){
if(assignColor(0))
{
	cout<<"Arranged";
	}else{
		cout<<"No color Arrangements possible";
	}	

}
