#include <stdio.h>
#include <stdlib.h>
int singleNumber(int* nums, int numsSize) {
    // Your code here
    int result = 0;
    for (int i = 0; i < numsSize; i++) {
        result ^= nums[i]; // XOR operation to find the single number
    }
    return result;
}int main() { 
int nums[1000], n;
fread(&n, sizeof(int), 1, stdin); 
fread(nums, sizeof(int), n, stdin); 
int result = singleNumber(nums, n);
printf("%d", result);
return 0;
}