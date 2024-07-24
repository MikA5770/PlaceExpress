import { PersonneDAO } from "../DAO/PersonneDAO";
import { Personne } from "../class/Personne";

describe('Personne', () => {
    let personneDAO : PersonneDAO;
  
    beforeAll(() => {
        personneDAO = new PersonneDAO();
    });

      
    it('getAll',  async () => {
      const personnes =  await personneDAO.getAll(); // on attend l'arrivé d'information 

      expect(personnes.length > 0).toBe(true);
    });

  
    it('getByPersonne', async () => {
        const personne =  await personneDAO.getByPersonne("idCompte");


        let resultat = true;
        resultat=resultat && personne.dateInscription==="02/11/2023";
        resultat=resultat && personne.estAdministrateur===false;
        resultat=resultat && personne.idCompte==="idCompte";
        resultat=resultat && personne.idPhotoProfil==="idPhoto";
        resultat=resultat && personne.mail==="thibault.kobler@gmail.com";
        resultat=resultat && personne.nom==="Kobler";
        resultat=resultat && personne.prenom==="Thibault";
        resultat=resultat && personne.pseudo==="Tbo";
        resultat=resultat && personne.telephone==="645675456";

        expect( resultat ).toBe(true);
    });
  
    it('existe',async () => {
        const personnes =  await personneDAO.existe("idCompte");
  
        expect(personnes).toBe(true);
    });

    it('existe pas',async () => {
        const personnes = await  personneDAO.existe("blabla");
  
        expect(personnes).toBe(false);
    });
  
    it('estAdministrateur',async () => {
        const personnes =  await personneDAO.estAdministrateur("1");
  
        expect(personnes).toBe(true);
    });

    it("n'est pas Administrateur", async() => {
        const personnes =  await personneDAO.estAdministrateur("idCompte");
  
        expect(personnes).toBe(false);
    });

    it("Ajout", async() => {
        const personne = new Personne();
        personne.idCompte="2";
        await personneDAO.ajout(personne);

        const existe =  await personneDAO.existe("2");
        expect(existe).toBe(true);
    });

    it("Modifier", async() => {
        const personne = await personneDAO.getByPersonne("2");
        personne.estAdministrateur=true;
        await personneDAO.update(personne);

        const admin =  await personneDAO.estAdministrateur("2");
        expect(admin).toBe(true);
    });

    it("Supprimer", async() => {
        const personne = await personneDAO.getByPersonne("2");

        await personneDAO.supprimer(personne);

        const existe =  await personneDAO.existe("2");
        expect(existe).toBe(false);
    });


    

    afterAll(() => {
        personneDAO.closeConnection();
    });

  });