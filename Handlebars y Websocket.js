const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Configurar el directorio de vistas
app.set('views', path.join(__dirname, 'views'));

// Configurar el directorio de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar el enrutador de vistas
app.use('/', require('./routes/views'));

// Configurar el enrutador de API
app.use('/api', require('./routes/api'));

// Configurar el WebSocket
io.on('connection', (socket) => {
  console.log('A client connected');

  // Emitir la lista de productos al cliente que se conecta
  const products = readJSONFile(PRODUCTS_FILE_PATH);
  socket.emit('products', products);

  // Escuchar eventos del cliente
  socket.on('addProduct', (product) => {
    // Lógica para agregar un producto
    // ...

    // Emitir la lista actualizada de productos a todos los clientes
    io.emit('products', products);
  });

  socket.on('deleteProduct', (productId) => {
    // Lógica para eliminar un producto
    // ...

    // Emitir la lista actualizada de productos a todos los clientes
    io.emit('products', products);
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Iniciar el servidor
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
