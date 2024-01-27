import { Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Home from "../Pages/Home/Home";
import Financeiro from "../Pages/Financeiro/Financeiro";
import Header from "../Components/Header/Header";
import Estoque from "../Pages/Estoque/Estoque";
import Participantes from "../Pages/Participantes/Participantes";
import QRcode from "../Pages/QRcode/QRcode";
import Login from "../Pages/Login/Login";
import Error from "../Pages/404/Error";

function Router() {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("LoginStatus");
    setLogin(storedLoginStatus === "true");
  }, []);

  return (
    <div className="Container-Route">
      {login && <Header />}

      <Routes>
        {login ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/Financeiro" element={<Financeiro />} />
            <Route path="/Estoque" element={<Estoque />} />
            <Route path="/QRcode" element={<QRcode />} />
            <Route path="/Participantes" element={<Participantes />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/*" element={<Error />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default Router;
