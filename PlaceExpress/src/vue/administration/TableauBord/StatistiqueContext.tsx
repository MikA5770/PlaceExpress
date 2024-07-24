import { createContext, ReactNode } from 'react';

interface StatistiqueContextProps {
  children: ReactNode;
  value: {type:string, id:string};
}

export const StatistiqueContext = createContext<{type:string, id:string}>({type:"", id:""});

export const StatistiqueProvider: React.FC<StatistiqueContextProps> = ({ children, value }) => {

  return <StatistiqueContext.Provider value={value}>{children}</StatistiqueContext.Provider>;
};