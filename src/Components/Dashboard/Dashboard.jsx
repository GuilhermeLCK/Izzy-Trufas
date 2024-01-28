import React, { useContext, useEffect, useState } from "react";
import "../../Scss/Dashboard.scss";

import BeatLoader from "react-spinners/BeatLoader";

function Dashboard({
  load,
  text01,
  icone01,
  text02,
  icone02,
  text03,
  icone03,
  Total01,
  Total02,
  Total03,
  color,
}) {
  return (
    <div className="container-dashboard">
      {load ? (
        <BeatLoader color="#000000" size={12} />
      ) : (
        <div className="section-dashboard">
          <div className="mocukp-dashboard" id={color[0]}>
            <div className="mocukp-dashboard-icone">
              {icone01}
              <br />
            </div>
            <div className="mocukp-dashboard-text">
              <h1>
                {text01}
                <br />
                <span> {Total01}</span>
              </h1>
            </div>
          </div>
          <div className="mocukp-dashboard" id={color[1]}>
            <div className="mocukp-dashboard-icone">{icone02}</div>
            <div className="mocukp-dashboard-text">
              <h1>
                {text02}
                <br />
                <span>{Total02}</span>
              </h1>
            </div>
          </div>
          <div className="mocukp-dashboard" id={color[2]}>
            <div className="mocukp-dashboard-icone">{icone03}</div>

            <div className="mocukp-dashboard-text">
              <h1>
                {text03} <br />
                <span> {Total03}</span>
              </h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
