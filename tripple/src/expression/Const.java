package expression;

public class Const extends AbstractOperation implements TripleExpression {
    private double value;
    public Const(double value){
        this.value = value;
    }
    public double evaluate(double x, double y, double z){
        return this.value;
    }
}
