<?php
App::uses('AppModel', 'Model');
/**
 * User Model
 *
 */
class User extends AppModel {
    var $displayField = 'first_name';

    public $validate = array(
        // 'first_name' => 'alphaNumeric',
        // 'last_name' => 'alphaNumeric',
        // 'email' => 'email'
        // 'email' => array(
        //     'email' => array(
        //         'rule'     => 'email',
        //         'required' => true,
        //         'message'  => 'This must be an email'
        //     )
        // )
    );

    public $hasMany = array(
        'SubtransactionPayer' => array(
            'className' => 'Subtransaction',
            'foreignKey' => 'payer_id',
            'dependent' => false,
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        ),
        'SubtransactionBorrower' => array(
            'className' => 'Subtransaction',
            'foreignKey' => 'borrower_id',
            'dependent' => false,
            'conditions' => '',
            'fields' => '',
            'order' => '',
            'limit' => '',
            'offset' => '',
            'exclusive' => '',
            'finderQuery' => '',
            'counterQuery' => ''
        )
    );

}
