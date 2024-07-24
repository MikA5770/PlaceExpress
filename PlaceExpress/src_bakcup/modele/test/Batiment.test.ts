import { BatimentDAO } from "../DAO/BatimentDAO";
import { Batiment } from "../class/Batiment";

describe('Batiment', () => {
    let  batimentDAO : BatimentDAO;
    let id="";
  
    beforeAll(() => {
        batimentDAO = new BatimentDAO();
    });

      
    it('getAll',  async () => {
      const batiments =  await batimentDAO.getAll(); // on attend l'arrivé d'information 

      expect(batiments.length > 0).toBe(true);
    });
  
    it('getByBatiment', async () => {
        const batiment =  await batimentDAO.getByBatiment("idBatiment");


        let resultat = true;
        resultat=resultat && batiment.dateCreation==="02-11-2023";
        resultat=resultat && batiment.adresse==="5 rue de la chaumière Sarreguemines";
        resultat=resultat && batiment.description==="Bla bla bla";
        resultat=resultat && batiment.libelle==="Cinema le Forum";
        resultat=resultat && batiment.idImage==="921456778.webp";

        expect( resultat ).toBe(true);
    });
  
    it('existe',async () => {
        const personnes =  await batimentDAO.existe("idBatiment");
  
        expect(personnes).toBe(true);
    });

    it('existe pas',async () => {
        const personnes = await  batimentDAO.existe("blabla");
  
        expect(personnes).toBe(false);
    });

    it("Ajout", async() => {
        const batiment = new Batiment();
        batiment.libelle="test";
        await batimentDAO.ajout(batiment);

        const lesBatiments = await batimentDAO.getAll();
        let existe = false;

        lesBatiments.forEach( elt => {
            if(elt.libelle==="test"){
                existe=true;
                id=elt.idBatiment;
            }
        })
        expect(existe).toBe(true);
    });

    it("Modifier", async() => {
        const batiment = await batimentDAO.getByBatiment(id);
        batiment.libelle="plouf";
        await batimentDAO.update(batiment);

        const newBatiment =  await batimentDAO.getByBatiment(id);
        expect(newBatiment.libelle).toBe("plouf");
    });

    it("Supprimer", async() => {

        const batiment = await batimentDAO.getByBatiment(id);

        await batimentDAO.supprimer(batiment);
        const existe =  await batimentDAO.existe(id);
        
        expect(existe).toBe(false);
    });


    

    afterAll(() => {
        batimentDAO.closeConnection();
    });

  });