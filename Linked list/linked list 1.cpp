#include <iostream>
using namespace std;
class Node{
	public:
		int data;
		Node *Next;
};
int main(){
	Node* head= new Node;
	head->data=10;
	head->Next=NULL;
	cout<<head->data;
}
