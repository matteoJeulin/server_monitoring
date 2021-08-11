# server_monitoring
Server monitoring tool.

Enter your personal credentials in config/config-sample.json and rename the file to config.json.

To use formMonitoring, create a google api project, enter your credentials in config.json and put your token.json file in the config directory.
To create your credentials for googleapi, follow the instructions on this link: https://developers.google.com/adwords/api/docs/guides/authentication?hl=fr#webapp . 
When you first launch formMonitoring, it will ask you to click on a link. Do so, copy the code in the taskbar (between code= and &) and paste it in the console. This will create your token.

connectionMonitoring monitors your database using a mysql command and logs the result.

databaseMonitoring monitors the response time of your database by connecting to it and checking if a certain command works. It then logs the response time.

display displays all of your logs on a HTML page in the form of boxes. You can click each individual box to get a graph of the logs as well as the log itself. There is also a functionnality which allows you to display only the results around a certain time (date + or - delta).

formMonitoring monitors differnt forms on a certain website by filling them out and checking for the appropriate response such as an email or a specific page opening, etc.

serverMonitoring monitors the logs of the perfromance of your servers that are created using bash commands in the bin directory. 

siteMonitoring checks if any given site is down by looking for a certain string in the page code. If the site takes too long to respond or doesn't contain the specified string, it is considered down and executes a bash command of your choosing. It also logs the response time of the site.

socketMonitoring monitors the sockets of your server by connecting to it and checking and logging the maximum number of users that are connected in a certain timeframe. If the socket doesn't respond after a given time, it logs an error and executes a bash command of your choosing.

zeromqMonitoring monitors zmq sockets and logs the number of responses in a given timeframe. It can execute a bash command if it detects an error.