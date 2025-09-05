'use client'
import React from 'react';
import Header from '../components/Partial/Header';
import Footer from '../components/Partial/Footer';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
