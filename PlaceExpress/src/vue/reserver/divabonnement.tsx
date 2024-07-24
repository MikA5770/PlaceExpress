import React from 'react';
import "../../style/abonnement.css";
import { Button, Space, ConfigProvider, DatePicker, DatePickerProps } from 'antd';

const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };
  
const Date: React.FC = () => (
    <Space direction="vertical">
      <DatePicker size="large" placeholder="Sélectionner la date" onChange={onChange}      
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
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap');
    </style>

    <div className='abo'>
        <span className='abonnement'>S'abonner à un jour : </span>
        <Date />
        <div className='submit'><Submit /></div>
        </div>

        
    </>
  );
}
