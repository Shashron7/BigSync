import React from "react";
import { useEffect, useState } from "react";
import load from "../Eclipse-1s-200px.gif";
import Chart from "chart.js/auto";
import 'chartjs-plugin-zoom';
import loadingSound from "./sound.mp3"; //sound for loading exits


export default function Vis() {
  const [loading, setLoading] = useState(false);
  const [csvData, SetCsvData] = useState([]); //state to set the CSV data
  const [loadingtext, setLoadingtext] = useState("Please wait...");

  const audio=new Audio(loadingSound);

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search); //this is to get the filename parameters from the URL
    const name = queryParameters.get("filename");
    console.log("This is from vis page", name); //this is the view page
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
      const response = await fetch(`/for_visualisation?filename=${filename}`, {
        method: "GET",
      });
      if (response.ok) {
        const responseData = await response.json(); //getting the 
        console.log(responseData);
        // setData(responseData.data);
        // setHeaders(responseData.headers);
        setLoading(false);
        SetCsvData(responseData.data);
        createChart(responseData.data);
        audio.play();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createChart = (data) => {
    // Extracting values from 1st and 5th columns
    const column1Data = data.map((row) => parseFloat(row[0])); // Assuming the 1st column contains numeric data
    const column5Data = data.map((row) => parseFloat(row[4])); // Assuming the 5th column contains numeric data
    const column6Data = data.map((row) => parseFloat(row[5])); // Extract values from column 6
    const column7Data = data.map((row) => parseFloat(row[6])); //extracting remaining columns
    const column8Data = data.map((row) => parseFloat(row[7])); //extracting remaining columns
    const column9Data = data.map((row) => parseFloat(row[8])); //extracting remaining columns
    const column10Data = data.map((row) => parseFloat(row[9])); //extracting remaining columns

    setTimeout(() => {
      if (setLoading)
        setLoadingtext("The file is big! This might take some while...");
      setTimeout(() => {
        setLoadingtext("Please wait...");
      }, 5000);
    }, 10000);
  

    const ctx = document.getElementById("myChart");
    



    new Chart(ctx, {
      type: "line",
      data: {
        labels: column1Data, // Use values from the 1st column as labels
        datasets: [
          {
            label: "Phase A Current", // Label for the dataset
            data: column5Data, // Use values from the 5th column as dataset
            fill: false, // Disable fill for line chart
            borderColor: "rgba(75, 192, 192, 1)", // Color for the line
            tension: 0.1, // Tension of the line
          },
          {
            label: "Phase B Current", // Label for the dataset
            data: column6Data, // Use values from the 5th column as dataset
            fill: false, // Disable fill for line chart
            borderColor: "rgba(255, 99, 132, 1)", // Color for the line
            tension: 0.1, // Tension of the line
          },
          {
            label: "Phase C Current", // Label for the dataset
            data: column7Data, // Use values from the 5th column as dataset
            fill: false, // Disable fill for line chart
            borderColor: "rgba(54, 162, 235, 1)", // Color for the line
            tension: 0.1, // Tension of the line
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Column 1 Data", // X-axis label
            },
          },
          y: {
            title: {
              display: true,
              text: "Column 5 Data", // Y-axis label
            },
          },
        },
      },
    });
    const ctx1 = document.getElementById("myChart1");
    new Chart(ctx1, {
      type: "line",
      data: {
        labels: column1Data, // Use values from the 1st column as labels
        datasets: [
          {
            label: "Phase A Voltage", // Label for the dataset
            data: column8Data, // Use values from the 5th column as dataset
            fill: false, // Disable fill for line chart
            borderColor: "rgba(75, 192, 192, 1)", // Color for the line
            tension: 0.1, // Tension of the line
          },
          {
            label: "Phase B Voltage", // Label for the dataset
            data: column9Data, // Use values from the 5th column as dataset
            fill: false, // Disable fill for line chart
            borderColor: "rgba(255, 99, 132, 1)", // Color for the line
            tension: 0.1, // Tension of the line
          },
          {
            label: "Phase C Voltage", // Label for the dataset
            data: column10Data, // Use values from the 5th column as dataset
            fill: false, // Disable fill for line chart
            borderColor: "rgba(54, 162, 235, 1)", // Color for the line
            tension: 0.1, // Tension of the line
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Column 1 Data", // X-axis label
            },
          },
          y: {
            title: {
              display: true,
              text: "Column 5 Data", // Y-axis label
            },
          },
        },
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'xy', // Enable zooming on both the X and Y axes
            },
          },
        },
        
      },
    });
  };

  return (
    <div className="container">
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

      {!loading && <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              <strong>Current Visualisations</strong>
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
            {loading ? "Loading the Graphs..." : <canvas id="myChart"></canvas>}
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
            <strong>Voltage Visualisations</strong> 
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
            {loading ? "Loading the Graphs..." : <canvas id="myChart1"></canvas>}
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}
