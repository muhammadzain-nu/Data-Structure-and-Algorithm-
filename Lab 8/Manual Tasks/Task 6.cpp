#include <iostream>
using namespace std;

class CompleteBinaryTree {
    int tree[100];
    int count;

public:
    CompleteBinaryTree() {
        count = 0;
    }

    void insert(int value) {
        tree[count] = value;
        count++;
    }

    void preorder(int index) {
        if (index >= count)
            return;

        cout << tree[index] << " ";

        preorder(2 * index + 1);
        preorder(2 * index + 2);
    }

    void inorder(int index) {
        if (index >= count)
            return;

        inorder(2 * index + 1);

        cout << tree[index] << " ";

        inorder(2 * index + 2);
    }

    void postorder(int index) {
        if (index >= count)
            return;

        postorder(2 * index + 1);
        postorder(2 * index + 2);

        cout << tree[index] << " ";
    }
};

int main() {
    CompleteBinaryTree t;

    t.insert(10);
    t.insert(20);
    t.insert(30);
    t.insert(40);
    t.insert(50);
    t.insert(60);

    cout << "Preorder: ";
    t.preorder(0);

    cout << "\nInorder: ";
    t.inorder(0);

    cout << "\nPostorder: ";
    t.postorder(0);

    return 0;
}
