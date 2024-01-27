import { React, useEffect, useContext, useState } from "react";
import { MyContext } from "../../Context/Context";
import Dashboard from "../../Components/Dashboard/Dashboard";
import { FaCloudDownloadAlt, FaMoneyBillAlt, FaEquals } from "react-icons/fa";
import { db } from "../../Services/Firebase";
import { collection, onSnapshot } from "firebase/firestore";
function Financeiro() {
  const { moduloAtual, setModuloAtual } = useContext(MyContext);

  useEffect(() => {
    setModuloAtual("Financeiro");
    localStorage.setItem("@Modulo_Atual", moduloAtual);
  }, [moduloAtual]);

  const [load, setLoad] = useState(true);

  const [financeiro, setFinanceiro] = useState({
    totalVenda: 0,
    totalPago: 0,
    valorPendenteDePagamento: 0,
  });

  useEffect(() => {
    const estoqueRef = collection(db, "Financeiro");
    const unsubscribe = onSnapshot(estoqueRef, (querySnapshot) => {
      let totalVenda = 0;
      let totalPago = 0;
      let valorPendenteDePagamento = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(data);
        const situacao = data.situaSituacaocao;
        const totalVendaDaVenda = data.TotalVenda;
        const valorPendenteDaVenda = data.ValorPendenteDePagamento;

        totalVenda += totalVendaDaVenda;
        valorPendenteDePagamento += valorPendenteDaVenda;
        totalPago += totalVendaDaVenda;
      });

      setFinanceiro({
        totalVenda,
        totalPago,
        valorPendenteDePagamento,
      });

      setLoad(false);
    });

    return () => unsubscribe();
  }, []);

  const totalVenda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(financeiro?.totalVenda);

  const totalPago = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(
    parseFloat(financeiro?.totalVenda).toFixed(2) -
      parseInt(financeiro?.valorPendenteDePagamento.toFixed(2))
  );

  const valorPendenteDePagamento = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(financeiro?.valorPendenteDePagamento);

  return (
    <>
      <Dashboard
        load={load}
        text01={"TOTAL DE VENDAS"}
        icone01={<FaEquals size={65} />}
        text02={" TOTAL PAGO"}
        icone02={<FaCloudDownloadAlt size={65} />}
        text03={"TOTAL A RECEBER"}
        icone03={<FaMoneyBillAlt size={65} />}
        Total01={totalVenda}
        Total02={totalPago}
        Total03={valorPendenteDePagamento}
      />
    </>
  );
}

export default Financeiro;
