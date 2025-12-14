'use client'
import React from 'react';
import Header from './Partial/Header';
import Footer from './Partial/Footer';

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
