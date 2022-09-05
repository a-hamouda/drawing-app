/**
 * Data structure element.
 */
class DataStructureNode {
    constructor(data, next = null) {
        /**
         * Data of the element
         */
        this.data = data;
        /**
         * Next element in the data structure.
         * @type {DataStructureNode}
         */
        this.next = next;
    }
}

/**
 * Stack data structure.
 */
class Stack {
    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    /**
     *  Add element to the beginning of the stack.
     */
    add(data) {
        const newNode = new DataStructureNode(data);
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

    /**
     * Removes element from the beginning of the list.
     */
    remove() {
        if (!this.first) return null;
        const temp = this.first;
        this.first = this.first.next;
        this.size--;
        temp.next = null; //removing the connection, not necessary but important
        return temp.data;
    }
}
