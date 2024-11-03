import react from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import image1 from './assets/gfg.jpg'
import image2 from './assets/hackerEarth.png'
import image3 from './assets/gfg2.jpg'
import leetCode from './assets/leetcode.jpg'
import geeksForGeeks from './assets/geeksForGeeks.jpg'
import hackerRank from './assets/hackerRank.png'
import hackerEarth from './assets/hackerEarth1.png'
import codeChef from './assets/codeChef.png'
import strivers from './assets/strivers.png'
import './ProblemSet.css'
const EvaluationPage = ()=>{
    return(
        <div className='problem-set'>
            <div className="advertising">
                <h2>Learnings</h2>
                <div style={{display:'flex'}}>
                    <div className="advertising-platforms">
                        <div className="learning-platform">
                            <img src={image1}/> 
                        </div>
                        <div className="learning-platform">
                            <img src={image2} />
                        </div>
                        <div className="learning-platform">
                            <img src={image3} />
                        </div>
                    </div>
                    <div className="user-detail">
                        
                        <CircularProgressbar value={60} minValue={1} maxValue={100} text={`${80}%`} />
                        <div style={{width:'100%', marginLeft:'25px'}}>
                            <p>Easy : <span>value</span></p> 
                            <p>Medium : <span>value</span></p> 
                            <p>Hard : <span>value</span></p> 
                        </div>
                    </div>
                </div>
            </div>
            <div className="advertising" style={{marginTop:'30px'}}>
                <h2 style={{marginBottom:'10px'}}>More Problems</h2>
                <div className="more-problem1">
                    <div className="problems">
                        <div className="problem">
                            <img src={leetCode}></img>
                            <div>
                            <h4 style={{fontWeight:'400',marginBottom:'5px'}}>Leetcode</h4>
                            <p style={{fontWeight:'200',fontSize:'1rem'}}>Platform with more than 3000 problems</p>
                            </div>
                        </div>
                        <div className="problem">
                            <img src={hackerRank}></img>
                            <div>
                            <h4 style={{fontWeight:'400',marginBottom:'5px'}}>Hacker Rank</h4>
                            <p style={{fontWeight:'200',fontSize:'1rem'}}>Platform with more than 3000 problems</p>
                            </div>
                        </div>
                        <div className="problem">
                            <img src={geeksForGeeks}></img>
                            <div>
                            <h4 style={{fontWeight:'400',marginBottom:'5px'}}>Geeks for Geeks</h4>
                            <p style={{fontWeight:'200',fontSize:'1rem'}}>Platform with more than 3000 problems</p>
                            </div>
                        </div>
                    </div>
                    <div className="problems" style={{marginTop:'30px'}}>
                        <div className="problem">
                            <img src={hackerEarth}></img>
                            <div>
                            <h4 style={{fontWeight:'400',marginBottom:'5px'}}>Hacker Earth</h4>
                            <p style={{fontWeight:'200',fontSize:'1rem'}}>Platform with more than 3000 problems</p>
                            </div>
                        </div>
                        <div className="problem">
                            <img src={codeChef}></img>
                            <div>
                            <h4 style={{fontWeight:'400',marginBottom:'5px'}}>Code Chef</h4>
                            <p style={{fontWeight:'200',fontSize:'1rem'}}>Platform with more than 3000 problems</p>
                            </div>
                        </div>
                        <div className="problem">
                            <img src={strivers}></img>
                            <div>
                            <h4 style={{fontWeight:'400',marginBottom:'5px'}}>Strivers</h4>
                            <p style={{fontWeight:'200',fontSize:'1rem'}}>Platform with more than 3000 problems</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EvaluationPage;