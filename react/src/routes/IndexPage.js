import React, { Component } from 'react';
import indexStyles from '../index.less';

function HomePage({ children }) {
  return (
    <div className={indexStyles.pt_50}>
      {children}
    </div>
  );
}
export default HomePage;
