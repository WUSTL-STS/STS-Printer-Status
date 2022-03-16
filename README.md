# Updated Printer Status Report

## Overview

This is the updated STS printer status report. Documentation can be seen on the corresponding Confluence page.

### Differences

This version of the app uses a MongoDB database to store data about the printers. Each printer is an object in the database containing all of its variables. Each printer also has an assigned maintainer, and printers are sorted into groups defined inthe database instead of in a JSON file.

### Running Locally (Development)

0. See CONFIG.md and create the necessary config file.
1. Create a mongodb image using the command `docker run -p "27017:27017" --name "mongo" -d mongo`. This starts a mongodb container. To remove it, run `docker rm mongo`
2. Run `npm install` to install the packages locally
3. Run `npm start` to run the webserver locally. Whenever you save a file the server will restart. Hot reloading should be enabled.

### Running Locally (PRODUCTION)

0. See CONFIG.md and create the necessary config file.
1. Install docker and docker-compose. Clone the repository.
2. Run docker-compose up --build

This runs the **production** version of the server, which does not use a local VPN connection. In order to use a VPN, you'll have to run the app locally instead of inside a docker container
