import React, { useState, useEffect } from "react";

const ItemTable = () => {
    const [mappingItems, setMappingItems] = useState([]);
    const [fiveMinItems, setFiveMinItems] = useState([]);
    const [mergedItems, setMergedItems] = useState([]);

    // Takes in a nested object, returns an array of objects
    // Necessary because five min items API returns nested object
    const convertNestedObjectToArray = (nestedObject) => {
        const object = nestedObject;
        for (let key in object) {
            object[key]["id"] = parseInt(key);
        }
        let convertedArray = Object.values(object);
        console.log("Converted Array:", convertedArray);
        return convertedArray;
    }

    // On website mount, load mapping data
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

    // On website mount, load five min data
    useEffect(() => {
        const fiveMinUrl = "https://prices.runescape.wiki/api/v1/osrs/5m";

        const fetchData = async (url, setter) => {
            try {
            const response = await fetch(url);
            const json = await response.json();
            setter(convertNestedObjectToArray(json.data));
            } catch (error) {
            console.log("error", error);
            }
        }

        fetchData(fiveMinUrl, setFiveMinItems);
    }, []);

    // On loading mapping or five min data, merge data
    useEffect(() => {
        const tempMergedItems = fiveMinItems.map(t1 => ({...t1, ...mappingItems.find(t2 => t2.id === t1.id)}));
        setMergedItems(tempMergedItems);
    }, [mappingItems, fiveMinItems]);

    return (
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
    );
}

export default ItemTable;