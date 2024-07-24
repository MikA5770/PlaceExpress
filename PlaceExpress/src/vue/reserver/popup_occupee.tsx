import React, { useState } from 'react';
import "../../style/popup_occupee.css";
import { Button, Space, ConfigProvider, DatePicker, DatePickerProps, Flex, Input } from 'antd';
import dayjs from 'dayjs';
import enter from "../../style/image/enter.png";
import exit from "../../style/image/exit.png";
import lock from "../../style/image/lock.png";
import commentaire from "../../style/image/commentaire.png";
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
const dateDuJour = dayjs();

const DateDeb: React.FC = () => (
  <Space direction="vertical">
    <DatePicker placeholder="Date de début" onChange={onChange} />
    {/* <DatePicker placeholder="Date ébut" defaultValue={dateDuJour} format={['DD/MM/YYYY']} /> */}
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
      <Button type="primary">Réserver</Button>
    </Space>
  </ConfigProvider>
);


export function PopupOccupee() {
  return (
    <> 
    <div className="container">
    <style>
    </style>
      <div className="titre">
        Place 3
      </div>
      <div className="close">
        <img className="close" src={fermer} alt="fermer.png" />
      </div>
      <div className="popup_info">
        <div className="img"><img className="icon" src={lock} alt="enter.png" /> <span className='booking'>Réservée par : Mikail</span> </div>
        <div className="img"><img className="icon" src={enter} alt="enter.png" /> <DateDeb /> </div>
        <div className="img"><img className="icon" src={exit} alt="exit.png" /> <DateFin /> </div>
        <div className="img"> {/*  <img src={commentaire} alt="commentaire.png" /> */} <Commentaire /></div>
      </div>

      <div className="bouton">
        <Submit />
      </div>
    </div>

        </>
  );
}