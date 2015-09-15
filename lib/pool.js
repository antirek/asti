'use strict';

var hashmap = require('hashmap');
    
var Pool = function () {
    var pool = new hashmap();

    var addClient = function (key, client) {
        console.log('add client', key, client);

        var hash = getHashmap(key);
        hash.set(client.getId(), client);
        pool.set(key, hash);

        client.onSocketEvent('disconnect', function () {
            removeClient(client);
        });

        //dump();
    };

    var dump = function () {
        pool.forEach(function (value, key) {
            console.log('key:' + key);
            value.forEach(function (item, key2) {
                console.log(key2 + ' - ' + item);
            })
        });
    }

    var getHashmap = function (key) {
        var hash = pool.get(key);
        if (!hash) hash = new hashmap();
        return hash;
    };

    var removeClient = function (client) {
        console.log('delete client', client.getId());
        pool.forEach(function (hash, key) {
            if (hash.has(client.getId())) {
                hash.remove(client.getId());
            }
        });
    };

    var getPool = function () {
        return pool;
    };

    var getClients = function (key) {
        return pool.get(key);
    };

    return {
        addClient: addClient,
        getPool: getPool,
        getClients: getClients,
        removeClient: removeClient
    };
};

module.exports = Pool;