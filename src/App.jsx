import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProductCatalog from './components/Product/ProductCatalog';
import ProductDetail from './components/Product/ProductDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/promocionales" element={<ProductCatalog />} />
          <Route path="/promocionales/product/:id" element={<ProductDetail />} />
          {/* Redireccionar cualquier otra ruta al catálogo */}
          <Route path="*" element={<Navigate to="/promocionales" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;