import React, { useEffect, useState } from "react";
import "../../Scss/Table.scss";
import { FaMoneyBillWave, FaCircle } from "react-icons/fa";

import { db } from "../../Services/Firebase";
import { collection, onSnapshot } from "firebase/firestore";

import ModalPagamentos from "../Modals/ModalPagamentos";
import { toast } from "react-toastify";

function TableVendas() {
  const arrayTh = [
    "Inclusão",
    "Participante",
    "Quantidade",
    "Valor",
    "Média",
    "Situação",
    "Pagamento",
    "Cobrar",
  ];
  const [vendas, setVendas] = useState({});
  const [loadTable, setLoadTable] = useState(false);
  const [load, setLoad] = useState(true);
  const [open, setOpen] = useState(false);
  const [vendaUpdate, setVendaUpdate] = useState([]);

  const dataAtual = new Date();
  const dia = String(dataAtual.getDate()).padStart(2, "0");
  const mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
  const ano = dataAtual.getFullYear();
  const dataHoje = `${dia}/${mes}/${ano}`;

  function OpenModal(prop) {
    setOpen(!open);
    setVendaUpdate(prop);
  }
  useEffect(() => {
    const vendasRef = collection(db, "Movimentos");

    const unsubscribeVendas = onSnapshot(vendasRef, (snapshot) => {
      const vendasAgrupadas = {};

      snapshot.docs.forEach((venda) => {
        const vendaData = venda.data();
        const idVendaParticipante = vendaData.VendaParticipanteId;

        // Adiciona a validação da Situacao
        if (vendaData.Situacao !== 2) {
          if (!vendasAgrupadas[idVendaParticipante]) {
            vendasAgrupadas[idVendaParticipante] = {
              Participante: vendaData.Participante,
              Inclusao: [],
              VendaParticipanteId: vendaData.VendaParticipanteId,
              MovimentosIDs: [],
              FinanceiroIDs: [],
              QuantidadeVendida: 0,
              ValorUnidade: 0, // Inicializa com zero para acumular
              TotalVenda: 0,
              ValorPendenteDePagamento: vendaData.ValorPendenteDePagamento,
              Situacao: vendaData.Situacao,
              VendaAtrasada: false,
              Contato: vendaData.VendaParticipanteContato,
            };
          }

          // Adiciona apenas o ID da venda ao array de Vendas
          if (vendaData.MovimentoId) {
            vendasAgrupadas[idVendaParticipante].MovimentosIDs.push(
              vendaData.MovimentoId
            );
            vendasAgrupadas[idVendaParticipante].FinanceiroIDs.push(
              vendaData.FinanceiroId
            );

            vendasAgrupadas[idVendaParticipante].Inclusao.push(
              vendaData.Inclusao
            );
          }
          vendasAgrupadas[idVendaParticipante].Inclusao.sort(function (a, b) {
            // Converta as datas para o formato 'mm/dd/yyyy' para garantir uma comparação válida
            var dateA = new Date(a.split("/").reverse().join("/"));
            var dateB = new Date(b.split("/").reverse().join("/"));

            // Compare as datas
            return dateA - dateB;
          });
          // Atualiza as informações agrupadas {}
          vendasAgrupadas[idVendaParticipante].QuantidadeVendida +=
            vendaData.QuantidadeVendida;
          vendasAgrupadas[idVendaParticipante].TotalVenda +=
            vendaData.TotalVenda;
          vendasAgrupadas[idVendaParticipante].ValorUnidade +=
            vendaData.ValorUnidade;
        }
      });

      // Converte o objeto de volta para um array
      const listVendas = Object.values(vendasAgrupadas);

      listVendas.forEach((venda) => {
        const qtndVendida = venda.QuantidadeVendida;

        venda.ValorUnidade = parseFloat(
          (venda.TotalVenda / qtndVendida).toFixed(2)
        );

        // Armazena todas as datas de inclusão no campo Inclusao
        const lastInclusionDate = venda.Inclusao.slice(-1)[0];
        const lastInclusionDatae = venda.Inclusao[0];

        // Atualiza VendaAtrasada se a última data de inclusão for diferente de hoje
        venda.VendaAtrasada = lastInclusionDatae !== dataHoje;

        // Mostra apenas a última data de inclusão na tabela
        venda.Inclusao = lastInclusionDate;
      });

      setVendas(listVendas);
      setLoadTable(true);
      setLoad(false);
    });

    return () => unsubscribeVendas();
  }, []);

  function cobrarCliente(caloteiro) {
    if (!caloteiro.Contato) {
      return toast.error(
        caloteiro.Participante + " não tem número cadastrado ou valido!"
      );
    }

    const sendMessage = () => {
      const phoneNumber = `55${caloteiro.Contato}`;
      const message = `
  ➡ Detalhe da compra 
  
  Itens:
  ➡ ${caloteiro.QuantidadeVendida} x TRUFAS
      
  Forma de pagamento:
  💳 Pix
  (85) 98972-8250
  Banco Nubank : Guilherme Lima Costa

  Total: R$ ${caloteiro.TotalVenda}
  
  Obrigado pela preferência, se precisar de algo é só chamar!`;

      const url = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank");
    };

    sendMessage();
  }

  return (
    <div className="Container-Table">
      <div className="Container-Table-Section">
        <table className="Container-Table-Table">
          <thead>
            <tr>
              {arrayTh.map((th, index) => {
                return <th key={index}>{th}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {vendas && vendas.length > 0 ? (
              vendas
                .filter((venda) => venda.Situacao === 1)
                .sort((a, b) => a.Participante.localeCompare(b.Participante))
                .map((venda, index) => (
                  <tr key={index}>
                    <td>{venda.Inclusao}</td>
                    <td>{venda.Participante}</td>
                    <td>{venda.QuantidadeVendida}</td>
                    <td>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(venda.TotalVenda)}
                    </td>
                    <td>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(venda.ValorUnidade)}
                    </td>
                    <td>
                      {venda.VendaAtrasada === false ? (
                        <FaCircle color="green" />
                      ) : (
                        <FaCircle color="red" />
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          OpenModal(venda);
                        }}
                      >
                        Pagar
                      </button>
                    </td>
                    <td>
                      <button
                        className="Cobrar"
                        onClick={() => {
                          cobrarCliente(venda);
                        }}
                      >
                        <FaMoneyBillWave size={22} />
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5">Não tem nenhuma venda pendente</td>
              </tr>
            )}
          </tbody>
        </table>

        {open ? (
          <ModalPagamentos OpenModal={OpenModal} vendaUpdate={vendaUpdate} />
        ) : null}
      </div>
    </div>
  );
}

export default TableVendas;
