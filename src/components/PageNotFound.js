import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const PageNotFound = () => {
  return (
    <Layout>
      <div style={{ fontSize: '1.5rem', paddingTop: '1rem' ,textAlign:'center'}}>
        Looks like you're lost. Go back to <Link to="/">Home.</Link>
      </div>
    </Layout>
  );
};

export default PageNotFound;