import React, { useState } from "react";
import "./Login.scss";
import { toast } from "react-toastify";
function Login({}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function Logar() {
    const emailValid = "guilherme.lima@izzyway.com.br";
    const senhaValid = "mino111344";

    if (emailValid === email && senhaValid === password) {
      localStorage.setItem("LoginStatus", true);
      toast.success("Logado com sucesso");

      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } else {
      toast.error("Erro ao logar");
    }
  }
  return (
    <div className="Container-Login">
      <div className="Container-Login-Section">
        <div className="Container-Login-Section-Banner"></div>
        <div className="Container-Login-Section-input">
          <h2>Faça seu login</h2>

          <input
            type="text"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button onClick={Logar}>Entrar</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
