require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cors = require('cors')
const { API_PORT } = process.env;
const app = express();
app.use(cors())
//const router = express.Router()    
const port = process.env.PORT || API_PORT;
app.use(express.json());
// para establecer las distintas rutas, necesitamos instanciar el express router
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.set('view engine', 'html');
 
 
//app.use('/api', router)
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
// nuestra ruta irá en http://localhost:8080/api
// es bueno que haya un prefijo, sobre todo por el tema de versiones de la API
// para establecer las distintas rutas, necesitamos instanciar el express router
// Logic goes here
module.exports = app;