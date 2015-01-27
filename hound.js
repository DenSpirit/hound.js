var net = require('net');
var fs = require('fs');

var port = 25600;
var vpnPidfile = '/run/openvpn@minsk.pid'
var gotdata = false;
var hostarr = process.argv[2].split('.');
//port trying and logging
function initiation(host, port) {
        var connection = new net.Socket();
        connection.on('error', function(err) {
                console.log(host + ' is bad.');
            })
            .on('end', function() {
                if (gotdata === false) {
                    console.log(host + ':' + 'nothing');
                }
            })
            .on('data', function(data) {
                gotdata = true;
                var data = JSON.parse(data);
                console.log(data);
                console.log(host + ' is our signet.');
                process.exit(0);
            })
            .on('connect', function() {
                console.log(host + ':' + 'connected');
            });
        connection.connect(port, host);
    }
    //host attempting wrapper
function attempt(host) {
        initiation(host, port);
    }
    //main code here
if (!fs.existsSync(vpnPidfile)) {
    console.error('vpn is down');
    process.exit(1);
}
if (hostarr[3] !== "0") {
    console.log('single host');
    attempt(process.argv[2]);
} else {
    console.log('multiple hosts');
    for (var i = 1; i < 254; i++) {
        nhost = hostarr.slice();
        nhost[3] = i;
        attempt(nhost.join('.'));
    }
}