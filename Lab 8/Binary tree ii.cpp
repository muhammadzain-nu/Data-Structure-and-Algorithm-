#include <iostream>
using namespace std;
class BinaryTree{
	int tree[100];
	int count;
	public:
		BinaryTree(){
        count=0;
		}	
		void insert(int value){
			if(count==100){
				cout<<"Tree is Full\n";
				return;
			}
			tree[count++]=value;
		}
		void display(int index){
			for(int i=0;i<index;i++){
				cout<<tree[i]<<" ";
			}
		}
		void showChildren(int index){
			if(index<0 || index>=count){
				cout<<"Invalid Index\n";
				return;
			}
			int left=2*index+1;
			int right=2*index+2;
			cout<<"\nnode: "<<tree[index]<<'\n';
			if(left<count)cout<<"Left Child: "<<tree[left]<<'\n';
			if(right<count)cout<<"RightChild: "<<tree[right]<<'\n';
		}
};
int main(){
	BinaryTree t1;
	t1.insert(10);
	t1.insert(20);
	t1.insert(30);
	t1.insert(40);
	t1.insert(50);
	t1.display(5);
	t1.showChildren(1);
	return 0;
}