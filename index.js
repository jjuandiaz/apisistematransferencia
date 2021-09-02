
const app = require("./app");
const Destinatario = require('./models/destinatario');
const Transferencia = require('./models/transferencia');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require("./middleware/auth");
const axios = require('axios');


app.get('/banks', auth, (req, res) => {

  axios.get('https://bast.dev/api/banks.php')
    .then(response => {
      const headerDate = response.headers && response.headers.date ? response.headers.date : 'no response date';
      console.log('Status Code:', response.status);
      console.log('Date in Response header:', headerDate);

        console.log(response.data.banks);
        res.json({
            result: response.data.banks,
            error: false,
            message: "Listado de bancos",
        });
    })
    .catch(err => {
      console.log('Error: ', err.message);
    });
  
})
app.post('/transferencia',   (req, res) => {
    console.log("items");
    console.log(req.body);
    const destinatario = Transferencia(req.body);
    destinatario.save().then(() => {
        res.json({
            result: destinatario,
            error: false,
            message: "Fue insertado con exito",
        });
    }).catch(err  => {
        console.log(err);
        res.json({
            error: true,
            message: "Opps, ocurrio un problema",
            description : err});
    });
})

app.get('/transferencias',   (req, res) => {
    Transferencia.find().then(result=> {
       res.json({
            data: result,
            error: false,
            message: "Historico transferencias",
       });
      
   }).catch(err  => {
        console.log(err);
        res.json({
            error: true,
            message: "Opps, ocurrio un problema",
            description : err});
    });
})


app.post('/destinatario', auth, (req, res) => {
    console.log("items");
    console.log(req.body);
    const destinatario = Destinatario(req.body);
    destinatario.save().then(() => {
        res.json({
            result: destinatario,
            error: false,
            message: "Fue insertado con exito",
        });
    }).catch(err  => {
        console.log(err);
        res.json({
            error: true,
            message: "Opps, ocurrio un problema",
            description : err});
    });
})
 
app.get('/destinatario/:rut', (req, res) => {
    const rut = req.params.rut;

    Destinatario.find({}, {  rut: 19123636-4  }).toArray( result=> {
    res.json( { destinatarios: result } );
    }   ).catch(error =>console.log(error));
});
 

app.get('/destinatarios', auth, (req, res) => {
    Destinatario.find().then(destinatarios=> {
       res.json({
            data: destinatarios,
            error: false,
            message: "Listado destinatarios",
       });
      
   }).catch(err  => {
        console.log(err);
        res.json({
            error: true,
            message: "Opps, ocurrio un problema",
            description : err});
    });
})
 
app.post("user/register", async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const {email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
     return  res.status(400).send( {error : true , message : "All input is required"});
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send( {error : true , message : "User Already Exist. Please Login"}) ;
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;
 
   return  res.status(201).json({error : false , message : "login exito", data: user});
  } catch (err) {
      console.log(err);
     return  res.status(500).send( {error : true , message : "error catch"});
  }
  // Our register logic ends here
});

app.post("/login", async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
     return  res.status(400).send( {error : true , message : "All input is required"});
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;

      // user
        
        return res.status(200).json({ error: false, message: "login exito", data: user });
        
    }
     return  res.status(400).send( {error : true , message : "Invalid Credentials"});
  } catch (err) {
    console.log(err);
     return  res.status(500).send( {error : true , message : "error catch"});
  }
  // Our register logic ends here
});
 