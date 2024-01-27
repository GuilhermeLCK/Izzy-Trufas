import React, { createContext, useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { db } from "../Services/Firebase";
import {
  addDoc,
  collection,
  getDoc,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
  setDoc,
  deleteField,
  deleteDoc,
} from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";
export const MyContext = createContext({});

export const ContextProvider = ({ children }) => {
  // Geral
  const [moduloAtual, setModuloAtual] = useState("");

  return (
    <MyContext.Provider
      value={{
        moduloAtual,
        setModuloAtual,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
