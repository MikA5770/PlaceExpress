
export class Role{
    private _idRole !: string;
    private _libelle !: string;


    constructor(idRole="",libelle=""){
        this.idRole=idRole;
        this.libelle=libelle;
    }

    set idRole(valeur : string){
        this._idRole=valeur;
    }
    get idRole(): string{
        return this._idRole;
    }

    set libelle(valeur : string){
        this._libelle=valeur;
    }
    get libelle(): string{
        return this._libelle;
    }

    
}