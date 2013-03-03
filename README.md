Pitch
--------------------

Making money lending and owes easy since 2013

Requirements
--------------------

Fucking nice LAMP stack
Nice fucking browser
A nicely fucked mood

Setup
--------------------

1) Setup LAMP stack: https://help.ubuntu.com/community/ApacheMySQLPHP
2) Create /api/app/Config/database.php and core.php from defaults.
3) Setup MySQL database in PHPMyAdmin
4) Change dir to /api/app and run ../lib/Cake/Console/cake schema create
5) Import test data in PHPMyAdmin (generate here: http://www.generatedata.com/#generator)
6) Create SQL views by running:
CREATE OR REPLACE VIEW group_balances AS
SELECT SUM(amount) as balance, group_id, payer_id as user_id FROM `subtransactions`
LEFT JOIN transactions on transactions.id = subtransactions.transaction_id
GROUP BY user_id, group_id
UNION
SELECT -SUM(amount) as balance, group_id, borrower_id as user_id FROM `subtransactions`
LEFT JOIN transactions on transactions.id = subtransactions.transaction_id
GROUP BY user_id, group_id