import logoGoogle from '../style/image/logo_google.png';
import { signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import '../style/connexion.css';
import { Utilisateur } from '../modele/DAO/Utilisateur.ts';
import { Button, Input } from 'antd';
import { PersonneDAO } from '../modele/DAO/PersonneDAO.ts';
import { Personne } from '../modele/class/Personne.ts';

export function ConnexionUtilisateur() {
    const navigate = useNavigate();
    const utilisateur = new Utilisateur();
    const auth =  utilisateur.getAuth()
    const provider = new GoogleAuthProvider();

    const handleSignIn = async () => {
      try{
        const result = await signInWithPopup(auth, provider);
        const googleUser = result.user;

        const personneDAO = new PersonneDAO();
        const personne= new Personne(
          googleUser.uid, "" ,googleUser.email!,googleUser.displayName?.split(" ")[1],googleUser.displayName?.split(" ")[0],
          googleUser.displayName!,googleUser.photoURL!,googleUser.phoneNumber?googleUser.phoneNumber:" " ,false);
        personneDAO.ajout(personne);

        navigate('/reserver');
      }catch (error) {
        console.error('Erreur de la connexion Google : ',error);
      }
    }
  

  return (
    <div className='pageConnexion'> 
      <Link to="*" className='pageConnexion_logo'></Link>

      <div className='pageConnexion_contenu'>
        <div className='pageConnexion_contenu_titre'>Connexion</div>
        <div className='pageConnexion_contenu_texte'>Veuillez vous identifier pour accéder à l'application</div>
        
        <Input className='pageConnexion_contenu_bouton' placeholder="Pseudo ou E-mail" />
        <Input className='pageConnexion_contenu_bouton' placeholder="Mot de passe" />
        <Button size='large' type='primary' className='pageConnexion_contenu_bouton'>Se connecter</Button>
        

        <div className='pageConnexion_contenu_separation' id="Ou" onClick={() => handleClick("toz")}></div>

        <button className="google-login-btn pageConnexion_contenu_bouton" onClick={handleSignIn}>
          <img src={logoGoogle} alt="Google Icon" className="google-icon"></img>
          Se connecter avec Google
        </button>

      </div>
    </div>
    
  )
}

function handleClick(membreDeLaFamille: string) {
  const phrase = "✨";
  alert(phrase + membreDeLaFamille + phrase)
}


