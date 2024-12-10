import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#f8f7ff] py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-4">Catania</h2>
          </div>
          <div>
            <a 
              href="https://cataniauniformesypromocionales.com/nosotros"
              className="text-xl font-bold hover:text-gray-600"
            >
              Nosotros
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;