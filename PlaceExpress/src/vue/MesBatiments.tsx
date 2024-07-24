import { useEffect, useState } from "react";
import { Header } from "./header/Header"
import { Batiment } from "../modele/class/Batiment";
import { PermissionDAO } from "../modele/DAO/PermissionDAO";
import { Utilisateur } from "../modele/DAO/Utilisateur";
import { useAuthState } from "react-firebase-hooks/auth";
import { FichierDAO } from "../modele/DAO/FichierDAO";
import { Empty } from "antd";
import { Footer } from "./Footer";

export function MesBatiments() {

  const utilisateur = new Utilisateur();
  const [user] = useAuthState(utilisateur.getAuth());


    const [lesBatiments, setLesBatiments] = useState<Batiment[]>([]);


    useEffect(() => { // Code à exécuter après chaque rendu 
      const permissionDAO= new PermissionDAO();
      const fichierDAO= new FichierDAO();

      async function affichage() {
        if(user?.uid!=null && user?.uid!=undefined){
          const bats=await permissionDAO.getBatimentByPersonne(user?.uid)
          for(const batiment of bats){
            batiment.idImage=await fichierDAO.image(batiment.idImage,"imageBatiment");
            batiment.dateCreation= batiment.dateCreation==="" ? "" : changementDate(batiment.dateCreation);
          }

          setLesBatiments(bats);
          
        }
      }

      affichage()
    },[user?.uid])

    function changementDate(date:string ):string{
      const [jour, mois, annee] = date.split('-').map(Number);
      const dateObj = new Date(annee, mois - 1, jour);

      const resultat=dateObj.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
      return resultat
    } 


    return (
      <>
        <Header page="mesBatiment" />
        <div className="mesBatiments">
          
          {lesBatiments.map(elt =>(
            <div className="mesBatiments_unBatiment">
              <div className="mesBatiments_unBatiment_haut">
              <img src={elt.idImage} alt="Image du batiment"/> 
              <div className="mesBatiments_unBatiment_haut_contenu">
                <div className="mesBatiments_unBatiment_haut_contenu_titre">
                  {elt.libelle}
                </div>
                <div className="mesBatiments_unBatiment_haut_contenu_description">
                  {elt.description}  
                </div>
              </div>
            </div>
            <div className="mesBatiments_unBatiment_bas">
              <div className="mesBatiments_unBatiment_bas_adresse">
                  {elt.adresse}  
              </div>
                <div className="mesBatiments_unBatiment_bas_actif">
                  {elt.dateCreation==="" ?
                  (<>•</>)
                  :
                  (<>Actif depuis le {elt.dateCreation}</>)
                  } 
                  
                </div>
              </div>
            </div>

          ))}

          {
            lesBatiments.length===0 ? 
              (<Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{ height: 200,marginTop:"6rem" }}
                description={
                <span style={{fontSize : "1.6em"}}>
                  Vous n'avez accès à aucun des batiments pour le moment
                </span>
                }
              ></Empty>): (<></>)
          }   
        </div>
        <Footer couleur='dore'/>
      </>
    )
  }
  