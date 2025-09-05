import React from "react";
import Layout from "../../components/Layout";
import UserLogin from "../../components/Auth/UserLogin";
const Login=()=>{

    return(
        <Layout>
            <div style={{marginTop:"100px",marginBottom:"50px"}}>
            <UserLogin/>
            </div>
        </Layout>
    )

    
}

export default Login;