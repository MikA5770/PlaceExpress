export function DivUnResultat(elt : {nom:string,prenom: string, estAdministrateur : boolean,mail : string, idCompte :string, changementAdmin: (elemtn : string) => void ,photoProfil : string}){
    
    
    return(<div className="administration_contenu_permission_compte_lesResultats_unResultat" key={elt.idCompte}>
        <div className="administration_contenu_permission_compte_lesResultats_unResultat_photo"
            style={{backgroundImage: elt.photoProfil!=""? "url("+elt.photoProfil+")" : ""   }}
        >
        </div>
        <div className="administration_contenu_permission_compte_lesResultats_unResultat_contenu">
                    <span>{elt.mail}</span>
                    <span>{elt.nom}</span>
                    <span>{elt.prenom}</span>
        </div>
        {elt.estAdministrateur ? 
        (<button className="administration_contenu_permission_compte_lesResultats_unResultat_admin">
            Administrateur
        </button>) : 
        (<button className="administration_contenu_permission_compte_lesResultats_unResultat_ajouter"
            onClick={() => elt.changementAdmin(elt.idCompte)}
        >
            Ajouter
         </button>)}
    
    </div>)
}