import { React, useState, useContext } from "react";
import "../../Scss/ModalYesOrNo.scss";
import { FaTimes, FaCheck } from "react-icons/fa";

function ModalYesOrNo({ text, Cancelar, Confirmar }) {
  return (
    <div className="Container-ModalYesOrNo">
      <div className="Container-ModalYesOrNo-Section">
        <h3> {text}</h3>
        <div className="Container-ModalYesOrNo-Section-button">
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
