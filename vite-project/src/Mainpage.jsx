import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Axios from 'axios';
import './App.css';

const MainPage = () => {
  const java_code = `class Solution {
    public String reverseWords(String s) {
      //Enter code here
    }
  }`;
  const cpp_code = `class Solution {
  public:
    string reverseWords(string s) {
      // Your code here
    }
  };`;
  const c_code = `char* reverseWords(char *s) {
    // Your code here
  }`;
  const py_code = `def reverseWords(s):
    # Your code here`;

  const [fontSize, setFontSize] = useState(10);
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [hour, setHour] = useState(1);
  const [minute, setMinute] = useState(30);
  const [userCode, setUserCode] = useState(cpp_code);
  const [testReport, setTestReport] = useState(null);
  const [questionData, setQuestionData] = useState({});
  const [completed, setCompleted] = useState(Array(5).fill(0)); // Initialize as state
  const languages = ["c", "cpp", "java", "python"];
  const [testCase, setTestCase] = useState(0);
  const [username, setUsername] = useState('');
  const [mailId, setMailId] = useState('');
  const [userData, setUserData] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const questionNo = parseInt(queryParams.get('no'), 10) || 1;

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await Axios.get(`http://localhost:5174/?no=${questionNo}`);
        setQuestionData(res.data || {});
      } catch (error) {
        console.error('Error fetching question:', error);
        setQuestionData({ question: "Failed to load question." });
      }
    };

    fetchQuestion();
  }, [questionNo]);

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
        { code: userCode, language: language, testType: 'submit', questionNo: questionNo },
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
      setUserCode(cpp_code);
    } else if (selectedLanguage === "c") {
      setUserCode(c_code);
    } else if (selectedLanguage === "python") {
      setUserCode(py_code);
    } else if (selectedLanguage === "java") {
      setUserCode(java_code);
    } else {
      setUserCode("");
    }
  };

  const handleUserDetailsSubmit = async (e) => {
    e.preventDefault();
    const userDetails = {
      username,
      mailId
    };
    setUserData(userDetails);
    let sum = 0;
    completed.forEach((element,index)=>{
      sum += element>0?1:0;
    })
    await Axios.post(
      'http://localhost:5174/generate-certificate',
      { username: username, mailId: mailId,decision:sum},
      { headers: { 'Content-Type': 'application/json' } }
    );
    setFormVisible(false); 
    navigate('/evaluating'); // Navigate to the evaluation page
  };

  useEffect(() => {
    if (testReport && testReport.success) {
      const updatedCompleted = [...completed];
      updatedCompleted[questionNo - 1] = 1;
      setCompleted(updatedCompleted); // Update the state
    }
  }, [testReport, questionNo]);

  return (
    <div className="app-container">
      {formVisible ? (
        <div className="form-overlay">
          <form onSubmit={handleUserDetailsSubmit} className="user-form">
            <label>
              Name:
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
            <br />
            <label>
              Email:
              <input type="email" value={mailId} onChange={(e) => setMailId(e.target.value)} required />
            </label>
            <br />
            <button type="submit">Submit</button>
          </form>
        </div>
      ) : (
        <>
          <ul>
            <div><li>Problem Solving Certification</li></div>
            <div>
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
                <button className='compile-btn run' onClick={handleRun}>Run</button>
                <button className='compile-btn' onClick={handleSubmit}>Submit</button>
              </li>
              <li><button className='compile-btn' onClick={handleFinish}>Finish Test</button></li>
            </div>
          </ul>
          {userData && (
            <div className="user-data">
              <p>User Details Submitted:</p>
              <p>Name: {userData.username}</p>
              <p>Email: {userData.mailId}</p>
            </div>
          )}
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
                  const nextQuestionNo = (parseInt(questionNo, 10) % 2) + 1;
                  navigate(`?no=${nextQuestionNo}`);
                }}
              >
                Next
              </button>
            </div>
            <Editor
              className='editor'
              fontSize={fontSize}
              height="85vh"
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
                {testReport && testReport.compilation_error && (
                  <div>
                    <strong>Compilation Error:</strong>
                    <pre>{testReport.compilation_error}</pre>
                  </div>
                )}
                {testReport && testReport.runtime_error && (
                  <div>
                    <strong>Runtime Error:</strong>
                    <pre>{testReport.runtime_error}</pre>
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
      )}
    </div>
  );
};

export default MainPage;
