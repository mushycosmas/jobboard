// EmployerDashboard.js
import React from 'react';
import EmployerLayout from '../../Layouts/EmployerLayout';
import EmployerHome from '../../components/Employer/Home/EmployerHome';

const EmployerDashboard = () => {
  return (
    <EmployerLayout>
       <EmployerHome/>
    </EmployerLayout>
  );
};

export default EmployerDashboard;
