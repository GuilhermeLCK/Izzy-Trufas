import { React, useState, useContext } from "react";
import "../../Scss/ModalYesOrNo.scss";
import { FaTimes, FaCheck } from "react-icons/fa";
import { JackInTheBox } from "react-awesome-reveal";

function ModalYesOrNo({ text, Cancelar, Confirmar }) {
  return (
    <div className="container-modalYesOrNo">
      <div className="container-modalYesOrNo-section">
        <h3> {text}</h3>
        <div className="container-modalYesOrNo-section-btn">
          <button className="button_close" onClick={Cancelar}>
            Cancelar <FaTimes />
          </button>
          <button className="button_confirm" onClick={Confirmar}>
            Confirmar <FaCheck />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalYesOrNo;
