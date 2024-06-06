import React, { useContext, useEffect, useState, useRef } from "react";
import { db } from "../../Services/Firebase";
import { toast } from "react-toastify";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import "../../Scss/InputsVendas.scss";

import { FaPlus } from "react-icons/fa";

function InputsVendas() {
  const [participantes, setParticipantes] = useState();
  const [participanteSelecionado, setParticipanteSelecionado] = useState("");
  const [participantesNew, setParticipantesNew] = useState([]);
  const [quantidade, setQuantidade] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  //const [valorUnidade, setValorUnidade] = useState(3.33);
  let valorUnidade = 3.5;
  const valorUnidadeDesconto = 2.5;

  // 1 = pendente
  // 2 = pago
  // 3 = atrasado

  useEffect(() => {
    const ParticipantesRef = collection(db, "Participantes");

    const BuscarParticipantes = onSnapshot(ParticipantesRef, (snapshot) => {
      const listaParticipantes = snapshot.docs.map((participantes) => {
        const list_participantes = participantes.data();

        return {
          Nome: list_participantes?.Nome,
          ParticipanteId: list_participantes?.ParticipanteId,
        };
      });

      setParticipantes(listaParticipantes);
    });
  }, []);

  const CriarNovaVenda = async (e) => {
    e.preventDefault();

    const participanteSelecionadoMinusculo =
      participanteSelecionado.toLowerCase();

    const partSelecionado = participantes.find((participante) => {
      return (
        participante.Nome.toLowerCase() === participanteSelecionadoMinusculo
      );
    });

    const estoque = [];
    const isValEstoqueIdRef = collection(db, "Estoque");

    const quantidadeparseInt = parseInt(quantidade);

    try {
      if (quantidadeparseInt > 0) {
        if (!partSelecionado) {
          toast.error(
            `Participante ${participanteSelecionado} não existe, cadastre um novo participante! `
          );
          return;
        }

        try {
          const querySnapshot = await getDocs(isValEstoqueIdRef);

          querySnapshot.forEach((estoqueDoc) => {
            const list_estoque = estoqueDoc.data();

            estoque.push({
              EstoqueAtual: list_estoque.EstoqueAtual,
              EstoqueInicial: list_estoque.EstoqueInicial,
              QuantidadeVendida: list_estoque.QuantidadeVendida,
              EstoqueId: list_estoque.EstoqueId,
            });
          });

          if (
            quantidade > estoque[0].EstoqueAtual ||
            estoque[0].EstoqueAtual == 0
          ) {
            toast.error(
              "Referência de objeto não definida para uma instância de um objeto! [ERROR: ESTOQUE ZERO!]"
            );
            return;
          }
        } catch (error) {
          console.error("Erro ao obter dados do estoque:", error);
        }

        const vendasCollectionRef = collection(db, "Movimentos");
        const financeiroCollectionRef = collection(db, "Financeiro");
        const dataAtual = new Date();
        // Obtém o dia, mês e ano
        const dia = String(dataAtual.getDate()).padStart(2, "0");
        const mes = String(dataAtual.getMonth() + 1).padStart(2, "0"); // Lembre-se que os meses são baseados em zero
        const ano = dataAtual.getFullYear();
        // Formata a data no formato desejado (DD/MM/AAAA)
        const dataFormatada = `${dia}/${mes}/${ano}`;

        let novaVendaCriacaoFinanceiro;
        let novaVenda;

        if (quantidade % 3 === 0) {
          const totalVenda = (quantidade / 3) * 10; // Cada grupo de 3 unidades custa 10 reais
          const valorUnidade = totalVenda / quantidade; // Calcula o valor por unidade

          const novaVendaLet = {
            Participante: partSelecionado.Nome,
            Inclusao: dataFormatada,
            VendaParticipanteId: partSelecionado.ParticipanteId,
            QuantidadeVendida: parseInt(quantidade),
            ValorUnidade: valorUnidade,
            TotalVenda: totalVenda,
            ValorPendenteDePagamento: totalVenda,
            Situacao: 1,
          };

          const novaVendaCriacaoFinanceiroLet = {
            TotalVenda: 10,
            Inclusao: dataFormatada,
            VendaParticipanteId: partSelecionado.ParticipanteId,
            QuantidadeVendida: parseInt(quantidade),
            ValorUnidade: valorUnidade,
            TotalVenda: totalVenda,
            ValorPendenteDePagamento: totalVenda,
            Situacao: 1,
          };

          novaVendaCriacaoFinanceiro = novaVendaCriacaoFinanceiroLet;
          novaVenda = novaVendaLet;
        } else {
          const novaVendaLet = {
            Participante: partSelecionado.Nome,
            Inclusao: dataFormatada,
            VendaParticipanteId: partSelecionado.ParticipanteId,
            QuantidadeVendida: parseInt(quantidade),
            ValorUnidade: valorUnidade,
            TotalVenda: valorUnidade * quantidade,

            ValorPendenteDePagamento: valorUnidade * quantidade,
            Situacao: 1,
          };

          const novaVendaCriacaoFinanceiroLet = {
            TotalVenda: valorUnidade * quantidade,
            ValorPendenteDePagamento: valorUnidade * quantidade,

            Inclusao: dataFormatada,
            VendaParticipanteId: partSelecionado.ParticipanteId,
            QuantidadeVendida: parseInt(quantidade),
            ValorUnidade: valorUnidade,
            Situacao: 1,
          };

          novaVendaCriacaoFinanceiro = novaVendaCriacaoFinanceiroLet;
          novaVenda = novaVendaLet;
        }

        const newDocRef = await addDoc(vendasCollectionRef, {
          ...novaVenda,
        });

        const newDocRefFinanceiro = await addDoc(financeiroCollectionRef, {
          ...novaVendaCriacaoFinanceiro,
        });

        const VendaId = newDocRef.id;

        const FinancaId = newDocRefFinanceiro.id;
        // Atualiza os documentos com os IDs relacionados
        await updateDoc(newDocRef, {
          MovimentoId: VendaId,
          FinanceiroId: FinancaId,
        });

        await updateDoc(newDocRefFinanceiro, {
          MovimentoId: VendaId,
          FinanceiroId: FinancaId,
        });

        const novoEstoque = estoque[0].EstoqueAtual - quantidade;
        await updateDoc(doc(db, "Estoque", estoque[0].EstoqueId), {
          EstoqueAtual: novoEstoque,
          QuantidadeVendida: estoque[0].QuantidadeVendida + quantidade * 1,
        });

        setParticipanteSelecionado("");
        setQuantidade("");
        toast.success("Venda realizada com sucesso!");
      } else {
        toast.error(
          "Referência de objeto não definida para uma instância de um objeto! [ERROR: INSIRA UM VALOR MAIOR QUE ZERO!]"
        );
      }
    } catch (error) {
      toast.error(
        "Referência de objeto não definida para uma instância de um objeto! [ERROR:FIREBASE]"
      );
    }
  };
  const handleSearch = (e) => {
    const term = e.target.value;
    setParticipanteSelecionado(term);
    const filteredItems = participantes.filter((item) =>
      item.Nome.toLowerCase().includes(term.toLowerCase())
    );

    setParticipantesNew(filteredItems);
  };

  const handleInputClick = () => {
    setParticipantesNew(participantes);
    setShowResults(true);
  };
  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowResults(false);
    }, [250]);
  };

  const handleSelecionarParticipante = (itemNome) => {
    setParticipanteSelecionado(itemNome);
  };

  return (
    <div className="Container-InputsVendas">
      <div className="Container-InputsVendas-Form">
        <div className="Container-InputsVendas-Form-Section">
          <form onSubmit={CriarNovaVenda}>
            <input
              onClick={handleInputClick}
              value={participanteSelecionado}
              type="text"
              onChange={handleSearch}
              onBlur={handleSearchBlur}
              placeholder="Busque o participante"
            />

            <div
              className="combox-div"
              style={{ display: showResults ? "block" : "none" }}
            >
              {participantesNew.length > 0 ? (
                participantesNew
                  .sort((a, b) => a.Nome.localeCompare(b.Nome))
                  .map((item) => (
                    <p
                      key={item.participanteId}
                      onClick={() => handleSelecionarParticipante(item.Nome)}
                    >
                      {item.Nome}
                    </p>
                  ))
              ) : (
                <p className="Nenhum">Nenhum participante encontrado ...</p>
              )}
            </div>

            <input
              type="number"
              value={quantidade}
              onChange={(event) => {
                setQuantidade(event.target.value);
              }}
              placeholder="Digite a quantidade"
            />

            <button type="submit">
              Novo <FaPlus />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InputsVendas;
