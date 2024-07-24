import { Batiment } from "./Batiment";

export class Etage{
    private _idEtage !: string;
    private _numeroEtage !: number;
    private _idImagePlan !: string;
    private _descriptionEtage !: string;
    private _libelleEtage !: string;
    private _batiment !: Batiment;

    constructor(idEtage="",numeroEtage=0,idImagePlan="",descriptionEtage="",libelleEtage="", batiment= new Batiment()){
        this.idEtage=idEtage;
        this.numeroEtage=numeroEtage;
        this.idImagePlan=idImagePlan;
        this.descriptionEtage=descriptionEtage;
        this.libelleEtage=libelleEtage;
        this.batiment=batiment;
    }

    set idEtage(valeur : string){
        this._idEtage=valeur;
    }
    get idEtage(): string{
        return this._idEtage;
    }

    set numeroEtage(valeur : number){
        this._numeroEtage=valeur;
    }
    get numeroEtage(): number{
        return this._numeroEtage;
    }

    set idImagePlan(valeur : string){
        this._idImagePlan=valeur;
    }
    get idImagePlan(): string{
        return this._idImagePlan;
    }

    set descriptionEtage(valeur : string){
        this._descriptionEtage=valeur;
    }
    get descriptionEtage(): string{
        return this._descriptionEtage;
    }

    set libelleEtage(valeur : string){
        this._libelleEtage=valeur;
    }
    get libelleEtage(): string{
        return this._libelleEtage;
    }

    set batiment(valeur : Batiment){
        this._batiment=valeur;
    }
    get batiment(): Batiment{
        return this._batiment;
    }
    
}