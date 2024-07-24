
import { useState } from "react";
import { EndroitProvider } from "./Plan/EndroitProvider";
import { IdProvider } from "./Plan/IdProvider";
import { DivPlanTotal } from "./Plan/DivPlanTotal";
import { DivBatiment } from "./Plan/DivBatiment";
import { DivEtage } from "./Plan/DivEtage";
import { notification } from "antd";

import { NotifProvider } from "./Plan/NotificationProvider";

export function DivPlan() {
    
    const [endroit, setEndroit] = useState("plan");
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
            case "plan":
                    return <DivPlanTotal />;
            case "batiment" : 
                    return <DivBatiment />;
            case "etage" : 
                    return <DivEtage/>;
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