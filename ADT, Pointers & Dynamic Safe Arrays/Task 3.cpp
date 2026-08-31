#include <iostream>
using namespace std;
class image{
	public:
	int ncols;
	int nrows;
	int **imagedata;
	public:
	image(){
     ncols=0;
    	nrows=0;
    	imagedata= 0;	
	}
	image(int rows, int cols){
		nrows= rows;
		ncols= cols;
		imagedata= new int*[nrows];
		for(int i=0;i<nrows;i++){
			imagedata[i]=new int[ncols];
		}
	}
	~image(){
	if(imagedata!=0){
		for(int i=0;i<nrows;i++){
			if(imagedata!=0){
				delete imagedata[i];
			}
		  imagedata[i] = 0;
		}
		delete imagedata;
		imagedata=0;
	}
	}
	void insert(){
		for(int i=0;i<nrows;i++){
			for(int j=0;j<ncols;j++){
				cout<<"Enter the element Number"<<endl;
				cin>>imagedata[i][j];
			}
		}
	}
	int &operator ()(int rows, int cols){
		if(rows<0|| rows>nrows+1|| cols>ncols+1|| cols<0){
			cout<<"Array Out of Bounds";
			exit(0);
		}
		return imagedata[rows][cols];
	}
	image(const image& other){
	if(this==&other){
cout<<"self assignment not allowed"<<endl;//Kaha jaa rha h bhai, khud ko khud sy assign nahi krty
exit(0);
}
		ncols=other.ncols;
		nrows=other.nrows;
		imagedata=new int*[nrows];
		for(int i=0;i<nrows;i++){
			imagedata[i]=new int[ncols];
					memcpy(imagedata[i],other.imagedata[i],sizeof(int)*ncols);
		}
		
	}
	image &operator =(const image& other){
		if(this==&other){
		return *this;
		}
		for(int i=0;i<nrows;i++){
			delete imagedata[i];
		}
		delete imagedata;
		nrows=other.nrows;
		ncols=other.ncols;
		imagedata= new int*[nrows];
		for(int i=0;i<nrows;i++){
			imagedata[i] = new int[ncols];
		memcpy(imagedata[i],other.imagedata[i],sizeof(int)*ncols);
		}
	}
	void kernel(){
		int kernal[3][3];
	for(int i=0;i<3;i++){
		for(int j=0;j<3;j++){
			kernal[i][j]=1;
		}
	}
		for(int i=0;i<3;i++){
			for(int j=0;j<3;j++){
				int sum=0;
				for(int k=0;k<3;k++){
					for(int l=0;l<3;l++){
						sum+=imagedata[i+k][j+l]*kernal[i][j];
					}
				}
							kernal[i][j]=sum;

			}
			
		}
			for(int i=0;i<3;i++){
		for(int j=0;j<3;j++){
			cout<<" "<<kernal[i][j]<<endl;
		}
		cout<<"\n";
	}
	}
};
int main(){
	image img(5,5);
	img(0,0)=10;
    img(0,0)=20;
	img(0,0)=30;
	img(0,0)=40;
	img(0,0)=50;
	
	img(0,0)=60;
	img(0,0)=70;
	img(0,0)=80;
	img(0,0)=90;
	img(0,0)=100;
	
	img(0,0)=110;
	img(0,0)=120;
	img(0,0)=130;
	img(0,0)=140;
	
	img(0,0)=150;
	img(0,0)=160;
	img(0,0)=170;
	img(0,0)=180;
	img(0,0)=190;
		
	img(0,0)=200;
	img(0,0)=210;
	img(0,0)=220;
	img(0,0)=230;
	img(0,0)=240;
	img.kernel();

	
	
}
