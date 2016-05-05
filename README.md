# Landscape Deploy

Landscape-Deploy contains a Node.js shell script for executing Landscape
scripts and retrieving their results.

## Install the Dependencies

The deploy script requires the following docker image for sending commands to
the Landscape API.

- [CityOfSurrey/landscape-api](https://github.com/CityofSurrey/landscape-api).

The above docker container requires the following environment variables to
be defined:

```
export LANDSCAPE_API_URI
export LANDSCAPE_API_KEY
export LANDSCAPE_API_SECRET
```

If you are calling the deploy script with the --dev flag, the following
environment variables must be defined (instead of or in addition to those
listed above):

```
export LANDSCAPE_API_DEV_URI
export LANDSCAPE_API_DEV_KEY
export LANDSCAPE_API_DEV_SECRET
export LANDSCAPE_API_DEV_CERT_FOLDER
export LANDSCAPE_API_DEV_CERT_FILE
```

## Run the Script

Run the following command for details on how execute the deploy script:

```
landscape-deploy --help
```

If you would like to see the logs in a human-readable format, install bunyan
and deploy script as shown below:

```
npm install -g bunyan
landscape-deploy --script <id> --tag <name> [--dev] | bunyan
```

See https://github.com/trentm/node-bunyan for more information.