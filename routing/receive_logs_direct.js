// Importing amqplib(rabbit mq) library
var amqp = require('amqplib/callback_api');

// Getting listener subjects(more than one) else exiting
var args = process.argv.slice(2);
if(args.length == 0){
    console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
    process.exit(1);
}

// Creating connection
amqp.connect("server_endpoint", function(error1, connection){
    if(error1) throw "Error1 : ".error1;

    // Creating channel
    connection.createChannel(function(error2, channel){
        if(error2) throw "Error2 : ".error2;

        // Exchange name
        var exchange = 'direct_logs';
        
        // Declaring direct exchange
        channel.assertExchange(exchange, 'direct', {
            durable : false
        });

        // First argument is set empty string for creating dynamic queue
        channel.assertQueue('', {
            exclusive : true,
        }, function(error3, q){
            if(error3) throw "Error3 : ".error3;

            console.log(' [*] Waiting for logs. To exit press CTRL+C');

            // Binding subjects with dynamic queue
            args.forEach(function(severity){
                channel.bindQueue(q.queue, exchange, severity);
            });

            // Listening for messages
            channel.consume(q.queue, function(msg){
                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
            }, {
                noAck : true
            });
        });
    });
});

// node receive_logs_direct info error