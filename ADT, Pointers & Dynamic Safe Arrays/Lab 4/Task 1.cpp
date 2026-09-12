#include <iostream>
#include <vector>
using namespace std;

int main() {
    int prices[] = {45, 12, 78, 34, 23, 90};
    int n=sizeof(prices)/sizeof(prices[0]); 
    
    int numberofswaps=0;
    int pass=0;
    int numberofcomparisions=0;
    for (int i=0;i<n-1;i++) {
        pass++;
        for (int j=0;j<n-i-1;j++) {
        numberofcomparisions++;
            if (prices[j] > prices[j + 1]) { 
                prices[j] += prices[j + 1];
                prices[j + 1] = prices[j] - prices[j + 1];
                prices[j] = prices[j] - prices[j + 1];
               
                numberofswaps++;
            }
        }
        cout << "Pass" << pass << ": ";
        for (int k = 0; k < n; k++) {
            cout << prices[k] << " ";
        }
        cout << endl;
       
    }
    
    for (int i = 0; i < n; i++) {
        cout << prices[i] << " "; 
    }
    cout<<"\nTotal Number of swaps are "<<numberofswaps<<endl;
    cout<<"Total Number of Comparisions "<<numberofcomparisions<<endl;
    cout<<"Total passes "<<pass<<endl;
    return 0;
}
