package expression;

public class Divide extends AbstractBinOperation implements TripleExpression {
    public Divide(AbstractOperation operation1, AbstractOperation operation2){
        super(operation1, operation2);
    }
    public double evaluate(double x, double y, double z){
        common(x, y, z);
        assert right != 0;
        return left / right;
    }
}
