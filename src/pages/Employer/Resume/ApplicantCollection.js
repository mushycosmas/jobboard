import React, { useState, useEffect} from 'react';
import { Container, Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import EmployerLayout from '../../../Layouts/EmployerLayout';
import ApplicantCollectionComponent from '../../../components/Applicant/ApplicantCollectionComponent';
import { useParams } from 'react-router-dom';
const ApplicantCollection = () => {
  const [collectionData, setCollectionData] = useState([]);
  const [loading, setLoading] = useState(true);
//   const employerId = localStorage.getItem('employerId');
  const { employerId, collectionId } = useParams(); // Access the dynamic params

  return (
    <EmployerLayout>
       <ApplicantCollectionComponent 
        employerId={{employerId}}
        collectionId={{collectionId}}

       />
    </EmployerLayout>
  );
};

export default ApplicantCollection;
