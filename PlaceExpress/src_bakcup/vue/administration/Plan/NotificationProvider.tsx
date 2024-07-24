import { createContext, ReactNode } from 'react';

interface NotifContextProps {
  children: ReactNode;
  value: (titre :string,contenu : string) => void  ;
}

export const NotifContext = createContext<(titre: string ,contenu : string ) => void
>( (titre,contenu) => {
    console.log(`Default update function. Received endroit: ${titre} ${contenu}`);
  });

export const NotifProvider: React.FC<NotifContextProps> = ({ children, value  }) => {

  return <NotifContext.Provider value={value}>{children}</NotifContext.Provider>;
};