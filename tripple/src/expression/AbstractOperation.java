package expression;

public abstract class AbstractOperation implements TripleExpression {

    public abstract double evaluate(double x, double y, double z);
}
