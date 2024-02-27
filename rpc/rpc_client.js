// Importing amqplib(rabbit mq) library
var amqp = require('amqplib/callback_api');

// Getting number argument else exiting
var args = process.argv.slice(2);
if (args.length == 0) {
  console.log("Usage: rpc_client.js num");
  process.exit(1);
}

// Creating connection
amqp.connect("server_endpoint", function(error1, connection){
    if(error1) throw "Error1 : ".error1;

    // Creating channel
    connection.createChannel(function(error2, channel){
        if(error2) throw "Error2 : ".error2;

        // Receiver(Reply) Queue name
        var queue = 'rpc_queue';

        // First argument is set empty string for creating dynamic queue
        channel.assertQueue('', {
            exclusive : true
        }, function(error3, q){
            if(error3) throw "Error3 : ".error3;

            // Generating unique Id
            var correlationId = generateUuid();
            var num = parseInt(args[0]);
            console.log(' [x] Requesting fib(%d)', num);

            // Listening fo messages
            channel.consume(q.queue, function(msg){
                if (msg.properties.correlationId == correlationId){
                    console.log(' [.] Got %s', msg.content.toString());
                    setTimeout(function() {
                        // Closing connection
                        connection.close();
                        process.exit(0)
                    }, 500);
                }
            }, {
                noAck : true
            });

            // Sending request for getting fibonacci sumed
            channel.sendToQueue(queue, Buffer.from(num.toString()),{
                correlationId : correlationId,
                replyTo : q.queue
            });
        });
    });
});

function generateUuid() {
    return  Math.random().toString() +
            Math.random().toString() +
            Math.random().toString();
}

// node rpc_client 10