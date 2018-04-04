var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    files: "src/**",
    forceDownload: true,
    zip: false,
    platforms: ['win64']
});

// Log stuff you want
nw.on('log',  console.log);

nw.build().then(function () {
    console.log('all done!');
}).catch(function (error) {
    console.error(error);
});