export class Personne{
    private _idCompte !: string;
    private _dateInscription !: string;
    private _idPhotoProfil !: string;
    private _mail !: string;
    private _nom !: string;
    private _prenom !: string;
    private _pseudo !: string;
    private _telephone! : string;
    private _estAdministrateur! : boolean;

    constructor(idCompte="",dateInscription="",mail="",nom="",prenom="",pseudo="",idPhotoProfil="",telephone="",estAdministrateur=false){
        this.idCompte=idCompte;
        this.dateInscription=dateInscription;
        this.idPhotoProfil=idPhotoProfil;
        this.mail=mail;
        this.nom=nom;
        this.prenom=prenom;
        this.pseudo=pseudo;
        this.telephone=telephone;
        this.estAdministrateur=estAdministrateur;
    }
    set idCompte(valeur : string){
        this._idCompte=valeur;
    }
    get idCompte(): string{
        return this._idCompte;
    }

    set estAdministrateur(valeur : boolean){
        this._estAdministrateur=valeur;
    }
    get estAdministrateur(): boolean{
        return this._estAdministrateur;
    }

    set dateInscription(valeur : string){
        this._dateInscription=valeur;
    }
    get dateInscription(): string{
        return this._dateInscription;
    }

    set idPhotoProfil(valeur : string){
        this._idPhotoProfil=valeur;
    }
    get idPhotoProfil(): string{
        return this._idPhotoProfil;
    }

    set mail(valeur : string){
        this._mail=valeur;
    }
    get mail(): string{
        return this._mail;
    }

    set nom(valeur : string){
        this._nom=valeur;
    }
    get nom(): string{
        return this._nom;
    }
    
    set prenom(valeur : string){
        this._prenom=valeur;
    }
    get prenom(): string{
        return this._prenom;
    }

    set pseudo(valeur : string){
        this._pseudo=valeur;
    }
    get pseudo(): string{
        return this._pseudo;
    }
    
    set telephone(valeur : string){
        this._telephone=valeur;
    }
    get telephone(): string{
        return this._telephone;
    }
}