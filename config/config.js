const config = {}
config.email_hours = 3
config.toner_email_percentage = 3
config.table_red_threshold = 10
config.port = 80
config.URI_Docker = 'mongodb://mongo:27017/printerstatus'
config.URI_Local = 'mongodb://localhost:27017/printerstatus'
config.report_target = 'jackheuberger@wustl.edu'

config.global_email = true

module.exports = config
