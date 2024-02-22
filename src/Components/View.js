import React, { useEffect, useState } from "react";
import load from "../Eclipse-1s-200px.gif";
import loadingSound from "./sound.mp3"; //sound for loading exits




export default function View() {
  //but can only navigate if you have uploaded something
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading]=useState(false);
  const audio=new Audio(loadingSound);
  const [loadingtext, setLoadingtext] = useState("Please wait...");
  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search); //this is to get the filename parameters from the URL
    const name = queryParameters.get("filename");
    console.log("This is from view page", name);
    fetchData(name);
  }, []);

  setTimeout(() => {
    if (setLoading)
      setLoadingtext("The file is big! This might take some while...");
    setTimeout(() => {
      setLoadingtext("Please wait...");
    }, 5000);
  }, 10000);


  const fetchData = async (filename) => {
    setLoading(true);
    try {
      const response = await fetch(`/get_first_10_rows?filename=${filename}`, {
        method: "GET",
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        setData(responseData.data);
        setHeaders(responseData.headers);
        setLoading(false);
        audio.play();
        
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container my-5">
      <h2>Preview the CSV</h2>
      {loading && (
          <img
            src={load} //loading animation
            alt="Loading..."
            style={{
              display: "block",
              margin: "auto",
              marginTop: "10px",
              height: "80px",
            }}
          />
        )}
        {loading && <h5>{loadingtext}</h5>}
      <table  class="table table-dark table-striped">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
