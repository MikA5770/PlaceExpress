import {Link as RouterLink } from 'react-router-dom';


export function Lien( valeur : {nom : string,chemin : string, actuel : boolean }){
    return(

        <RouterLink to={valeur.chemin} className={valeur.actuel ? "vert": "" }>
                <div>{valeur.nom}</div>
                {valeur.actuel ? <div className="header_bas_vert"></div> : ''}
        </RouterLink>
    )
}