import { useAuthState } from "react-firebase-hooks/auth";
import { Utilisateur } from "../../modele/DAO/Utilisateur";
import {Link as RouterLink } from 'react-router-dom';
import { useEffect, useState } from "react";
import { PersonneDAO } from "../../modele/DAO/PersonneDAO";

export function DivNavigation(value : {visibility : boolean,click : boolean, setVisibility : (bol : boolean) => void }){


    const utilisateur = new Utilisateur();
    const [user] = useAuthState(utilisateur.getAuth());
  
    const [admin, setAdmin] = useState(false);

  
  useEffect(() => { // Code à exécuter après chaque rendu 
    const personneDAO= new PersonneDAO()
    async function administrateur(){
        const estAdmin= await personneDAO.estAdministrateur(user!.uid)
        setAdmin(estAdmin);

    }
    administrateur();
  }, [user]);

    return(
        <>
        {user ? (
            <div className="contact_presentation_navigation"
            style={{animation : value.visibility ? "arriver 0.7s 0s both" : value.click ? "enlever 0.7s 0s both" : ""}}>  
              <input type="button"  className="contact_presentation_navigation_bouton" 
                onClick={() =>value.setVisibility(false)}
              />
              <div  className="contact_presentation_navigation_navigation accueil_presentation_navigation">
              <RouterLink to="/reserver" className="contact_presentation_navigation_navigation_endroit">
                Réserver une place
              </RouterLink>
              <RouterLink to="/mesBatiments" className="contact_presentation_navigation_navigation_endroit">
                Mes Batiments
              </RouterLink>
              <RouterLink to="/mesReservations" className="contact_presentation_navigation_navigation_endroit">
                Mes Réservations
              </RouterLink>
              <RouterLink to="/contact" className="contact_presentation_navigation_navigation_endroit">
                Contact
              </RouterLink>
              { admin ?
                  <RouterLink to="/administration" className="contact_presentation_navigation_navigation_endroit">
                    Administration
                  </RouterLink>
               :
                  ""
               }
              </div>
            </div>
          ) : <></>
          }
          </>
    )
    
  
  }