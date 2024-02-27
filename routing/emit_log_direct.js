// Importing amqplib(rabbit mq) library
var amqp = require('amqplib/callback_api');

// Creating connection
amqp.connect("server_endpoint", function(error1, connection){
    if(error1) throw "Error1 : ".error1;

    // Creating channel
    connection.createChannel(function(error2, channel){
        if(error2) throw "Error2 : ".error2;

        // Exchange name
        var exchange = 'direct_logs';
        var args = process.argv.slice(2);     // subject name
        var msg = args.slice(1).join(' ') || 'Hello World!';       // Msg from node command or "Hello World!"
        var severity = args.length > 0 ? args[0] : 'info';

        // Declaring direct exchange (broadcasts only to selected subjects, can listen for one subjects at a time)
        channel.assertExchange(exchange, 'direct', {
            durable : false
        });

        // Publishing to selected subject(severity)
        channel.publish(exchange, severity, Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", severity, msg);
    });

    setTimeout(function() {
        // Closing connection
        connection.close();
        process.exit(0)
    }, 500);
})

// node emit_log_direct info "It is info msg"
// node emit_log_direct error "It is an error"