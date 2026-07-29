#include <iostream>
#include <stdexcept>
#include <utility>

class ImmutableSafeArray {
private:
    const int* m_data; // Pointer to const data: contents cannot be mutated
    const size_t m_size;
public:
    // Private constructor used internally to build new arrays efficiently
    ImmutableSafeArray(int* rawData, size_t size) 
        : m_data(rawData), m_size(size) {}

public:
    // 1. Constructor
    ImmutableSafeArray(const int* sourceData, size_t size) : m_size(size) {
        if (size == 0) {
            m_data = nullptr;
            return;
        }
        int* temp = new int[size];
        for (size_t i = 0; i < size; ++i) {
            temp[i] = sourceData[i];
        }
        m_data = temp;
    }

    // 2. Destructor
    ~ImmutableSafeArray() {
        delete[] m_data; 
    }

    // 3. Copy Constructor
    ImmutableSafeArray(const ImmutableSafeArray& other) : m_size(other.m_size) {
        if (m_size == 0) {
            m_data = nullptr;
            return;
        }
        int* temp = new int[m_size];
        for (size_t i = 0; i < m_size; ++i) {
            temp[i] = other.m_data[i];
        }
        m_data = temp;
    }

    // 4. Move Constructor (For efficiency when returning from mutators)
    ImmutableSafeArray(ImmutableSafeArray&& other) noexcept 
        : m_data(other.m_data), m_size(other.m_size) {
        other.m_data = nullptr;
        // const_cast allows us to reset the size of the dying temporary object
        const_cast<size_t&>(other.m_size) = 0; 
    }

    // Delete assignment operators because an immutable object cannot be reassigned!
    ImmutableSafeArray& operator=(const ImmutableSafeArray&) = delete;
    ImmutableSafeArray& operator=(ImmutableSafeArray&&) = delete;

    // 5. Accessor (Read-only)
    int get(size_t index) const {
        if (index >= m_size) {
            throw std::out_of_range("Index out of bounds!");
        }
        return m_data[index];
    }

    size_t size() const { return m_size; }

    // 6. MUTATOR: Returns a completely new array with the updated value
    ImmutableSafeArray set(size_t index, int newValue) const {
        if (index >= m_size) {
            throw std::out_of_range("Index out of bounds!");
        }

        // Allocate memory for the new copy
        int* newBuffer = new int[m_size];
        for (size_t i = 0; i < m_size; ++i) {
            newBuffer[i] = (i == index) ? newValue : m_data[i];
        }

        // Use the private constructor and return by value (Move semantics will optimize this)
        return ImmutableSafeArray(newBuffer, m_size);
    }

    // 7. Debug Helper
    void print() const {
        std::cout << "[ ";
        for (size_t i = 0; i < m_size; ++i) std::cout << m_data[i] << " ";
        std::cout << "]\n";
    }
};
int main() {
    int initialData[] = {10, 20, 30, 40};
    
    // Create original array
    ImmutableSafeArray original(initialData, 4);
    std::cout << "Original: "; original.print();

    // "Modify" an element -> creates a second array
    ImmutableSafeArray modified = original.set(1, 99);
    
    std::cout << "\nAfter set(1, 99):\n";
    std::cout << "Original remains: "; original.print(); // Unchanged!
    std::cout << "Modified copy:   "; modified.print(); // Has the change!

    // Functional method chaining syntax
    ImmutableSafeArray chained = original.set(0, 11).set(3, 44);
    std::cout << "\nChained modifications: "; chained.print();

    return 0;
}