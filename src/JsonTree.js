// JsonTree.js
import React from 'react';
import JsonTreeVisualization from './JsonTreeVisualization';
import Tree from "./img/tree.png"

const JsonTree = ({ jsonData }) => {
  return (
    <div style={{ margin: '20px', borderRadius: '5px', padding: '10px' ,height:"300vh"}}>
      <h2>JSON <img src={Tree} style={{height:"10rem"}}/> Visualization:</h2>
      <JsonTreeVisualization jsonData={jsonData} />
    </div>
  );
};

export default JsonTree;
