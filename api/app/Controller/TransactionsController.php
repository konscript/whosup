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
            '_serialize' => array('transactions')
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

// /**
//  * index method
//  *
//  * @return void
//  */
// 	public function index() {
// 		$this->Transaction->recursive = 0;
// 		$this->set('transactions', $this->paginate());
// 	}

// /**
//  * view method
//  *
//  * @throws NotFoundException
//  * @param string $id
//  * @return void
//  */
// 	public function view($id = null) {
// 		if (!$this->Transaction->exists($id)) {
// 			throw new NotFoundException(__('Invalid transaction'));
// 		}
// 		$options = array('conditions' => array('Transaction.' . $this->Transaction->primaryKey => $id));
// 		$this->set('transaction', $this->Transaction->find('first', $options));
// 	}

// /**
//  * add method
//  *
//  * @return void
//  */
// 	public function add() {
// 		if ($this->request->is('post')) {
// 			$this->Transaction->create();
// 			if ($this->Transaction->save($this->request->data)) {
// 				$this->Session->setFlash(__('The transaction has been saved'));
// 				$this->redirect(array('action' => 'index'));
// 			} else {
// 				$this->Session->setFlash(__('The transaction could not be saved. Please, try again.'));
// 			}
// 		}
// 	}

// /**
//  * edit method
//  *
//  * @throws NotFoundException
//  * @param string $id
//  * @return void
//  */
// 	public function edit($id = null) {
// 		if (!$this->Transaction->exists($id)) {
// 			throw new NotFoundException(__('Invalid transaction'));
// 		}
// 		if ($this->request->is('post') || $this->request->is('put')) {
// 			if ($this->Transaction->save($this->request->data)) {
// 				$this->Session->setFlash(__('The transaction has been saved'));
// 				$this->redirect(array('action' => 'index'));
// 			} else {
// 				$this->Session->setFlash(__('The transaction could not be saved. Please, try again.'));
// 			}
// 		} else {
// 			$options = array('conditions' => array('Transaction.' . $this->Transaction->primaryKey => $id));
// 			$this->request->data = $this->Transaction->find('first', $options);
// 		}
// 	}

// /**
//  * delete method
//  *
//  * @throws NotFoundException
//  * @throws MethodNotAllowedException
//  * @param string $id
//  * @return void
//  */
// 	public function delete($id = null) {
// 		$this->Transaction->id = $id;
// 		if (!$this->Transaction->exists()) {
// 			throw new NotFoundException(__('Invalid transaction'));
// 		}
// 		$this->request->onlyAllow('post', 'delete');
// 		if ($this->Transaction->delete()) {
// 			$this->Session->setFlash(__('Transaction deleted'));
// 			$this->redirect(array('action' => 'index'));
// 		}
// 		$this->Session->setFlash(__('Transaction was not deleted'));
// 		$this->redirect(array('action' => 'index'));
// 	}
}
