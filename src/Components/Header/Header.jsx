import { React, useState, useEffect, useContext } from "react";
import "../../Scss/Header.scss";
import { MyContext } from "../../Context/Context";
import { toast } from "react-toastify";

import {
  FaBoxOpen,
  FaCartPlus,
  FaMoneyBillAlt,
  FaInstalod,
  FaQrcode,
  FaSignOutAlt,
  FaUserCheck,
} from "react-icons/fa";

function Header() {
  const { moduloAtual, setModuloAtual } = useContext(MyContext);

  function SairDoSistema() {
    localStorage.setItem("LoginStatus", false);
    toast.success("Saindo do sistema ...");

    setTimeout(() => {
      window.location.href = "/";
    }, 1300);
  }

  return (
    <div className="container-header">
      <div className="section-header-logo">
        <a href="/"> PATY</a>
      </div>
      <div className="section-header-modulos">
        <h3>
          {moduloAtual === "Vendas" && (
            <>
              <FaCartPlus className="FaCartPlus" />
              {moduloAtual}
            </>
          )}

          {moduloAtual === "Financeiro" && (
            <>
              <FaMoneyBillAlt className="FaMoneyBillAlt" />
              {moduloAtual}
            </>
          )}

          {moduloAtual === "Estoque" && (
            <>
              <FaBoxOpen className="FaBoxOpen" />
              {moduloAtual}
            </>
          )}

          {moduloAtual === "Participantes" && (
            <>
              <FaUserCheck className="FaUserCheck  " />
              {moduloAtual}
            </>
          )}

          {moduloAtual === "QRcode" && (
            <>
              <FaQrcode className="FaQrcode" />
              {moduloAtual}
            </>
          )}
        </h3>
      </div>

      <div className="section-header-btns">
        <a href="/">
          Vendas <FaCartPlus />
        </a>

        <a href="/Financeiro">
          Financeiro <FaMoneyBillAlt />
        </a>

        <a href="/Estoque">
          Estoque <FaBoxOpen />
        </a>

        <a href="/Participantes">
          Participantes <FaUserCheck />
        </a>
        <a href="/QRcode">
          QRcode <FaQrcode />
        </a>

        <button onClick={SairDoSistema}>
          Sair <FaSignOutAlt />
        </button>
      </div>
    </div>
  );
}

export default Header;
