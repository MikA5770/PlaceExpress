import { Permission } from "../class/Permission";
import { PermissionDAO } from "../DAO/PermissionDAO";

describe('Permission', () => {
    let  permissionDAO : PermissionDAO ;
  
    beforeAll(() => {
        permissionDAO = new PermissionDAO();
    });

      
    it('getAll',  async () => {
      const permissions =  await permissionDAO.getAll(); // on attend l'arrivé d'information 

      expect(permissions.length > 0).toBe(true);
    });
  
    it('getByReservation', async () => {
        const permission =  await permissionDAO.getByPermission("idRole","idCompte");

        let resultat = true;
        resultat=resultat && permission.valeur===true;
        resultat=resultat && permission.personne.idCompte==="idCompte";
        resultat=resultat && permission.role.idRole==="idRole";

        expect( resultat ).toBe(true);
    });
  
    it('existe',async () => {
        const permission =  await permissionDAO.existe("idRole","idCompte");
  
        expect(permission).toBe(true);
    });

    it('existe pas',async () => {
        const permission = await  permissionDAO.existe("idPlace","idBatiment");
  
        expect(permission).toBe(false);
    });

    it("Ajout", async() => {
        const permission = new Permission();

        permission.valeur=true;
        permission.personne.idCompte="idCompte";
        permission.role.idRole="1"
        await permissionDAO.ajout(permission);

        const existe = await permissionDAO.existe("1","idCompte");

       
        expect(existe).toBe(true);
    });

    it("Modifier", async() => {
        const permission = await permissionDAO.getByPermission("1","idCompte");
        permission.valeur=false;
        await permissionDAO.update(permission);

        const newRes =  await permissionDAO.getByPermission("1","idCompte");
        expect(newRes.valeur).toBe(false);
    });

    it("Supprimer", async() => {

        const permission = await permissionDAO.getByPermission("1","idCompte");

        await permissionDAO.supprimer(permission);
        const existe =  await permissionDAO.existe("1","idCompte");
        
        expect(existe).toBe(false);
    });


    

    afterAll(() => {
        permissionDAO.closeConnection();
    });

  });