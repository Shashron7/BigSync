import React, { useState } from "react";
import { useEffect } from "react";
import load from "../Eclipse-1s-200px.gif";
import loadingSound from "./sound.mp3"; //sound for loading exits

export default function Predict() {
  const queryParameters = new URLSearchParams(window.location.search); //this is to get the filename parameters from the URL
  const name = queryParameters.get("filename"); //get the filename parameter key value, 'name' is the filename variable
  const [loading, setLoading] = useState(false);
  const audio= new Audio(loadingSound);
  const [afterp, setAfterp] = useState("");
  const [loadingtext, setLoadingtext] = useState("Please wait...");
  const [up, setUp] = useState(false); //has the file been processed?
  const [Prediction, setPrediction] = useState("");
  const [dis,setDis]=useState(false);
  useEffect(() => {
    //as soon as the page gets reloaded
    const imgElement = document.getElementById("plotImage");
    if (imgElement) {
      imgElement.remove();
      console.log("removed");
    }
    console.log("This is from predict page", name); //this is the view page
    fetchData(name);
  }, []);
  //dynamically change the text if the file is too big
  setTimeout(() => {
    if (setLoading)
      setLoadingtext("The file is big! This might take some while...");
    setTimeout(() => {
      setLoadingtext("Please wait...");
    }, 5000);
  }, 10000);

  setTimeout(() => {
    if (afterp) setAfterp(null);
  }, 4000);

  const onClick = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/process?filename=${name}`, {
        method: "GET",
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        setLoading(false);
        audio.play();
        setAfterp("File processed successfully !");
        setUp(true); //file has been processed so true
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onClick1 = async () => {
    setLoading(true);
    try {
      const response = await fetch("/for_predict", {
        method: "GET",
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("Prediction-");
        console.log(responseData);
        setLoading(false);
        audio.play();
        setPrediction(responseData.ans);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchData = async (filename) => {
    try {
      const response = await fetch(`/predict?filename=${filename}`, {
        method: "GET",
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onClick2 = async (filename) => {
    console.log("Clicked!");
    setLoading(true);
    try {
      const response = await fetch(`/recon?filename=${filename}`, {
        method: "GET",
      });
      if (response.ok) {
        // Assuming the response contains the image data
        console.log("!!");
        setLoading(false);
        audio.play();
        setDis(true); //disabling the button so that no more graphs can be generated
        const imageData = await response.blob();
        const imgUrl = URL.createObjectURL(imageData);
  
        // Display the image in the frontend
        const imgElement = document.createElement('img');
        imgElement.src = imgUrl;
        imgElement.alt = 'Plot';
        imgElement.style.display = 'block';
        imgElement.style.margin = 'auto';
        imgElement.id = "plotImage";
  
        document.body.appendChild(imgElement); // Or append to a specific element
      } else {
        console.error('Failed to fetch plot:', response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        style={{ marginTop: "30px" }}
        onClick={onClick}
      >
        Process the CSV file
      </button>
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
      <h3 style={{ marginTop: "30px", color: "green" }}>{afterp}</h3>
      {up && (
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginTop: "30px" }}
          onClick={onClick1}
        >
          Predict
        </button>
      )}
      {up && (
        <button
          type="button"
          className="btn btn-primary mx-3"
          style={{ marginTop: "30px" }}
          onClick={() => onClick2(name)}
          disabled={dis}
        >
          Show Original and Reconstructed Waveforms
        </button>
      )}
      {up && <h3 style={{ marginTop: "40px" }}>{Prediction}</h3>}
    </div>
  );
}
