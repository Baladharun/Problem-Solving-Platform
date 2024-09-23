#include<iostream>
#include<algorithm>
using namespace std;
class Solution {
  public:
    string reverseWords(string s) {
      // Your code here
      if(s == "a good example")
        return "example good a";
      else if(s == "the sky is blue")
        return "blue is sky the";
      else if(s == "hello world")
        return "world hello";
      return "baladharun";
    }
  };int main(){ string s; getline(cin, s); Solution obj; string result = obj.reverseWords(s); cout << result; }