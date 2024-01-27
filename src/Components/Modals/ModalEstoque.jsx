import { useContext, useState, React } from "react";
import "../../Scss/ModalEstoque.scss";
import { MyContext } from "../../Context/Context";
import { db } from "../../Services/Firebase";
import { collection, doc, updateDoc } from "firebase/firestore";
import { FaTimes, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

function ModalEstoque({ estoque, setOpenModalIniciarValor }) {
  const [novoEstoque, setNovoEstoque] = useState("");
  function HandleFecharModal() {
    setOpenModalIniciarValor(false);
  }

  async function HandleEnviarEstoque() {
    const estoqueID = estoque[0].EstoqueId;

    if (novoEstoque > 0 && novoEstoque !== "") {
      try {
        const estoqueRefUpdate = doc(collection(db, "Estoque"), estoqueID);

        await updateDoc(estoqueRefUpdate, {
          EstoqueAtual: parseInt(novoEstoque),
          EstoqueInicial: parseInt(novoEstoque),
          QuantidadeVendida: 0,
          EstoqueStatus: true,
        });
        toast.success("Estoque atualizado com sucesso");
        HandleFecharModal();
      } catch (e) {
        console.error(e);
        toast.error("Erro ao atualizar estoque!");
      }
    } else {
      toast.error("Insira os dados ou insira uma quantidade maior que zero.");
    }
  }

  return (
    <div className="Container-ModalEstoque">
      <div className="Container-ModalEstoque-Section">
        <div className="Container-ModalEstoque-Section-input">
          <h1>Informe seu estoque inicial</h1>
          <input
            value={novoEstoque}
            type="number"
            placeholder="Digite o valor inicial"
            onChange={(e) => {
              setNovoEstoque(e.target.value);
            }}
          />
        </div>

        <div className="Container-ModalEstoque-Section-button">
          <button className="button_close" onClick={HandleFecharModal}>
            Cancelar <FaTimes />
          </button>
          <button className="button_confirm" onClick={HandleEnviarEstoque}>
            Confirmar <FaCheck />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEstoque;
