<?php
App::uses('AppController', 'Controller');
/**
 * Transactions Controller
 *
 * @property Transaction $Transaction
 */
class TransactionsController extends AppController {

    public function index() {
        $transactions = $this->Transaction->find('all');
        $this->set(array(
            'transactions' => $transactions,
            '_serialize' => 'transactions'
        ));
    }

    public function getAllByUser($id){
		$this->loadModel('User');
		$this->loadModel('Subtransaction');
		if (!$this->User->exists($id)) {
			throw new NotFoundException(__('Invalid user id'));
		}

		$this->Transaction->recursive = 2;
		$options = array('conditions' => array('Transaction.created_by' => $id));
		$transactions = $this->Transaction->find('all',$options);

        $this->set(array(
            'transactions' => $transactions,
            '_serialize' => array('transactions')
        ));
    }

	public function view($id = null) {
		if (!$this->Transaction->exists($id)) {
			throw new NotFoundException(__('Invalid transaction'));
		}
		$options = array('conditions' => array('Transaction.' . $this->Transaction->primaryKey => $id));
		$transaction = $this->Transaction->find('first', $options);
        $this->set(array(
            'transaction' => $transaction,
            '_serialize' => array('transaction')
        ));
	}


	public function add() {
		
		// avoid overwriting existing
		unset($this->request->data["id"]);

		if ($this->request->is('post')) {
			

			$this->loadModel('User');
			$this->loadModel('Subtransaction');

			$subtransactions = $this->request->data['subTransactions'];
			$total_amount = $this->request->data['total_amount'];

			$this->Transaction->create();
			if ($this->Transaction->save($this->request->data)) {
				$success = true;
			} else {
				$success = false;
			}
			$payer_id = $this->request->data['payer_id'];
			// $running_amount = 0;
			foreach ($subtransactions as $st){
				$user_id = $st['value'];
				if (!$this->User->exists($user_id)){
					$data = array();
					list($first_name, $last_name) = explode(' ', $st['label'],1);

					$this->User->create();
					$data['id'] = $user_id;
					$data['first_name'] = $first_name;
					$data['last_name'] = $last_name;
					$data['email'] = @$st['borrower_email'];
					$this->User->save($data);
				}

				$this->Subtransaction->create();
				$data = array();
				$data['payer_id'] = $payer_id;
				$data['borrower_id'] = $st['value'];
				$data['amount'] = $st['amount'];
				$data['transaction_id'] = $this->Transaction->id;
				$data['accepted'] = 1;
				$this->Subtransaction->save($data);

				// $running_amount += $st['amount'];

			}
			// Save a transaction to own your self!
			// $this->Subtransaction->create();
			// $data = array();
			// $data['payer_id'] = $payer_id;
			// $data['borrower_id'] = $payer_id;
			// $data['amount'] = $total_amount - $running_amount;
			// $data['transaction_id'] = $this->Transaction->id;
			// $data['accepted'] = 1;
			// $this->Subtransaction->save($data);


			$invalidFields = $this->Transaction->invalidFields();

	        $this->set(array(
	            'invalidFields' => $invalidFields,
	            'success' => $success,
	            // 'st' => $subtransactions,
	            '_serialize' => array('invalidFields', 'success')
	        ));
		}
	}

	public function edit($id = null) {
		if (!$this->Transaction->exists($id)) {
			throw new NotFoundException(__('Invalid transaction'));
		}
		if ($this->request->is('post') || $this->request->is('put')) {
			if ($this->Transaction->save($this->request->data)) {
				$success = true;
			} else {
				$success = false;
			}
		}

		$invalidFields = $this->Transaction->invalidFields();

        $this->set(array(
            'invalidFields' => $invalidFields,
            'success' => $success,
            '_serialize' => array('invalidFields', 'success')
        ));
	}

    public function delete($id = null) {
        $this->Transaction->id = $id;
        if (!$this->Transaction->exists()) {
            throw new NotFoundException(__('Invalid transaction'));
        }

        $this->request->onlyAllow('post', 'delete');
        if ($this->Transaction->delete()) {
            $success = true;
        }else {
            $success = false;
        }

        $this->set(array(
            'success' => $success,
            '_serialize' => array('success')
        ));
    }

}