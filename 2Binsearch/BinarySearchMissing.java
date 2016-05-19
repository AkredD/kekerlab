import javax.xml.bind.DatatypeConverter;
import java.io.BufferedReader;
import java.io.FileReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.*;


public class BinarySearchMissing {
    // Pre: i < j => a[i] >= a[j]
    // l >= -1 && l <= a.length-1
    // r >= 0 && r <= a.length
    // Post: a[-1]..a[l-1] > x >= a[r]..a[a.length]
    // Inv: a is immutable array
    public static int binarySearchRec(int x, int a[], int l, int r) {
        //Pre:  ∧  l < r
        int m = (l + r) / 2;
        //Post: <= m < r

        if (l >= r - 1) {
            //Inv: l >= r - 1
            if (r < a.length && a[r] == x) {
                //Inv: a[-1]...a[l-1] > x >= a[r]...[a.length]
                // a[r] == x
                // r < a.length
                return r;
            } else {
                //Inv: a[-1]...a[l-1] > x > a[r]...[a.length]
                // a[r] != x
                // a[l] != x
                // r < a.length
                return (-r - 1);
            }
        }

        if (x >= a[m]) {
            //Inv: m >= a[m]
            //Post: a[-1]..a[l-1] > x >= a[m]..a[a.length]
            return binarySearchRec(x, a, l, m);
        } else {
            //Inv:  x < a[m]
            //Post: a[-1]..a[m] > x >= a[r]..a[a.length]
            return binarySearchRec(x, a, m, r);
        }
    }

    // Pre: i < j => a[i] >= a[j]
    // l>=-1 && l <= a.length-1
    // r>=0 && r <= a.length
    // Post: a[-1]..a[l-1] > x >= a[r]..a[a.length]

    public static int binarySearchIter(int x, int a[], int l, int r) {
        for (; ; ) {
            //Pre:  ∧  l < r
            int m = (l + r) / 2;
            //Post: <= m < r
            if (l >= r - 1) {
                //Inv: l >= r - 1
                if (r < a.length && a[r] == x) {
                    // Inv: a[-1]...a[l-1] > x >= a[r]...[a.length]
                    // a[r] == x
                    // r < a.length
                    return r;
                } else {
                    // Inv: a[-1]...a[l-1] > x > a[r]...[a.length]
                    // a[r] != x
                    // a[l] != x
                    // r < a.length
                    return (-r - 1);
                }
            }

            if (x >= a[m]) {
                //Inv: m >= a[m]
                r = m;
            } else {
                //Inv:  x < a[m]
                l = m;
            }
        }
    }

    public static void main(String[] args) throws Exception {
        int x = Integer.parseInt(args[0]);
        int a[] = new int[args.length - 1];
        for (int i = 0; i < args.length - 1; ++i) a[i] = Integer.parseInt(args[i + 1]);
        System.out.println(binarySearchRec(x, a, -1, a.length));
    }
}