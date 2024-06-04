# How to

_For now, this project is targetting Windows (personal needs)._

## Notes

This should work with node LTS (18.19.0 as of today).

This project was created in order for offshore colleagues to have a pass-through proxy running under the same port as local developers. With this, we can run the same project and set of settings on different computer configurations.

## Certificates

1. Install [mkcert](https://github.com/FiloSottile/mkcert).
2. Run `mkcert -install`

## Usage

## Install

Run `npm i`

## Run

_TL;DR: `npm run start`_

### Environment Variables

- `process.env.FAKE_PROXY_PORT` (default: 5000) - The port where the proxy will run.
- `process.env.FAKE_PROXY_DEBUG` (default: none) - If set to 'true', will output debug information.
- `process.env.FAKE_PROXY_THROTTLE_MS` (default: none) - If set, will throttle the response time in milliseconds.

### Available scripts

- `npm run start` - Start the proxy on port 5000.
- `npm run start:another-port` - Start the proxy on port 5001.
- `npm run start:debug:verbose` - Start the proxy on port 5002 with verbose debug information.
- `npm run start:slow` - Start the proxy on port 5002 with a 10 seconds delay on every request.
