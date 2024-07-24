import React from 'react';
import "../../style/abonnement.css";
import { Button, Space, ConfigProvider, DatePicker, DatePickerProps } from 'antd';

const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };
  
const Date: React.FC = () => (
    <Space direction="vertical">
      <DatePicker placeholder="Sélectionner la date" onChange={onChange}      
      style={{
          width:200,
        }}
 />
      {/* <DatePicker placeholder="Date ébut" defaultValue={dateDuJour} format={['DD/MM/YYYY']} /> */}
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
        <Button type="primary">S'abonner</Button>
      </Space>
    </ConfigProvider>
  );
  
  


export function Abonnement() {
  return (
    <>
    <style>
    </style>

    <div className='abo'>
        <p className='abonnement'>S'abonner à un jour : </p>
        <Date />
        <div className='submit'><Submit /></div>
        </div>

        
    </>
  );
}
