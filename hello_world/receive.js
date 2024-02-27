// Importing amqplib(rabbit mq) library
var ampq = require('amqplib/callback_api');

// Creating connection
ampq.connect('server_endpoint', function(error1, connection){
    if(error1) throw 'Error1 : '+error1;

    // Creating channel
    connection.createChannel(function(error2, channel){
        if(error2) throw 'Error2 : '+error2;
                
        // Queue name
        var queue = 'Hello';

        //  declaration a queue, queue declaration is idempotent - it will only be created if it doesn't exist already
        channel.assertQueue(queue, function(){
            durable : false     // set True for persisting msg even after closing of RabbitMQ
        });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg){
            console.log(" [x] Received %s", msg.content.toString());
            channel.ack(msg);
        }),
        {
            noAck: false
        }
    })
    // setTimeout(function() {
    //     connection.close();
    //     process.exit(0)
    // }, 500);
});

// node receive