import JobForm from '../job/JobForm';
import {  Container, Row, Col,} from 'react-bootstrap';
import React, { useState } from 'react';
import EmployerLayout from "../Layout/EmployerLayout";

const EmployerPostJob=()=>{

 
    return (
        <EmployerLayout>
         <Container >
         <JobForm/>
         </Container>
        </EmployerLayout> 
     
      
    );
  };
export default EmployerPostJob;