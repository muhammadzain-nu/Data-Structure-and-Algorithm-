#include <iostream>
using namespace std;
int n=0;
int comparisions=0;
void merge(int arr[], int left, int mid, int right){
	int n1=mid-left+1;
	int n2=right-mid;
	int *L=new int[n1];
	int *R=new int[n2];
	cout<<"Left SubArray";
	for(int i=0;i<n1;i++) {
	L[i]=arr[left+i];
	cout<<"	"<<L[i];
	}
		cout<<"\nRight SubArray";

	for(int j=0;j<n2;j++){
	 R[j]=arr[mid+1+j];
	cout<<"	"<<R[j];
	}
	cout<<endl;
	 int i=0, j=0, k=left;
	while(i<n1 && j<n2){
		if(L[i]<=R[j]){
			arr[k]=L[i];
			i++; k++;
			comparisions++;
		}else{
			arr[k]=R[j];
			k++;j++;
			comparisions++;
		}
	}
	cout<<"Number of comparisions: "<< i+j<<endl;
	while(i<n1) arr[k++]=L[i++];
	while(j<n2) arr[k++]=R[j++];
	delete[] L;
	delete[] R;
}
void display(int arr[]){
		cout<<"\nmerge operation number:"<<n;
	for(int i=0;i<8;i++){
		cout<<" "<<arr[i];
	}
	cout<<endl;
}
void mergesort(int arr[], int left, int right){
	if(left>=right){
		return;
	}
	int mid=(left+right)/2;
	mergesort(arr, left, mid);
	mergesort(arr, mid+1, right);
	merge(arr, left, mid, right);
	n++;
	display(arr);
	
}

int main(){
	int arr[]={1299, 499, 2499, 799, 499, 1599, 999, 299};
	mergesort(arr,0,7);
	cout<<"\n-----------After MErge sort------------\n";
	cout<<"Total Merges: "<<n<<endl;
	for(int i=0;i<8;i++){
		cout<<" "<<arr[i];
	}
	cout<<"\nTotal Comparisions: "<<comparisions<<endl;
}
