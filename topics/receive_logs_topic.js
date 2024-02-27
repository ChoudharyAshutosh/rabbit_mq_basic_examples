// Importing amqplib(rabbit mq) library
var amqp = require('amqplib/callback_api');

// Getting "." separated listener subjects(more than one) else exiting
var args = process.argv.slice(2);
if (args.length == 0) {
  console.log("Usage: receive_logs_topic.js &lt;facility&gt;.&lt;severity&gt;");
  process.exit(1);
}

// Creating connection
amqp.connect("server_endpoint", function(error1, connection){
    if(error1) throw "Error1 : ".error1;

    // Creating channel
    connection.createChannel(function(error2, channel){
        if(error2) throw "Error2 : ".error2; 
        // Exhange name
        var exchange = 'topic_logs';
        
        // Declaring topic exchange
        channel.assertExchange(exchange, 'topic', {
            durable : false
        });

        // // First argument is set empty string for creating dynamic queue
        channel.assertQueue('', {
            exclusive : true
        }, function(error3, q){
            if(error3) throw "Error3 : ".error3;

            console.log(' [*] Waiting for logs. To exit press CTRL+C');
            // Binding topics(abc.xyz, a.b.# etc.) with dynamic queue
            args.forEach(function(key){
                channel.bindQueue(q.queue, exchange, key);
            });

            // Listening for messages
            channel.consume(q.queue, function(msg){
                console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
            }, {
                noAck : true
            });
        });
    });
});

/* "*" represent only one postion and "#" represent more than one position */
// node receive_logs_topic "color.speed"
// node receive_logs_topic "*.height" "weight.#"