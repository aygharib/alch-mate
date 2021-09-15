import React, { useState, useEffect } from "react";

const ItemTable = () => {
    // Data
    const [mappingItems, setMappingItems] = useState([]);
    const [fiveMinItems, setFiveMinItems] = useState([]);
    const [mergedItems, setMergedItems] = useState([]);
    const [displayedItems, setDisplayedItems] = useState([]);

    // Pagination
    const [pageNumber, setPageNumber] = useState(0);
    const itemsPerPage = 5;
    const pagesVisted = pageNumber * itemsPerPage;

    // Takes in a nested object, returns an array of objects
    // Necessary because five min items API returns nested object
    const convertNestedObjectToArray = (nestedObject) => {
        const object = nestedObject;
        for (let key in object) {
            object[key]["id"] = parseInt(key);
        }
        let convertedArray = Object.values(object);
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
        const compareProfit = (a, b) => {
            return b.profit - a.profit;
        }

        // Creates a profit attribute for all objects
        // Necessary as API does not include high alch profit data
        const createProfitAttribute = (objectArray) => {
            objectArray.forEach((element) => {
                // Some items do not have a valid avgHighPrice
                // These items are not considered for profit
                if (element.avgHighPrice !== null) {
                    element.profit = element.highalch - element.avgHighPrice;
                } else {
                    element.profit = 0;
                }
            });
        }

        const merge = () => {
            // Merge mappingItems and fiveMinItems into one array of objects
            const tempMergedItems = fiveMinItems.map(t1 => ({...t1, ...mappingItems.find(t2 => t2.id === t1.id)}));
            createProfitAttribute(tempMergedItems);
            setMergedItems(tempMergedItems.sort(compareProfit));
        }

        merge();
    }, [mappingItems, fiveMinItems]);

    useEffect(() => {
        setDisplayedItems(mergedItems.slice(pagesVisted, pagesVisted + itemsPerPage));
    }, [mergedItems]);

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>name</th>
                        <th>high alch</th>
                        <th>members</th>
                        <th>limit</th>
                        <th>avgHighPrice</th>
                        <th>highPriceVolume</th>
                        <th>avgLowPrice</th>
                        <th>lowPriceVolume</th>
                        <th>profit</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedItems.map((item) => (
                        <tr>
                            <td>{item.name}</td>
                            <td>{item.highalch}</td>
                            <td>{item.members ? <p>T</p> : <p>F</p>}</td>
                            <td>{item.limit}</td>
                            <td>{item.avgHighPrice}</td>
                            <td>{item.highPriceVolume}</td>
                            <td>{item.avgLowPrice}</td>
                            <td>{item.lowPriceVolume}</td>
                            <td>{item.profit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ItemTable;