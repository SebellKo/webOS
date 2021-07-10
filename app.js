const express = require('express');
const socket = require('socket.io');
const http = require('http');
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use('/css', express.static('./static/css'));
app.use('/js', express.static('./static/js'));

app.get('/', function(request, response) {
    fs.readFile('./static/index.html', function(err, data) {
        if (err) {
            response.send('error');
        }
        else {
            response.writeHead(200, {'Content-Type' : 'text/html'});
            response.write(data);
            response.end();
        }
    });
})

io.sockets.on('connection', function(socket) {
    socket.on('newUser', function(name) {
        console.log(name + ' join this group');
        socket.name = name;
        io.sockets.emit('update', {type: 'connect', name: 'server', message: name + ' is connected' });

    socket.on('message', function(data) {
        data.name = socket.name;
        console.log(data);
        socket.broadcast.emit('update', data);
    });
});

    socket.on('disconnect', function() {
        console.log(socket.name + ' lefted');

        socket.broadcast.emit('update', {type: 'disconnect', name: 'server', message: socket.name + ' lefted'});
    })
});

server.listen(3000, function() {console.log('connect!')});