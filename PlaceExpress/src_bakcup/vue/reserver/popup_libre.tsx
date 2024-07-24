import React, { useState } from 'react';
import { Reservation } from '../../modele/class/Reservation';
import { ReservationDAO } from '../../modele/DAO/ReservationDAO';
import "../../style/popup_libre.css";
import { Button, Space, ConfigProvider, DatePicker, DatePickerProps, Flex, Input } from 'antd';
import enter from "../../style/image/enter.png";
import exit from "../../style/image/exit.png";
import fermer from "../../style/image/fermer.png";


const Commentaire: React.FC = () => (
  <Flex vertical gap={16}>
      <Input
        count={{
          show: true,
          max: 20,
        }}
        style={{
          
        }}
        placeholder="Commentaire"
        />

  </Flex>
);

const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};

const DateDeb: React.FC = () => (
  <Space direction="vertical">
    <DatePicker placeholder="Date de début" onChange={onChange} />
  </Space>
);
const DateFin: React.FC = () => (
  <Space direction="vertical">
    <DatePicker placeholder="Date de fin" onChange={onChange} />
  </Space>
);

const Submit: React.FC = () => (
  <ConfigProvider
  theme={{
    token: {
      colorPrimary: '#7B914D',
      borderRadius: 6,
    },
  }}
  >
    <Space>
      <Button type="primary" >Réserver</Button>
    </Space>
  </ConfigProvider>
);


export function PopupLibre(value : {valeur : string}) {
  return (
    <> 
    <div className="container">
      <div className="titre">
        Place 1
      </div>
      <div className="close">
        <img className="close" src={fermer} alt="fermer.png" />
      </div>
      <div className="popup_info">
        <div className="img"><img className="icon" src={enter} alt="enter.png" /> <DateDeb /> </div>
        <div className="img"><img className="icon" src={exit} alt="exit.png" /> <DateFin /> </div>
        <div className="img"> <Commentaire /></div>
      </div>

      <div className="bouton">
        <Submit />
      </div>
    </div>

        </>
  );
}