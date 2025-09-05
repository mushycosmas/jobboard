import React from "react";
import Layout from "../../components/Layout";
import RegistrationTabs from "../../components/Auth/Registration/RegistrationTabs";


const Registration=()=>{

    return(
        <Layout>
            <div style={{marginTop:'50px'}}>
            <RegistrationTabs/>
            </div>
        </Layout>
    )

}

export default Registration;