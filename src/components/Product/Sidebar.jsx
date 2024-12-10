// Sidebar.jsx
import React, { useState } from 'react';

const Sidebar = ({ onSearch, onFilterChange, products = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openSection, setOpenSection] = useState(null);

  // Obtener categorías únicas y ordenarlas alfabéticamente
  const uniqueCategories = [...new Set(products.map(p => p.categorias))].filter(Boolean).sort();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="w-64">
      <div>
        <h3 className="text-[#242964] font-medium">BÚSQUEDA</h3>
        <form onSubmit={handleSubmit} className="mt-2">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type="submit"
            className="w-full bg-[#242964] text-white p-2 rounded mt-2"
          >
            BUSCAR
          </button>
        </form>
      </div>

      <div className="mt-6">
        <h3 className="text-[#242964] font-medium mb-2">BÚSQUEDA AVANZADA</h3>
        
        {/* Categorías */}
        <div onClick={() => toggleSection('categorias')} 
             className="flex justify-between items-center py-2 cursor-pointer border-t">
          <span>CATEGORÍAS</span>
          <span>{openSection === 'categorias' ? '▼' : '▲'}</span>
        </div>
        
        {openSection === 'categorias' && (
          <div className="pl-4 py-2">
            {uniqueCategories.map((category, index) => (
              <div key={index} className="py-1">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    className="mr-2"
                    onChange={() => onFilterChange('categorias', category)}
                  />
                  <span className="text-sm">{category}</span>
                </label>
              </div>
            ))}
          </div>
        )}
        
        {/* Existencia */}
        <div onClick={() => toggleSection('existencia')}
             className="flex justify-between items-center py-2 cursor-pointer border-t">
          <span>EXISTENCIA</span>
          <span>{openSection === 'existencia' ? '▼' : '▲'}</span>
        </div>

        {openSection === 'existencia' && (
          <div className="pl-4 py-2">
            <select 
              className="w-full p-1 border rounded"
              onChange={(e) => onFilterChange('existencia', e.target.value)}
            >
              <option value="">Todos</option>
              <option value="disponible">Disponible</option>
              <option value="agotado">Sin existencias</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
