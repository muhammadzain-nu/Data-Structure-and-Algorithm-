#include <iostream>
using namespace std;
class node{

public:	int data;
	node* left;
	node* right;
   public:
   node(int dt){
	left=nullptr;
	right=nullptr;
	data=dt;
}
};
node* createnode(int key){
	node* temp=new node(key);
	return temp;
	}
class BST{
public:
	node* root;
	BST(){
		root=nullptr;
	}
	node* insert(node* root, int key){
		if(root==nullptr){
			root=createnode(key);
			return root;
		}
		if(root->data>key){
			root->left=insert(root->left, key);
			
		}else if(root->data<key){
			root->right=insert(root->right,key);
		
		}
		return root;
	}
	node* search(node* root, int data){
		if(root==nullptr){
			return root;
		}
		if(data==root->data) {
		return root;}
		if(data<root->data){
			return search(root->left,data);
	 }
	 	else{
				return search(root->right, data);
			}
}
node* findMin(node* root){
	if(root==nullptr){
		return root;
	}
	if(root->left==nullptr){
		return root;
	}
	return findMin(root->left);
}
node* findMax(node* root){
	if(root==nullptr){
		return root;
	}
	if(root->right==nullptr){
		return root;
	}
	return findMax(root->right);
}
void deleteKey(int key) {
    root = deleteNode(root, key);
}
node* deleteNode(node* root,int key){
   if(root==nullptr){
   	return nullptr;
   }
   if(key<root->data){
   	root->left=deleteNode(root->left, key);
   }else if(key>root->data){
   	root->right=deleteNode(root->right, key);
   }
   else{
   	if(root->left==nullptr && root->right==nullptr){
   		delete root;
   		return nullptr;
	   }
   
   else if(root->left==nullptr){
   	node* temp=root->right;
   	delete root;
   	return temp;
   }else if(root->right==nullptr){
   	node* temp=root->left;
   	delete root;
   	return temp;
   }
   else{
   	node* temp=findMin(root->left);
   	root->data=temp->data;
   	root->left=deleteNode(root->left,temp->data);
   }
   }
           return root;

}
node* inorderSuccessor(int key) {
    node* succ = nullptr;
    node* curr = root; 

    while (curr != nullptr) {
        if (key < curr->data) {
        
            succ = curr;      
            curr = curr->left; 
        } 
        else if (key > curr->data) {
            curr = curr->right; 
        } 
        else {
            if (curr->right != nullptr) {
                succ = findMin(curr->right);
            }
            break; 
        }
    }
    return succ;
}
void display(node* root){
	if(root==nullptr){
		return;
	}
	display(root->left);
		cout<<root->data<<" ";
	display(root->right);
}
};
int main(){
	BST tree;
    tree.root = tree.insert(tree.root, 20);
    
   tree.root= tree.insert(tree.root, 8);
   tree.root= tree.insert(tree.root, 22);
   tree.root= tree.insert(tree.root, 4);
    tree.root=tree.insert(tree.root, 12);
   tree.root= tree.insert(tree.root, 10);
   tree.root= tree.insert(tree.root, 14);
    
    node* target = tree.search(tree.root, 14);
    node* succ = tree.inorderSuccessor(14);
    tree.display(tree.root);
    cout<<"\n";
    tree.deleteKey(20);
    tree.display(tree.root);
	cout<<"The Successor is: "<<succ->data;
    
    return 0;
}
