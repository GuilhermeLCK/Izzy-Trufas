import { React, useEffect, useContext } from "react";

import { MyContext } from "../../Context/Context";

import ParticipanteComponent from "../../Components/Participantes/Participante";
function Participantes() {
  const { moduloAtual, setModuloAtual } = useContext(MyContext);

  useEffect(() => {
    setModuloAtual("Participantes");
    localStorage.setItem("@Modulo_Atual", moduloAtual);
  }, [moduloAtual]);
  return (
    <div className="Container-Participantes">
      <ParticipanteComponent />
    </div>
  );
}

export default Participantes;
