// JsonTreeVisualization.js
import React, { useState, useRef } from 'react';
import Tree from 'react-d3-tree';

const JsonTreeVisualization = ({ jsonData }) => {
  const convertToTreeData = (data, name = 'Root') => {
    if (Array.isArray(data)) {
      return {
        name: name,
        children: data.map((item, index) => convertToTreeData(item, `Index ${index}`)),
      };
    } else if (typeof data === 'object' && data !== null) {
      return {
        name: name,
        attributes: { label: name },
        children: Object.entries(data).map(([key, value]) => convertToTreeData(value, key)),
      };
    } else {
      return {
        name: `${name}: ${String(data)}`,
        attributes: { label: `${name}: ${String(data)}` },
      };
    }
  };
  const containerStyle = {
     marginBottom:"10px",
    
    borderBottom: '2px solid rgb(154,77,1)'
  };
  const [hoveredNode, setHoveredNode] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [searchError, setSearchError] = useState('');

  const [fieldNameSearch, setFieldNameSearch] = useState('');
  const [fieldNameSearchResult, setFieldNameSearchResult] = useState([]);
  const [fieldNameSearchError, setFieldNameSearchError] = useState('');

  const treeContainerRef = useRef(null);

  const handleNodeMouseOver = (nodeData) => {
    setHoveredNode(nodeData);
  };

  const handleNodeMouseOut = () => {
    setHoveredNode(null);
  };

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
    setSearchResult([]);
    setSearchError('');
  };

  const handleSearchClick = () => {
    const trimmedSearchValue = searchValue.trim();

    if (trimmedSearchValue === '') {
      setSearchError('Please enter a search field or value.');
      return;
    }

    const result = findValuePath(jsonData, trimmedSearchValue);

    if (result.length > 0) {
      setSearchResult(result);
    } else {
      setSearchError('Invalid search field or value.');
    }
  };

  const handleFieldNameSearchInputChange = (event) => {
    setFieldNameSearch(event.target.value);
    setFieldNameSearchResult([]);
    setFieldNameSearchError('');
  };

  const handleFieldNameSearchClick = () => {
    const trimmedFieldNameSearch = fieldNameSearch.trim();

    if (trimmedFieldNameSearch === '') {
      setFieldNameSearchError('Please enter a field name for search.');
      return;
    }

    const result = findFieldPath(jsonData, trimmedFieldNameSearch);

    if (result.length > 0) {
      setFieldNameSearchResult(result);
    } else {
      setFieldNameSearchError('Field not found.');
    }
  };

  const findValuePath = (data, targetValue, currentPath = [], results = []) => {
    for (const key in data) {
      const newPath = [...currentPath, key];

      if (String(data[key]).toLowerCase() === targetValue.toLowerCase()) {
        results.push({ path: newPath, value: data[key] });
      }

      if (typeof data[key] === 'object' && data[key] !== null) {
        findValuePath(data[key], targetValue, newPath, results);
      }
    }

    return results;
  };

  const findFieldPath = (data, targetField, currentPath = [], results = []) => {
    for (const key in data) {
      const newPath = [...currentPath, key];

      if (key.toLowerCase() === targetField.toLowerCase()) {
        results.push({ path: newPath, value: data[key] });
      }

      if (typeof data[key] === 'object' && data[key] !== null) {
        findFieldPath(data[key], targetField, newPath, results);
      }
    }

    return results;
  };

  const accessValueByPath = (data, path) => {
    let result = data;

    for (const key of path) {
      if (result && typeof result === 'object') {
        result = result[key];
      } else {
        result = undefined;
        break;
      }
    }

    return result;
  };

  const treeData = convertToTreeData(jsonData);

  const containerStyles = {
    marginTop:"100px",
    width: '90%',
    height:"400vw",
    fontFamily: 'Arial, sans-serif',
    border:'3px solid rgb(154,77,1)',
    
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <div>
          <label class="button-68 inpute">
            Search Value:
            <input type="text" value={searchValue} onChange={handleSearchInputChange}   className='inputebox'/>
            <button onClick={handleSearchClick}  className='inputebox inputebutton' >Search</button>
           
          </label>
          {searchResult.length > 0 && (
              <div style={{height:"200px",overflow:"auto" ,border:"1px solid rgb(154,77,1)"}}>
                {searchResult.map((result, index) => (
                  <div key={index}style={containerStyle} >
                    <div>Value: {String(result.value)}</div>
                    <div>
                      Accessed Value: {String(accessValueByPath(jsonData, result.path))}
                    </div>
                    <div>Field Path: {result.path.join(' -> ')}</div>
                  </div>
                ))}
              </div>
            )}
            {searchError && <div style={{ color: 'red' }}>{searchError}</div>}
        </div>
        <div>
          <label class="button-68 inpute">
            Search by Field Name:
            <input
              type="text"
              value={fieldNameSearch}
              onChange={handleFieldNameSearchInputChange}
              className='inputebox'
            />
            <button onClick={handleFieldNameSearchClick}  className='inputebox inputebutton'>Search</button>
          
          </label>
          {fieldNameSearchResult.length > 0 && (
              <div style={{height:"200px",overflow:"auto", border:"1px solid rgb(154,77,1)"}}>
                {fieldNameSearchResult.map((result, index) => (
                  <div key={index} style={containerStyle}>
                    <div >Value: {String(result.value)}</div>
                    <div>
                      Accessed Value: {String(accessValueByPath(jsonData, result.path))}
                    </div>
                    <div>Field Path: {result.path.join(' -> ')}</div>
                  </div>
                ))}
              </div>
            )}
            {fieldNameSearchError && (
              <div style={{ color: 'red' }}>{fieldNameSearchError}</div>
            )}
        </div>
      </div>


      <div style={containerStyles} ref={treeContainerRef}  >
        <Tree
          data={treeData}
          orientation="horizontal"
          pathFunc="straight"
          translate={{ x: 50, y: 250 }}
          separation={{ siblings: 1, nonSiblings: 1 }}
          nodeSize={{ x: 200, y: 100 }}
          zoom={0.7}
          nodeLabelComponent={{
            render: <CustomLabel hoveredNode={hoveredNode} setHoveredNode={setHoveredNode} />,
            foreignObjectWrapper: {
              width: 200,
              height: 100,
              x: -100,
              y: 50,
              style: { overflow: 'visible' },
            },
          }}
          onMouseOver={handleNodeMouseOver}
          onMouseOut={handleNodeMouseOut}
          styles={{
            nodes: {
              node: {
                attributes: {
                  fill: '#ecf0f1',
                  stroke: '#bdc3c7',
                  strokeWidth: 2,
                  padding: 10,
                },
              },
            },
            links: {
              stroke: '#7f8c8d',
              strokeWidth: 2,
            },
          }}
        />
      </div>
    </div>
  );
};

const CustomLabel = ({ nodeData, hoveredNode, setHoveredNode }) => {
  const isLastNode = !nodeData.children || nodeData.children.length === 0;

  return (
    <g
      onMouseOver={() => isLastNode && setHoveredNode(nodeData)}
      onMouseOut={() => isLastNode && setHoveredNode(null)}
    >
      <foreignObject width={200} height={100} style={{ overflow: 'visible' }}>
        <div style={{ width: '100%', height: '100%', textAlign: 'center' }}>
          {isLastNode && (hoveredNode === nodeData || !hoveredNode) && (
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {Object.entries(nodeData.attributes).map(([key, value]) => (
                <div key={key}>{`${key}: ${String(value)}`}</div>
              ))}
            </div>
          )}
          {!isLastNode && (
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {nodeData.attributes.label}
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  );
};

export default JsonTreeVisualization;
