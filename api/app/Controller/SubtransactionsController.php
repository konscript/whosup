<?php
App::uses('AppController', 'Controller');
/**
 * Subtransactions Controller
 *
 * @property Subtransaction $Subtransaction
 */
class SubtransactionsController extends AppController {

/**
 * index method
 *
 * @return void
 */
	public function index() {
		$this->Subtransaction->recursive = 0;
		$this->set('subtransactions', $this->paginate());
	}

/**
 * view method
 *
 * @throws NotFoundException
 * @param string $id
 * @return void
 */
	public function view($id = null) {
		if (!$this->Subtransaction->exists($id)) {
			throw new NotFoundException(__('Invalid subtransaction'));
		}
		$options = array('conditions' => array('Subtransaction.' . $this->Subtransaction->primaryKey => $id));
		$this->set('subtransaction', $this->Subtransaction->find('first', $options));
	}

/**
 * add method
 *
 * @return void
 */
	public function add() {
		if ($this->request->is('post')) {
			$this->Subtransaction->create();
			if ($this->Subtransaction->save($this->request->data)) {
				$this->Session->setFlash(__('The subtransaction has been saved'));
				$this->redirect(array('action' => 'index'));
			} else {
				$this->Session->setFlash(__('The subtransaction could not be saved. Please, try again.'));
			}
		}
		$payers = $this->Subtransaction->Payer->find('list');
		$borrowers = $this->Subtransaction->Borrower->find('list');
		$transactions = $this->Subtransaction->Transaction->find('list');
		$this->set(compact('payers', 'borrowers', 'transactions'));
	}

/**
 * edit method
 *
 * @throws NotFoundException
 * @param string $id
 * @return void
 */
	public function edit($id = null) {
		if (!$this->Subtransaction->exists($id)) {
			throw new NotFoundException(__('Invalid subtransaction'));
		}
		if ($this->request->is('post') || $this->request->is('put')) {
			if ($this->Subtransaction->save($this->request->data)) {
				$this->Session->setFlash(__('The subtransaction has been saved'));
				$this->redirect(array('action' => 'index'));
			} else {
				$this->Session->setFlash(__('The subtransaction could not be saved. Please, try again.'));
			}
		} else {
			$options = array('conditions' => array('Subtransaction.' . $this->Subtransaction->primaryKey => $id));
			$this->request->data = $this->Subtransaction->find('first', $options);
		}
		$payers = $this->Subtransaction->Payer->find('list');
		$borrowers = $this->Subtransaction->Borrower->find('list');
		$transactions = $this->Subtransaction->Transaction->find('list');
		$this->set(compact('payers', 'borrowers', 'transactions'));
	}

/**
 * delete method
 *
 * @throws NotFoundException
 * @throws MethodNotAllowedException
 * @param string $id
 * @return void
 */
	public function delete($id = null) {
		$this->Subtransaction->id = $id;
		if (!$this->Subtransaction->exists()) {
			throw new NotFoundException(__('Invalid subtransaction'));
		}
		$this->request->onlyAllow('post', 'delete');
		if ($this->Subtransaction->delete()) {
			$this->Session->setFlash(__('Subtransaction deleted'));
			$this->redirect(array('action' => 'index'));
		}
		$this->Session->setFlash(__('Subtransaction was not deleted'));
		$this->redirect(array('action' => 'index'));
	}
}
