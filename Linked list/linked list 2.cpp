#include <iostream>
using namespace std;
class Node{
	public:
		int data;
		Node *Next;
		Node(int val){
			data=val;
			Next=NULL;
		}
};
int main(){
	Node* head= new Node(4);
	Node* temp=new Node(10);
	temp->Next=head;
	head=temp; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;; ; ; ; ; ; ; ;; ; ; ; 
	return 0;
	
}
