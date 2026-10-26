#include <iostream>
using namespace std;

class Node{
	public:
	int data;
	Node *left;
	Node *right;
	Node(int dt){
		data=dt;
		left=nullptr;
		right=nullptr;
	}
};
Node* createnode(int data){
	return new Node(data);
}
class binaryTree{
public:
	Node* root;
public:
	binaryTree(){
		root=nullptr;
	}
	binaryTree(int data){
		root=createnode(data);
	}
	Node* buildTree(){
		int value;
		cout<<"Enter Value(-1 for no node): ";
		cin>>value;
		if(value==-1){
			return NULL;
		}
		Node *root=createnode(value);
		cout<<"Enter Left Child of "<<value<<endl;
		root->left=buildTree();
		cout<<"Enter Right Child of "<< value<<endl;
		root->right=buildTree();
		return root; 
	}
 
};
void displayTree(Node* temp){
    if(temp==nullptr)return;
    cout<<" "<<temp->data;
    displayTree(temp->left);
    displayTree(temp->right);
} 
 void inorder(Node* root){
  	if(root==NULL){
  		return;
	  }
	  inorder(root->left);
	  cout<<root->data<<" ";
	  inorder(root->right);
  }
	void postorder(Node* root){
		if(root==NULL){
			return;
		}
		postorder(root->left);
		postorder(root->right);
		cout<<root->data<<" ";
	}
	void preorder(Node *root){
		if(root==NULL)
		{
			return;
		}
		cout<<root->data<<" ";
		preorder(root->left);
		preorder(root->right);
	}


int main(){
	binaryTree n1= binaryTree();
	n1.root =n1.buildTree();
	cout<<"Display:(Preorder)\n";
    displayTree(n1.root);
    cout<<"\nPreOrder: ";
    preorder(n1.root);
    cout<<"\nPostOrder: ";
    postorder(n1.root);
    cout<<"\nInOrder: ";
    inorder(n1.root);
}         