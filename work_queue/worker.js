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

        //  declaration a queue, queue declaration is idempotent - it will only be created if it doesn't exist already
        channel.assertQueue(queue, {
            durable : true     // True for persisting msg even after closing of RabbitMQ
        });
        channel.prefetch(1);    // 1 for fair depatch else RabbitMQ will dispatch messages evenly
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg){
            let secs = msg.content.toString().split('.').length - 1;
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(function(){
                console.log('[X] Done');
                channel.ack(msg);
            },secs * 1000);
        },{
            noAck : false
        })
    });
});

/* Run two instance in separate windows or tabs */
// node worker