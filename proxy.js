const path = require('path');
const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const hoxy = require('hoxy');

const rootCAFolder = execSync('mkcert -CAROOT').toString('utf-8').trim();

const certLocation = path.join(rootCAFolder, 'rootCA.pem');
const keyLocation = path.join(rootCAFolder, 'rootCA-key.pem');
console.info(`Expecting root CA Cert in '${certLocation}' and Key in '${keyLocation}'.`);

const certAuthority = {
    cert: readFileSync(certLocation),
    key: readFileSync(keyLocation),
};
console.info('Root CA loaded successfully!');

const debug = process.env.FAKE_PROXY_DEBUG === 'true';
const port = process.env.FAKE_PROXY_PORT || 5000;
const proxy = hoxy.createServer({ certAuthority }).listen(port, () => console.info(`The proxy is listening on port ${port}.`));

proxy.log('error warn', process.stderr);
proxy.log('info', process.stdout);

const parseBody = req => {
    let body = null;

    if(req.buffer?.length){
        const bodyAsStr = req.buffer.toString();
        try {
            body = JSON.parse(bodyAsStr);
        } catch {
            body = bodyAsStr;
        }
        return body;
    }

    if(req.json){
        body = req.json;
        return body;
    }

    if(req.params){
        body = req.params;
        return body;
    }

    if(req.string){
        body = req.string;
        return body;
    }

    return body;
};

proxy.intercept(
    { 
        phase: 'request',
        as: 'buffer'
    },
    req => console.info(
        `Forwarding ${req.method} request to ${req.fullUrl()}${
            debug ?
            `\nHeaders: ${JSON.stringify(req.headers)}\nQuery: ${JSON.stringify(req.query)}\nBody: ${JSON.stringify(parseBody(req))}` :
            ''
        }`
    )
);

proxy.intercept(
    {
        phase: 'response',
        as: 'buffer'
    },
    (req, res) => console.info(
        `Received HTTP ${res.statusCode} from ${req.fullUrl()}${
            debug ?
            `\nBody: ${JSON.stringify(parseBody(res))}` :
            ''
        }`
    )
);

// We do not want to throw here because the proxy should continue to run even though it met an error
proxy.on('error', err => console.error('Error detected!', err));
process.on('uncaughtException', err => console.error('Uncaught Exception detected!', err));
