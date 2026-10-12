#include <iostream>
using namespace std;
int display(int n, int j){
	if(j==5){
		return 1;
	}
  n=n*2;
  j++;
  display(n, j);
  cout<<"Day: "<< j<<": "<< n<<endl;
}
int main(){
cout<<display(10, 0);	
}
