#include <iostream>
using namespace std;
class Node{
public:
	int data;
	Node *next;
	
};
class Stack{
	Node* top;
public:
	Stack(){
		
	top=NULL;
	}
	bool isEmpty(){
	return top==nullptr;}
void	push(int key){
		Node *temp=new Node();
		temp->data=key;
		temp->next=top;
		top=temp;
	}
	int pop(){
		if(isEmpty()){
			cout<<"Stack Underflow";
			return -1;
		}
		Node *temp=top;
		int popped=temp->data;
		top=top->next;
		delete temp;
		return popped;
	}
	int peek(){
		if(isEmpty()){
				cout<<"Stack Underflow";
			return -1;
		}
		return top->data;
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