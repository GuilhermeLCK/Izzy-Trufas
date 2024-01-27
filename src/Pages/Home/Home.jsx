import React, { useState, useEffect, Context, useContext } from "react";
import { MyContext } from "../../Context/Context";
import InputsVendas from "../../Components/Vendas/InputsVendas";

import Table from "../../Components/Vendas/Table";

import "./Home.scss";
const Home = () => {
  const { moduloAtual, setModuloAtual, modalOpen } = useContext(MyContext);

  useEffect(() => {
    setModuloAtual("Vendas");
    localStorage.setItem("@Modulo_Atual", moduloAtual);
  }, [moduloAtual]);

  return (
    <>
      <div className="Container-Home">
        <div className="Container-Home-Section">
          <InputsVendas />
          <Table />
        </div>
      </div>
    </>
  );
};

export default Home;
