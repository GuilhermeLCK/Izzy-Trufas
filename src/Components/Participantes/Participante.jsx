import { React, useState, useEffect } from "react";
import { db } from "../../Services/Firebase";
import BeatLoader from "react-spinners/BeatLoader";

import {
  doc,
  setDoc,
  collection,
  addDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { FaPlus, FaPlay, FaUserCircle, FaTrashAlt } from "react-icons/fa";
import "../../Scss/ParticipanteComponent.scss";
import { toast } from "react-toastify";

import ModalYesOrNo from "../Modals/ModalYesOrNo";

function Participante() {
  const [participantesNew, setParticipantesNew] = useState("");
  const [load, setLoad] = useState(true);
  const [participantesList, setParticipantesList] = useState([]);
  const [participanteInput, setParticipanteInput] = useState("");

  const [participanteDelet, setParticipanteDelet] = useState([]);

  const [openModalNewParticipante, setOpenModalNewParticipante] =
    useState(false);

  const [openModalDeleteParticipante, setOpenModalDeleteParticipante] =
    useState(false);

  const arrayTh = ["Id", "Inclusão", "Nome", ""];

  async function CriarParticipante(e) {
    e.preventDefault();

    const result = participantesList.find(
      (result) =>
        result.Nome.toLowerCase().trim() ===
        participantesNew.toLowerCase().trim()
    );

    console.log(participantesNew.toLowerCase().trim());

    if (result) {
      toast.error(
        `Referência de objeto não definida para uma instância de um objeto! ERROR[${participantesNew}]já existe!`
      );
      return;
    }

    try {
      const participantesCollectionRef = collection(db, "Participantes");

      if (!participantesNew) {
        toast.error(
          "Referência de objeto não definida para uma instância de um objeto! [ERROR:PARTICIPANTE NULL]"
        );

        return;
      }

      const dataAtual = new Date();
      // Obtém o dia, mês e ano
      const dia = String(dataAtual.getDate()).padStart(2, "0");
      const mes = String(dataAtual.getMonth() + 1).padStart(2, "0"); // Lembre-se que os meses são baseados em zero
      const ano = dataAtual.getFullYear();
      // Formata a data no formato desejado (DD/MM/AAAA)
      const dataFormatada = `${dia}/${mes}/${ano}`;

      const novoParticipante = {
        Nome: participantesNew,
        Inclusao: dataFormatada,
      };

      const newDocRefParticipante = await addDoc(participantesCollectionRef, {
        ...novoParticipante,
      });

      const newDocRefParticipanteId = newDocRefParticipante.id;

      const docRefParticipante = doc(
        participantesCollectionRef,
        newDocRefParticipanteId
      );

      await updateDoc(docRefParticipante, {
        ParticipanteId: newDocRefParticipanteId,
      });

      setParticipantesNew("");
      toast.success("Cadastrado com sucesso");
      HandleAbrirModalCriarParticipante();
    } catch (error) {
      console.error("Erro ao adicionar participantes:", error);
      toast.error(
        "Referência de objeto não definida para uma instância de um objeto! ERROR[FIREBASE]"
      );
    }
  }

  useEffect(() => {
    const participantesCollectionRef = collection(db, "Participantes");

    const chamarParticipantes = onSnapshot(
      participantesCollectionRef,
      (snapshot) => {
        const listParticipantes = snapshot.docs.map((doc) => {
          const partiData = doc.data();

          return {
            Nome: partiData.Nome,
            Inclusao: partiData.Inclusao,
            ParticipanteId: partiData.ParticipanteId,
          };
        });
        setParticipantesList(listParticipantes);
        setLoad(false);
      }
    );
    return () => chamarParticipantes();
  }, []);

  async function DeletarParticipante() {
    await deleteDoc(doc(db, "Participantes", participanteDelet[0]))
      .then(() => {
        HandleAbrirModalDeletarParticipante();
        toast.success("Deletado com sucesso");
        setParticipanteDelet([]);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function HandleAbrirModalCriarParticipante() {
    setOpenModalNewParticipante(!openModalNewParticipante);
  }

  function HandleAbrirModalDeletarParticipante(Id, Nome) {
    setOpenModalDeleteParticipante(!openModalDeleteParticipante);

    setParticipanteDelet([Id, Nome]);
  }

  return (
    <div className="Container-ParticipanteComponent">
      <div className="Container-ParticipanteComponent-Section">
        <button onClick={HandleAbrirModalCriarParticipante}>
          Novo <FaPlus />
        </button>
      </div>

      <div className="Container-ParticipanteComponent-Section-ExibirList">
        <input
          placeholder="Busca um participante"
          type="text"
          value={participanteInput}
          onChange={(e) => {
            setParticipanteInput(e.target.value.toLowerCase());
          }}
        />
        {load ? (
          <BeatLoader color="#000000" size={12} />
        ) : (
          <table className="Container-Participantes-Table">
            <thead>
              <tr>
                {arrayTh.map((th, index) => {
                  return <th key={index}>{th}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {participantesList.length > 0 ? (
                participantesList
                  .sort((a, b) => a.Nome.localeCompare(b.Nome))
                  .filter((item) =>
                    item.Nome.toLowerCase().includes(participanteInput)
                  )
                  .map((participante, index) => (
                    <tr key={index}>
                      <td>{participante.ParticipanteId}</td>
                      <td>{participante.Inclusao}</td>
                      <td>{participante.Nome}</td>
                      <td>
                        <button
                          onClick={() => {
                            HandleAbrirModalDeletarParticipante(
                              participante.ParticipanteId,
                              participante.Nome
                            );
                          }}
                        >
                          Excluir
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="4">
                    Não tem nenhum participante cadastrado ...
                  </td>
                </tr>
              )}
            </tbody>

            <tbody></tbody>
          </table>
        )}
      </div>

      {openModalNewParticipante && (
        <div className="Container-ParticipanteComponent-Section-New">
          <div className="Container-ParticipanteComponent-Section-New-Modal">
            <h1>Criar novo participante</h1>
            <div className="Container-ParticipanteComponent-Section-New-Modal-Input">
              <form onSubmit={CriarParticipante}>
                <input
                  onChange={(e) => {
                    setParticipantesNew(e.target.value);
                  }}
                  value={participantesNew.value}
                  type="text"
                  placeholder="Digite o nome do novo participante"
                />
                <button type="submit">Salvar</button>
                <button
                  onClick={HandleAbrirModalCriarParticipante}
                  className="button_close"
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {openModalDeleteParticipante && (
        <ModalYesOrNo
          text={`Deseja deletar o participante ${participanteDelet[1]} ?! `}
          Cancelar={HandleAbrirModalDeletarParticipante}
          Confirmar={DeletarParticipante}
        />
      )}
    </div>
  );
}

export default Participante;