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
			$this->Transaction->create();
			if ($this->Transaction->save($this->request->data)) {
				$success = true;
			} else {
				$success = false;
			}

			$invalidFields = $this->Transaction->invalidFields();

	        $this->set(array(
	            'invalidFields' => $invalidFields,
	            'success' => $success,
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