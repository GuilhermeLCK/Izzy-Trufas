import { useContext, useState, React, useEffect } from "react";
import "../../Scss/ModalPagamentos.scss";
import { FaTimes } from "react-icons/fa";

import {
  FaCheckDouble,
  FaPercent,
  FaArrowRight,
  FaCircle,
} from "react-icons/fa";
import ModalYesOrNo from "./ModalYesOrNo";

import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../Services/Firebase";
import { ToastContainer, toast } from "react-toastify";

function ModalPagamentos({ OpenModal, vendaUpdate }) {
  const [VendasUpdatePagamento, setVendasUpdatePagamento] = useState([]);
  const [openModalDesconto, setOpenModalDesconto] = useState(false);
  const [openModalPagamentoUnidade, setOpenModalPagamentoUnidade] =
    useState(false);
  const [openModalPagamentoCompleto, setOpenModalPagamentoCompleto] =
    useState(false);
  const [propsModalDesconto, setPropsModalDesconto] = useState([]);
  const [propsModalPagamentoUnidade, setPropsModalPagamentoUnidade] = useState(
    []
  );

  const [openYes, setOpenYes] = useState(false);
  const valorUnidadeDesconto = 2.5;

  const [propsFuncao, setPropsFuncao] = useState([]);
  const arrayTh = [
    "Venda Id",
    "Participante",
    "Inclusao",
    "Quantidade",
    "Valor da Unidade",
    "Total",
    "Situação",
    "Desconto",
    "Pagamentos",
  ];
  const dataAtual = new Date();
  const dia = String(dataAtual.getDate()).padStart(2, "0");
  const mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
  const ano = dataAtual.getFullYear();
  const dataHoje = `${dia}/${mes}/${ano}`;

  useEffect(() => {
    const fetchData = async () => {
      const MovimentosID = [...vendaUpdate.MovimentosIDs];
      const movimentosCollection = collection(db, "Movimentos");

      const unsubscribe = onSnapshot(
        movimentosCollection,
        (movimentosSnapshot) => {
          const movimentosList = movimentosSnapshot.docs
            .filter((mov) => MovimentosID.includes(mov.id))
            .map((mov) => {
              const movimentosData = mov.data();
              return {
                Participante: movimentosData.Participante,
                Inclusao: movimentosData.Inclusao,
                VendaParticipanteId: movimentosData.VendaParticipanteId,
                QuantidadeVendida: movimentosData.QuantidadeVendida,
                ValorUnidade: movimentosData.ValorUnidade,
                TotalVenda: movimentosData.TotalVenda,
                TotalPago: movimentosData.TotalPago,
                ValorPendenteDePagamento:
                  movimentosData.ValorPendenteDePagamento,
                Situacao: movimentosData.Situacao,
                MovimentoID: movimentosData.MovimentoId,
                FinanceiroId: movimentosData.FinanceiroId,
              };
            });

          movimentosList.forEach((movimentosList) => {
            if (movimentosList.Inclusao !== dataHoje) {
              movimentosList.VendaAtrasada = true;
            } else {
              movimentosList.VendaAtrasada = false;
            }
          });

          setVendasUpdatePagamento(movimentosList);
        }
      );

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  async function PagarVendaSeparado() {
    try {
      const IdsMovimentos = propsModalPagamentoUnidade[0];
      const IdsFinanceiros = propsModalPagamentoUnidade[1];

      const vendaRefMovimentos = doc(
        collection(db, "Movimentos"),
        IdsMovimentos
      );

      await updateDoc(vendaRefMovimentos, {
        Situacao: 2,
        ValorPendenteDePagamento: 0,
        VendaAtrasada: false,
      });

      const vendaRefFinanceiro = doc(
        collection(db, "Financeiro"),
        IdsFinanceiros
      );

      await updateDoc(vendaRefFinanceiro, {
        Situacao: 2,
        ValorPendenteDePagamento: 0,
        VendaAtrasada: false,
      });

      toast.success("Pagamento efetuado com sucesso!");
      setOpenModalPagamentoUnidade(!openModalPagamentoUnidade);

      console.log(vendaUpdate.MovimentosIDs.length);

      console.log(vendaUpdate);
      if (
        vendaUpdate.MovimentosIDs.length == 0 ||
        vendaUpdate.MovimentosIDs.length == 1
      ) {
        OpenModal();
      }
    } catch (error) {
      console.error("Erro ao pagar as venda:", error);
      toast.error(
        "Referência de objeto não definida para uma instância de um objeto! [ERROR:FIREBASE]"
      );
    }
  }

  async function DescontoVenda() {
    try {
      const IdsMovimentos = propsModalDesconto[0];
      const IdsFinanceiros = propsModalDesconto[1];
      const Quantidade = propsModalDesconto[2];

      const vendaRefMovimentos = doc(
        collection(db, "Movimentos"),
        IdsMovimentos
      );

      await updateDoc(vendaRefMovimentos, {
        ValorUnidade: valorUnidadeDesconto,
        TotalVenda: parseFloat(valorUnidadeDesconto * Quantidade),
        ValorPendenteDePagamento: parseFloat(valorUnidadeDesconto * Quantidade),
      });

      const vendaRefFinanceiro = doc(
        collection(db, "Financeiro"),
        IdsFinanceiros
      );

      await updateDoc(vendaRefFinanceiro, {
        ValorUnidade: valorUnidadeDesconto,
        TotalVenda: parseFloat(valorUnidadeDesconto * Quantidade),
        ValorPendenteDePagamento: parseFloat(valorUnidadeDesconto * Quantidade),
      });

      toast.success("Desconto aplicado  com sucesso!");
      setOpenModalDesconto(!openModalDesconto);
    } catch (error) {
      console.error("Erro ao aplicar desconto:", error);
      toast.error(
        "Referência de objeto não definida para uma instância de um objeto! [ERROR:FIREBASE _ PAGAR VENDA]"
      );
    }
  }

  async function PagarVendaCompleta() {
    try {
      // Supondo que VendasIDs seja uma lista de IDs que você deseja atualizar
      const IdsMovimentos = vendaUpdate.MovimentosIDs; // Sem a necessidade de colchetes adicionais
      const IdsFinanceiros = vendaUpdate.FinanceiroIDs; // Sem a necessidade de colchetes adicionais

      // Itera sobre cada ID de venda e realiza a atualização
      for (const IdVenda of IdsMovimentos) {
        const vendaRef = doc(collection(db, "Movimentos"), IdVenda);

        await updateDoc(vendaRef, {
          Situacao: 2,
          ValorPendenteDePagamento: 0,
          VendaAtrasada: false,
        });
      }

      for (const IdFinanceiro of IdsFinanceiros) {
        const vendaRef = doc(collection(db, "Financeiro"), IdFinanceiro);

        await updateDoc(vendaRef, {
          Situacao: 2,
          ValorPendenteDePagamento: 0,
          VendaAtrasada: false,
        });
      }
      OpenModal();
      toast.success("Pagamento em lote efetuado com sucesso!");
    } catch (error) {
      console.error("Erro ao pagar as vendas:", error);
      toast.error(
        "Referência de objeto não definida para uma instância de um objeto! [ERROR:FIREBASE] _ PAGAR VENDAs"
      );
    }
  }

  function HandleModalDesconto(
    vendaMovimentoID,
    vendaFinanceiroId,
    vendaQuantidadeVendida
  ) {
    setOpenModalDesconto(!openModalDesconto);

    setPropsModalDesconto([
      vendaMovimentoID,
      vendaFinanceiroId,
      vendaQuantidadeVendida,
    ]);
  }

  function HandleModalPagamentoUnidade(vendaMovimentoID, vendaFinanceiroId) {
    setOpenModalPagamentoUnidade(!openModalPagamentoUnidade);

    setPropsModalPagamentoUnidade([vendaMovimentoID, vendaFinanceiroId]);
  }

  function HandleModalPagamentoCompleto() {
    setOpenModalPagamentoCompleto(!openModalPagamentoCompleto);
  }

  return (
    <>
      <div className="container-modalPagamento">
        <div className="container-modalPagamento-section">
          <h2>RECEBER CONTAS</h2>

          <table>
            <thead>
              <tr>
                {arrayTh.map((th, index) => {
                  return <th key={index}>{th}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {VendasUpdatePagamento && VendasUpdatePagamento.length > 0
                ? VendasUpdatePagamento.filter((venda) => venda.Situacao === 1)
                    .sort((a, b) => {
                      const dateA = a.Inclusao.split("/").reverse().join("");
                      const dateB = b.Inclusao.split("/").reverse().join("");
                      return dateB.localeCompare(dateA);
                    })
                    .map((venda, index) => (
                      <tr key={index}>
                        <td>{venda.MovimentoID}</td>
                        <td>{venda.Participante}</td>
                        <td>{venda.Inclusao}</td>
                        <td>{venda.QuantidadeVendida}</td>
                        <td>
                          {" "}
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(venda.ValorUnidade)}
                        </td>
                        <td>
                          {" "}
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(venda.TotalVenda)}
                        </td>
                        <td>
                          {venda.VendaAtrasada === true ? (
                            <FaCircle color="red" />
                          ) : (
                            <FaCircle color="green" />
                          )}
                        </td>
                        <td>
                          <button
                            className="Desc"
                            onClick={() => {
                              HandleModalDesconto(
                                venda.MovimentoID,
                                venda.FinanceiroId,
                                venda.QuantidadeVendida
                              );
                            }}
                          >
                            <FaPercent />
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              HandleModalPagamentoUnidade(
                                venda.MovimentoID,
                                venda.FinanceiroId
                              );
                            }}
                          >
                            <FaCheckDouble />
                          </button>
                        </td>
                      </tr>
                    ))
                : null}
            </tbody>
          </table>

          <div className="container-modalPagamento-section-btn">
            <button onClick={OpenModal} className="button_cancelar">
              Cancelar <FaTimes />
            </button>
            <button
              onClick={HandleModalPagamentoCompleto}
              className="button_pagar"
            >
              Pagar em Lote <FaArrowRight />
            </button>
          </div>
        </div>
      </div>

      <>
        {openModalDesconto ? (
          <ModalYesOrNo
            text={"Confirmar o desconto ?!"}
            Cancelar={HandleModalDesconto}
            Confirmar={DescontoVenda}
          />
        ) : null}

        {openModalPagamentoUnidade ? (
          <ModalYesOrNo
            text={"Confirmar o pagamento ?!"}
            Cancelar={HandleModalPagamentoUnidade}
            Confirmar={PagarVendaSeparado}
          />
        ) : null}

        {openModalPagamentoCompleto ? (
          <ModalYesOrNo
            text={"Confirmar o pagamento completo ?!"}
            Cancelar={HandleModalPagamentoCompleto}
            Confirmar={PagarVendaCompleta}
          />
        ) : null}
      </>
    </>
  );
}

export default ModalPagamentos;
