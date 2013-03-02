<?php
App::uses('AppModel', 'Model');
/**
 * Subtransaction Model
 *
 * @property Payer $Payer
 * @property Borrower $Borrower
 * @property Transaction $Transaction
 */
class Subtransaction extends AppModel {


	//The Associations below have been created with all possible keys, those that are not needed can be removed

/**
 * belongsTo associations
 *
 * @var array
 */
	public $belongsTo = array(
		'Payer' => array(
			'className' => 'User',
			'foreignKey' => 'payer_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		),
		'Borrower' => array(
			'className' => 'User',
			'foreignKey' => 'borrower_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		),
		'Transaction' => array(
			'className' => 'Transaction',
			'foreignKey' => 'transaction_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		)
	);
}
