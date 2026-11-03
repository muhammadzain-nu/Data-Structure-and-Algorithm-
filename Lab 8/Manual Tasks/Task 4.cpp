#include <iostream>
using namespace std;

class Node {
public:
    char data;
    Node* left;
    Node* right;

    Node(char value) {
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

void inorder(Node* root) {
    if (root == NULL)
        return;

    if (root->left != NULL || root->right != NULL)
        cout << "(";

    inorder(root->left);

    cout << root->data;

    inorder(root->right);

    if (root->left != NULL || root->right != NULL)
        cout << ")";
}

void postorder(Node* root) {
    if (root == NULL)
        return;

    postorder(root->left);
    postorder(root->right);

    cout << root->data << " ";
}

int main() {
    Node* root = new Node('*');

    root->left = new Node('+');
    root->right = new Node('-');

    root->left->left = new Node('A');
    root->left->right = new Node('B');

    root->right->left = new Node('C');
    root->right->right = new Node('D');

    cout << "Preorder: ";
    preorder(root);

    cout << "\nInorder: ";
    inorder(root);

    cout << "\nPostorder: ";
    postorder(root);

    return 0;
}
