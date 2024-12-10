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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, stocksData] = await Promise.all([
          fetchProducts(),
          fetchStocks()
        ]);

        const stocksMap = stocksData.reduce((acc, stock) => {
          acc[stock.Material] = stock.Stock;
          return acc;
        }, {});

        const processedProducts = productsData.map(product => ({
          id: product.skuPadre,
          name: product.nombrePadre,
          description: product.descripcion,
          categorias: product.categorias,
          imageUrl: product.imagenesPadre[0],
          tipo: product.hijos?.[0]?.tipo || '',
          stock: stocksMap[product.skuPadre] || 0
        }));

        setProducts(processedProducts);
        // Filtrar inicialmente solo los productos con existencias
        const productsWithStock = processedProducts.filter(product => product.stock > 0);
        setFilteredProducts(productsWithStock);
      } catch (err) {
        console.error('Error in loadData:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      // Al limpiar la búsqueda, mostrar solo productos con existencias
      const productsWithStock = products.filter(product => product.stock > 0);
      setFilteredProducts(productsWithStock);
    } else {
      const filtered = products.filter(product => 
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        product.stock > 0 // Mantener el filtro de existencias en la búsqueda
      );
      setFilteredProducts(filtered);
    }
    setVisibleProducts(24);
  };

  const handleFilterChange = (filterType, value) => {
    let filtered = [...products];
    
    if (filterType === 'categorias') {
      filtered = filtered.filter(product => 
        product.categorias === value && product.stock > 0 // Mantener el filtro de existencias
      );
    } else if (filterType === 'existencia') {
      filtered = filtered.filter(product => {
        if (value === 'disponible') {
          return product.stock > 0;
        } else if (value === 'agotado') {
          return product.stock === 0;
        }
        return true;
      });
    }
    
    setFilteredProducts(filtered);
    setVisibleProducts(24);
  };

  const loadMoreProducts = () => {
    setVisibleProducts(prev => prev + 24);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#242964] mx-auto mb-4"></div>
        <p>Cargando productos...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center p-8 text-red-600">
        <p className="text-xl mb-2">Error al cargar los productos</p>
        <p>{error}</p>
      </div>
    </div>
  );

  const displayedProducts = filteredProducts.slice(0, visibleProducts);

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <div className="flex gap-8">
        <Sidebar 
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          products={products}
        />
        
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map(product => (
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
                      e.target.src = 'https://via.placeholder.com/300x300?text=Imagen+no+disponible';
                    }}
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-[#242964] font-bold text-lg mb-1">{product.name}</h2>
                  <p className="text-gray-600 mb-1">{product.tipo}</p>
                  <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin existencias'}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {filteredProducts.length > visibleProducts && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMoreProducts}
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