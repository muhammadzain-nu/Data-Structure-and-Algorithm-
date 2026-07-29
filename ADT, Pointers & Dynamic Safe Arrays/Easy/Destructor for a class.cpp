#include <iostream>
#include <cstring>
using namespace std;
class Myclass{
public:	char* Name;
	Myclass(char* x){
   Name= new char[strlen(x)+1];
   strcpy(Name,x);
   
	}
	public:
	~Myclass(){
	delete[] Name;
	cout<<"Destructor executed";
	}
	
};
int main(){
	Myclass Zain("Zain");
	cout<<Zain.Name;
	return 0;
}
