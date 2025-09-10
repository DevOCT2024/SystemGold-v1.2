import React, { createContext, useContext, useState } from 'react';

const StampsContext = createContext();

export const StampsProvider = ({ children }) => {
  const [stampsKonva, setStampsKonva] = useState([]);

  return (
    <StampsContext.Provider value={{ stampsKonva, setStampsKonva }}>
      {children}
    </StampsContext.Provider>
  );
};

export const useStamps = () => {
  const context = useContext(StampsContext);
  if (!context) {
    throw new Error('useStamps must be used within a StampsProvider');
  }
  return context;
};
