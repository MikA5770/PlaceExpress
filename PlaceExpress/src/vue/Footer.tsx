import { Link } from 'react-router-dom';
import { Utilisateur } from '../modele/DAO/Utilisateur';
import { useAuthState } from 'react-firebase-hooks/auth';

export function Footer(value : {couleur : string}) {

  const utilisateur = new Utilisateur();
  const [user] = useAuthState(utilisateur.getAuth());


  const scrollToTop = () => {
    window.scrollTo({
        top: 0,
    });
}

  return (
    <div className="footer"
    style={{backgroundColor : value.couleur==="vert" ? "#7B914D" : "#A99063" }}
    >
        <div className="footer_gauche">
            <div className="footer_partie footer_navigation">
              <div className="footer_partie_titre">
                Navigation
              </div>
              <Link  to="*"className="footer_partie_lien" onClick={scrollToTop}>
                • Accueil
              </Link>
              <Link to="/reserver"className="footer_partie_lien" onClick={scrollToTop}>
                • Réserver
              </Link>
              <Link to="/mesReservations" className="footer_partie_lien" onClick={scrollToTop}>
                • Mes Réservations
              </Link>
              <Link to="/mesBatiments" className="footer_partie_lien" onClick={scrollToTop}>
                • Mes Batiments
              </Link>
              <Link to="/monCompte" className="footer_partie_lien" onClick={scrollToTop}>
                • Gérer mon compte
              </Link>
            </div>
            <div className="footer_partie footer_gestion">
              <div className="footer_partie_titre">
                Gestion
              </div>
              <Link to="/administration" className="footer_partie_lien" onClick={scrollToTop}>
                • Administration
              </Link>
              {user ?
                  (<Link to="/*" className="footer_partie_lien" onClick={()=> {scrollToTop() ; utilisateur.deconnexion() }}>
                  • Déconnexion
                </Link>)

                 : (<Link to="/connexion" className="footer_partie_lien" onClick={scrollToTop}>
                  • Connexion
                </Link>)}
            </div>
        </div>
        <div className="footer_centre">
          <a className="footer_centre_logo footer_centre_iut" href='https://dptinfo.iutmetz.univ-lorraine.fr'>
          </a>
          <a className="footer_centre_logo footer_centre_univ" href='https://www.univ-lorraine.fr'>
          </a>
          <a className="footer_centre_logo footer_centre_sfeir" href='https://www.sfeir.com'>
          </a>
        </div>
        <div className="footer_droite">
            <div className="footer_droite_partie">
              <div className="footer_partie_titre">
              À Savoir
              </div>
              <Link to="/contact" className="footer_partie_lien" onClick={scrollToTop}>
                • Contact
              </Link>
              <Link to="/mentionsLegales" className="footer_partie_lien" onClick={scrollToTop}>
                • Mentions Légales
              </Link>
            </div>
            <div className="footer_developpement">
              <div className="footer_partie_titre">
                Les Développeurs
              </div>
              <div className="footer_partie_developpeur" >
                • Er Mikail
              </div>
              <div className="footer_partie_developpeur">
                • Friderich Alexis
              </div>
              <a className="footer_partie_developpeur"  href='https://www.linkedin.com/in/thibault-kobler-5a7256293/'>
                • Kobler Thibault
              </a>
              <div className="footer_partie_developpeur">
                • Belmadani Abdourrahmanne
              </div>
            </div>

        </div>
    </div>
  );
}
