
export class Role{
    private _idRole !: string;
    private _libelle !: string;
    private _color !: string;


    constructor(idRole="",libelle="",color=""){
        this.idRole=idRole;
        this.libelle=libelle;
        this.color=color;
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

    set color(valeur : string){
        this._color=valeur;
    }
    get color(): string{
        return this._color;
    }

    
}