'use strict';

const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost');

client.on('connect', () => console.log('publisher.connected.'));

const random = () => {
    const min = 10;
    const max = 80;
    return Math.floor( Math.random() * (max + 1 - min) ) + min;
}

setInterval(() => {
    // const message = Date.now().toString();
    const message = {
        humidity: random(),
        temperature: random(),
        co2: random(),
    };
    client.publish('n0bisuke', JSON.stringify(message));
    console.log('publisher.publish:', message);
}, 1000);