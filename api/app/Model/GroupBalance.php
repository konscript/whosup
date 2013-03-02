<?php
App::uses('AppModel', 'Model');
/**
 * GroupBalance Model
 *
 */
class GroupBalance extends AppModel {

	function getBalanceByUserId($user_id){
		$balances = $this->find('all',array(
				'conditions' => array('GroupBalance.user_id' => $user_id),
				'group' => array('GroupBalance.group_id'),
				'fields' => array('sum(GroupBalance.balance) as balance','GroupBalance.group_id')
		));

		$output = array();
		foreach ($balances as $balance){
			// debug($balance);
			$output[] = array(
				'balance' => $balance[0]['balance'],
				'group_id' => $balance['GroupBalance']['group_id']
				);
		}

		return $output;
	}

	function getBalanceByGroupId($group_id){
		// "SELECT user_id, SUM( balance ) AS balance
		// 	FROM  `group_balances`
		// 	WHERE group_id =$group_id
		// 	GROUP BY user_id");

		$balances = $this->find('all',array(
				'conditions' => array('GroupBalance.group_id' => $group_id),
				'group' => array('GroupBalance.user_id'),
				'fields' => array('sum(GroupBalance.balance) as balance','GroupBalance.user_id')
		));

		$output = array();
		foreach ($balances as $balance){
			// debug($balance);
			$output[] = array(
				'balance' => $balance[0]['balance'],
				'user_id' => $balance['GroupBalance']['user_id']
				);
		}

		return $output;
	}
}
