import java.util.function.Function;
import java.util.function.Predicate;

public abstract class AbstractQueue {
    protected int size;

    public int size() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    abstract void enqueue(Object element);

    abstract Object element();

    abstract Object dequeue();

    abstract AbstractQueue makeEmpty();

    public AbstractQueue filter(Predicate<Object> predicate) {
        AbstractQueue queueNew = this.makeEmpty();
        for (int i = 0; i < size; i++) {
            if (predicate.test(this.element())) {
                queueNew.enqueue(this.element());
            }
            this.enqueue(this.dequeue());
        }
        return queueNew;
    }

    public AbstractQueue map(Function<Object, Object> function) {
        AbstractQueue queueNew = this.makeEmpty();
        for (int i = 0; i < size; i++) {
            queueNew.enqueue(function.apply(this.element()));
            this.enqueue(this.dequeue());
        }
        return queueNew;
    }
}
