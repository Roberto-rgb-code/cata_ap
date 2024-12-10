import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-[1200px] mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="https://cataniauniformesypromocionales.com" className="text-2xl font-bold">
            Catania
          </Link>
          
          <nav className="flex gap-8">
            <a 
              href="https://cataniauniformesypromocionales.com" 
              className="hover:text-gray-600"
            >
              Inicio
            </a>
            <a 
              href="https://cataniauniformesypromocionales.com/nosotros" 
              className="hover:text-gray-600"
            >
              Nosotros
            </a>
            <a 
              href="https://cataniauniformesypromocionales.com/servicios" 
              className="hover:text-gray-600"
            >
              Servicios
            </a>
            <a 
              href="https://cataniauniformesypromocionales.com/productos" 
              className="hover:text-gray-600"
            >
              Productos
            </a>
            <a 
              href="https://cataniauniformesypromocionales.com/contacto" 
              className="hover:text-gray-600"
            >
              Contacto
            </a>
          </nav>
          <a
            href="https://cataniauniformesypromocionales.com/contacto" 
            className="hover:text-gray-600"
          
          >
            Contacta con nosotros
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;