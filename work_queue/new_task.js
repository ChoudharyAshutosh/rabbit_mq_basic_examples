// Importing amqplib(rabbit mq) library
var amqp = require('amqplib/callback_api');

// Creating connection
amqp.connect('server_endpoint', function(error1, connection){
    if(error1) throw 'Error1 : '+error1;

    // Creating channel
    connection.createChannel(function(error2, channel){
        if(error2) throw 'Error2 : '+error2;
                
        // Queue name
        var queue = 'new_task';

        // Queue message taking from shell with default msg "Hello World!"
        var msg = process.argv.slice(2).join(' ') || "Hello world!";

        //  declaration a queue, queue declaration is idempotent - it will only be created if it doesn't exist already
        channel.assertQueue(queue, {
            durable : true     // True for persisting msg even after closing of RabbitMQ
        });

        // Pushing message to queue
        channel.sendToQueue(queue, Buffer.from(msg), {
            persistent : true       // True for persisting msg to memory but persistent guarantees are not strong
        });
        console.log(" [x] Sent '%s'", msg);
    });
    setTimeout(function() {
        // Closing connection
        connection.close();
        process.exit(0)
    }, 500);
});

// node new_task First.
// node new_task Second..
// node new_task Third...
// node new_task Fourth....
// node new_task Fifth.....