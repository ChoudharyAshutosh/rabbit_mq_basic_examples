// Importing amqplib(rabbit mq) library
var amqp = require('amqplib/callback_api');

// Creating connection
amqp.connect("server_endpoint", function(error1, connection){
    if(error1) throw "Error1 : ".error1;

    // Creating channel
    connection.createChannel(function(error2, channel){
        if(error2) throw "Error2 : ".error2;
        // Exhange name
        var exchange = 'topic_logs';
        var args = process.argv.slice(2);       // Getting subjects or topics, separated by '.'
        var key = (args.length > 0) ? args[0] : 'anonymous.info';   // Default topic
        var msg = args.slice(1).join(' ') || 'Hello World!';

        // Declaring topic exchange (broadcasts only to selected subjects, can listen for multiple subjects at a time)
        channel.assertExchange(exchange, 'topic', {
            durable : false
        });

        // Publishing to topic
        channel.publish(exchange, key, Buffer.from(msg));
        console.log(" [x] Sent %s:'%s'", key, msg);
    });

    setTimeout(function() {
        // Closing connection
        connection.close();
        process.exit(0)
    }, 500);
});
/* "*" represent only one postion and "#" represent more than one position */
// node emit_log_topic "color.speed" "Color of fastest car is red"
// node emit_log_topic "*.height" "It is height sea level"
// node emit_log_topic "weight.#" "It weighs 20 KG only"