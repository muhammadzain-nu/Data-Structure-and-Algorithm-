#include <iostream>
using namespace std;
#define max 5
class Stack{
	int arr[max];
	int top;

public:
	Stack(){
		*arr=NULL;
		top=0;
	}
	void push(int key){
		if(top>=max){
			cout<<"Stack Overflow";
	    return;		
		}
		arr[top]=key;
		top++;
	}
	int pop(){
		if(top==0){
			
			cout<<"Stack Underflow: ";
		return 0;
		}
		top--;
	   int key=arr[top];
	   arr[top]=NULL;
	   
	   return key;	
	}
	int peek(){
		if(top==0){
			cout<<"Stack Underflow: ";
		return 0;
		}
		return arr[top-1]; 
	}
};
int main() {
    Stack s1;         
    s1.push(3);       
    cout << s1.pop() << endl; 
    
    s1.push(5);        
    cout << s1.peek() << endl; 
    cout << s1.pop() << endl; 
    cout << s1.pop() << endl;  
    
    return 0;
}