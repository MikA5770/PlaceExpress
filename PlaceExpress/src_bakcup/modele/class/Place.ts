import { Etage } from "./Etage";

export class Place{
    private _idPlace !: string;
    private _hauteur !: number;
    private _largeur !: number;
    private _x !: number;
    private _y !: number;
    private _libellePlace !: string;
    private _etage !: Etage;

    constructor(idPlace="",hauteur=0,largeur=0,x=0,y=0,libellePlace="", etage= new Etage()){
        this.idPlace=idPlace;
        this.hauteur=hauteur;
        this.largeur=largeur;
        this.x=x;
        this.y=y;
        this.libellePlace=libellePlace;
        this.etage=etage;
    }

    set idPlace(valeur : string){
        this._idPlace=valeur;
    }
    get idPlace(): string{
        return this._idPlace;
    }

    set hauteur(valeur : number){
        this._hauteur=valeur;
    }
    get hauteur(): number{
        return this._hauteur;
    }

    set largeur(valeur : number){
        this._largeur=valeur;
    }
    get largeur(): number{
        return this._largeur;
    }

    set x(valeur : number){
        this._x=valeur;
    }
    get x(): number{
        return this._x;
    }

    set y(valeur : number){
        this._y=valeur;
    }
    get y(): number{
        return this._y;
    }

    set libellePlace(valeur : string){
        this._libellePlace=valeur;
    }
    get libellePlace(): string{
        return this._libellePlace;
    }

    set etage(valeur : Etage){
        this._etage=valeur;
    }
    get etage(): Etage{
        return this._etage;
    }
    
}