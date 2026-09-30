#include <iostream>
using namespace std;
#define max 5
class queue{
	int arr[max]
	int front;
	int rear;
	int count
	class queue(){
		arr=NULL;
		front =0;
		rear=0;
		count=0
	}
	bool isFull(int front, int rear, int SIZE) {
    return (rear + 1) % SIZE == front;
}
  void enqueue(int key){
	   if(isFull()){
           cout<<"queue full"
		   return;	   	
	   }
	   arr[rear]=key;
	   rear=(rear+1)%max;
	   count++;
	}
	void dequeue(){
		if(count==0){
			
		}
		count--;
		arr[face]=NULL;
		face=(face+1)%max;
	}
	
};