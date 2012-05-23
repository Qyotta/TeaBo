var fs = require('fs');

var registerRestServices = function(app) {
    fs.readdirSync('./rest').forEach(function(file) {
        var service = require('../rest/' + file.substr(0, file.length -3));
        
        if(service.rest) {
            for(var i = 0; i < service.rest.length; ++i) {
                var url = service.rest[i].url;
                var method = service.rest[i].type;
                var callback = service.rest[i].callback;
                
                switch(method){
                    case 'get':
                        app.get(url,callback);
                        break;
                    case 'post':
                        app.post(url,callback);
                        break;
                    case 'delete':
                        app.delete(url,callback);
                        break;
                    case 'put':
                        app.put(url,callback);
                        break;
                }    
            }
        } else {
            console.log('[INFO] - can\'t find rest array in \'./rest/'+file+'\'');
        }
        
    });
}

exports.registerRestServices = registerRestServices;