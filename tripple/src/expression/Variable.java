package expression;

public class Variable extends AbstractOperation implements TripleExpression {

    private String name;

    private int value;

    public Variable(String name){
        this.name = name;
    }
    public double evaluate(double x, double y, double z){
        if (name.equals("x")) return x;
        if (name.equals("y")) return y;
        if (name.equals("z")) return z;
        return 0;
    }
}