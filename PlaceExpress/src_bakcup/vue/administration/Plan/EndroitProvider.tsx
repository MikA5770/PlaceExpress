import { createContext, ReactNode } from 'react';

interface EndroitContextProps {
  children: ReactNode;
  value: (endroit :string) => void ;
}

export const EndroitContext = createContext< (endroit :string) => void >(
  (endroit) => {
    console.log(`Default update function. Received endroit: ${endroit}`);
  
} );

export const EndroitProvider: React.FC<EndroitContextProps> = ({ children, value  }) => {

  return <EndroitContext.Provider value={value}>{children}</EndroitContext.Provider>;
};