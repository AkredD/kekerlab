package expression;

public abstract class AbstractBinOperation extends AbstractOperation implements TripleExpression {
    protected AbstractOperation operation1;
    protected AbstractOperation operation2;
    public AbstractBinOperation(AbstractOperation operation1, AbstractOperation operation2){
        this.operation1 = operation1;
        this.operation2 = operation2;
    }
    protected double left;
    protected double right;
    public void common(double x, double y, double z){
        this.left = operation1.evaluate(x, y, z);
        this.right = operation2.evaluate(x, y, z);
    }
}
