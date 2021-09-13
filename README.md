# Updated Printer Status Report

## Overview

This is the updated STS printer status report. Documentation can be seen on the corresponding Confluence page.

### Differences

This version of the app uses a MongoDB database to store data about the printers. Each printer is an object in the database containing all of its variables. Each printer also has an assigned maintainer, and printers are sorted into groups defined inthe database instead of in a JSON file.

### Running Locally

To run locally, first install [docker](https://docs.docker.com/get-docker/) and [docker compose](https://docs.docker.com/compose/install/) (note - Mac users do not need to install compose separately). Clone the repository and cd into the directory. Run `docker-compose up --build` to build and run the app along with a MongoDB database. The app will be available at <https://localhost:8080>.

For some reason the past few times I've compiled the program for the first time using docker compose, I've gotten an error saying the container for node:latest could not be fetched. In that case, run `docker pull node:latest` and try again.

### Alternative Options

You technically don't need docker to run the app. Install a local instance of mongodb and run `npm install` when in the directory and then run `npm start`.

## IMPORTANT OID's

- 1.3.6.1.2.1.1.5.0 -- Tray levels. 0 is none, -3 is some amount of paper left. [Bypass, 2, 3, 4, 5]
- 1.3.6.1.2.1.43.11.1.1.9.1 -- Toner levels. [Blk, Cyn, Mag, Yel, image transfer, fuser, document]

(see this reddit article for information https://www.reddit.com/r/sysadmin/comments/1qq73y/how_to_monitor_hp_tonerpaper_levels_through_snmp/)

## SNMP command

To run the command to pull the data from the computer the following command should be followed

snmpwalk -c public [IP_address] [OID]

# TODO

- Edit printer values without fully deleting the printer
- Write scripts