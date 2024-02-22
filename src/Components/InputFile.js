import React from "react";
import { useState, useEffect, useRef } from "react";
import load from "../Eclipse-1s-200px.gif";
import { useNavigate, useLocation } from "react-router-dom";
import csv_shape from "../csv_format.png";
import loadingSound from "./sound.mp3";


export default function InputFile() {
  const navigate = useNavigate();
  const audio= new Audio(loadingSound);
  const ref = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null); //state for the file selection
  const [loading, setLoading] = useState(false); //state for the loading screen
  const [aftup, setAftup] = useState(null); //this state will help trigger the buttons after uploading
  useEffect(() => {
    const storedFile = sessionStorage.getItem("uploaded_file");
    if(sessionStorage.getItem('plot'))
    {
      sessionStorage.removeItem('plot');
    }
    const imgElement = document.getElementById("plotImage");
    if (imgElement) {
      imgElement.remove();
      console.log("removed");
    }
    if (storedFile) {
      setSelectedFile(storedFile);
      setAftup(`${sessionStorage.getItem("FileName")} uploaded`);
      //setting the value equal to the already added file
    }
  }, []);
  const clickClear = () => {
    //this handles the clear button
    sessionStorage.clear();
    setAftup(null); // Set aftup to null
    setSelectedFile(null); //set the selected file as null
    document.getElementById("formFile").value = ""; //this will clear the form input
  };

  let AfterFile = false;
  const handleFileChange = (event) => {
    const file = event.target.files[0]; //the method of getting the file
    sessionStorage.setItem("uploaded_file", file); //this will store the file as a key value pair

    setSelectedFile(file);
    setAftup(null);
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    setLoading(true);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData, //the data is formtype always use this when we have to upload
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        sessionStorage.setItem("FileName", data.filename); //storing the name of the file also
        console.log(sessionStorage.getItem("FileName")); //here we are using session storage to get the FileName, because we want the name to be constant till we clear it
        setAftup("File Uploaded Successfully !");
        // Do something after successful upload if needed
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error occurred while uploading:", error);
    } finally {
      setLoading(false);
      audio.play();
    }
  };
  //buttons to help navigate to different pages --note: see the filename is very important for further processes
  const handleClick = () => {
    navigate(`/view?filename=${sessionStorage.getItem("FileName")}`); //we are sending a filename query which will have the name of the file
  };
  const handleClick1 = () => {
    navigate(`/vis?filename=${sessionStorage.getItem("FileName")}`); //we are sending a filename query which will have the name of the file
  };
  const handleClick2 = () => {
    navigate(`/predict?filename=${sessionStorage.getItem("FileName")}`); //we are sending a filename query which will have the name of the file
  };
  const onClick = () => {
    ref.current.click();
    console.log("clicked");
  };
  return (
    <div className="container my-5">
      <div className="mb-3">
        <h2>Cyberattack Detection</h2>
        <label htmlFor="formFile" className="form-label">
          {!selectedFile ? "Select CSV file" : "Remove your selection"}
        </label>
        <input
          className="form-control"
          type="file"
          id="formFile"
          accept=".csv"
          style={{ width: "500px", marginLeft: "390px" }}
          onChange={handleFileChange}
        />
        {!aftup && ( //if aftup is null then onlu display the submit button
          <button
            type="button"
            className="btn btn-primary mx-3"
            style={{ marginTop: "30px" }}
            onClick={handleSubmit}
            disabled={!selectedFile}
          >
            {loading ? "Uploading..." : "Submit CSV file"}
          </button>
        )}
        {aftup &&
          sessionStorage.getItem("uploaded_file") && ( //only display if stored file and aftup is not null
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: "30px" }}
              onClick={clickClear}
            >
              Clear Selection
            </button>
          )}
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
        <h5 style={{ marginTop: "20px", color: "green" }}>{aftup}</h5>
        {sessionStorage.getItem("uploaded_file") && aftup && (
          <div className="d-grid gap-2" style={{ marginTop: " 50px" }}>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleClick}
            >
              View CSV
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleClick1}
            >
              Visualisation
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleClick2}
            >
              Predict Cyberattack
            </button>
          </div>
        )}
        <button
          type="button"
          className="btn btn-primary  d-none"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          ref={ref}
        >
          See the CSV format
        </button>
        {/* Modal */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  CSV format
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div class="d-flex flex-column mb-3">
                  <div class="p-2"> <strong>Column 1</strong>: Timestamp </div>
                  <div class="p-2"><strong>Column 2</strong>: Fault Time</div>
                  <div class="p-2"><strong>Column 3</strong>: Fault location</div>
                  <div class="p-2"><strong>Column 4</strong>: Fault type</div>
                  <div class="p-2"><strong>Column 5</strong>: Current A</div>
                  <div class="p-2"><strong>Column 6</strong>: Current B </div>
                  <div class="p-2"> <strong>Column 7</strong>: Current C</div>
                  <div class="p-2"><strong>Column 8</strong>: Voltage A</div>
                  <div class="p-2"><strong>Column 9</strong>: Voltage B </div>
                  <div class="p-2"><strong>Column 9</strong>: Voltage C</div>
              </div>
              </div>
              <div className="modal-footer"></div>
            </div>
          </div>
        </div>
        {
          !sessionStorage.getItem("uploaded_file") && (
            <a id="csv_format" onClick={onClick}>
              See the CSV format before uploading
            </a>
          ) //as soon as we get an uploaded file we dont need this message anymore
        }
      </div>
    </div>
  );
}
