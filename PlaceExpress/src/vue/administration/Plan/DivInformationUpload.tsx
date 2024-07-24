import { Upload, Button } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';

import { UploadOutlined } from '@ant-design/icons';

export function DivInformationUpload(value : { titre :string, fonction : (valeur: UploadFile<File>[] ) => void ,  }){

    const beforeUpload = () => {
        // Ne rien faire ici pour empêcher l'envoi du fichier
        return false;
      };

    return (
    <div className="administration_contenu_lesInfos_contenant">
                    <div  className="administration_contenu_lesInfos_upload">
                        <div>{value.titre}</div>
                        <Upload 
                            onChange={ e => value.fonction(e.fileList)}
                            className="administration_contenu_lesInfos_upload_upload"
                            maxCount={1}
                            listType="picture"
                            beforeUpload={()=>beforeUpload()}
                            >
                        <Button icon={<UploadOutlined />}>Upload </Button>
                    </Upload>
                    </div>
                    
    </div> )
}