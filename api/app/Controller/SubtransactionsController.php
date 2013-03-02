<?php
App::uses('AppController', 'Controller');
/**
 * Subtransactions Controller
 *
 * @property Subtransaction $Subtransaction
 */
class SubtransactionsController extends AppController {

    public function index() {
        $subtransactions = $this->Subtransaction->find('all');
        $this->set(array(
            'subtransactions' => $subtransactions,
            '_serialize' => array('subtransactions')
        ));
    }

	public function view($id = null) {
		if (!$this->Subtransaction->exists($id)) {
			throw new NotFoundException(__('Invalid subtransaction'));
		}
		$options = array('conditions' => array('Subtransaction.' . $this->Subtransaction->primaryKey => $id));
		$subtransaction = $this->Subtransaction->find('first', $options);
        $this->set(array(
            'subtransaction' => $subtransaction,
            '_serialize' => array('subtransaction')
        ));
	}


	public function add() {
		// avoid overwriting existing
		unset($this->request->data["id"]);

		if ($this->request->is('post')) {
			$this->Subtransaction->create();
			if ($this->Subtransaction->save($this->request->data)) {
				$success = true;
			} else {
				$success = false;
			}

			$invalidFields = $this->Subtransaction->invalidFields();

	        $this->set(array(
	            'invalidFields' => $invalidFields,
	            'success' => $success,
	            '_serialize' => array('invalidFields', 'success')
	        ));
		}
	}

	public function edit($id = null) {
		if (!$this->Subtransaction->exists($id)) {
			throw new NotFoundException(__('Invalid subtransaction'));
		}
		if ($this->request->is('post') || $this->request->is('put')) {
			if ($this->Subtransaction->save($this->request->data)) {
				$success = true;
			} else {
				$success = false;
			}
		}

		$invalidFields = $this->Subtransaction->invalidFields();

        $this->set(array(
            'invalidFields' => $invalidFields,
            'success' => $success,
            '_serialize' => array('invalidFields', 'success')
        ));
	}

    public function delete($id = null) {
        $this->Subtransaction->id = $id;
        if (!$this->Subtransaction->exists()) {
            throw new NotFoundException(__('Invalid subtransaction'));
        }

        $this->request->onlyAllow('post', 'delete');
        if ($this->Subtransaction->delete()) {
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
