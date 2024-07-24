import {Link as RouterLink } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { Utilisateur } from '../../modele/DAO/Utilisateur';

export function HeaderAccueil(){
  
  const utilisateur = new Utilisateur();
  const [user] = useAuthState(utilisateur.getAuth());

    return(
      <div className="accueil_presentation_header">
          <RouterLink to="/contact" className="accueil_presentation_header_partieUn"> Contact </RouterLink>
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