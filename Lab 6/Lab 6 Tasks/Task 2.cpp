#include <iostream>
#include <stack>
#include <string>
using namespace std;

class TextEditor {
    stack<string> undoStack, redoStack;
    string document;

public:
    void type(string word) {
        undoStack.push(word);
        redoStack = stack<string>();

        if (!document.empty())
            document += " ";
        document += word;

        print();
    }

    void undo() {
        if (undoStack.empty()) {
            cout << "Nothing to undo\n";
            return;
        }

        string word = undoStack.top();
        undoStack.pop();
        redoStack.push(word);

        size_t pos = document.rfind(word);
        if (pos != string::npos) {
            if (pos > 0 && document[pos - 1] == ' ')
                pos--;
            document.erase(pos);
        }

        print();
    }

    void redo() {
        if (redoStack.empty()) {
            cout << "Nothing to redo\n";
            return;
        }

        string word = redoStack.top();
        redoStack.pop();
        undoStack.push(word);

        if (!document.empty())
            document += " ";
        document += word;

        print();
    }

    void print() {
        cout << "Document: \"" << document << "\"\n";
    }
};

int main() {
    TextEditor editor;

    editor.type("Hello");
    editor.type("World");
    editor.undo();
    editor.redo();
    editor.undo();
    editor.type("There");
    editor.redo();

    return 0;
}
