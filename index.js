const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;
const TARGET_DOMAIN = process.env.TARGET_DOMAIN; // Например: http://domain.com
const QUERY_PARAM = process.env.QUERY_PARAM || 'action'; // Например: action

app.use(cors());

app.get('/:id', (req, res) => {
    if (!TARGET_DOMAIN) {
        return res.status(500).send('Environment variable TARGET_DOMAIN is missing!');
    }

    const id = req.params.id;
    // Очищаем домен от лишнего слеша в конце, если он есть
    const cleanDomain = TARGET_DOMAIN.endsWith('/') 
        ? TARGET_DOMAIN.slice(0, -1) 
        : TARGET_DOMAIN;

    const finalUrl = `${cleanDomain}/${QUERY_PARAM}=${id}`;
    
    console.log(`Redirecting to: ${finalUrl}`);
    res.redirect(302, finalUrl);
});

// Базовый роут, чтобы проверить, что сервис жив
app.get('/', (req, res) => {
    res.send('Proxy is running. Use /your_id to redirect.');
});

app.listen(PORT, () => {
    console.log(`Server is active on port ${PORT}`);
});
