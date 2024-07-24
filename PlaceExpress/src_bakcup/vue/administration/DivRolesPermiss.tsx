import { DivPermission } from "./Permission/DivPermission"

export function DivRolesPermiss(){

    return(
        <div className="administration_contenu">
        <div className="administration_contenu_titre">
            Permissions
        </div>
        <DivPermission />
        <div className="administration_contenu_deuxiemeTitre">
            Roles
        </div>

    </div>
    );
}