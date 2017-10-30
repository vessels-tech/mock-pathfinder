# mock-pathfinder
A mock PathFinder server for development and testing. 

The server has two different endpoints, one that supports the PathFinder Query API over DNS, and one that supports the PathFinder Provisioning API over SOAP.

The project is intended to fully replace the PathFinder service with a local version for testing and development purposes. It is not intended to be a replacement for production usage.

Contents:

- [Deployment](#deployment)
- [Configuration](#configuration)
- [API](#api)
- [Logging](#logging)
- [Tests](#tests)

## Deployment

To run the server locally outside of Docker, run the command `npm start` from the command line. This will start the service and open two ports, 15353 over UDP and 8080 over TCP.

### Deploy to Docker

To run the server in your local Docker environment, run the command `npm run dev` to build and run the container. This will start the service in Docker and open two ports, 15353 over UDP and 8080 over TCP.

## Configuration

### Environment variables
mock-pathfinder has a handful of options that can be configured through environment variables. Values can also be set in the file `config/default.json`, but environment variables are preferred.

| Environment variable | Description | Default values | Example values |
| -------------------- | ----------- | ------ | ------ |
| MOPF\_DATABASE\_URI | The connection string for the database mock-pathfinder will use. Postgres is currently the only supported database. | n/a | postgres://\<username>:\<password>@localhost:5678/mock_pathfinder |
| MOPF\_QUERY\__PORT | The UDP port the Query API will exposed on. | 15353 | 15353
| MOPF\_QUERY\_\_DEFAULT\_RECORD | The default record will always be returned as a NAPTR record for a phone number retrieved through the Query API. | | |
| MOPF\_QUERY\_\_DEFAULT\_RECORD\_order | The order value for the default NAPTR record. | 10 | 1 |
| MOPF\_QUERY\_\_DEFAULT\_RECORD\_preference | The preference value for the default NAPTR record. | 50 | 30 |
| MOPF\_QUERY\_\_DEFAULT\_RECORD\_flags | The flags value for the default NAPTR record. | u | u |
| MOPF\_QUERY\_\_DEFAULT\_RECORD\_service | The service value for the default NAPTR record. | E2U+pstn:tel | |
| MOPF\_QUERY\_\_DEFAULT\_RECORD\_regexp | The regular expression value for the default NAPTR record. This value includes the URI and the regular expression separated by a !. | !^(.*)$!tel:\\1;q_stat=102! | |
| MOPF\_QUERY\_\_DEFAULT\_RECORD\_replacement | The replacement value for the default NAPTR record. |  |  |
| MOPF\_QUERY\_\_DEFAULT\_RECORD\_ttl | The time-to-live value for the default NAPTR record. | 900 | 300 |
| MOPF\_PROVISIONING\__PORT | The TCP port the Provisioning API will be exposed on. | 8080 | 8080 |
| MOPF\_PROVISIONING\__PATH | The URI path the SOAP Provisioning API will respond on. | /nrs-pi/services/SIPIX/SendRequest | |
| MOPF\_PROVISIONING\_\_WSDL_FILE | The absolute path to the WSDL file the SOAP Provisioning API will use. | ./sipix-2.0.0.wsdl | |
| MOPF\_PROVISIONING\_\_DEFAULT\_CUSTOMER\_ID | The default Customer ID returned by the Provisioning API. | 1234 | 1234 |

## API

For documentation of the endpoints, see the [API documentation](API.md). There is also a list of limitations and differences between mock-pathfinder and the PathFinder service.

## Logging

Logs are sent to standard output by default.

## Tests

Tests include unit and integration.

    
Unit tests can be ran by running:



    npm test
    
Integration tests can be ran by running:



    npm run test:integration


Unit tests include code coverage via istanbul. See the test/ folder for testing scripts.