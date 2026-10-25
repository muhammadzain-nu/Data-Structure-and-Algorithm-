#include <iostream>
#include <utility>
using namespace std;
int getmax(int arr[], int n){
	int max=arr[0];
	for(int i=1;i<n;i++){
		if(arr[i]>max){
			max=arr[i];
		}
	}
	return max;
}
void countingsort(int arr[], int n, int exp){
	int *output=new int[n];
	int count[10]={0};
	for(int i=0;i<n;i++){
		int digit=(arr[i]/exp)%10;
		count[digit]++;
	}
	cout<<"\nFrequencies of elements: ";
	cout<<"0="<<count[0]<<" ";
	for(int i=1;i<10;i++){
						cout<<i<<"="<<count[i]<<" ";//freq

		count[i]=count[i]+count[i-1];
	}
	cout<<"\nCumulative Count: ";
	for(int i=0;i<10;i++){
		cout<<" "<<count[i];//cumulative

	}
	for(int i=n-1;i>=0;i--){
		int digit=(arr[i]/exp)%10;
		output[count[digit]-1]=arr[i];
		count[digit]--;
	}
	cout<<"\nOutput array: ";
	for(int i=0;i<n;i++){
		arr[i]=output[i];
		cout<<" "<<output[i];
	}
	delete[] output;
}
void radixsort(int arr[], int n){

	int maxVal=getmax(arr, n);
	for(int exp=1;maxVal/exp>0;exp*=10){
		countingsort(arr, n, exp);
	}
}

int main(){
	int arr[] = {329, 457, 657, 839, 436, 720, 355};
	int n=sizeof(arr)/sizeof(arr[0]);
	radixsort(arr, n);
	cout<<"\nArray After sorting: ";
	for(int i=0;i<n;i++){
		cout<<" "<<arr[i];
	}
	return 0;
}
