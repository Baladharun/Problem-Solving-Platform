const { spawn } = require('child_process');
const { writeFileSync } = require('fs');

let testInputs;
let expectedOutputs;

async function getTestData(language, code, numTestCases, db, questionNo) {
  try {
    // Use `skip()` to retrieve the document by its position (questionNo - 1)
    const questionData = await db.collection('question_set').find().toArray();

    // Check if the question exists
    if (!questionData.length) {
      throw new Error(`No question found for number ${questionNo}`);
    }

    // Extract testInputs and expectedOutputs from the found question
    const question = questionData[questionNo-1];
    testInputs = question.testInputs;
    expectedOutputs = question.expectedOutputs;

    // Proceed to compile and run the code
    return await compileAndRun(language, code, numTestCases);
  } catch (error) {
    return { compilation_error: error.message };
  }
}



function runProgram(command, args, numTestCases) {
  return new Promise((resolve, reject) => {
    const inputsToUse = testInputs.slice(0, numTestCases);
    const outputsToUse = expectedOutputs.slice(0, numTestCases);
    let output = [];
    let completedTestCases = 0;

    inputsToUse.forEach((input, index) => {
      const run = spawn(command, args);

      run.stdin.write(input + '\n');
      run.stdin.end();

      let dataCollector = '';

      run.stdout.on('data', (data) => {
        dataCollector += data.toString();
      });

      run.stdout.on('end', () => {
        output[index] = dataCollector.trim();
        completedTestCases++;

        if (numTestCases === 3) {
          if (completedTestCases === numTestCases) {
            resolve({ result: { input: inputsToUse, expected: outputsToUse, output: output } });
          }
        } else {
          if (output[index] !== outputsToUse[index]) {
            resolve({ result: { input: [inputsToUse[index]], output: [output[index]], expected: [outputsToUse[index]] } });
          } else if (completedTestCases === numTestCases) {
            resolve({ success: "All test cases passed... Submission successful" });
          }
        }
      });

      run.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        reject(`${data}`);
      });

      run.on('close', (code) => {
        if (code !== 0) {
          reject(`Process exited with code ${code}`);
        }
      });
    });
  });
}

async function compileAndRun(language, code, numTestCases) {
  let compileCommand, runCommand, fileExtension;
  let mainFunction, headers;

  switch (language) {
    case 'cpp':
      compileCommand = ['g++', 'test.cpp', '-o', 'test.exe'];
      runCommand = ['./test.exe'];
      fileExtension = 'cpp';
      mainFunction = "int main(){ string s; getline(cin, s); Solution obj; string result = obj.reverseWords(s); cout << result; }";
      headers = "#include<iostream>\n#include<algorithm>\nusing namespace std;\n";
      break;
    case 'c':
      compileCommand = ['gcc', 'test.c', '-o', 'test.exe'];
      runCommand = ['./test.exe'];
      fileExtension = 'c';
      mainFunction = 'int main() { char s[100]; fgets(s, sizeof(s), stdin); char *result = reverseWords(s); printf("%s", result); free(result); return 0; }';
      headers = "#include <stdio.h>\n#include <string.h>\n";
      break;
    case 'python':
      compileCommand = null;
      runCommand = ['python', 'test.py'];
      fileExtension = 'py';
      mainFunction = `
import sys
for line in sys.stdin:
    s = line.strip()
    result = reverseWords(s)
    print(result)
`;
      headers = '';
      break;
    case 'java':
      compileCommand = ['javac', 'test.java'];
      runCommand = ['java', 'Main'];
      fileExtension = 'java';
      mainFunction = `
class Main {
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
`;
      headers = 'import java.util.Scanner;';
      break;
    default:
      throw new Error('Unsupported language');
  }

  const fullCode = headers + code + mainFunction;
  const fileName = `test.${fileExtension}`;
  writeFileSync(fileName, fullCode);

  return new Promise((resolve, reject) => {
    if (compileCommand) {
      const compile = spawn(compileCommand[0], compileCommand.slice(1));
      let compilationError = '';

      compile.stderr.on('data', (data) => {
        compilationError += `${data}`;
      });

      compile.on('close', async (code) => {
        if (code == 0) {
          try {
            const results = await runProgram(runCommand[0], runCommand.slice(1), numTestCases);
            resolve(results);
          } catch (error) {
            reject({ runtime_error: error });
          }
        } else {
          //console.log(compilationError)
          reject(compilationError);
        }
      });
    } else {
      runProgram(runCommand[0], runCommand.slice(1), numTestCases)
        .then(resolve)
        .catch(reject);
    }
  });
}

module.exports = { getTestData, compileAndRun, runProgram };
