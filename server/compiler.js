const { spawn } = require('child_process');
const { writeFileSync } = require('fs');

let testInputs;
let expectedOutputs;

async function getTestData(language, code, numTestCases, db, questionNo) {
  try {
    const questionData = await db.collection('question_set').find().toArray();

    if (!questionData.length) {
      throw new Error(`No question found for number ${questionNo}`);
    }
    
    const question = questionData[questionNo-1];
    testInputs = question.testInputs;
    expectedOutputs = question.expectedOutputs;
    if(language == "c")
    {
      headers = question.CHeader;
      mainFunction = question.CMain;
    }
    else if(language == "cpp"){
      headers = question.CppHeader;
      mainFunction = question.CppMain;
    }
    else if(language == "java"){
      headers = question.JavaHeader;
      mainFunction = question.JavaMain;
    }
    else if(language == "python"){
      
      mainFunction = question.PythonMain;
      code += `\n`
      code += mainFunction;
      const fullProgram = code.replace(/\\n/g, '\n');
      return await compileAndRun(language, fullProgram, numTestCases);
    }
    const program = headers + code + mainFunction;
    const fullProgram = program.replace(/\\n/g, '\n');
    return await compileAndRun(language, fullProgram, numTestCases);
  } 
  catch (error) {
    console.log(error);
    return { compilation_error: error};
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
      if (Array.isArray(input)) {
        run.stdin.write(input.length + '\n');
        input.forEach((elem) => {
          run.stdin.write(elem + '\n');
        });
        run.stdin.end();
      } else {
        run.stdin.write(input);
        run.stdin.end();
      }

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
        if ((output[index]) != outputsToUse[index]) {
          resolve({ result: { input: [inputsToUse[index]], output: [output[index]], expected: [outputsToUse[index]] } });
        } else if (completedTestCases == numTestCases) {
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

  switch (language) {
    case 'cpp':
      compileCommand = ['g++', 'test.cpp', '-o', 'test.exe'];
      runCommand = ['./test.exe'];
      fileExtension = 'cpp';
      break;
    case 'c':
      compileCommand = ['gcc', 'test.c', '-o', 'test.exe'];
      runCommand = ['./test.exe'];
      fileExtension = 'c';
      break;
    case 'python':
      compileCommand = null;
      runCommand = ['python', 'test.py'];
      fileExtension = 'py';
      break;
    case 'java':
      compileCommand = ['javac', 'test.java'];
      runCommand = ['java', 'Main'];
      fileExtension = 'java';
      break;
    default:
      throw new Error('Unsupported language');
  }

  const fileName = `test.${fileExtension}`;
  writeFileSync(fileName, code);

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
