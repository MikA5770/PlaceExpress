import { Etage } from "../class/Etage";
import { EtageDAO } from "../DAO/EtageDAO";

describe('Etage', () => {
    let  etageDAO : EtageDAO ;
    let id="";
  
    beforeAll(() => {
        etageDAO = new EtageDAO();
    });

      
    it('getAll',  async () => {
      const etages =  await etageDAO.getAll(); // on attend l'arrivé d'information 

      expect(etages.length > 0).toBe(true);
    });
  
    it('getByEtage', async () => {
        const etage =  await etageDAO.getByEtage("idEtage");


        let resultat = true;
        resultat=resultat && etage.descriptionEtage==="blabla";
        resultat=resultat && etage.idEtage==="idEtage";
        resultat=resultat && etage.idImagePlan==="";
        resultat=resultat && etage.libelleEtage==="Commerce";
        resultat=resultat && etage.numeroEtage===0;
        resultat=resultat && etage.batiment.idBatiment==="idBatiment";
        resultat=resultat && etage.batiment.libelle==="Cinema le Forum";

        expect( resultat ).toBe(true);
    });
  
    it('existe',async () => {
        const etage =  await etageDAO.existe("idEtage");
  
        expect(etage).toBe(true);
    });

    it('existe pas',async () => {
        const etage = await  etageDAO.existe("blabla");
  
        expect(etage).toBe(false);
    });

    it("Ajout", async() => {
        const etage = new Etage();
        etage.descriptionEtage="test";
        await etageDAO.ajout(etage);

        const lesEtages = await etageDAO.getAll();
        let existe = false;

        lesEtages.forEach( elt => {
            if(elt.descriptionEtage==="test"){
                existe=true;
                id=elt.idEtage;
            }
        })
        expect(existe).toBe(true);
    });

    it("Modifier", async() => {
        const etage = await etageDAO.getByEtage(id);
        etage.numeroEtage=1;
        await etageDAO.update(etage);

        const newEtage =  await etageDAO.getByEtage(id);
        expect(newEtage.numeroEtage).toBe(1);
    });

    it("Supprimer", async() => {

        const etage = await etageDAO.getByEtage(id);

        await etageDAO.supprimer(etage);
        const existe =  await etageDAO.existe(id);
        
        expect(existe).toBe(false);
    });


    

    afterAll(() => {
        etageDAO.closeConnection();
    });

  });