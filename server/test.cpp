#include<iostream>
#include<vector>
using namespace std;class Solution {
  public:
    int singleNumber(vector<int>& nums) {
        int result = 0;
        for(int num:nums)
            result^=num;
        return result;
    }
};int main() {
    vector<int> nums;
 int i,n,num;
 cin>>n; for(int i=0;i<n;i++)  { cin>>num; nums.push_back(num);}    Solution obj;
    int result = obj.singleNumber(nums);
    cout << result;
    return 0;
}