import {Link as RouterLink } from 'react-router-dom';

export function LienAvecPhoto( valeur : {nom : string, source :string,chemin:string , actuel : boolean}){
    return(
        <RouterLink to={valeur.chemin} className={valeur.actuel ? "vert header_haut_element": "header_haut_element" }>
            <img src={`../src/style/image/${valeur.source}`} alt="Description de l'image" />
            <div>{valeur.nom}</div>
        </RouterLink>
    )
}