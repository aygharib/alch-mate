import React, { useState, useEffect } from "react";
import './App.css';
import data from "./components/MOCK_DATA_ARRAY.json"

const App = () => {
  const [mappingItems, setMappingItems] = useState([]);
  const [fiveMinItems, setFiveMinItems] = useState([]);
  const [mergedItems, setMergedItems] = useState([]);

  const convertToArray = (nestedObject) => {
    const object = nestedObject;
    // Convert ID from key to attribute of object
    for (let key in object) {
      object[key]["id"] = parseInt(key);
    }
    let convertedArray = Object.values(object);
    console.log("convertedArray", convertedArray);
    return convertedArray;
  }

  useEffect(() => {
    const mappingUrl = "https://prices.runescape.wiki/api/v1/osrs/mapping";
    const fiveMinUrl = "https://prices.runescape.wiki/api/v1/osrs/5m";

    const fetchData = async (url, setter) => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log("Mapping Json:", json);
        setter(json);
        
        return response;
      } catch (error) {
        console.log("error", error);
      }
    }

    const fetchData2 = async (url, setter) => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log("Five Min Json:", json);
        setter(convertToArray(json.data));

        return response;
      } catch (error) {
        console.log("error", error);
      }
    }

    let prom1 = fetchData(mappingUrl, setMappingItems);
    let prom2 = fetchData2(fiveMinUrl, setFiveMinItems);
    
    Promise.all([prom1, prom2]).then(() => {
      console.log("Test mapping:", mappingItems);
      console.log("Test fivemin:", fiveMinItems);
      const a3 = fiveMinItems.map(t1 => ({...t1, ...mappingItems.find(t2 => t2.id === t1.id)}));
      console.log("merged results:", a3);
      setMergedItems(a3);
    });

    // console.log("Merged items...:", mergedItems);
  }, []);

  const updateData = () => {
    console.log("Update!");
    setMappingItems([
      {
        "examine": "Fabulously ancient mage protection enchanted in the 3rd Age.",
        "id": 10344,
        "members": true,
        "lowalch": 20200,
        "limit": 8,
        "value": 50500,
        "highalch": 30300,
        "icon": "3rd age amulet.png",
        "name": "3rd age amulet"
      },
      {
        "examine": "A beautifully crafted axe, shaped by ancient smiths.",
        "id": 20011,
        "members": true,
        "lowalch": 22000,
        "limit": 40,
        "value": 55000,
        "highalch": 33000,
        "icon": "3rd age axe.png",
        "name": "3rd age axe"
      },
      {
        "examine": "A beautifully crafted bow carved by ancient archers.",
        "id": 12424,
        "members": true,
        "lowalch": 60000,
        "limit": 8,
        "value": 150000,
        "highalch": 90000,
        "icon": "3rd age bow.png",
        "name": "3rd age bow"
      },
      {
        "examine": "A beautiful cloak woven by ancient tailors.",
        "id": 12437,
        "members": true,
        "lowalch": 34000,
        "limit": 8,
        "value": 85000,
        "highalch": 51000,
        "icon": "3rd age cloak.png",
        "name": "3rd age cloak"
      }]);

    // setItems([{
    //   "id": 2,
    //   "avgHighPrice": 193,
    //   "highPriceVolume": 41445,
    //   "avgLowPrice": 187,
    //   "lowPriceVolume": 21731
    // },
    // {
    //   "id": 4,
    //   "avgHighPrice": null,
    //   "highPriceVolume": 0,
    //   "avgLowPrice": 178633,
    //   "lowPriceVolume": 2
    // }]);
  }

  return (
    <div className="app-container">
      <button onClick={updateData}>
        Update Table!
      </button>
      <table>
        <thead>
          <tr>
            {/* Mapping */}
            {/* <th>id</th>
            <th>name</th>
            <th>high alch</th>
            <th>members</th>
            <th>limit</th> */}

            {/* Five Min */}
            {/* <th>id</th>
            <th>avgHighPrice</th>
            <th>highPriceVolume</th>
            <th>avgLowPrice</th>
            <th>lowPriceVolume</th> */}

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
          {/* {mappingItems.map((item) => (
            <tr>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.highalch}</td>
              <td>{item.members}</td>
              <td>{item.limit}</td>
            </tr>
          ))} */}
          {/* {fiveMinItems.map((item) => (
            <tr>
              <td>{item.id}</td>
              <td>{item.avgHighPrice}</td>
              <td>{item.highPriceVolume}</td>
              <td>{item.avgLowPrice}</td>
              <td>{item.lowPriceVolume}</td>
            </tr>
          ))} */}
          {mergedItems.map((item) => (
            <tr>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.highalch}</td>
              <td>{item.members}</td>
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
