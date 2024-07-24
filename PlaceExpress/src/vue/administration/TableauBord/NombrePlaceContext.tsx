import { createContext, ReactNode } from 'react';

interface NombrePlaceContextProps {
  children: ReactNode;
  value: number;
}

export const NombrePlaceContext = createContext<number>(0);

export const NombrePlaceProvider: React.FC<NombrePlaceContextProps> = ({ children, value }) => {

  return <NombrePlaceContext.Provider value={value}>{children}</NombrePlaceContext.Provider>;
};