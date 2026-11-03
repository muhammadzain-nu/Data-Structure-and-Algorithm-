#include <iostream>
using namespace std;

class Node {
public:
    int data;
    Node* left;
    Node* right;

    Node(int value) {
        data = value;
        left = NULL;
        right = NULL;
    }
};

void preorder(Node* root) {
    if (root == NULL)
        return;

    cout << root->data << " ";

    preorder(root->left);
    preorder(root->right);
}

int main() {
    Node* root = new Node(15);

    root->left = new Node(8);
    root->right = new Node(25);

    root->left->left = new Node(4);
    root->left->right = new Node(12);

    root->right->right = new Node(30);

    cout << "Preorder Traversal: ";
    preorder(root);

    return 0;
}
