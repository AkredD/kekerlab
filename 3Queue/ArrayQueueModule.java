// INV: for i = 0 to nsize - 1 : elements[(start + i) % elements.length] != null
// size >= 0
//
public class ArrayQueueModule{

    public static int nsize = 0, start = 0;

    public static Object[] elements = new Object[10];

    // Pre: element != null
    // Post: nsize == nsize` + 1
    // elements[(start + nsize`) % elements.length] == element
    public static void enqueue(Object element) {
        ensureCapacity(nsize + 1);
        elements[(start + nsize++) % elements.length] = element;
    }

    // Pre: element != null
    // Post: nsize == nsize` + 1
    // start == start` - 1
    // elements[start] = element
    public static void push(Object element){
        ensureCapacity(nsize + 1);
        start--;
        if (start < 0) start = elements.length - 1;
        elements[start] = element;
        nsize++;
    }

    // Pre: nsize != 0
    // Prev: Result == elements[(start + nsize - 1) % elements.length]
    public static Object peek(){
        assert (nsize > 0);
        return elements[(start + nsize - 1) % elements.length];
    }

    // Pre: nsize > 0
    // Post: Result == peek()
    // nsize == nsize` - 1
    public static Object remove(){
        assert (nsize > 0);
        Object temp = peek();
        nsize--;
        return temp;
    }

    // Post: capacity <= elements.length || capacity > elements.length && start == 0
    // elements.length == elements.length * 2
    //  for i = 0 to nsize - 1 : elements[(start + i) % elements.length] == elements[i]
    public static void ensureCapacity(int capacity) {
        if (capacity <= elements.length) {
            return;
        }
        Object[] newElements = new Object[elements.length * 2];
        for (int i = 0; i < nsize; i++) {
            newElements[i] = elements[(start + i) % elements.length];
        }
        elements = newElements;
        start = 0;
    }

    // Pre: nsize != 0
    // Post: Result = elements[start];
    public static Object element() {
        assert (nsize > 0);
        return elements[start];
    }

    // Pre: nsize != 0
    // Post: start == (start' + 1) % elements.length
    // nsize = nsize` - 1
    // Result == elements[start']
    public static Object dequeue() {
        assert (nsize > 0);
        Object temp = elements[start++];
        start %= elements.length;
        nsize--;
        return temp;
    }

    // Post: Result == nsize
    public static int size(){
        return nsize;
    }

    // Post: Result == nsize == 0;
    public static boolean isEmpty(){
        return nsize == 0;
    }

    // Post: start == nsize == 0;
    public static void clear(){
        start = nsize = 0;
    }
}