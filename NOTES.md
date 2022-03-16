## IMPORTANT OID's

- 1.3.6.1.2.1.43.8.2.1.10 -- Tray levels. 0 is none, -3 is some amount of paper left. [Bypass, 2, 3, 4, 5]
- 1.3.6.1.2.1.43.11.1.1.9.1 -- Toner levels. [Blk, Cyn, Mag, Yel, image transfer, fuser, document]

(see the following articles for information 
- https://www.reddit.com/r/sysadmin/comments/1qq73y/how_to_monitor_hp_tonerpaper_levels_through_snmp/
- https://secure.n-able.com/webhelp/nc_7-2-0_cust_en/content/n-central/Services/Services_PrinterPaperSupplyLevel.html
- https://iphostmonitor.com/monitoring-toner-level-in-snmp-capable-hp-printer.html
)

## SNMP command

To run the command to pull the data from the computer the following command should be followed

snmpwalk -c public [IP_address] [OID]