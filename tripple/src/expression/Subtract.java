package expression;

public class Subtract extends AbstractBinOperation implements TripleExpression {
    public Subtract(AbstractOperation operation1, AbstractOperation operation2){
        super(operation1, operation2);
    }
    public double evaluate(double x, double y, double z){
        common(x, y, z);
        return left - right;
    }
}
