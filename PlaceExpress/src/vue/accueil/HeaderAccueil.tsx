import {Link as RouterLink } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { Utilisateur } from '../../modele/DAO/Utilisateur';


export function HeaderAccueil(value : {visibility : boolean,setClick : (bol : boolean) => void , setVisibility : (bol : boolean) => void }){
  
  const utilisateur = new Utilisateur();
  const [user] = useAuthState(utilisateur.getAuth());

    return(
      


      <div className="accueil_presentation_header">
         
          {user ? (
              
              <div className="accueil_presentation_header_partieNav"
                onClick={() =>{value.setVisibility(true); value.setClick(true)} }
                style={{visibility : value.visibility ? "hidden" : "visible"}}
              ></div>
            
            
          ) : (
            <RouterLink to="/contact" className="accueil_presentation_header_partieUn"> Contact </RouterLink>
          )
        }
          <RouterLink to="/reserver" className="accueil_presentation_header_logo"> </RouterLink>
           {user ? (
              <a onClick={() => utilisateur.deconnexion()} className="accueil_presentation_header_partieTrois">
                Se deconnecter
              </a>
               ) : (
                <RouterLink to="/connexion" className="accueil_presentation_header_partieDeux"> Se connecter </RouterLink>
                )}
      </div>

    )
}