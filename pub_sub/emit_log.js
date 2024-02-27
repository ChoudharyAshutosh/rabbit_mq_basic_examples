// Importing amqplib(rabbit mq) library
var amqp = require('amqplib/callback_api');

// Creating connection
amqp.connect("server_endpoint", function(error1, connection){
    if(error1) throw 'Error1 : '+error1;

    // Creating channel
    connection.createChannel(function(error2, channel){
        if(error2) throw 'Error2 : '+error2;

        // Exchange name
        var exchange = 'logs';

        // Getting msg from node command or "Hello World!" as default
        var msg = process.argv.slice(2).join(' ') || 'Hello World!';

        // Declaring fanout exchange
        channel.assertExchange(exchange, 'fanout', {
            durable : false
        });

        // Publishing to "logs" exchange
        channel.publish(exchange, '', Buffer.from(msg));
    })

    setTimeout(()=>{
        // Closing connection
        connection.close();
        process.exit(0);
    }, 500);
});

// node emit_log "Hi I am here." "Where are you?"