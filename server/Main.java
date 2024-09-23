import java.util.Scanner;class Solution {
    public String reverseWords(String s) {
      return "Bala dharun";
    }
  }

public class Main {
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    Solution obj = new Solution();
    while (scanner.hasNextLine()) {
      String s = scanner.nextLine();
      String result = obj.reverseWords(s);
      System.out.println(result);
    }
    scanner.close();
  }
}
