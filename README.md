Pitch
--------------------

Making money lending and owes easy since 2013

Platform (Apache, PHP, MySQL)
--------------------

Install Tasksel:
`sudo apt-get install tasksel`

And the LAMP stack:
`sudo tasksel install lamp-server`

PHPMyAdmin:
`sudo apt-get install phpmyadmin`

Read more: https://help.ubuntu.com/community/ApacheMySQLPHP

DNS setup
--------------------
Add the following lines to `/etc/hosts`:
```
# Local testing
172.16.214.42   api.whosup.local whosup.local

# Pagodabox
50.97.141.37    api.whosup.com whosup.com
```

*Remember to change `172.16.214.42` to either `127.0.0.1` or the IP belonging to your local virtual machine*

Apache setup
--------------------
To point the domains ´whosup.local´ and ´api.whosup.local´ to their respective local folders, create a new virtual hosts by creating the file `/etc/apache2/sites-available/whosup`:
```
<VirtualHost *:80>
    DocumentRoot /srv/www/whosup
    ServerName  whosup.local
    LogLevel debug
</VirtualHost>

<VirtualHost *:80>
    DocumentRoot /srv/www/whosup/api
    ServerName  api.whosup.local
</VirtualHost>
```
*Remember to change `/srv/www/whosup` to your own local path*

** Last stuff **
Enable the virtual host: `sudo a2ensite whosup`
Restart Apache: `sudo service apache2 restart`

Data import
--------------------
1. Create /api/app/Config/database.php and core.php from defaults.
2. Setup MySQL database in PHPMyAdmin
3. Change dir to /api/app and run `../lib/Cake/Console/cake schema create`
4. Import test data in PHPMyAdmin (generate here: http://www.generatedata.com/#generator)
5. Create SQL views by running:

```
CREATE OR REPLACE VIEW group_balances AS
SELECT SUM(amount) as balance, group_id, payer_id as user_id FROM subtransactions
LEFT JOIN transactions on transactions.id = subtransactions.transaction_id
GROUP BY user_id, group_id
UNION
SELECT -SUM(amount) as balance, group_id, borrower_id as user_id FROM subtransactions
LEFT JOIN transactions on transactions.id = subtransactions.transaction_id
GROUP BY user_id, group_id`
```
