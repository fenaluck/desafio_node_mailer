//importando express
const express = require('express');
//importando axios
const axios = require('axios')
//importando uuid
const uuid = require('uuid');
const { resolveSoa } = require('dns');
//importando fs
const fs = require('fs').promises;
//importando libreria del email
const enviarMail = require('./email.js')
//crear app
const app = express();
//carga los servicios estatic
app.use(express.static('static'));


//ruta por defecto
app.get('/email', async(req, res)=>{
    const destinatarios = req.query.destinatarios
    const asunto = req.query.asunto
    const contenido = req.query.contenido

    // llamada de axios
    
    let divisa = await axios.get("https://mindicador.cl/api");
    divisa = divisa.data
    const dolar = divisa.dolar.valor
    const euro = divisa.euro.valor
    const uf = divisa.uf.valor
    const utm = divisa.utm.valor
    const mensaje = `
    ${contenido}
    <br>
    <hr>
    <br>
    <ul>
    <li>El valor del dolar$${dolar}</li>
    <li>El valor del euro es: ${euro}</li>
    <li>El valor de la uf es: ${uf}</li>
    <li>El valor de la utm es: ${utm}</li>
    </ul>
    <br>
    <hr>
    `
    // generamos el ID
    const id = uuid.v4();
    // generar archivo
    let archivo = `correos/${id}.txt`;

    await fs.writeFile(
        archivo,
        mensaje,
        'UTF-8',
        function(){
        console.log("archivo creado correctamente")
        });
    
    
    enviarMail(destinatarios, asunto, mensaje)
    res.send("Email enviado exitosamente")

});
//creando nuevo usuario  
app.get('/addUsuario', async(req, res)=>{
    // 1 se crea el objeto a guardar
    const newUser = {
        name:req.query.name,
        lastname: req.query.lastname,
        email: req.query.email,
        password: req.query.password
    }
    // 2 recupero la base de datos desde el archivo JSON
    let db = await fs.readFile('db.json', 'utf-8')
    db = JSON.parse(db)
    // 3 guardo el usuario
    db.usuarios.push(newUser)
    // 4 vuelvo a guardar el archivo JSON
    await fs.writeFile('db.json', JSON.stringify(newUser), 'UTF-8');
    res.send('usuario creado satisfactoriamente')
    
})


app.get('/addAuto', async (req, res) => { 
    // 1. primero creo el objeto a guardar 
    const nuevoAuto = { 
        marca: req.query.marca, 
        modelo: req.query.modelo 
    } 
    // 2. después recupero mi base de datos desde un archivo JSON 
    let db = await fs.readFile('db.json', 'utf-8') 
    db = JSON.parse(db) 
    // 3. guardo el auto 
    db.autos.push(nuevoAuto) 
    // 4. finalmente vuelvo a guardar el archivo JSON 
    await fs.writeFile('db.json', JSON.stringify(db), 'utf-8') 
    res.send('Auto guardado exitosamente')
}); 



// 4. Ejecuto el servidor
app.listen(3000, function () {
    console.log('Servidor andando en el puerto 3000')
  })
