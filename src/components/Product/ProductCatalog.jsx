import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { fetchProducts, fetchStocks } from "../../services/api.js";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(24);
  
  // Añadir estado para debugging
  const [debug, setDebug] = useState({
    rawProducts: null,
    rawStocks: null,
    processedProducts: null,
    activeFilters: null
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch data
        const [productsData, stocksData] = await Promise.all([
          fetchProducts(),
          fetchStocks()
        ]);

        // Guardar datos crudos para debug
        setDebug(prev => ({
          ...prev,
          rawProducts: productsData,
          rawStocks: stocksData
        }));

        // Si no hay datos, mostrar error
        if (!productsData?.length) {
          throw new Error('No se recibieron productos de la API');
        }

        // 2. Procesar stocks
        const stocksMap = stocksData?.reduce((acc, stock) => {
          if (stock?.Material) {
            acc[stock.Material] = stock.Stock;
          }
          return acc;
        }, {}) || {};

        // 3. Procesar productos con validaciones
        const processedProducts = productsData.map((product) => {
          if (!product?.skuPadre) {
            console.warn('Producto sin skuPadre:', product);
          }

          return {
            id: product.skuPadre || '',
            name: product.nombrePadre || 'Producto sin nombre',
            description: product.descripcion || '',
            categorias: Array.isArray(product.categorias) 
              ? product.categorias 
              : product.categorias 
                ? [product.categorias] 
                : [],
            imageUrl: product.imagenesPadre?.[0] || 'https://via.placeholder.com/300x300?text=No+image',
            tipo: product.hijos?.[0]?.tipo || '',
            stock: stocksMap[product.skuPadre] || 0
          };
        });

        // Guardar productos procesados para debug
        setDebug(prev => ({
          ...prev,
          processedProducts
        }));

        console.log('Productos procesados:', processedProducts);
        setProducts(processedProducts);

        // Mostrar todos los productos (sin filtrar por existencias)
        setFilteredProducts(processedProducts);

      } catch (err) {
        console.error('Error detallado:', {
          message: err.message,
          stack: err.stack,
          debug: debug
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (searchTerm) => {
    // Guardar filtro actual para debug
    setDebug(prev => ({
      ...prev,
      activeFilters: { ...prev.activeFilters, search: searchTerm }
    }));

    let filtered = [...products];
    
    if (searchTerm) {
      filtered = products.filter((p) => {
        const nameLower = p.name?.toLowerCase() || '';
        const descLower = p.description?.toLowerCase() || '';
        const term = searchTerm.toLowerCase();
        return (nameLower.includes(term) || descLower.includes(term));
      });
    }

    console.log('Productos filtrados por búsqueda:', filtered);
    setFilteredProducts(filtered);
    setVisibleProducts(24);
  };

  // Solo se filtra por categorías
  const handleFilterChange = (filterType, value) => {
    setDebug(prev => ({
      ...prev,
      activeFilters: { ...prev.activeFilters, [filterType]: value }
    }));

    let filtered = [...products];

    if (filterType === 'categorias' && value) {
      filtered = filtered.filter(p => p.categorias.includes(value));
    }
    
    console.log('Productos filtrados por', filterType, ':', filtered);
    setFilteredProducts(filtered);
    setVisibleProducts(24);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 text-red-600">
          <p className="text-xl mb-2">Error al cargar los productos</p>
          <p>{error}</p>
          <details className="mt-4 text-left">
            <summary>Información de debug</summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded">
              {JSON.stringify(debug, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <div className="flex gap-8">
        <Sidebar 
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          products={products}
        />
        
        <div className="flex-1">
          {/* Mostrar contador de productos */}
          <div className="mb-4 text-sm text-gray-600">
            Mostrando {filteredProducts.length} productos
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.slice(0, visibleProducts).map((product) => (
              <Link 
                to={`/promocionales/product/${product.id}`} 
                key={product.id}
                className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square mb-4 relative overflow-hidden">
                  <img 
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=No+image';
                    }}
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-[#242964] font-bold text-lg mb-1">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mb-1">{product.tipo}</p>
                  {/* Si stock > 0, mostramos la cantidad; si no, no mostramos nada */}
                  {product.stock > 0 && (
                    <p className="text-sm text-green-600">
                      Stock: {product.stock}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {filteredProducts.length > visibleProducts && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleProducts(prev => prev + 24)}
                className="px-6 py-2 bg-[#242964] text-white rounded hover:bg-[#1e2255] transition-colors"
              >
                Cargar más productos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
