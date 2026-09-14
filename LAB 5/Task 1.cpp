#include <iostream>
using namespace std;
void Linearsearch(int arr[], int n, int target){
	int numberofappearances=0;
	int indexes[]={0,0};
	for(int i=0;i<n;i++){
		if(arr[i]==target){
			numberofappearances++;
			if(indexes[0]==0){
				indexes[0]=i;
			}
			cout<<"Index appearances: "<<i<<endl;
		}
		
	}
	for(int i=n;i>0;i--){
		if(arr[i]==target){
			indexes[1]=i;
			break;
		}
	}
	if(numberofappearances>1){
		cout<<numberofappearances;
	}else if(numberofappearances==0){
		cout<<"Not found";
	}
	
}
int main(){
	int arr[]={10,10,10,20,30,40,50,80,10,90,50};
	Linearsearch(arr,11,10);
return 0;
}