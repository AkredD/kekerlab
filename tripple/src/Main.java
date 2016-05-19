import expression.*;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double x = sc.nextDouble();
        double y = sc.nextDouble();
        double z = sc.nextDouble();
        double result = new Add(
                new Subtract(
                        new Multiply(
                            new Variable ("x"),
                            new Multiply( // x*y*z
                                    new Variable("y"),
                                    new Variable("z")
                            )
                        ),
                        new Multiply( // 2x
                                new Const(2),
                                new Variable("x")
                        )
                ),
                new Const(1)
        ).evaluate(x,y,z);

        System.out.println(result);
    }
}