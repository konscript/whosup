<?php
App::uses('AppModel', 'Model');
/**
 * GroupBalance Model
 *
 */
class GroupBalance extends AppModel {

	var $recursive = 2;

	public $belongsTo = array(
		'User' => array(
			'className' => 'User',
			'foreignKey' => 'user_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		),
		'Group' => array(
			'className' => 'Group',
			'foreignKey' => 'group_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		)
	);

	function getBalanceByUserId($user_id){
		$balances = $this->find('all', array(
				'conditions' => array('GroupBalance.user_id' => $user_id),
				'group' => array('GroupBalance.group_id'),
				'fields' => array('sum(GroupBalance.balance) as balance','GroupBalance.group_id')
		));

		$output = array();
		foreach ($balances as $balance){
			unset($balance['Group']['User']);

			$output[] = array(
				'balance' => $balance[0]['balance'],
				'group' => $balance["Group"]
			);
		}

		return $output;
	}

	function getBalanceByGroupId($group_id){
		$balances = $this->find('all', array(
			'conditions' => array('GroupBalance.group_id' => $group_id),
			'group' => array('GroupBalance.user_id'),
			'fields' => array('sum(GroupBalance.balance) as balance','GroupBalance.user_id')
		));

		$output = array();
		foreach ($balances as $balance){
			unset($balance['User']['SubtransactionPayer']);
			unset($balance['User']['SubtransactionBorrower']);

			$output[] = array(
				'balance' => $balance[0]['balance'],
				'user' => $balance['User'],
			);
		}

		return $output;
	}
}
