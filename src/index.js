const express = require('express');
const bodyParser = require('body-parser');


const cors = require('cors');





const app = express();

app.set('trust proxy', true);

app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

const rutasAdministracion = {
	productos: require('./routes/administracion/productos.router')
}


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin'
    + ', X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method,token');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});
app.use(cors());

app.use('/api/' + 'administracion/', rutasAdministracion.productos)


const port = 4300 || 5000 ;
app.listen(port, () => {
    console.log(`Servidor ejecutándose en el puerto ${port}`);
});