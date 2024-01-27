import { React, useEffect, useContext } from "react";
import "./QRcode.scss";
import QRcodeImg from "../../Img/QRcode.png";

import { MyContext } from "../../Context/Context";

function QRcode() {
  const { moduloAtual, setModuloAtual } = useContext(MyContext);

  useEffect(() => {
    setModuloAtual("QRcode");
    localStorage.setItem("@Modulo_Atual", moduloAtual);
  }, [moduloAtual]);
  return (
    <div className="Container-QRcode">
      <div className="Container-QRcode-Img">
        <img src={QRcodeImg} alt="QRcodeImg" />
      </div>
    </div>
  );
}

export default QRcode;
