# Configuration Options
There are two files within the /config folder: config.js and .env.

`.env` stores all secrets for sessions and items that should not be made public (passwords, etc). This file is not pushed to the Bitbucket repository, and must be created on each new instance of the app. Here are its required options:
- `SESSION_SECRET` = a randomly generated string for session values
- `COOKIE_SECRET` = another randomly generated string used as a secret for cookies
- `EMAIL_PASS` (in .env) = The student.technology@wustl.edu email.
  - THIS NEEDS TO BE CHANGED WITH EACH WUSTL KEY PASSWORD UPDATE.
- `SITE_PASS` (in .env) = The password for the website.
- `REPORT_TARGET` = The email to send weekly reports to


`config.js` stores all other options:

- `email_hours` = How frequently the email script should activate. Note that this value does not carry through 24 hour intervals.
  - For example: setting this to 5 will cause emails at midnight, 5am, 10am, 3pm, 8pm, and this cycle will reset -- it will not go to 1am.
- `port` = the port the web server should run on (80)
- `URI_Docker` = The database address if being run with the status report in a docker network
- `URI_Local` = The database address if being run separate from the app (in a separate container or fully locally)
- `toner_email_percentage` = The threshold for a toner cartridge to be marked low
- `table_red_threshold` = The threshold for a toner cell to be marked as red on the report
- `global_email` = Universal email switch. If false, no emails will be sent by the app.
