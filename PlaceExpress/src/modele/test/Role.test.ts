import { Role } from "../class/Role";
import { RoleDAO } from "../DAO/RoleDAO";

describe('Role', () => {
    let  roleDAO : RoleDAO;
    let id="";
  
    beforeAll(() => {
        roleDAO = new RoleDAO();
    });

      
    it('getAll',  async () => {
      const roles =  await roleDAO.getAll(); // on attend l'arrivé d'information 

      expect(roles.length > 0).toBe(true);
    });
  
    it('getByBatiment', async () => {
        const role =  await roleDAO.getByRole("idRole");


        let resultat = true;
        resultat=resultat && role.idRole==="idRole";
        resultat=resultat && role.libelle==="Luxembourgeois";

        expect( resultat ).toBe(true);
    });
  
    it('existe',async () => {
        const roles =  await roleDAO.existe("idRole");
  
        expect(roles).toBe(true);
    });

    it('existe pas',async () => {
        const roles = await  roleDAO.existe("blabla");
  
        expect(roles).toBe(false);
    });

    it("Ajout", async() => {
        const role = new Role();
        role.libelle="test";
        await roleDAO.ajout(role);

        const lesRoles = await roleDAO.getAll();
        let existe = false;

        lesRoles.forEach( elt => {
            if(elt.libelle==="test"){
                existe=true;
                id=elt.idRole;
            }
        })
        expect(existe).toBe(true);
    });

    it("Modifier", async() => {
        const role = await roleDAO.getByRole(id);
        role.libelle="plouf";
        await roleDAO.update(role);

        const newRole =  await roleDAO.getByRole(id);
        expect(newRole.libelle).toBe("plouf");
    });

    it("Supprimer", async() => {

        const role = await roleDAO.getByRole(id);

        await roleDAO.supprimer(role);
        const existe =  await roleDAO.existe(id);
        
        expect(existe).toBe(false);
    });


    

    afterAll(() => {
        roleDAO.closeConnection();
    });

  });