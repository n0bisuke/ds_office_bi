'use strict';

const express = require("express");
const http = require('http');
const mosca = require('mosca');

const HTTP_PORT = 4002;
const MQTT_PORT = 1883;

const app = express();
const httpServer = http.createServer(app);
const broker = new mosca.Server({port: MQTT_PORT});

broker.on('ready', () => console.log('Server is ready.'));
broker.on('clientConnected', client => console.log('broker.on.connected.', 'client:', client.id));
broker.on('clientDisconnected', client => console.log('broker.on.disconnected.', 'client:', client.id));
broker.on('subscribed', (topic, client) => console.log('broker.on.subscribed.', 'client:', client.id, 'topic:', topic));
broker.on('unsubscribed', (topic, client) => console.log('broker.on.unsubscribed.', 'client:', client.id));
broker.on('published', (packet, client) => {
    if (/\/new\//.test(packet.topic))return;
    if (/\/disconnect\//.test(packet.topic))return;
    console.log('broker.on.published.', 'client:', client.id);
});

app.use(express.static(__dirname + '/public'));
app.get('/',(req,res) => res.sendFile(__dirname + '/index.html'));
app.get('/chart',(req,res) => res.sendFile(__dirname + '/chart.html'));

broker.attachHttpServer(httpServer);
httpServer.listen(HTTP_PORT);

console.log(`listend HTTP *:${HTTP_PORT} / MQTT *:${MQTT_PORT}`);