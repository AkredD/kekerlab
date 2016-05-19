import javax.xml.bind.DatatypeConverter;
import java.io.BufferedReader;
import java.io.FileReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.*;


public class CalcSHA256 {
    public static void main(String[] args)throws Exception {
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            BufferedReader in = new BufferedReader(new FileReader(args[0]));
            String fileName;
            while ((fileName=in.readLine()) != null) System.out.println(DatatypeConverter.printHexBinary(sha.digest(Files.readAllBytes(Paths.get(fileName)))));
            in.close();
    }
}