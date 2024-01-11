// App.js
import React, { useState } from 'react';
import JsonTree from './JsonTree';
import  "./App.css"
import Tree from "./img/tree.png"
const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonData, setJsonData] = useState(null);

  const handleInputChange = (event) => {
    setJsonInput(event.target.value);
  };

  const handleVisualizeClick = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      setJsonData(parsedData);
    } catch (error) {
      alert('Please check JSON format : ⚠️');
      setJsonData(null);
    }
  };

  return (
   
    <div style={{ textAlign: 'center' }}>
      <div>
      <h1>JSON <img src={Tree} style={{height:"10rem"}}/>Viewer</h1>
      <textarea
        rows="20"
        cols="150"
        placeholder="Paste JSON data here..."
        value={jsonInput}
        onChange={handleInputChange}
        style={{ border:'3px solid rgb(154,77,1)'}}
        className='textarea_'
      />
      <br />
      <button    style={{ marginTop:'10px'}}  class="button-68 " role="button" onClick={handleVisualizeClick}>Visualize JSON</button>
      
      </div>
      {jsonData && <JsonTree jsonData={jsonData} />}
    </div>
 
  );
};

export default App;
