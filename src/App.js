import React, { useState, useEffect } from "react";
import './App.css';
import data from "./components/MOCK_DATA_ARRAY.json"

const App = () => {
  const [mappingItems, setMappingItems] = useState([]);
  const [fiveMinItems, setFiveMinItems] = useState([]);
  const [mergedItems, setMergedItems] = useState([]);

  // Takes in a nested object, returns an array of objects
  const convertNestedObjectToArray = (nestedObject) => {
    const object = nestedObject;
    for (let key in object) {
      object[key]["id"] = parseInt(key);
    }
    let convertedArray = Object.values(object);
    console.log("Converted Array:", convertedArray);
    return convertedArray;
  }

  useEffect(() => {
    const mappingUrl = "https://prices.runescape.wiki/api/v1/osrs/mapping";

    const fetchData = async (url, setter) => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setter(json);
      } catch (error) {
        console.log("error", error);
      }
    }

    fetchData(mappingUrl, setMappingItems);
  }, []);

  useEffect(() => {
    const fiveMinUrl = "https://prices.runescape.wiki/api/v1/osrs/5m";

    const fetchData2 = async (url, setter) => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setter(convertNestedObjectToArray(json.data));
      } catch (error) {
        console.log("error", error);
      }
    }

    fetchData2(fiveMinUrl, setFiveMinItems);
  }, [mappingItems]);

  useEffect(() => {
    const tempMergedItems = fiveMinItems.map(t1 => ({...t1, ...mappingItems.find(t2 => t2.id === t1.id)}));
    setMergedItems(tempMergedItems);
  }, [mappingItems, fiveMinItems]);

  return (
    <div className="app-container">
      <table>
        <thead>
          <tr>
            {/* Merged Items */}
            <th>id</th>
            <th>name</th>
            <th>high alch</th>
            <th>members</th>
            <th>limit</th>
            <th>avgHighPrice</th>
            <th>highPriceVolume</th>
            <th>avgLowPrice</th>
            <th>lowPriceVolume</th>
          </tr>
        </thead>
        <tbody>
          {mergedItems.map((item) => (
            <tr>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.highalch}</td>
              <td>{item.members ? <p>T</p> : <p>F</p>}</td>
              <td>{item.limit}</td>
              <td>{item.avgHighPrice}</td>
              <td>{item.highPriceVolume}</td>
              <td>{item.avgLowPrice}</td>
              <td>{item.lowPriceVolume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
