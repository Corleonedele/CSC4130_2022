import './App.css';
import React from 'react';

import logo from './Components/Attachments/logo.png'
import Kcanvas from './Components/Kcanvas/Kcanvas';

function App() {
  return (
    <div className="App">
      <div className='intro'>
        <div className='title'>
          <img src={logo} id="logo"/>
          
          <h1>CSC4130 Project K-means</h1>
        </div>
        <h3>Gao Lianhao 119010077</h3>
      </div>
      <Kcanvas/>

      <h2>Instruction</h2>
      <div className='Instruction'>
        <p>User can <b>click the button to modify the parameters</b> <br/>cluster number range from 1 to 10 (normally 5 is good) <br/>
          iteration number range from 1 to infinite (usually 10 is enough for converging)<br/> set random data size (no limit but 100 to 200 is a good choice)<br/>
          Here also provides three default data with specific position <br/>In the end, click Reset will clear and regenerate data
        </p>
      </div>


      <h2>Survey</h2>
      <div className='Survey_Con'>
        <div className='Survey'>
        <ul>
        <h3>1. I think the fidelity of the web is appropriate<br/></h3>
        &nbsp;from 1(disagree) to 10(agree) I give <input className='Survey_Input'></input> point
        </ul>
        <ul>
        <h3>2. I think the web layout is appropriate<br/></h3>
        &nbsp;from 1(disagree) to 10(agree) I give <input className='Survey_Input'></input> point
        </ul>
        <ul>
        <h3>3. I think the web navigation is clear<br/></h3>
        &nbsp;from 1(disagree) to 10(agree) I give <input className='Survey_Input'></input> point
        </ul>
        <ul>
        <h3>4. I think the color is proper design<br/></h3>
        &nbsp;from 1(disagree) to 10(agree) I give <input className='Survey_Input'></input> point
        </ul>
        <ul>
        <h3>5. I think the web interaction is fluent<br/></h3>
          &nbsp;from 1(disagree) to 10(agree) I give <input className='Survey_Input'></input> point
        </ul>



        </div>
      </div>

    </div>
  );
}

export default App;
