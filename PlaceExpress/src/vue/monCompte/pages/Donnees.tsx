
import React from 'react';

import { Input } from 'antd';
import { Select, Space } from 'antd';
import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import { Button } from 'antd';

////////////////////////////////
import {  useEffect } from 'react';
import 'firebase/firestore';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { PersonneDAO } from '../../../modele/DAO/PersonneDAO';

////////////////////////////////

const { Option } = Select;
const { TextArea } = Input;

///const Données = () => {
  /*const [pseudo, setPseudo] = useState('');
  const [mail, setMail] = useState('');
  const [telephone, setTelephone] = useState('');
 
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    //mettre à jour les données modifiées
  };*/


  interface DonneesProps  {
    pseudo: string;
    mail: string;
    telephone: string;
    setPseudo: Dispatch<SetStateAction<string>>;
    setMail: Dispatch<SetStateAction<string>>;
    setTelephone: Dispatch<SetStateAction<string>>;
  }
  
  const Donnees: React.FC<DonneesProps > = ({
    pseudo,
    mail,
    telephone,
    setPseudo,
    setMail,
    setTelephone,
  }) => {
    const handleInputChange = (setter: Dispatch<SetStateAction<string>>) => (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      // Mettre à jour les données modifiées si nécessaire
    };

  useEffect(() => {
    // Récupérez les données de la personne (assumant que vous avez une méthode pour obtenir les données)
    const fetchData = async () => {
      try {
        const personneDAO = new PersonneDAO();
        const personne = await personneDAO.getByPersonne('idDeLaPersonne'); // Remplacez par l'id de la personne
        setPseudo(personne.pseudo);
        setMail(personne.mail);
        setTelephone(personne.telephone);
      } catch (error) {
        console.error('Erreur lors de la récupération des données de la personne:', error);
      }
    };

    fetchData();
  }, []); // Le tableau vide [] signifie que useEffect s'exécutera une fois lors du montage initial

  const handleChange = (value : string ) => {
    console.log(`selected ${value}`);
  };

  const onChange : DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };

  const handleCancel = () => {
    // Recharge la page actuelle
    window.location.reload();
  };


  const handleSave = async () => {
    try {
      // Créez une instance de DAO
      const personneDAO = new PersonneDAO();

      // Récupérez les données actuelles de la personne
      const personne = await personneDAO.getByPersonne('idDeLaPersonne'); // Remplacez par l'id de la personne

      // Mettez à jour uniquement les champs modifiés
      if (pseudo !== '') personne.pseudo = pseudo;
      if (mail !== '') personne.mail = mail;
      if (telephone !== '') personne.telephone = telephone;

      // Enregistrez les modifications dans Firebase
      await personneDAO.update(personne);

      // Fermez la connexion Firebase
      personneDAO.closeConnection();

      // Réinitialisez les champs après l'enregistrement
      setPseudo('');
      setMail('');
      setTelephone('');

      console.log('Données enregistrées avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des données:', error);
    }
  };

  return (
    <React.Fragment>
      <section>
        <div className="data">Données</div>
        <div className="data-input-container">
          <div id="data_input1">
            <Input placeholder="Pseudo" value={pseudo} onChange={handleInputChange(setPseudo)} />
          </div>
          <div className="data_input2">
            <Input placeholder="Mail"  value={mail} onChange={handleInputChange(setMail)} />
          </div>
          <div className="data_input3">
            <Input placeholder="Téléphone"  value={telephone} onChange={handleInputChange(setTelephone)}/>
          </div>
        </div>

        <div className='coordonnées'>
          <TextArea placeholder='Coordonnées' rows={6} />
        </div>

        <div className='date-de-naissance'>
          <Space direction="vertical">
            <DatePicker onChange={onChange} />
          </Space>
        </div>

        <div className="civilité">
          <Space wrap>
            <Select
              defaultValue="Civilité"
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                { value: 'Homme', label: 'Homme' },
                { value: 'Femme', label: 'Femme' },
              ]}
            />
          </Space>
        </div>

        <section className='bouton2'>
          <Space>
            <Button onClick={handleSave} type="primary">Enregistrer</Button>
            <Button onClick={handleCancel}>Annuler</Button>
          </Space>
        </section>
      </section>
    </React.Fragment>
  );
};

export default Donnees;