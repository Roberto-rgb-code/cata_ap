const API_URL = 'https://promocionalesenlinea.net/api';

const headers = {
    'Content-Type': 'application/json'
};

const credentials = {
    user: "GDL3099",
    password: "NKEwuUIilPPfzNOVzlQu"
};

export const fetchProducts = async () => {
    try {
        console.log('Fetching products...');
        const response = await fetch(`${API_URL}/all-products`, {
            method: 'POST',
            headers,
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Products data:', data);
        
        if (data.success) {
            return data.response;
        }
        throw new Error('Error al obtener productos');
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const fetchStocks = async () => {
    try {
        console.log('Fetching stocks...');
        const response = await fetch(`${API_URL}/all-stocks`, {
            method: 'POST',
            headers,
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Stocks data:', data);
        
        if (data.success) {
            return data.Stocks;
        }
        throw new Error('Error al obtener existencias');
    } catch (error) {
        console.error('Error fetching stocks:', error);
        throw error;
    }
};