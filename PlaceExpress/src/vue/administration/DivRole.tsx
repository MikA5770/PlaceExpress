
import { useState } from "react";
import { EndroitProvider } from "./Plan/EndroitProvider";
import { IdProvider } from "./Plan/IdProvider";

import { notification } from "antd";

import { NotifProvider } from "./Plan/NotificationProvider";
import { DivRoleTotal } from "./Role/DivRoleTotal";
import { DivRoleMA } from "./Role/DivRoleMA";
import { DivUtiRole } from "./Role/DivUtiRole";

export function DivRole() {
    
    const [endroit, setEndroit] = useState("accueil");
    const [identif, setId] = useState("");
    const [api, contextHolder] = notification.useNotification();

    const nouvelleNotification = (titre: string, contenu : string ) => {
        api.success({
          message: titre,
          description: contenu,
          placement : "topLeft",
        });
      };

    //provider pour endroit
    function changementEndroit(){
        switch(endroit){
            case "accueil":
                    return <DivRoleTotal />;
            case "role" : 
                    return <DivRoleMA />;
            case "personne" : 
                    return <DivUtiRole/>;
            default : 
                    return null;
        }
    }
    const updateEndroit = ( endroit :string ) => {
        setEndroit(endroit);
    };

    const updateId = ( id :string ) => {
        setId(id);
    };


    return (
        <IdProvider value={{fonction : updateId, id : identif} }>
            <EndroitProvider value={updateEndroit }>
                <NotifProvider value={nouvelleNotification}>
                    {contextHolder}
                    {changementEndroit()}
                </NotifProvider>
            </EndroitProvider>
        </IdProvider>
    );
}