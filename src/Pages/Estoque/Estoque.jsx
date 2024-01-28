import { React, useEffect, useContext, useState } from "react";
import "./Estoque.scss";
import { MyContext } from "../../Context/Context";
import ModalEstoque from "../../Components/Modals/ModalEstoque";
import ModalYesOrNo from "../../Components/Modals/ModalYesOrNo";
import {
  FaTruckLoading,
  FaCubes,
  FaDolly,
  FaPlay,
  FaRedo,
} from "react-icons/fa";
import Dashboard from "../../Components/Dashboard/Dashboard";
import { toast } from "react-toastify";
import { db } from "../../Services/Firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
function Estoque() {
  const { moduloAtual, setModuloAtual } = useContext(MyContext);
  const [estoque, setEstoque] = useState({});
  const [load, setLoad] = useState(true);
  const [openModalInciarValor, setOpenModalIniciarValor] = useState(false);
  const [openModalResetar, setOpenModalResetar] = useState(false);

  useEffect(() => {
    setModuloAtual("Estoque");
    localStorage.setItem("@Modulo_Atual", moduloAtual);
  }, [moduloAtual]);

  useEffect(() => {
    const estoqueRef = collection(db, "Estoque");

    const unsubscribeEstoque = onSnapshot(estoqueRef, (snapshot) => {
      const listEstoque = snapshot.docs.map((venda) => {
        const estoqueData = venda.data();

        return {
          EstoqueAtual: estoqueData.EstoqueAtual,
          EstoqueInicial: estoqueData.EstoqueInicial,
          EstoqueId: estoqueData.EstoqueId,
          QuantidadeVendida: estoqueData.QuantidadeVendida,
          EstoqueStatus: estoqueData.EstoqueStatus,
        };
      });
      setLoad(false);
      setEstoque(listEstoque);
    });

    return () => unsubscribeEstoque();
  }, []);

  async function ResetarEstoque() {
    const estoqueID = estoque[0].EstoqueId;
    try {
      const estoqueRefUpdate = doc(collection(db, "Estoque"), estoqueID);

      await updateDoc(estoqueRefUpdate, {
        EstoqueAtual: 0,
        EstoqueInicial: 0,
        QuantidadeVendida: 0,
        EstoqueStatus: false,
      });
      toast.success("Estoque reiniciado com sucesso!");
      setOpenModalResetar();
    } catch (e) {
      console.error(e);
      toast.error("Erro ao atualizar estoque!");
    }
  }
  function ValidarEstoqueInical() {
    const StatusEstoque = estoque[0]?.EstoqueStatus;

    if (StatusEstoque === false) {
      setOpenModalIniciarValor(!openModalInciarValor);
    } else {
      toast.error(
        "Referência de objeto não definida para uma instância de um objeto! ERROR JA POSSUI VALOR INICIAL]"
      );
    }
  }
  function ModalResetarEstoque() {
    setOpenModalResetar(!openModalResetar);
  }
  return (
    <>
      <Dashboard
        load={load}
        text01={"ESTOQUE INICIAL"}
        icone01={<FaDolly size={65} />}
        text02={"TOTAL VENDIDO"}
        icone02={<FaTruckLoading size={65} />}
        text03={"ESTOQUE ATUAL"}
        icone03={<FaCubes size={65} />}
        Total01={!estoque[0]?.EstoqueInicial ? 0 : estoque[0]?.EstoqueInicial}
        Total02={
          !estoque[0]?.QuantidadeVendida ? 0 : estoque[0]?.QuantidadeVendida
        }
        Total03={!estoque[0]?.EstoqueAtual ? 0 : estoque[0]?.EstoqueAtual}
        color={["Gren", "Blue", "Red"]}
      />
      {openModalInciarValor && (
        <ModalEstoque
          estoque={estoque}
          setOpenModalIniciarValor={setOpenModalIniciarValor}
        />
      )}
      {openModalResetar && (
        <ModalYesOrNo
          text={"Deseja reinicar estoque ?!"}
          Cancelar={ModalResetarEstoque}
          Confirmar={ResetarEstoque}
        />
      )}
      <div className="container-estoque-btn">
        <button onClick={ModalResetarEstoque}>
          <FaRedo />
        </button>
        <button onClick={ValidarEstoqueInical}>
          <FaPlay />
        </button>
      </div>
      ;
    </>
  );
}

export default Estoque;
