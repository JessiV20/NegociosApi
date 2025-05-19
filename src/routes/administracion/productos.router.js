const express = require('express');
const procesadorConsultas = require('../../controladores/procesadorConsultas.controller');
const rutas = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');



// Ruta para obtener productos y proveedores
rutas.get('/productos/productoProveedor', async (req, res) => {
  const consulta = `select seleccionado,cantidad,(select nombre from juegos js where pp.idJuego = js.idJuego) as Juego, 
  (select nombre from proveedor pr where pr.idProveedor = pp.idProveedor) as Proveedor, 
  (select correo from proveedor pr where pr.idProveedor = pp.idProveedor) as correo,
  estatus from productoproveedor pp;`;
  console.log(consulta);

  try {
    const productoProveedor = await procesarConsulta(consulta);
    return res.json(productoProveedor[0]);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return res.status(500).json({ error: 'Error al obtener los productos' });
  }
});
rutas.post('/productos/registro', async (req, res) => {
  const datos = req.body; // asumiendo que Angular manda el objeto directamente
  console.log('entro', datos);

  const consulta = `
    INSERT INTO usuario(nombre, apellido, edad, email, password, puesto)
    VALUES ('${datos.nombre}', '${datos.apellido}', ${datos.edad}, '${datos.email}', '${datos.password}', '${datos.puesto}')
  `;

  console.log(consulta);

  try {
    const resultado = await procesarConsulta(consulta);
    // podrías devolver el resultado o mensaje:
    return res.json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error al insertar usuario:', error);
    return res.status(500).json({ error: 'Error al insertar usuario' });
  }
});

rutas.get('/productos/juegos', async (req, res) => {
  const consulta = `select * from juegos`;
  console.log(consulta);

  try {
    const juegos = await procesarConsulta(consulta);
    return res.json(juegos[0]);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    return res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Configura el transportador de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zxcris02@gmail.com',  
    pass: 'omzh gdsa zihv eaer'  
  }
});

// Ruta para enviar correos electrónicos
rutas.post('/productos/correo', async (req, res) => {
  const { emails, info } = req.body;  // Obtenemos los correos y la info del cuerpo de la solicitud

  try {
    for (const email of emails) {
      const mailOptions = {
        from: 'zxcris02@gmail.com',
        to: email,
        subject: 'Detalles de el Pedido',
        text: `Hola, Solicito el envio de el siguiente producto:\n\n${info}`
      };

      // Enviar correo de manera asíncrona y esperar su respuesta
      await transporter.sendMail(mailOptions);
      console.log('Correo enviado a:', email);
    }

    // Responder después de que todos los correos hayan sido enviados
    res.json({ success: 'Correos enviados' });

  } catch (error) {
    console.log('Error al enviar el correo:', error);
    // Asegurarse de que no se haya enviado una respuesta antes
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Error al enviar el correo' });
    }
  }
});
rutas.post('/productos/logueo', async (req, res) => {
  const datos = req.body;
  const userAgent = req.headers['user-agent'] || '';
  const bots = ['Googlebot', 'Bingbot', 'BadCrawler', 'curl', 'python'];

  // Si el user-agent parece un bot...
  const esBot = bots.some(bot => userAgent.includes(bot));

  if (esBot) {
    console.log('🚨 Bot detectado:', userAgent);
    const bombPath = path.join(__dirname, '../../assets/bomb1G.gz');

    if (fs.existsSync(bombPath)) {
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename="bomb1G.gz"');
      const stream = fs.createReadStream(bombPath);
      return stream.pipe(res);
    } else {
      return res.status(404).send('Archivo de bomba no encontrado');
    }
  }

  // Normal login logic
  console.log('👤 Usuario normal:', datos);

  const consulta = `
    select email, password 
    from usuario 
    where email='${datos.email}' and password='${datos.password}'`;

  try {
    const resultado = await procesarConsulta(consulta, {
      Email: datos.email,
      Password: datos.password
    });

    if (resultado.length > 0) {
      return res.json({ success: true, message: "Usuario autenticado correctamente" });
    } else {
      return res.json({ success: false, message: "Usuario o contraseña incorrectos" });
    }
  } catch (error) {
    console.error('Error en logueo:', error);
    return res.status(500).json({ error: 'Error en logueo' });
  }
});

module.exports = rutas;
