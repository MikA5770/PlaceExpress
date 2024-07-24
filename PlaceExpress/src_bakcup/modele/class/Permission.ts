import { Role } from "./Role";
import { Personne } from "./Personne";

export class Permission{
    private _role !: Role;
    private _personne !: Personne;
    private _valeur !: boolean;

    constructor(role =new Role(),personne= new Personne(), valeur=false){
        this.role=role;
        this.personne=personne;
        this.valeur=valeur;
    }

    set role(valeur : Role){
        this._role=valeur;
    }
    get role(): Role{
        return this._role;
    }

    set personne(valeur : Personne){
        this._personne=valeur;
    }
    get personne(): Personne{
        return this._personne;
    }

    set valeur(valeur : boolean){
        this._valeur=valeur;
    }
    get valeur(): boolean{
        return this._valeur;
    }
    
}