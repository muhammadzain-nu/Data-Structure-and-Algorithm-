#include <iostream>
using namespace std;
class SafeArray{
	int ncols;
	int nrows;
	int *dynamicArray;
	public:
	SafeArray(){
     ncols=0;
    	nrows=0;
    	dynamicArray= 0;	
	}
	SafeArray(int rows, int cols){
		nrows= rows;
		ncols= cols;
		dynamicArray= new int[nrows*ncols];
	}
	~SafeArray(){
	if(dynamicArray!=0){
		
		delete [] dynamicArray;
		dynamicArray=0;
	}
	}
	void insert(){
		for(int i=0;i<nrows;i++){
			for(int j=0;j<ncols;j++){
				cout<<"Enter the element Number"<<endl;
				cin>>dynamicArray[i*ncols+j];
			}
		}
	}
	int &operator ()(int rows, int cols){
		if(rows<0|| rows>nrows+1|| cols>ncols+1|| cols<0){
			cout<<"Array Out of Bounds";
			exit(0);
		}
		return dynamicArray[rows*nrows+cols];
	}
	SafeArray(const SafeArray& other){
	if(this==&other){
cout<<"self assignment"<<endl;//Kaha jaa rha h bhai, khud ko khud sy assign nahi krty
exit(0);
}
		ncols=other.ncols;
		nrows=other.nrows;
		
		dynamicArray=new int[nrows*ncols];
		for(int i=0;i<nrows*ncols;i++){
			for(int j=0;j<ncols;j++){
		dynamicArray[nrows*i+j]=other.dynamicArray[nrows*i+j];
		}
		}
		
	}
	SafeArray &operator =(const SafeArray& other){
		if(this==&other){
		return *this;
		}
		delete []dynamicArray;
		nrows=other.nrows;
		ncols=other.ncols;
		dynamicArray= new int[ncols*nrows];
		for(int i=0;i<nrows;i++){
		memcpy(dynamicArray,other.dynamicArray,sizeof(int)*ncols*nrows);
		}
	}
};
int main()
{
int columns;
int rows;
cout<<"enter number of rows and cols"<<endl;
cin>>rows>>columns;
SafeArray ob1(rows,columns);
ob1.insert();
SafeArray ob3(3,3);
ob3=ob1;
ob3.insert();
cout<<ob1(1,1)<<endl;

return 0;
}
