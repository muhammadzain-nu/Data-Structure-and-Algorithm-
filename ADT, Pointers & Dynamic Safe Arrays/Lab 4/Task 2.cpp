#include <iostream>
#include <vector>
using namespace std;

int main() {
    int prices[] = {55, 61, 67, 72, 78, 81, 80, 85};
    int n=sizeof(prices)/sizeof(prices[0]); 
    bool swapped = false;
    int numberofswaps=0;
    int pass=0;
    int standardcomparisions=n*(n-1)/2;
    int numberofcomparisions=0;
    for(int i=0;i<n-1;i++) {
    swapped = false;
      pass++;
        for(int j=0;j<n-i-1;j++) {
        numberofcomparisions++;
            if (prices[j] > prices[j + 1]) { 
                prices[j] += prices[j + 1];
                prices[j + 1] = prices[j] - prices[j + 1];
                prices[j] = prices[j] - prices[j + 1];
                swapped = true;
                numberofswaps++;
            }
        }
        cout << "Pass" << pass << ": ";
        for (int k = 0; k < n; k++) {
            cout << prices[k] << " ";
        }
        cout << endl;
        if (!swapped) {
            break;
        }
    }
    
    for (int i = 0; i < n; i++) {
        cout << prices[i] << " "; 
    }
    cout<<"\nTotal Number of swaps are "<<numberofswaps<<endl;
    cout<<"Total Number of Comparisions "<<numberofcomparisions<<endl;
    cout<<"Total passes "<<pass<<endl;
    cout<<"Standard's Bubble sort Comparisions: "<<standardcomparisions<<endl;
    return 0;
}
