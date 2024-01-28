import { React, useEffect, useContext, useState } from "react";
import "./Financeiro.scss";
import { MyContext } from "../../Context/Context";
import Dashboard from "../../Components/Dashboard/Dashboard";
import { toast } from "react-toastify";
import {
  FaCloudDownloadAlt,
  FaMoneyBillAlt,
  FaEquals,
  FaShoppingCart,
  FaDollarSign,
  FaCubes,
  FaCalculator,
  FaPercent,
  FaMoneyBillWave,
  FaChartLine,
  FaHandHoldingUsd,
  FaReceipt,
  FaWallet,
} from "react-icons/fa";

import { db } from "../../Services/Firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { Fade } from "react-awesome-reveal";
import ModalYesOrNo from "../../Components/Modals/ModalYesOrNo";

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

  const [caixa, setCaixa] = useState({
    caixaTotalVenda: 0,
    caixaQuantidadeVendida: 0,
    caixaValorUnidadeMedia: 0,
    caixaReceitaTotal: 0,
    caixaMargemLucroTotal: 0,
    caixaCustoMedioPorUnidade: 0,
    caixaLucroPorUnidade: 0,
    caixaTicketMedio: 0,
  });
  const [movimentosIDs, setMovimentosIDs] = useState([]);
  const [financeiroIDs, setFinanceiroIDs] = useState([]);

  const [openModalFecharCaixa, setOpenModalFecharCaixa] = useState(false);
  const [openModalFinancas, setOpenModalFinancas] = useState(false);

  useEffect(() => {
    const financeiroRef = collection(db, "Financeiro");
    const unsubscribe = onSnapshot(financeiroRef, (querySnapshot) => {
      let totalVenda = 0;
      let totalPago = 0;
      let valorPendenteDePagamento = 0;
      let movimentosIDs = [];
      let financeiroIDs = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const situacao = data.Situacao;
        const totalVendaDaVenda = data.TotalVenda;
        const valorPendenteDaVenda = data.ValorPendenteDePagamento;

        totalVenda += totalVendaDaVenda;
        valorPendenteDePagamento += valorPendenteDaVenda;
        totalPago += totalVendaDaVenda;

        if (situacao === 2) {
          movimentosIDs.push(data.MovimentoId);
          financeiroIDs.push(data.FinanceiroId);
        }
      });

      setFinanceiro({
        totalVenda,
        totalPago,
        valorPendenteDePagamento,
      });

      setMovimentosIDs(movimentosIDs);
      setFinanceiroIDs(financeiroIDs);

      setLoad(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const caixaFinanceiro = collection(db, "Caixa");
    const unsubscribe = onSnapshot(caixaFinanceiro, (querySnapshot) => {
      let totalVendas = 0;
      let quantidadesVendida = 0;
      let custosTotais = 0; // Adicione essa variável se tiver informações sobre custos

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const totalVendaDaVenda = data?.TotalVenda;
        const valorQuantidadeVendida = data?.QuantidadeVendida;
        const custoPorUnidade = data?.CustoPorUnidade || 1.4; // Valor padrão caso não esteja definido

        totalVendas += totalVendaDaVenda;
        quantidadesVendida += valorQuantidadeVendida;

        custosTotais += custoPorUnidade * valorQuantidadeVendida;
      });

      const media =
        quantidadesVendida !== 0
          ? parseFloat((totalVendas / quantidadesVendida).toFixed(2))
          : 0;

      const receitaTotal = totalVendas;
      const margemLucroTotal = totalVendas - custosTotais;
      const custoMedioPorUnidade =
        quantidadesVendida !== 0 ? custosTotais / quantidadesVendida : 0;
      const lucroPorUnidade = media - custoMedioPorUnidade;
      const ticketMedio =
        querySnapshot.size !== 0 ? receitaTotal / querySnapshot.size : 0;

      // Calcular as porcentagens

      const margemLucroTotalPercent =
        receitaTotal !== 0 || margemLucroTotal != 0
          ? parseFloat((margemLucroTotal / receitaTotal) * 100)
          : 0;

      const lucroPorUnidadePercent =
        lucroPorUnidade !== 0 && media !== 0
          ? parseFloat((lucroPorUnidade / media) * 100)
          : 0;

      setCaixa({
        caixaReceitaTotal: receitaTotal,
        caixaQuantidadeVendida: quantidadesVendida,
        caixaValorUnidadeMedia: media,

        caixaMargemLucroTotal: margemLucroTotal,
        caixaCustoMedioPorUnidade: custoMedioPorUnidade,
        caixaLucroPorUnidade: lucroPorUnidade,

        margemLucroTotalPercent: margemLucroTotalPercent,
        lucroPorUnidadePercent: lucroPorUnidadePercent,
        caixaTicketMedio: ticketMedio,
      });
    });

    return () => unsubscribe();
  }, []);

  async function FecharCaixa() {
    if (movimentosIDs.length === 0 && financeiroIDs.length === 0) {
      toast.warning("Não há documentos para serem movidos para o Caixa.");
      return;
    }

    const moverParaCaixa = async (documento, id, colecaoOrigem) => {
      const caixaRef = collection(db, "Caixa");
      const novoDocumentoRef = await addDoc(caixaRef, documento);

      // Exclua o documento original após mover para 'Caixa'
      await deleteDoc(doc(db, colecaoOrigem, id))
        .then(() => {
          toast.success(
            `${colecaoOrigem} movido para Caixa e deletado com sucesso`
          );
        })
        .catch((e) => {
          console.error("Erro ao deletar documento:", e);
        });
    };

    // Mover documentos da coleção 'Movimentos' para 'Caixa'
    const movimentosPromises = movimentosIDs.map(async (id) => {
      const movimentoDoc = await getDoc(doc(db, "Movimentos", id));
      if (movimentoDoc.exists()) {
        await moverParaCaixa(movimentoDoc.data(), id, "Movimentos");
      }
    });

    // Mover documentos da coleção 'Financeiro' para 'Caixa'
    const financeiroPromises = financeiroIDs.map(async (id) => {
      const financeiroDoc = await getDoc(doc(db, "Financeiro", id));
      if (financeiroDoc.exists()) {
        await moverParaCaixa(financeiroDoc.data(), id, "Financeiro");
      }
    });

    // Aguardar a conclusão de todas as movimentações
    await Promise.all([...movimentosPromises, ...financeiroPromises]);

    HandleAbrirModalFecharCaixa();
  }

  function HandleAbrirModalFecharCaixa() {
    setOpenModalFecharCaixa(!openModalFecharCaixa);
  }

  function HandleAbrirModalFinanceiro() {
    setOpenModalFinancas(!openModalFinancas);
  }
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

  const caixaReceitaTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(caixa?.caixaReceitaTotal);

  const caixaValorUnidadeMedia = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(caixa?.caixaValorUnidadeMedia);

  const caixaMargemLucroTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(caixa?.caixaMargemLucroTotal);

  const caixaCustoMedioPorUnidade = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(caixa?.caixaCustoMedioPorUnidade);

  const caixaLucroPorUnidade = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(caixa?.caixaLucroPorUnidade);

  const caixaTicketMedio = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(caixa?.caixaTicketMedio);
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
        color={["Gren", "Blue", "Red"]}
      />
      <div className="container-financeiro-btn">
        <button onClick={HandleAbrirModalFecharCaixa}>
          <FaShoppingCart />
        </button>

        <button onClick={HandleAbrirModalFinanceiro}>
          <FaWallet />
        </button>
      </div>

      {openModalFinancas && (
        <div className="container-financeiro-dashboards">
          <Fade direction="down">
            {" "}
            <div>
              <Dashboard
                load={load}
                text01={"RECEITA TOTAL"}
                icone01={<FaDollarSign size={65} />}
                text02={"QUANTIDADE GERAL"}
                icone02={<FaCubes size={65} />}
                text03={"MEDIA UNIDADE"}
                icone03={<FaCalculator size={65} />}
                Total01={caixaReceitaTotal}
                Total02={caixa?.caixaQuantidadeVendida}
                Total03={caixaValorUnidadeMedia}
                color={["Roxo", "Amarelo", "Verde"]}
              />
            </div>
            <div>
              <Dashboard
                load={load}
                text01={"MARGEM DE LUCRO TOTAL"}
                icone01={<FaPercent size={65} />}
                text02={"CUSTO MEDIO POR UNIDADE"}
                icone02={<FaMoneyBillAlt size={65} />}
                text03={"LUCRO MEDIO POR UNIDADE"}
                icone03={<FaMoneyBillWave size={65} />}
                Total01={caixaMargemLucroTotal}
                Total02={caixaCustoMedioPorUnidade}
                Total03={caixaLucroPorUnidade}
                color={["Preto", "AzulClaro", "Rosa"]}
              />
            </div>
            <div>
              <Dashboard
                load={load}
                text01={"LUCRO TOTAL"}
                icone01={<FaChartLine size={65} />}
                text02={"LUCRO POR UNIDADE"}
                icone02={<FaHandHoldingUsd size={65} />}
                text03={"TICKET MÉDIO"}
                icone03={<FaReceipt size={65} />}
                Total01={caixa?.margemLucroTotalPercent?.toFixed(2) + "%"}
                Total02={caixa?.lucroPorUnidadePercent?.toFixed(2) + "%"}
                Total03={caixaTicketMedio}
                color={["VerdeEscuro", "Cinza", "AzulEscuro"]}
              />
            </div>
          </Fade>
        </div>
      )}

      {openModalFecharCaixa && (
        <ModalYesOrNo
          text={"Deseja fechar o caixa ?!"}
          Cancelar={HandleAbrirModalFecharCaixa}
          Confirmar={FecharCaixa}
        />
      )}
    </>
  );
}

export default Financeiro;
