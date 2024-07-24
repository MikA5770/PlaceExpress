import { Popconfirm, message } from "antd";

export function DivAdmin(elt : {nom:string,prenom: string, mail : string, idCompte :string, changementAdmin: (elemtn : string) => void } ){

    return(
        <div className="administration_contenu_permission_admin_lesAdmin_unAdmin" key={elt.idCompte}>
            <div className="administration_contenu_permission_admin_lesAdmin_unAdmin_photo">
            </div>
            <div className="administration_contenu_permission_admin_lesAdmin_unAdmin_contenu">
                <div className="administration_contenu_permission_admin_lesAdmin_unAdmin_contenu_haut">
                    <span>{elt.nom}</span>
                    <span>{elt.prenom}</span>
                </div>
            <div className="administration_contenu_permission_admin_lesAdmin_unAdmin_contenu_bas">
                {elt.mail}
            </div>
        </div>

        <Popconfirm
                title="Suppression"
                description="Etes vous sûr de supprimer cet administrateur ?"
                onConfirm={() => elt.changementAdmin(elt.idCompte)}
                onCancel={ () => message.error('Suppression annulé')}
                okText="Yes"
                cancelText="No"
            >
            <input type="button" className="administration_contenu_permission_admin_lesAdmin_unAdmin_supprimer"/>
        </Popconfirm>

    
    </div>
    )
}