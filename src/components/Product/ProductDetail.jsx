import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProducts, fetchStocks } from "../../services/api.js";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const colorHexMap = {
    blanco: "#ffffff",
    rojo: "#ff0000",
    azul: "#0000ff",
    negro: "#000000",
    amarillo: "#ffff00",
    verde: "#008000",
    BEIGE: "#f5f5dc",
    naranja: "#ffa500",
    MORADO: "#e800080",

  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, stocksData] = await Promise.all([
          fetchProducts(),
          fetchStocks(),
        ]);

        const stocksMap = stocksData.reduce((acc, stock) => {
          acc[stock.Material] = stock.Stock;
          return acc;
        }, {});

        const foundProduct = productsData.find((p) => p.skuPadre === id);

        console.log("Producto encontrado:", foundProduct); // Depuración

        if (foundProduct) {
          setProduct({
            id: foundProduct.skuPadre,
            name: foundProduct.nombrePadre,
            images: [
              ...foundProduct.imagenesPadre,
              ...(foundProduct.hijos[0]?.imagenesHijo || []),
            ],
            description: foundProduct.descripcion,
            category: foundProduct.categorias,
            tipo: foundProduct.hijos[0]?.tipo || "",
            stock: stocksMap[foundProduct.skuPadre] || 0,
            colors:
              foundProduct.hijos?.map((hijo) => ({
                nombre: hijo.color || "Sin color",
                stock: stocksMap[hijo.skuHijo] || 0,
                colorHex:
                  hijo.colorHex || colorHexMap[hijo.color?.toLowerCase()] || "#ffffff", // Asocia HEX
              })) || [],
            details: {
              descripcion: foundProduct.descripcion,
              categoria: foundProduct.categorias,
              tamanoProducto: foundProduct.paquete?.medidas || "1 x 14",
              tamanoCaja: foundProduct.paquete?.medidas || "",
              piezasPorCaja: foundProduct.paquete?.PiezasCaja || "",
              tecnicaImpresion: foundProduct.impresion?.tecnicaImpresion || "",
              areaImpresion: foundProduct.impresion?.areaImpresion || "",
            },
          });

          // Obtener productos relacionados
          const related = productsData
            .filter(
              (p) =>
                p.categorias === foundProduct.categorias &&
                p.skuPadre !== id
            )
            .slice(0, 6)
            .map((p) => ({
              id: p.skuPadre,
              name: p.nombrePadre,
              imageUrl: p.imagenesPadre[0],
              tipo: p.hijos?.[0]?.tipo || "",
              stock: stocksMap[p.skuPadre] || 0,
            }));
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#242964]"></div>
      </div>
    );

  if (!product)
    return <div className="text-center p-8">Producto no encontrado</div>;

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        <div>
          <div className="aspect-square mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, index) => (
              <div
                key={index}
                className={`aspect-square border p-1 cursor-pointer ${
                  selectedImage === index
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {/* Detalles del producto */}
          <h2 className="font-semibold mt-6 mb-4">Detalles del producto</h2>
          <div className="bg-gray-50 p-6 rounded">
            {Object.entries(product.details).map(([key, value]) => (
              <div key={key} className="grid grid-cols-2 gap-4 mb-2">
                <span className="font-medium capitalize">
                  {key
                    .charAt(0)
                    .toUpperCase() +
                    key.slice(1).replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span>{value}</span>
              </div>
            ))}

            {/* Lista de colores y existencias */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Colores y existencias</h3>
              <table className="table-auto w-full mt-2 text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Color</th>
                    <th className="p-2">Existencia</th>
                    <th className="p-2 text-center">Etiqueta</th>
                  </tr>
                </thead>
                <tbody>
                  {product.colors.map((color, index) => (
                    <tr key={index} className="border-b">
                      {/* Nombre del color */}
                      <td className="p-2 capitalize">{color.nombre}</td>

                      {/* Existencia */}
                      <td className="p-2">{color.stock.toLocaleString()}</td>

                      {/* Círculo del color */}
                      <td className="p-2 text-center">
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300 mx-auto"
                          style={{
                            backgroundColor: color.colorHex,
                          }}
                        ></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Existencia general */}
          <div className="mt-4">
            <p className="text-sm">
              Existencia total: {product.stock.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
