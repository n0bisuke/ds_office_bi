`use strict`;

const mosca = require('mosca');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => console.log('listening on *:3000'));

/***
 * mqtt
 */
const broker = new mosca.Server({port: 1883});
io.on('connection', socket => {});
broker.on('ready', () => console.log('Server is ready.'));
broker.on('clientConnected', client =>  console.log('broker.on.connected.', 'client:', client.id));
broker.on('clientDisconnected', client => console.log('broker.on.disconnected.', 'client:', client.id));
broker.on('subscribed', (topic, client) => console.log('broker.on.subscribed.', 'client:', client.id, 'topic:', topic));
broker.on('unsubscribed', (topic, client) => console.log('broker.on.unsubscribed.', 'client:', client.id));
broker.on('published', (packet, client) => {
    //エッジデバイスからデータが送信されたら実行される処理
    if (/\/new\//.test(packet.topic)){
        return;
    }
    if (/\/disconnect\//.test(packet.topic)){
        return;
    }

    console.log('broker.on.published.', 'client:', client.id);
    const data = packet.payload.toString("utf-8");
    console.log('topic: ' + packet.topic);
    console.log('data:' + data);
    io.sockets.emit(packet.topic,{message: data});
    io.sockets.emit("co2",{message: `{"co2":${Math.random() * 100}}`});
});