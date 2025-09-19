import React from "react";

const defaultValue = {
  stageSize: { width: 600, height: 800 },
  bgUrl: null,
  // no-ops para não quebrar se o Provider não envolver
  setStageSize: () => {},
  setBgUrl: () => {},
};

const StageConfigCtx = React.createContext(defaultValue);

export function StageConfigProvider({ children }) {
  const [stageSize, setStageSize] = React.useState({ width: 600, height: 800 });
  const [bgUrl, setBgUrl] = React.useState(null);

  const value = React.useMemo(
    () => ({ stageSize, setStageSize, bgUrl, setBgUrl }),
    [stageSize, bgUrl]
  );

  return <StageConfigCtx.Provider value={value}>{children}</StageConfigCtx.Provider>;
}

export function useStageConfig() {
  // agora NÃO lança erro; retorna defaultValue se estiver fora do Provider
  return React.useContext(StageConfigCtx);
}
