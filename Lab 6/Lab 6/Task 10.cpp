#include <iostream>
using namespace std;
#define n 3
char grid[n][n] = {{'C', 'A', 'T'},
{'O', 'X', 'X'},
{'X', 'X', 'X'}
};

bool visited[n][n] = {false};

bool isSafe(int row, int col) {
    return row >= 0 && row < n &&
           col >= 0 && col < n &&
           !visited[row][col];
}

bool searchWord(int row, int col, string word, int index) {
    if (index == word.length())
        return true;

    if (!isSafe(row, col) || grid[row][col] != word[index])
        return false;

    visited[row][col] = true;

    if (searchWord(row + 1, col, word, index + 1) ||
        searchWord(row - 1, col, word, index + 1) ||
        searchWord(row, col + 1, word, index + 1) ||
        searchWord(row, col - 1, word, index + 1))
        return true;
    visited[row][col] = false;
    return false;
}

int main() {
    string word = "CAT";

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == word[0]) {
                if (searchWord(i, j, word, 0)) {
                    cout << "Word found";
                    return 0;
                }
            }
        }
    }
    cout << "Word not found";
    return 0;
}
