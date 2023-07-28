const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3500;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const users = require('./routes/users');
const occurrences = require('./routes/occurrences');



app.use(cors());
app.use(express.json());
app.use(cookieParser());
// app.get('/', (req, res) => {
//     res.send('hi')
// })

app.use('/', users);
app.use('/', occurrences);

app.listen(PORT, () => console.log(`Server iniciado na porta ${PORT}`));

