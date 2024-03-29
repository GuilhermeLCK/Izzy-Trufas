import React, { useState, useEffect, Context, useContext } from "react";
import { MyContext } from "../../Context/Context";
import InputsVendas from "../../Components/Vendas/InputsVendas";

import TableVendas from "../../Components/Vendas/TableVendas";

import "./Home.scss";
const Home = () => {
  const { moduloAtual, setModuloAtual, modalOpen } = useContext(MyContext);

  useEffect(() => {
    setModuloAtual("Vendas");
    localStorage.setItem("@Modulo_Atual", moduloAtual);
  }, [moduloAtual]);

  return (
    <>
      <div className="container-home">
        <div className="container-home-section">
          <InputsVendas />
          <TableVendas />
        </div>
      </div>
    </>
  );
};

export default Home;
