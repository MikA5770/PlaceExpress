import { createContext, ReactNode } from 'react';

interface IdContextProps {
  children: ReactNode;
  value: {fonction :(endroit :string) => void , id : string };
}

export const IdContext = createContext<{
  fonction: (endroit: string) => void;
  id: string;
}>({
  fonction: (endroit) => {
    console.log(`Default update function. Received endroit: ${endroit}`);
  },
  id: "",
});
export const IdProvider: React.FC<IdContextProps> = ({ children, value  }) => {

  return <IdContext.Provider value={value}>{children}</IdContext.Provider>;
};