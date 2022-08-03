import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Words from "./Words";
import Translation from "./Translation";
import Home from "./Home";

function App() {
  return (
<Router>
    <div className="container">
      <div className="row">
        <div className="col">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand">Wörtertrainer</Link>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <Link to="/words" className="nav-link">Words</Link>
                </li>
                <li className="nav-item active">
                  <Link to="/translation" className="nav-link">Translation</Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/words" element={<Words />} />
        <Route path="/translation" element={<Translation />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
