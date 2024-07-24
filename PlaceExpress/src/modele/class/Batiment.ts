export class Batiment{
    private _idBatiment !: string;
    private _adresse !: string;
    private _dateCreation !: string;
    private _description !: string;
    private _libelle !: string;
    private _idImagePlan !: string;

    constructor(idBatiment="",adresse="",dateCreation="",description="",libelle="",idImage = ""){
        this.idBatiment=idBatiment;
        this.adresse=adresse;
        this.dateCreation=dateCreation;
        this.description=description;
        this.libelle=libelle;
        this.idImage=idImage;
    }

    set idBatiment(valeur : string){
        this._idBatiment=valeur;
    }
    get idBatiment(): string{
        return this._idBatiment;
    }

    set idImage(valeur : string){
        this._idImagePlan=valeur;
    }
    get idImage(): string{
        return this._idImagePlan;
    }

    set adresse(valeur : string){
        this._adresse=valeur;
    }
    get adresse(): string{
        return this._adresse;
    }

    set dateCreation(valeur : string){
        this._dateCreation=valeur;
    }
    get dateCreation(): string{
        return this._dateCreation;
    }

    set description(valeur : string){
        this._description=valeur;
    }
    get description(): string{
        return this._description;
    }

    set libelle(valeur : string){
        this._libelle=valeur;
    }
    get libelle(): string{
        return this._libelle;
    }
    
}