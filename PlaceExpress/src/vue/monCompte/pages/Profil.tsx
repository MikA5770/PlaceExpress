import { UserOutlined } from '@ant-design/icons';
import React from 'react';
import { Avatar} from 'antd';
import { Input } from 'antd';
import { Flex } from 'antd';
import { Button } from 'antd';

import { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

const { TextArea } = Input;

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};


const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const handleCancel = () => {
  // Recharge la page actuelle
  window.location.reload();
};


function Profil () {

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();


  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <React.Fragment>
      <div className="profil">Profil</div>
    <section className='section1'>
      <div className='avatar'>
        <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload></div>
      



  <div className='input-container'>
      <div className='input1'><Input  placeholder="Nom" /></div>
      <div className='input2'><Input  placeholder="Prénom"/></div>

  </div>
      
      
    </section>

    <section className='section2'>
    <TextArea style={{ width: 700 }} rows={6} />

    </section>
    
    <section className='bouton1'>
    <Flex gap="small" wrap="wrap">
    <Button type="primary">Enregistrer</Button>
    <Button onClick={handleCancel}>Annuler</Button>
    </Flex>
    </section>

  </React.Fragment>
  )
}

export default Profil