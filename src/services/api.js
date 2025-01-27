import he from 'he';

const API_URL = 'https://promocionalesenlinea.net/api';

const headers = {
  'Content-Type': 'application/json'
};

const credentials = {
  user: "GDL3099",
  password: "NKEwuUIilPPfzNOVzlQu"
};

const decodeHtmlEntities = (obj) => {
  if (typeof obj === 'string') {
    return he.decode(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(decodeHtmlEntities);
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, decodeHtmlEntities(value)])
    );
  }
  return obj;
};

export const fetchProducts = async () => {
  try {
    console.log('[API] Iniciando fetch de productos...');
    
    const response = await fetch(`${API_URL}/all-products`, {
      method: 'POST',
      headers,
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    console.log('[API] Respuesta productos (raw):', data);

    // Validación más flexible de la respuesta
    if (!data) {
      throw new Error('No se recibieron datos de la API');
    }

    // Verificar si data.response existe y es un array
    const products = Array.isArray(data.response) ? data.response : 
                    Array.isArray(data.products) ? data.products :
                    Array.isArray(data) ? data : null;

    if (!products) {
      throw new Error('Formato de respuesta inválido: no se encontró el array de productos');
    }

    const decodedProducts = decodeHtmlEntities(products);
    console.log('[API] Productos decodificados:', decodedProducts);

    return decodedProducts;

  } catch (error) {
    console.error('[API] Error en fetchProducts:', error);
    throw new Error(`Error al obtener productos: ${error.message}`);
  }
};

export const fetchStocks = async () => {
  try {
    console.log('[API] Iniciando fetch de stocks...');
    
    const response = await fetch(`${API_URL}/all-stocks`, {
      method: 'POST',
      headers,
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    console.log('[API] Respuesta stocks (raw):', data);

    // Validación más flexible de la respuesta
    if (!data) {
      throw new Error('No se recibieron datos de la API');
    }

    // Verificar diferentes propiedades donde podrían venir los stocks
    const stocks = Array.isArray(data.Stocks) ? data.Stocks :
                  Array.isArray(data.stocks) ? data.stocks :
                  Array.isArray(data.response) ? data.response :
                  Array.isArray(data) ? data : null;

    if (!stocks) {
      throw new Error('Formato de respuesta inválido: no se encontró el array de stocks');
    }

    const decodedStocks = decodeHtmlEntities(stocks);
    console.log('[API] Stocks decodificados:', decodedStocks);

    return decodedStocks;

  } catch (error) {
    console.error('[API] Error en fetchStocks:', error);
    throw new Error(`Error al obtener stocks: ${error.message}`);
  }
};