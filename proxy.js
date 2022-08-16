const hoxy = require('hoxy');

const port = 5000;
const proxy = hoxy.createServer().listen(port, () => console.log(`The proxy is listening on port ${port}.`));

proxy.log('error warn', process.stderr);
proxy.log('info', process.stdout);

proxy.intercept({ phase: 'request' }, req => console.log(`Forwarding request: ${req.fullUrl()}`));
