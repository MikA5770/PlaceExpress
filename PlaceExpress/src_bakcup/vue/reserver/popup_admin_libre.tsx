import React, { useState } from 'react';
import "../../style/popup_admin_libre.css";
import { Button, Space, ConfigProvider, DatePicker, DatePickerProps, Flex, Input, Select } from 'antd';
import dayjs from 'dayjs';
import enter from "../../style/image/enter.png";
import touch from "../../style/image/robinet.png";
import exit from "../../style/image/exit.png";
import commentaire from "../../style/image/commentaire.png";
import fermer from "../../style/image/fermer.png";

const onChangeSelect = (value: string) => {
  console.log(`selected ${value}`);
};

const onSearch = (value: string) => {
  console.log('search:', value);
};

// Filter `option.label` match the user type `input`
const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const SelectUser: React.FC = () => (
  <Select
    showSearch
    placeholder="Sélectionner une personne"
    optionFilterProp="children"
    onChange={onChangeSelect}
    onSearch={onSearch}
    filterOption={filterOption}
    style={{width:220}}
    options={[
      {
        value: 'mikail',
        label: 'Mikail',
      },
      {
        value: 'thibault',
        label: 'Thibault',
      },
      {
        value: 'abdourrahmane',
        label: 'Abdourrahmane',
      },
      {
        value: 'alexis',
        label: 'Alexis',
      },
    ]}
  />
);

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



export function PopupAdminLibre() {

  return (
    <> 
    <div className="container">
    <style>
    </style>
      <div className="titre">
        Place 2
      </div>
      <div className="close">
        <img className="close" src={fermer} alt="fermer.png" />
      </div>
      <div className="popup_info">
        <div className="img"><img className="icon" src={touch} alt="enter.png" /> <SelectUser /> </div>
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