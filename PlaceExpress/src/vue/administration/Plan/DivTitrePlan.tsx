import { ReactNode } from 'react';

export function DivTitrePlan(value: {
    children: ReactNode;
    titre: string;
  }){

    return(
        <div className="administration_contenu_titreBouton">
                <div>{value.titre}</div>
                {value.children}
            </div>
    )
}