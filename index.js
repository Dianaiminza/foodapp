var express = require('express');
var  path =require ('path');
var  bodyParser=require('body-parser');
var config =require ('./config');
var  userRoute =require('./routes/userRoute');
var  productRoute =require ('./routes/productRoute');
var orderRoute =require ('./routes/orderRoute');
var uploadRoute =require ('./routes/uploadRoute');
var  mongoose =require ('mongoose');
var  http =require ('http');
var  Server =require('socket.io');

mongoose.connect(process.env.MONGODB_URL ||'mongodb+srv://dbUser:Captain@cluster0.w11hf.mongodb.net/food?retryWrites=true&w=majority');
const mongodbUrl = config.MONGODB_URL;
mongoose .connect(mongodbUrl, {
  useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    
  })
   .catch((error) => console.log(error.reason));
  

const app = express();
app.use(bodyParser.json());
app.use('/api/uploads', uploadRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
app.get('/api/config/google', (req, res) => {
  res.send(process.env.GOOGLE_API_KEY || 'AIzaSyA_o7FM2m9ZPRceHDT9EDgrVtFIslIQHQ8');
});
app.post('/hooks/mpesa', (req, res) => {
  console.log('-----------Received M-Pesa webhook-----------');
	
  // format and dump the request payload recieved from safaricom in the terminal
  console.log(prettyjson.render(req.body, options));
  console.log('-----------------------');
	
  let message = {
	  "ResponseCode": "00000000",
	  "ResponseDesc": "success"
	};
	
  // respond to safaricom servers with a success message
  res.json(message);
});
// app.use(express.static(path.join(__dirname, '//frontend/build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(`${__dirname}//frontend/build/index.html`));
// });

// app.listen(config.PORT, () => {
//   console.log('Server started at http://localhost:5000');
if(process.env.NODE_ENV ==='production'){
  app.use(express.static('frontend/build'));
  
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname, 'frontend','build','index.html'));
  
  });
  }
  
  const httpServer = http.Server(app);
const io =Server(httpServer, { cors: { origin: '*' } });
const users = [];

io.on('connection', (socket) => {
  console.log('connection', socket.id);
  socket.on('disconnect', () => {
    const user = users.find((x) => x.socketId === socket.id);
    if (user) {
      user.online = false;
      console.log('Offline', user.name);
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit('updateUser', user);
      }
    }
  });
  socket.on('onLogin', (user) => {
    const updatedUser = {
      ...user,
      online: true,
      socketId: socket.id,
      messages: [],
    };
    const existUser = users.find((x) => x._id === updatedUser._id);
    if (existUser) {
      existUser.socketId = socket.id;
      existUser.online = true;
    } else {
      users.push(updatedUser);
    }
    console.log('Online', user.name);
    const admin = users.find((x) => x.isAdmin && x.online);
    if (admin) {
      io.to(admin.socketId).emit('updateUser', updatedUser);
    }
    if (updatedUser.isAdmin) {
      io.to(updatedUser.socketId).emit('listUsers', users);
    }
  });

  socket.on('onUserSelected', (user) => {
    const admin = users.find((x) => x.isAdmin && x.online);
    if (admin) {
      const existUser = users.find((x) => x._id === user._id);
      io.to(admin.socketId).emit('selectUser', existUser);
    }
  });

  socket.on('onMessage', (message) => {
    if (message.isAdmin) {
      const user = users.find((x) => x._id === message._id && x.online);
      if (user) {
        io.to(user.socketId).emit('message', message);
        user.messages.push(message);
      }
    } else {
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit('message', message);
        const user = users.find((x) => x._id === message._id && x.online);
        user.messages.push(message);
      } else {
        io.to(socket.id).emit('message', {
          name: 'Admin',
          body: 'Sorry. I am not online right now',
        });
      }
    }
  });
});


httpServer.listen(process.env.PORT || 5000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
  