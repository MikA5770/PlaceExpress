import { Batiment } from "./Batiment";
import { Role } from "./Role";

export class Acces{
    private _role !: Role;
    private _batiment !: Batiment;
    private _dateDebutAcces !: string;

    constructor(dateDebutAcces="",role= new Role(), batiment= new Batiment()){
        this.dateDebutAcces=dateDebutAcces;
        this.role=role;
        this.batiment=batiment;
        
    }


    set dateDebutAcces(valeur : string){
        this._dateDebutAcces=valeur;
    }
    get dateDebutAcces(): string{
        return this._dateDebutAcces;
    }

    set role(valeur : Role){
        this._role=valeur;
    }
    get role(): Role{
        return this._role;
    }

    set batiment(valeur : Batiment){
        this._batiment=valeur;
    }
    get batiment(): Batiment{
        return this._batiment;
    }
    
}