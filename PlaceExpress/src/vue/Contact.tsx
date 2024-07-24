import {Link as RouterLink } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { Utilisateur } from '../modele/DAO/Utilisateur';
import { useEffect, useState } from 'react';

import { PersonneDAO } from "../modele/DAO/PersonneDAO";
import { Footer } from './Footer';

export function Contact() {

    const utilisateur = new Utilisateur();
    
    const [user] = useAuthState(utilisateur.getAuth());


  const [visibility, setVisibility] = useState<boolean>(false);
  const [click, setClick] = useState<boolean>(false);
  
  const [admin, setAdmin] = useState(false);

  
  useEffect(() => { // Code à exécuter après chaque rendu 
    const personneDAO= new PersonneDAO()
    async function administrateur(){
        const estAdmin= await personneDAO.estAdministrateur(user!.uid)
        setAdmin(estAdmin);

    }
    administrateur();
  }, [user]);

    return (
      <>
      <div className="contact">
        {user ? (
          <div className="contact_presentation_navigation"
          style={{animation : visibility ? "arriver 0.7s 0s both" : click ? "enlever 0.7s 0s both" : ""}}>  
            <input type="button"  className="contact_presentation_navigation_bouton" 
              onClick={() =>setVisibility(false)}
            />
            <div  className="contact_presentation_navigation_navigation">
            <RouterLink to="/*" className="contact_presentation_navigation_navigation_endroit">
              Accueil
            </RouterLink>
            <RouterLink to="/mesBatiments" className="contact_presentation_navigation_navigation_endroit">
              Mes Batiments
            </RouterLink>
            <RouterLink to="/reserver" className="contact_presentation_navigation_navigation_endroit">
              Réserver une place
            </RouterLink>
            <RouterLink to="/mesReservations" className="contact_presentation_navigation_navigation_endroit">
              Mes Réservations
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
        ) :""
        }
        
        <div className="contact_presentation">
        <div className="contact_presentation_header">

          {user ? (
              
                <div className="contact_presentation_header_partieNav"
                  onClick={() =>{setVisibility(true); setClick(true)} }
                  style={{visibility : visibility ? "hidden" : "visible"}}
                ></div>
              
              
            ) : (
              <RouterLink to="/*" className="contact_presentation_header_partieUn"> Accueil </RouterLink>
            )
          }
          <RouterLink to="/*" className="contact_presentation_header_logo"> </RouterLink>
              {/* IMAGE DE LA PHOTO DE PROFIL AVEC DECONNECTION ET TOUT */}
           {user ? (
              <a onClick={() => utilisateur.deconnexion()} className="accueil_presentation_header_partieTrois">
                Se deconnecter
              </a>
               ) : (
                <RouterLink to="/connexion" className="contact_presentation_header_partieDeux"> Se connecter </RouterLink>
                )}
      
        </div>
        <div className="contact_presentation_slogan">Contact</div>
        </div>
        <div className="contact_defillement " >
          <div className="contact_defillement_animation" >
            Nous sommes ravis de vous accueillir et enthousiastes à l'idée de vous accompagner dans votre réservation de places.
          </div>
        </div>
        <div className="contact_collaborateur">
          <div className="contact_collaborateur_titre">
              Les collaborateurs
          </div>
          <div className="contact_collaborateur_lesCollaborateurs">
              <a className="contact_collaborateur_lesCollaborateurs_unCollaborateur" href='https://www.sfeir.com'>
                  <div className="contact_collaborateur_lesCollaborateurs_unCollaborateur_image sfeir">

                  </div>
                  <div className="contact_collaborateur_lesCollaborateurs_unCollaborateur_contenu">
                    <div className="contact_collaborateur_lesCollaborateurs_unCollaborateur_contenu_titre ">
                        SFEIR
                    </div>
                    <div className="contact_collaborateur_lesCollaborateurs_unCollaborateur_contenu_site ">
                        www.sfeir.com
                    </div>
                  </div>
              </a>
              <a className="contact_collaborateur_lesCollaborateurs_unCollaborateur" href='https://www.univ-lorraine.fr'>
                  <div className="contact_collaborateur_lesCollaborateurs_unCollaborateur_image univLorraine">
                  
                  </div>
                  <div className="contact_collaborateur_lesCollaborateurs_unCollaborateur_contenu">
                    <div className="contact_collaborateur_lesCollaborateurs_unCollaborateur_contenu_titre">
                        Université de Lorrainne
                    </div>
                    <div className="contact_collaborateur_lesCollaborateurs_unCollaborateur_contenu_site">
                        www.univ-lorraine.fr
                    </div>
                  </div>
              </a>
              <a className="contact_collaborateur_lesCollaborateurs_unCollaborateur" href='https://dptinfo.iutmetz.univ-lorraine.fr'>
                  <div className="contact_collaborateur_lesCollaborateurs_unCollaborateur_image dptInfo">
                  
                  </div>
                  <div className="contact_collaborateur_lesCollaborateurs_unCollaborateur_contenu">
                    <div className="contact_collaborateur_lesCollaborateurs_unCollaborateur_contenu_titre">
                      Département Informatique
                    </div>
                    <div className="contact_collaborateur_lesCollaborateurs_unCollaborateur_contenu_site">
                        dptinfo.iutmetz.univ-lorraine.fr
                    </div>
                  </div>
              </a>
          </div>

        </div>
        
        <div className='contact_tuteur'>
            <div className='contact_tuteur_titre'>
                Le tuteur de projet
            </div>
            <a className="contact_tuteur_card" href='https://www.linkedin.com/in/alex-ronin-126177112/?originalSubdomain=lu'>
                  <div className="contact_tuteur_card_photo">
                  
                  </div>
                  <div className="contact_tuteur_card_contenu">
                    <div className="contact_tuteur_card_contenu_titre">
                        Alex Ronin
                    </div>
                    <div className="contact_tuteur_card_contenu_site">Découvrir mon profil</div>
                  </div>
              </a>
        </div>
        
        <div className="contact_titre">
                Les développeurs
        </div>
        <div className="contact_lesImages" >
          <a className="contact_lesImages_uneImage rotateUn"
            >
            <div className="contact_lesImages_uneImage_image mikail">
              
            </div>
            <div className="contact_lesImages_uneImage_info">
                Er Mikail
            </div>
          </a>
          <a className="contact_lesImages_uneImage rotateDeux" 
            href='https://www.linkedin.com/in/thibault-kobler-5a7256293/'
            >
            <div className="contact_lesImages_uneImage_image thibault">
              
            </div>
            <div className="contact_lesImages_uneImage_info">
                Kobler Thibault
            </div>
          </a>
          <a className="contact_lesImages_uneImage rotateTrois"
            >
            <div className="contact_lesImages_uneImage_image alexis">
              
            </div>
            <div className="contact_lesImages_uneImage_info">
                Friderich Alexis
            </div>
          </a>
          <a className="contact_lesImages_uneImage rotateQuatre"
            >
            <div className="contact_lesImages_uneImage_image abdou">
              
            </div>
            <div className="contact_lesImages_uneImage_info">
                Abdourrahmanne Belmadani
            </div>
          </a>
      </div>
      <div className="contact_titre">
          Présentation de PlaceExpress
      </div>
      <div className="contact_poster">
          
      </div>
      </div>
      <Footer couleur='vert'/>

      </>
    )
  }
  