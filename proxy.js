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

const port = 5000;
const proxy = hoxy.createServer({ certAuthority }).listen(port, () => console.info(`The proxy is listening on port ${port}.`));

proxy.log('error warn', process.stderr);
proxy.log('info', process.stdout);

proxy.intercept({ phase: 'request' }, req => console.info(`Forwarding request: ${req.fullUrl()}`));

// We do not want to throw here because the proxy should continue to run even though it met an error
proxy.on('error', err => console.error('Error detected!', err));
process.on('uncaughtException', err => console.error('Uncaught Exception detected!', err));
