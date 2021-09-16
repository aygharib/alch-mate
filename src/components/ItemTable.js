import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./ItemTable.css";

const ItemTable = () => {
    // Data
    const [mappingItems, setMappingItems] = useState([]);
    const [fiveMinItems, setFiveMinItems] = useState([]);
    const [mergedItems, setMergedItems] = useState([]);
    const [displayedItems, setDisplayedItems] = useState([]);

    // Pagination
    const [pageNumber, setPageNumber] = useState(0);
    const itemsPerPage = 20;
    const pagesVisted = pageNumber * itemsPerPage;
    const pageCount = Math.ceil(mergedItems.length / itemsPerPage);

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

    // Update displayed items when mergedItems changes, or when the pageNumber changes
    useEffect(() => {
        setDisplayedItems(mergedItems.slice(pagesVisted, pagesVisted + itemsPerPage));
    }, [mergedItems, pageNumber]);

    const changePage = ({selected}) => {
        setPageNumber(selected);
    }

    return (
        <div className="container">
            <div className="table-style">

                <h2>Profitable Items</h2>

                <table class="table table-hover">
                <thead>
                    <tr>
                    <th scope="col">Name</th>
                    <th scope="col">High Price</th>
                    <th scope="col">High Volume</th>
                    <th scope="col">High Alchemy Value</th>
                    <th scope="col">Members Only</th>
                    <th scope="col">Limit</th>
                    <th scope="col">Profit</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedItems.map((item) => (
                        <tr class="table-active">
                            <th scope="row">{item.name}</th>
                            <td>{item.avgHighPrice}</td>
                            <td>{item.highPriceVolume}</td>
                            <td>{item.highalch}</td>
                            <td>{item.members ? <p>Yes</p> : <p>No</p>}</td>
                            <td>{item.limit}</td>
                            <td>{item.profit}</td>
                        </tr>
                    ))}
                </tbody>
                </table>
                {/* 
                <ReactPaginate 
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName={"paginationButtons"}
                    previousLinkClassName={"previousButton"}
                    nextLinkClassName={"nextButton"}
                    activeClassName={"activeButton"}
                /> */}

                <div class="poggers">
                    <ReactPaginate
                        previousLabel={"Prev"}
                        nextLabel={"Next"}
                        containerClassName="pagination"
                        breakClassName="page-item"
                        breakLabel={<a className="page-link">...</a>}
                        pageClassName="page-item"
                        previousClassName="page-item"
                        nextClassName="page-item"
                        pageLinkClassName="page-link"
                        previousLinkClassName="page-link"
                        nextLinkClassName="page-link"
                        activeClassName="active"
                        pageCount={pageCount}
                        onPageChange={changePage}
                    />
                </div>
                
                
                {/* <table>
                    <thead className="table-header">
                        <tr>
                            <th>Name</th>
                            <th>High Alchemy</th>
                            <th>Members</th>
                            <th>Limit</th>
                            <th>High Price</th>
                            <th>High Volume</th>
                            <th>Low Price</th>
                            <th>Low Volume</th>
                            <th>Profit</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
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
                
                <ReactPaginate 
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName={"paginationButtons"}
                    previousLinkClassName={"previousButton"}
                    nextLinkClassName={"nextButton"}
                    activeClassName={"activeButton"}
                /> */}
            </div>
        </div>
    );
}

export default ItemTable;