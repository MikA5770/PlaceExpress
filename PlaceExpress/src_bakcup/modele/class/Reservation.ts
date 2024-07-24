import { Place } from "./Place";
import { Personne } from "./Personne";

export class Reservation{
    private _place !: Place;
    private _personne !: Personne;
    private _commentaire !: string;
    private _dateReservation !: string;
    private _heureDebut !: string;
    private _heureFin !: string;
    private _present !: boolean;

    constructor(place= new Place(),personne= new Personne(), commentaire="",dateRes="",heureDebut="",heureFin="",present=true){
        this.place=place;
        this.personne=personne;
        this.commentaire=commentaire;
        this.dateRes=dateRes;
        this.heureDebut=heureDebut;
        this.heureFin=heureFin;
        this.present=present;
    }

    set commentaire(valeur : string){
        this._commentaire=valeur;
    }
    get commentaire(): string{
        return this._commentaire;
    }

    set dateRes(valeur : string){
        this._dateReservation=valeur;
    }
    get dateRes(): string{
        return this._dateReservation;
    }

    set heureDebut(valeur : string){
        this._heureDebut=valeur;
    }
    get heureDebut(): string{
        return this._heureDebut;
    }

    set heureFin(valeur : string){
        this._heureFin=valeur;
    }
    get heureFin(): string{
        return this._heureFin;
    }

    set present(valeur : boolean){
        this._present=valeur;
    }
    get present(): boolean{
        return this._present;
    }

    set place(valeur : Place){
        this._place=valeur;
    }
    get place(): Place{
        return this._place;
    }

    set personne(valeur : Personne){
        this._personne=valeur;
    }
    get personne(): Personne{
        return this._personne;
    }
    
}