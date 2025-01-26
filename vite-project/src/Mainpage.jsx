import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Axios from 'axios';
import './App.css';

const MainPage = () => {

  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [hour, setHour] = useState(1);
  const [minute, setMinute] = useState(30);
  const [userCode, setUserCode] = useState();
  const [testReport, setTestReport] = useState(null);
  const [questionData, setQuestionData] = useState({});
  const [completed, setCompleted] = useState(Array(5).fill(0)); 
  const languages = ["c", "cpp", "java", "python"];
  const [testCase, setTestCase] = useState(0);




  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const questionNo = parseInt(queryParams.get('no'), 10) || 1;

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await Axios.get(`http://localhost:5174/?no=${questionNo}`);
        console.log('sample:',res.data);
        setQuestionData(res.data || {});
        const response = await Axios.post('http://localhost:5174/getTable', { user:localStorage.getItem("user") });
        if (
          response.data.userCode && 
          response.data.userCode[questionNo] && 
          response.data.userCode[questionNo][language]
        ) {
          setUserCode(response.data.userCode[questionNo][language]);
          console.log('hi');
          console.log(response.data.userCode[questionNo][language])
        }
        else if(language == "c"){
          setUserCode(questionData.CStructure);
        }
        else if(language == "cpp"){
          setUserCode(questionData.CppStructure);
        }
        else if(language == "java"){
          setUserCode(questionData.JavaStructure);
        }
        else{
          setUserCode(questionData.PythonStructure);
        }
      } catch (error) {
        console.error('Error fetching question:', error);
        setQuestionData({ question: "Failed to load question." });
      }
    };

    fetchQuestion();
  }, [questionNo,language]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMinute((prevMinute) => {
        if (prevMinute > 0) {
          return prevMinute - 1;
        } else if (hour > 0) {
          setHour((prevHour) => prevHour - 1);
          return 59;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [hour, minute]);

  const handleRun = async () => {
    
    try {
      const res = await Axios.post(
        'http://localhost:5174/run',
        { code: userCode, language: language, testType: 'run', questionNo: questionNo },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Server response:', res.data);

      if (res.data.compilation_error) {
        setTestReport({ compilation_error: res.data.compilation_error });
      } else if (res.data.runtime_error) {
        setTestReport({ runtime_error: res.data.runtime_error });
      } else {
        setTestReport({ test_detail: res.data.result });
        console.log('test report:', testReport);
      }
    } catch (error) {
      console.error('Error:', error);
      setTestReport(error);
    }
    
  };

  const handleSubmit = async () => {
    
    try {
      const res = await Axios.post(
        'http://localhost:5174/submit',
        { code: userCode, language: language, testType: 'submit', questionNo: questionNo,user:localStorage.getItem("user") },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Response data:', res.data);

      let report;
      if (res.data.compilation_error) {
        report = { compilation_error: res.data.compilation_error };
      } else if (res.data.runtime_error) {
        report = { runtime_error: res.data.runtime_error };
      } else if (res.data.result) {
        report = { test_detail: res.data.result };
      } else if (res.data.wrong_answer) {
        report = { test_detail: res.data.wrong_answer };
      } else {
        report = { success: res.data.success };
      }

      setTestReport(report);
    } catch (error) {
      console.error('Error:', error);
      setTestReport(error);
    }
  };

  const handleFinish = () => {
    setFormVisible(true); 
    console.log("Submitting code:", userCode);
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    if (selectedLanguage === "cpp") {
      setUserCode(questionData.CppStructure);
    } else if (selectedLanguage === "c") {
      setUserCode(questionData.CStructure);
    } else if (selectedLanguage === "python") {
      setUserCode(questionData.PythonStructure);
    } else if (selectedLanguage === "java") {
      setUserCode(questionData.JavaStructure);
    } else {
      setUserCode("");
    }
  };


  useEffect(() => {
    if (testReport && testReport.success) {
      const updatedCompleted = [...completed];
      updatedCompleted[questionNo - 1] = 1;
      setCompleted(updatedCompleted); 
    }
  }, [testReport, questionNo]);

  return (
    <div className="app-container">
      
        <>
          <ul>
            <div><li>Problem Solving <em>Platform</em></li></div>
            <div style={{display:'flex'}}>
              <li>
                <select onChange={handleLanguageChange} value={language}>
                  {languages.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </li>
              <li>
                <select onChange={(e) => setTheme(e.target.value)} value={theme}>
                  <option value="vs">Light</option>
                  <option value="vs-dark">Dark</option>
                </select>
              </li>
              <li>
                <span className='hour'>{hour}</span> <span>:</span>
                <span id='minute'>{minute.toString().padStart(2, '0')}</span>
              </li>
              <li>
                <button className='compile-btn run' onClick={handleRun} style={{marginRight:'20px'}}>Run</button>
                <button className='compile-btn' onClick={handleSubmit}>Submit</button>
              </li>
              <li><button className='compile-btn' onClick={handleFinish}>Finish Test</button></li>
            </div>
          </ul>
          
          <div className='container'>
            <div className="description">
              <p>{questionData.question || "Loading question..."}</p>
              <br /><br />
              {questionData.examples && questionData.examples.map((example, index) => (
                <div key={index}>
                  <em><strong>Example {index + 1}:</strong></em><br />
                  Input: {example.input}<br />
                  Output: {example.output}<br />
                  {example.explanation && <span>Explanation: {example.explanation}<br /></span>}
                  <br />
                </div>
              ))}
              <strong>Constraints:</strong><br />
              {questionData.constraints && questionData.constraints.map((constraint, index) => (
                <span key={index}>{constraint}<br /></span>
              ))}
    
              <button 
                className='next-question' 
                onClick={() => {
                  const nextQuestionNo = (parseInt(questionNo, 10) % 3) + 1;
                  navigate(`?no=${nextQuestionNo}`);
                }}
              >
                Next
              </button>
            </div>
            <Editor
              className='editor'
              fontSize='14'
              height="100vh"
              theme={theme}
              language={language}
              value={userCode}
              onChange={(value) => setUserCode(value)}
            />
          </div>
          <div className="test-cases">
            {testReport && testReport.test_detail ? (
              <>
                <h3>Test Cases</h3>
                <div className="cases">
                  {Array.isArray(testReport.test_detail.input) && testReport.test_detail.input.map((_, index) => (
                    <div
                      className={`case ${testCase === index ? 'active' : ''}`}
                      key={index + 1}
                      onClick={() => setTestCase(index)}
                    >
                      Case {index + 1}
                    </div>
                  ))}
                </div>
                <h4 style={{ margin: '15px' }}>Input:</h4>
                <textarea
                  className="test-case-input"
                  value={testReport.test_detail.input[testCase] || ''}
                  readOnly
                />
                <br />
                <h4 style={{ margin: '15px' }}>Output:</h4>
                <textarea
                  className="test-case-output"
                  value={testReport.test_detail.output[testCase] || ''}
                  readOnly
                />
                <br />
                <h4 style={{ margin: '15px' }}>Expected:</h4>
                <textarea
                  className="test-case-expected"
                  value={testReport.test_detail.expected[testCase] || ''}
                  readOnly
                />
              </>
            ) : (
              <>
                
                {testReport && testReport.compilation_error && testReport.compilation_error.runtime_error && (
                  <div>
                    <strong>Runtime Error:</strong>
                    <pre>{testReport.runtime_error}</pre>
                  </div>
                )}
                {testReport && testReport.compilation_error && (
                  <div>
                    <strong>Compilation Error:</strong>
                    <pre>{testReport.compilation_error}</pre>
                  </div>
                )}
                {testReport && testReport.success && (
                  <div>
                    <p>{testReport.success}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      
    </div>
  );
};

export default MainPage;
