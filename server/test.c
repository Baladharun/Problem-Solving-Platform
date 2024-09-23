#include <stdio.h>
#include <string.h>
char* reverseWords(char* s) {
    int length = strlen(s);
    int start, end;
    int wordCount = 0;
    
    // To store start and end indices of words
    int** wordPositions = (int**)malloc(length * sizeof(int*));
    for (int i = 0; i < length; i++) {
        wordPositions[i] = (int*)malloc(2 * sizeof(int));
    }
    
    int i = 0;
    // Iterate through the string to identify word boundaries
    while (i < length) {
        // Skip leading spaces
        while (i < length && s[i] == ' ') i++;
        if (i == length) break;
        
        start = i;  // Start of the word
        
        // Move to the end of the word
        while (i < length && s[i] != ' ') i++;
        end = i - 1;  // End of the word
        
        // Store the start and end indices of the word
        wordPositions[wordCount][0] = start;
        wordPositions[wordCount][1] = end;
        wordCount++;
    }
    
    char* result = (char*)malloc(length + 1);
    int pos = 0;
    
    // Reverse the order of the words and build the result string
    for (int j = wordCount - 1; j >= 0; --j) {
        for (int k = wordPositions[j][0]; k <= wordPositions[j][1]; ++k) {
            result[pos++] = s[k];
        }
        // Add a space between words, except for the last word
        if (j != 0) result[pos++] = ' ';
    }
    result[pos] = '\0';
    
    // Free allocated memory
    for (int i = 0; i < length; i++) {
        free(wordPositions[i])
    }
    free(wordPositions);
    
    return result;
}
int main() { char s[100]; fgets(s, sizeof(s), stdin); char *result = reverseWords(s); printf("%s", result); free(result); return 0; }