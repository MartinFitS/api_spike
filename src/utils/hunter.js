const axios = require('axios');
require('dotenv').config();

const HUNTER_API_KEY = process.env.HUNTER_API_KEY;

const hunterClient = {
    verifyEmail: async (email) => {
        try {
            const url = `https://api.hunter.io/v2/email-verifier`;
            const response = await axios.get(url, {
                params: {
                    email: email,
                    api_key: HUNTER_API_KEY
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error en la verificación de email:', error.response?.data || error.message);
            throw error;
        }
    }
};

module.exports = hunterClient;