import { createContext, useContext, useState } from "react";


const BoxContext = createContext();


export const BoxProvider = ({ children }) => {
  const [boxData, setBoxData] = useState([]);



  return (
    <BoxContext.Provider value={{ boxData, setBoxData }}>
      {children}
    </BoxContext.Provider>
  );
};


export const useBox = () => {
  const context = useContext(BoxContext);

  if (!context) {
    throw new Error("useBox must be used within a BoxProvider");
  }

  return context;
};
