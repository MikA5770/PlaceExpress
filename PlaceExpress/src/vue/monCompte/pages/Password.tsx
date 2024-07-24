import React from 'react'
import { Input, Space } from 'antd';
import { Button, Flex } from 'antd';


const handleCancel = () => {
  // Recharge la page actuelle
  window.location.reload();
};

function Password () {
  return (
    <React.Fragment>
    <section>
      <div className="password">Mot de passe</div>

      <div className='ancienMDP'>
      <Space>
      <Input.Password placeholder="Saisir l'ancien mot de passe" />
      </Space>
      </div>

      <div className='nouveauMDP'>
      <Space>
      <Input.Password placeholder="Saisir le nouveau mot de passe" />
      </Space>
      </div>

      <section className='bouton3'>
    <Flex gap="small" wrap="wrap">
    <Button type="primary">Enregistrer</Button>
    <Button onClick={handleCancel}>Annuler</Button>
    </Flex>
    </section>

    </section>
  </React.Fragment>
  )
}

export default Password
