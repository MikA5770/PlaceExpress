import { Acces } from "../class/Acces";
import { AccesDAO } from "../DAO/AccesDAO";

describe('Acces', () => {
    let  accesDAO : AccesDAO ;
  
    beforeAll(() => {
        accesDAO = new AccesDAO();
    });

      
    it('getAll',  async () => {
      const acces =  await accesDAO.getAll(); // on attend l'arrivé d'information 

      expect(acces.length > 0).toBe(true);
    });
  
    it('getByReservation', async () => {
        const acces =  await accesDAO.getByAcces("idRole","idBatiment");

        let resultat = true;
        resultat=resultat && acces.dateDebutAcces==="02-11-2023";
        resultat=resultat && acces.batiment.idBatiment==="idBatiment";
        resultat=resultat && acces.role.idRole==="idRole";

        expect( resultat ).toBe(true);
    });
  
    it('existe',async () => {
        const acces =  await accesDAO.existe("idRole","idBatiment");
  
        expect(acces).toBe(true);
    });

    it('existe pas',async () => {
        const acces = await  accesDAO.existe("idPlace","idBatiment");
  
        expect(acces).toBe(false);
    });

    it("Ajout", async() => {
        const acces = new Acces();

        acces.dateDebutAcces="30-11-2023";
        acces.batiment.idBatiment="idBatiment";
        acces.role.idRole="1"
        await accesDAO.ajout(acces);

        const existe = await accesDAO.existe("1","idBatiment");

       
        expect(existe).toBe(true);
    });

    it("Modifier", async() => {
        const acces = await accesDAO.getByAcces("1","idBatiment");
        acces.dateDebutAcces="31-11-2023";
        await accesDAO.update(acces);

        const newRes =  await accesDAO.getByAcces("1","idBatiment");
        expect(newRes.dateDebutAcces).toBe("31-11-2023");
    });

    it("Supprimer", async() => {

        const acces = await accesDAO.getByAcces("1","idBatiment");

        await accesDAO.supprimer(acces);
        const existe =  await accesDAO.existe("1","idBatiment");
        
        expect(existe).toBe(false);
    });


    

    afterAll(() => {
        accesDAO.closeConnection();
    });

  });