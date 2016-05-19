// INV: for i = 0 to nsize - 1 : elements[(start + i) % elements.length] != null
// size >= 0
public class ArrayQueueADT{

    private int nsize = 0, start = 0;

    private Object[] elements = new Object[10];

    // Pre: element != null
    // Post: nsize == nsize` + 1
    // elements[(start + nsize`) % elements.length] == element
    public static void enqueue(ArrayQueueADT queue, Object element) {
        queue.ensureCapacity(queue, queue.nsize + 1);
        queue.elements[(queue.start + queue.nsize++) % queue.elements.length] = element;
    }

    // Pre: element != null
    // Post: nsize == nsize` + 1
    // start == start` - 1
    // elements[start] = element
    public static void push(ArrayQueueADT queue, Object element){
        ensureCapacity(queue, queue.nsize + 1);
        queue.start--;
        if (queue.start < 0) queue.start = queue.elements.length - 1;
        queue.elements[queue.start] = element;
        queue.nsize++;
    }

    // Pre: nsize != 0
    // Prev: Result == elements[(start + nsize - 1) % elements.length]
    public static Object peek(ArrayQueueADT queue){
        assert (queue.nsize > 0);
        return queue.elements[(queue.start + queue.nsize - 1) % queue.elements.length];
    }

    // Pre: nsize > 0
    // Post: Result == peek()
    // nsize == nsize` - 1
    public static Object remove(ArrayQueueADT queue){
        assert (queue.nsize > 0);
        Object temp = queue.peek(queue);
        queue.nsize--;
        return temp;
    }

    // Post: capacity <= elements.length || capacity > elements.length && start == 0
    // elements.length == elements.length * 2
    // for i = 0 to nsize - 1 : elements[(start + i) % elements.length] == elements[i]
    private static void ensureCapacity(ArrayQueueADT queue, int capacity) {
        if (capacity <= queue.elements.length) {
            return;
        }
        Object[] newElements = new Object[queue.elements.length * 2];
        for (int i = 0; i < queue.nsize; i++) {
            newElements[i] = queue.elements[(queue.start + i) % queue.elements.length];
        }
        queue.elements = newElements;
        queue.start = 0;
    }

    // Pre: nsize != 0
    // Post: Result = elements[start];
    public static Object element(ArrayQueueADT queue) {
        assert (queue.nsize > 0);
        return queue.elements[queue.start];
    }

    // Pre: nsize != 0
    // Post: start == (start' + 1) % elements.length && nsize = nsize` - 1
    // Result == elements[start']
    public static Object dequeue(ArrayQueueADT queue) {
        assert (queue.nsize > 0);
        Object temp = queue.elements[queue.start++];
        queue.start %= queue.elements.length;
        queue.nsize--;
        return temp;
    }

    // Post: Result == nsize
    public static int size(ArrayQueueADT queue){
        return queue.nsize;
    }

    // Post: Result == nsize == 0;
    public static boolean isEmpty(ArrayQueueADT queue){
        return queue.nsize == 0;
    }

    // Post: start == nsize == 0;
    public static void clear(ArrayQueueADT queue){
        queue.start = queue.nsize = 0;
    }
}