class Node {
    constructor(data, next = null) {
        this.data = data;
        this.next = next;
    }
}

class Stack {
    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }
    //Adds element to the beginning of the list. similar to Array.unShift()
    add(data) {
        const newNode = new Node(data);
        if (!this.first) {
            this.last = newNode;
            this.first = newNode;
        } else {
            const temp = this.first;
            this.first = newNode;
            newNode.next = temp;
        }
        return ++this.size;
    }

    //Removes element from the beginning of the list. similar to Array.shift()
    remove() {
        if (!this.first) return null;
        const temp = this.first;
        this.first = this.first.next;
        this.size--;
        temp.next = null; //removing the connection, not necessary but important
        return temp.data;
    }
}
