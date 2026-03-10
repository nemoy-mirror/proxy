const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const TARGET_DOMAIN = process.env.TARGET_DOMAIN; 
const QUERY_PARAM = process.env.QUERY_PARAM || 'action';

app.use(cors());

app.get('/:id', async (req, res) => {
    if (!TARGET_DOMAIN) {
        return res.status(500).send('Environment variable TARGET_DOMAIN is missing!');
    }

    const id = req.params.id;
    const cleanDomain = TARGET_DOMAIN.endsWith('/') ? TARGET_DOMAIN.slice(0, -1) : TARGET_DOMAIN;
    
    // Формируем полный URL для запроса
    const targetUrl = `${cleanDomain}?${QUERY_PARAM}=${id}`;

    try {
        console.log(`Fetching data from: ${targetUrl}`);
        
        // Делаем запрос к целевому серверу
        const response = await axios.get(targetUrl, {
            // Передаем заголовки, чтобы целевой сайт думал, что это обычный браузер
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            responseType: 'text' // или 'arraybuffer', если там бинарные данные (картинки)
        });

        // Отправляем полученные данные клиенту
        res.set('Content-Type', response.headers['content-type']);
        res.send(response.data);

    } catch (error) {
        console.error('Proxy Error:', error.message);
        res.status(error.response?.status || 500).send(`Error fetching data: ${error.message}`);
    }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
