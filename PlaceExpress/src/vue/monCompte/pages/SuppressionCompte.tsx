
import { Input, Space } from 'antd';
import { Button, Flex } from 'antd';
import { message, Popconfirm } from 'antd';
import React from 'react';

const confirm = () => {
  message.success('Compte effacé');
};

const cancel = () => {
  message.error('Action annulée');
};

const handleCancel = () => {
  // Recharge la page actuelle
  window.location.reload();
};

const SuppressionCompte: React.FC = () =>(
  
    <React.Fragment>
    <section>
      <div className="delete_acc">Supprimer le compte</div>
    </section>


    <div className='MDP'>
      <Space>
      <Input.Password placeholder="Saisir le mot de passe" />
      </Space>
    </div>

    <section className='bouton4'>
    <Flex gap="small" wrap="wrap">
    <Popconfirm
    title="Supprimer le compte?"
    description="Êtes-vous sûr de vouloir supprimer le compte?"
    onConfirm={confirm}
    onCancel={cancel}
    okText="Oui"
    cancelText="Non"
  >
    <Button danger>Supprimer</Button>
  </Popconfirm>
    <Button onClick={handleCancel}>Annuler</Button>
    </Flex>
    </section>

  </React.Fragment>
  
);

export default SuppressionCompte