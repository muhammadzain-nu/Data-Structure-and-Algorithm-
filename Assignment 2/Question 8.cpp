
#include <iostream>
using namespace std;

#define N 4

int maze[N][N] = {
    {1, 1, 0, 1},
    {1, 1, 1, 1},
    {0, 1, 0, 1},
    {1, 1, 1, 1}
};
bool visited[N][N] = {false};
char path[100];
int pathIndex = 0;
bool found = false;

bool isSafe(int row, int col) {
    if (row < 0 || row >= N ||
        col < 0 || col >= N) {
        return false;
    }

    if (maze[row][col] == 0 || visited[row][col]) {
        return false;
    }

    return true;
}
void findPaths(int row, int col) {
    if (row == N - 1 && col == N - 1) {
        found = true;

        for (int i = 0; i < pathIndex; i++) {
            cout << path[i];
        }

        cout << endl;
        return;
    }
    visited[row][col] = true;
    if (isSafe(row - 1, col)) {
        path[pathIndex++] = 'U';
        findPaths(row - 1, col);
        pathIndex--;
    }
    if (isSafe(row + 1, col)) {
        path[pathIndex++] = 'D';
        findPaths(row + 1, col);
        pathIndex--;
    }
    if (isSafe(row, col - 1)) {
        path[pathIndex++] = 'L';
        findPaths(row, col - 1);
        pathIndex--;
    }

    if (isSafe(row, col + 1)) {
        path[pathIndex++] = 'R';
        findPaths(row, col + 1);
        pathIndex--;
    }

    visited[row][col] = false;
}

int main() {

    if (maze[0][0] == 0 || maze[N-1][N-1] == 0) {
        cout << "No path exists." << endl;
        return 0;
    }

    findPaths(0, 0);

    if (!found) {
        cout << "No path exists." << endl;
    }

    return 0;
}

