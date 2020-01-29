let fs = require('fs')
let httpProxy = require('http-proxy')
let port = 8443
let password
let clientCert

if (process.argv.length == 2) {
    help()
}

process.argv.forEach((arg) => {
    if (arg == "--help" || arg == "-h") {    
        help()
    } else {
        password = process.argv[2]
        if (process.argv[3]) {
            port = process.argv[3]
        }
    }
})

function help() {
    console.log(`
    Welcome to the world of tomorrow!
    Please move the script to the same folder as "ClientCert.pfx" and run it from there passing the certificate password as the first argument.
    You can also specify the port on which you want the script to run in a second argument(optional), standart value is 8443.
    Please keep in mind that the first argument has to contain the certificate password.
    Examples:
    proxy.exe Password123
    proxy.exe Password123 8080
    `)
    process.exit(0)
}

try {
    clientCert = fs.readFileSync(__dirname + '\\ClientCert.pfx')
} catch (error) {
    console.log("error in fs, cannot find the ClientCert.pfx file. Run proxy.exe --help or proxy.exe -h for more info.")
    console.log(error)
    process.exit(1)
}

let options = {
    target: {
        protocol: 'https:',
        host: '-',                             //CHANGEIT
        pfx: clientCert,
        passphrase: password
    },
    changeOrigin: true,
    ws: true,
    ssl: {
        pfx: fs.readFileSync(__dirname + '\\connectorCert\\localhost.p12'),
        passphrase: ('changeit')
        }
    }

let proxy = httpProxy.createProxyServer(options)

proxy.on('proxyReq', (clReq, req, res, options) => {
    console.log(req.headers)
})

proxy.listen(port, () => {console.log(`listening on port ${port}, do not close this window`)})