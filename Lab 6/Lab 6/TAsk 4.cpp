#include <iostream>
using namespace std;
int display(int n, int j){
	if(j==5){
		return 0;
	}

  n=n*2;
  	cout<<"Day: "<< j+1<<": "<< n<<endl;
  j++;
  return n+display(n, j);
  
}
int main(){
cout<<display(5, 0);	
}
