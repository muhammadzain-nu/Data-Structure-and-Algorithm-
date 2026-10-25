#include <iostream>
#include <utility>
int count=0;
using namespace std;
void display(int arr[]){
	 for(int k=0;k<7;k++){
		cout<<arr[k]<<" ";
	}
}
int partition(int arr[], int low, int high){
	int pivot= arr[high];//part 2
	cout<<"\nPivot: "<<pivot;
	int i=low-1;
	for(int j=low;j<high;j++){
		if(arr[j]<pivot){
			i++;
			swap(arr[i],arr[j]);
		}
	}
	cout<<"\nBoundary: "<<low<<"-"<<high;

	swap(arr[i+1], arr[high]);
		cout<<"\narray after Partition Completes: ";
display(arr);
count++;
	return i+1;
}
void quicksort(int arr[], int low, int high){//part 1
	if(low<high){
		int pi=partition(arr, low, high);
		quicksort(arr, low, pi-1);
		quicksort(arr, pi+1, high);
	}
}
	

int main(){
	int arr[]={40, 20, 70, 10, 60, 30, 50};
    quicksort(arr, 0, 6);
    cout<<"\nPartition Operations Count: "<<count;
    cout<<"\n------Final Array--------\n";
    display(arr);
    return 0;
}
