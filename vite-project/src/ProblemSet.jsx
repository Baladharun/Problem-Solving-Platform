import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import image1 from './assets/gfg.jpg';
import image2 from './assets/hackerEarth.png';
import image3 from './assets/gfg2.jpg';
import leetCode from './assets/leetcode.jpg';
import geeksForGeeks from './assets/geeksForGeeks.jpg';
import hackerRank from './assets/hackerRank.png';
import hackerEarth from './assets/hackerEarth1.png';
import codeChef from './assets/codeChef.png';
import strivers from './assets/strivers.png';
import './ProblemSet.css';
import Axios from 'axios';

const ProblemSet = () => {
    const [sno, setSno] = useState(1);
    const [solvedPosition, setSolvedPosition] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [solvedQuestions, setSolvedQuestions] = useState([]);
    const [easy,setEasy] = useState(0);
    const [medium,setMedium] = useState(0);
    const [hard,setHard] = useState(0);
    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const res = await Axios.post('http://localhost:5174/getTable', { user:localStorage.getItem("user") });
            console.log(res.data);
            setTableData(res.data.response);
            setSolvedQuestions(res.data.solvedQuestions);
            setEasy(res.data.easy);
            setMedium(res.data.medium);
            setHard(res.data.hard);
        } catch (error) {
            console.error("Error loading data", error);
        }
    }

    return (
        <div className='problem-set'>
            <div className="advertising">
                <h2>Learnings</h2>
                <div style={{ display: 'flex' }}>
                    <div className="advertising-platforms">
                        <div className="learning-platform"><img src={image1} alt="Platform 1" /></div>
                        <div className="learning-platform"><img src={image2} alt="Platform 2" /></div>
                        <div className="learning-platform"><img src={image3} alt="Platform 3" /></div>
                    </div>
                    <div className="user-detail">
                        <CircularProgressbar value={60} minValue={1} maxValue={100} text={`${80}%`} />
                        <div style={{ width: '100%', marginLeft: '25px' }}>
                            <p>Easy : <span>{easy}</span></p>
                            <p>Medium : <span>{medium}</span></p>
                            <p>Hard : <span>{hard}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="advertising" style={{ marginTop: '30px' }}>
                <h2 style={{ marginBottom: '10px' }}>More Problems</h2>
                <div className="more-problem1">
                    <div className="problems">
                        <div className="problem">
                            <img src={leetCode} alt="LeetCode" />
                            <div>
                                <h4 style={{ fontWeight: '400', marginBottom: '5px' }}>Leetcode</h4>
                                <p style={{ fontWeight: '200', fontSize: '1rem' }}>Platform with more than 3000 problems</p>
                            </div>
                        </div>
                        <div className="problem">
                            <img src={hackerRank} alt="Hacker Rank" />
                            <div>
                                <h4 style={{ fontWeight: '400', marginBottom: '5px' }}>Hacker Rank</h4>
                                <p style={{ fontWeight: '200', fontSize: '1rem' }}>Platform with more than 3000 problems</p>
                            </div>
                        </div>
                        <div className="problem">
                            <img src={geeksForGeeks} alt="Geeks for Geeks" />
                            <div>
                                <h4 style={{ fontWeight: '400', marginBottom: '5px' }}>Geeks for Geeks</h4>
                                <p style={{ fontWeight: '200', fontSize: '1rem' }}>Platform with more than 3000 problems</p>
                            </div>
                        </div>
                    </div>
                    <div className="problems" style={{ marginTop: '30px' }}>
                        <div className="problem">
                            <img src={hackerEarth} alt="Hacker Earth" />
                            <div>
                                <h4 style={{ fontWeight: '400', marginBottom: '5px' }}>Hacker Earth</h4>
                                <p style={{ fontWeight: '200', fontSize: '1rem' }}>Platform with more than 3000 problems</p>
                            </div>
                        </div>
                        <div className="problem">
                            <img src={codeChef} alt="Code Chef" />
                            <div>
                                <h4 style={{ fontWeight: '400', marginBottom: '5px' }}>Code Chef</h4>
                                <p style={{ fontWeight: '200', fontSize: '1rem' }}>Platform with more than 3000 problems</p>
                            </div>
                        </div>
                        <div className="problem">
                            <img src={strivers} alt="Strivers" />
                            <div>
                                <h4 style={{ fontWeight: '400', marginBottom: '5px' }}>Strivers</h4>
                                <p style={{ fontWeight: '200', fontSize: '1rem' }}>Platform with more than 3000 problems</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Title</th>
                            <th>Difficulty</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td><a href={`/question?no=${index + 1}`} style={{color:'black',textDecoration:'none'}}>{row.title}</a></td>
                                <td>{row.difficulty}</td>
                                <td>{solvedQuestions.includes(index + 1) ? "Solved" : "Unsolved"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProblemSet;
