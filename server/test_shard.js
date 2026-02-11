const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://minoshimadurapperuma:2002minoshimadurapperuma@ac-wylh5th-shard-00-00.h5v2oi5.mongodb.net:27017/EVENTRA?ssl=true&authSource=admin&retryWrites=true';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to shard 0 successfully');
        const replSetName = mongoose.connection.getClient().topology.description.topologyId;
        console.log('Replica Set ID:', replSetName);
        process.exit(0);
    })

    .catch(err => {
        console.error('Shard connection failed:', err.message);
        process.exit(1);
    });
