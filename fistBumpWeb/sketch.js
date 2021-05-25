/*
    p5.js MQTT Client example
    This example uses p5.js: https://p5js.org/
    and the Eclipse Paho MQTT client library: https://www.eclipse.org/paho/clients/js/
    to create an MQTT client that sends and receives MQTT messages.
    The client is set up for use on the shiftr.io test MQTT broker (https://next.shiftr.io/try),
    but has also been tested on https://test.mosquitto.org

    created 12 June 2020
    modified 23 Nov 2020
    by Tom Igoe
*/

// MQTT client details:
let broker = {
    hostname: 'public.cloud.shiftr.io',
    port: 443
};
// MQTT client:
let client;
// client credentials:
// For shiftr.io, use try for both username and password
// unless you have an account on the site. 
let creds = {
    clientID: 'p5Client',
    userName: 'public',
    password: 'public'
}
// topic to subscribe to when you connect
// For shiftr.io, use whatever word you want for the subtopic
// unless you have an account on the site. 

let topic = 'fistbump';

// HTML divs for local and remote messages
let localDiv;
let remoteDiv;
// position of the circle
let xPos, yPos;

function setup() {
    createCanvas(400, 400);
    // Create an MQTT client:
    client = new Paho.MQTT.Client(broker.hostname, broker.port, creds.clientID);
    // set callback handlers for the client:
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    // connect to the MQTT broker:
    client.connect(
        {
            onSuccess: onConnect,       // callback function for when you connect
            userName: creds.userName,   // username
            password: creds.password,   // password
            useSSL: true                // use SSL
        }
    );
    // create a div for local messages:
    localDiv = createDiv('local messages will go here');
    localDiv.position(20, 50);

    // create a div for the response:
    remoteDiv = createDiv('waiting for messages');
    remoteDiv.position(20, 80);
    noStroke();
}

function draw() {
    background(255);
    circle(width/2, height/2, 30);
}


function mousePressed() {
    sendMqttMessage('170' );
    fill(50);
		localDiv.html('I sent a fistbump!');
}

function mouseReleased(){
	sendMqttMessage('10');
    fill(200);
	localDiv.html('I withdrew my fist');
}

// called when the client connects
function onConnect() {
    localDiv.html('client is connected');
    remoteDiv.html('topic is ' + topic);
    client.subscribe(topic);
}

// called when the client loses its connection
function onConnectionLost(response) {
    if (response.errorCode !== 0) {
        localDiv.html('onConnectionLost:' + response.errorMessage);
    }
}

// called when a message arrives
function onMessageArrived(message) {
    remoteDiv.html('I got a message:' + message.payloadString);
}

// called when you want to send a message:
function sendMqttMessage(msg) {
    // if the client is connected to the MQTT broker:
    if (client.isConnected()) {
        // start an MQTT message:
        message = new Paho.MQTT.Message(msg);
        // choose the destination topic:
        message.destinationName = topic;
        // send it:
        client.send(message);
        // print what you sent:
        // localDiv.html('I sent: ' + message.payloadString);
    }
}
