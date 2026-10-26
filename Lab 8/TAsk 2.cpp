#include <iostream>
using namespace std;

class Node{
	public:
	char data;
	Node *left;
	Node *right;
	Node(char dt){
		data=dt;
		left=nullptr;
		right=nullptr;
	}
};
Node* createnode(char data){
	return new Node(data);
}
class binaryTree{
public:
	Node* root;
public:
	binaryTree(){
		root=nullptr;
	}
	binaryTree(char data){
		root=createnode(data);
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

}         