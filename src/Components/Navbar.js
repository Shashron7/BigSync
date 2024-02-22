import React from 'react'
import iitlogo from '../iitpkd.png'
export default function Navbar() {
  return (
    <div>
     
  <nav className="navbar navbar-expand-lg bg-body-tertiary bg-dark navbar-light">
    <div className="container-fluid">
      <a className="navbar-brand" href="#">
        <strong>BigSync</strong>
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="#">
             About
            </a>
          </li>
          
        </ul>
        <img src={iitlogo} style={{marginLeft: "200px", height: "67px",width: 'auto'}}></img>
      </div>
    </div>
  </nav>


    </div>
  )
}
