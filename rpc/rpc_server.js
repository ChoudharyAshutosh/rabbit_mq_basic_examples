// Importing amqplib(rabbit mq) library
var amqp = require('amqplib/callback_api');

// Creating connection
amqp.connect("server_endpoint", function(error1, connection){
    if(error1) throw "Error1 : ".error1;

    // Creating channel
    connection.createChannel(function(error2, channel){
        if(error2) throw "Error2 : ".error2;
        
        // Queue name
        var queue = 'rpc_queue';

        //  declaration a queue, queue declaration is idempotent - it will only be created if it doesn't exist already
        channel.assertQueue(queue, {
            durable : false         // set True for persisting msg even after closing of RabbitMQ
        });

        channel.prefetch(1);        // 1 for fair depatch else RabbitMQ will dispatch messages evenly
        console.log(' [x] Awaiting RPC requests');

        // Listening for messages
        channel.consume(queue, function(msg){
            var n = parseInt(msg.content.toString());
            console.log(" [.] fib(%d)", n);
            var val = fibonacci(n);         // Calculating fibonacci sum

            // Sending fibonacci sum to client
            channel.sendToQueue(msg.properties.replyTo, Buffer.from(val.toString()),{
                correlationId: msg.properties.correlationId
            });
            channel.ack(msg);       // Acknowleging msg
        });
    });
});

function fibonacci(n) {
    if (n == 0 || n == 1)
        return n;
    else
        return fibonacci(n - 1) + fibonacci(n - 2);
}

// node rpc_server