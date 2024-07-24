import { Batiment } from "./Batiment";
import { Personne } from "./Personne";

export class Abonnement{
    private _batiment !: Batiment;
    private _personne !: Personne;
    private _dateAbonnement !: string;
    private _valeur !: boolean;

    constructor(batiment= new Batiment(),personne= new Personne(), dateAbonnement="",valeur=true){
        this.batiment=batiment;
        this.personne=personne;
        this.dateAbonnement=dateAbonnement;
        this.valeur=valeur;
    }

    set valeur(valeur : boolean){
        this._valeur=valeur;
    }
    get valeur(): boolean{
        return this._valeur;
    }

    set dateAbonnement(valeur : string){
        this._dateAbonnement=valeur;
    }
    get dateAbonnement(): string{
        return this._dateAbonnement;
    }

    set batiment(valeur : Batiment){
        this._batiment=valeur;
    }
    get batiment(): Batiment{
        return this._batiment;
    }

    set personne(valeur : Personne){
        this._personne=valeur;
    }
    get personne(): Personne{
        return this._personne;
    }
    
}