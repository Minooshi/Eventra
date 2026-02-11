const dns = require('dns');
dns.setServers(['8.8.8.8']);
dns.resolveSrv('_mongodb._tcp.eventra.h5v2oi5.mongodb.net', (err, addresses) => {

    if (err) {
        console.error('DNS Error:', err);
        process.exit(1);
    }
    console.log(JSON.stringify(addresses, null, 2));
});
