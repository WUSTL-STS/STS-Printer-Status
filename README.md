# Updated Printer Status Report

## Overview
This is the updated STS printer status report. Documentation can be seen on the corresponding Confluence page.

### Differences
This version of the app uses a MongoDB database to store data about the printers. Each printer is an object in the database containing all of its variables. Each printer also has an assigned maintainer, and printers are sorted into groups. 

### Running Locally
To run locally, clone the repository and cd into the directory. Run `docker-compose up --build` to build and run the app along with a MongoDB database. The app will be available at https://localhost:8080.