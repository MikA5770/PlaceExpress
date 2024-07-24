import logoPlaceExpress from '../style/image/logo_blanc_mobile.png';
import logoGoogle from '../style/image/logo_google.png';
import { signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { getDatabase, child, get, ref, set} from "firebase/database";
import { useNavigate } from 'react-router-dom';
import '../style/connexion.css';
import { Utilisateur } from '../modele/DAO/Utilisateur.ts';

export function ConnexionUtilisateur() {
    const navigate = useNavigate();
    const utilisateur = new Utilisateur();
    const auth =  utilisateur.getAuth()
    const provider = new GoogleAuthProvider();

    const handleSignIn = async () => {
      try{
        const result = await signInWithPopup(auth, provider);
        const googleUser = result.user;

        const dbRef = ref(getDatabase()); 
        const snapshot = await get(child(dbRef, `Personne/${googleUser.uid}`));
        if (!snapshot.exists()) {
          // L'utilisateur n'existe pas, le créer
          const newUser = {
            dateInscription: new Date().toLocaleDateString(),
            estAdministrateur: false,
            idPhotoProfil: googleUser.photoURL,
            mail: googleUser.email,
            nom: googleUser.displayName?.split(" ")[1],
            prenom: googleUser.displayName?.split(" ")[0],
            pseudo: googleUser.displayName,
            telephone: googleUser.phoneNumber
          };
          await set(child(dbRef, `Personne/${googleUser.uid}`), newUser);
        }
      
        navigate('/');
      }catch (error) {
        console.error('erreur de co google : ',error);
      }
    }
  

  return (
    <div> 
      <div className='conteneur_co'>
        <img src={logoPlaceExpress} alt='logo_place_express' className='logo_place_express' onClick={() => handleClick("toz")} />
        <h1 className='titre_co'>Connexion</h1>

        <form onSubmit={handleSubmit}>
          <input type='text' name='id' placeholder='Pseudo ou E-mail' /> <br />
          <input type='password' name='mdp' placeholder='Mot de passe' /> <br />
          <button type='submit'>Se connecter</button>
        </form>

        <p id="Ou">Ou</p>

        <button className="google-login-btn" onClick={handleSignIn}>
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

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault() // empêche le comportement par défaut du formulaire qui est de recharger la page
  if (e.target['id'].value !== '' && e.target['mdp'].value !== '') {
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target['id'].value)) {
      alert('bon');
    } else {
      alert('pas bon');
    }
  }
}


