// Importing amqplib(rabbit mq) library
var amqp = require('amqplib/callback_api');

// Creating connection
amqp.connect("server_endpoint", function(error1, connection){
    if(error1) throw "Error1 : ".error1;

    // Creating channel
    connection.createChannel(function(error2, channel){
        if(error2) throw "Error2 : ".error2;

        // Exchange name
        var exchange = 'logs';
        
        // Declaring fanout exchange
        channel.assertExchange(exchange, 'fanout', {
            durable : false
        });

        // First argument is set empty string for creating dynamic queue
        channel.assertQueue('', {
            exclusive : true,
        }, function(error3, q){
            if(error3) throw "Error3 : ".error3;

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

            // Binding dynamic quque to "logs" exchange
            channel.bindQueue(q.queue, exchange, '');

            // Listening for messages
            channel.consume(q.queue, function(msg){
                if(msg.content){
                    console.log(" [x] %s", msg.content.toString());
                }
            }, {
                noAck : true
            });
        });
    });
});

// node receive_logs