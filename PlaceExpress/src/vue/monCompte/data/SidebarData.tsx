import { UserOutlined } from '@ant-design/icons';
import { DatabaseOutlined } from '@ant-design/icons';
import { KeyOutlined } from '@ant-design/icons';
import { DeleteOutlined } from '@ant-design/icons';

export const SidebarData=[
     
      {
        title: "Profil",
        path: "/profil",
        icon: <UserOutlined/>,
      },
      {
        title: "Données",
        path: "/personal_data",
        icon: <DatabaseOutlined />,
      },
      {
        title: "Mot de passe",
        path: "/password",
        icon: <KeyOutlined />,
      },
      {
        title: "Supprimer le compte",
        path: "/delete_account",
        icon: <DeleteOutlined />,
      },
      
]