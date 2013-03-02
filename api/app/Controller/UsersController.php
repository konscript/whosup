<?php
App::uses('AppController', 'Controller');
/**
 * Users Controller
 *
 * @property User $User
 */
class UsersController extends AppController {

    public function index() {
        $users = $this->User->find('all');
        $this->set(array(
            'users' => $users,
            '_serialize' => array('users')
        ));
    }

	public function view($id = null) {
		if (!$this->User->exists($id)) {
			throw new NotFoundException(__('Invalid user'));
		}
		$options = array('conditions' => array('User.' . $this->User->primaryKey => $id));
		$user = $this->User->find('first', $options);
        $this->set(array(
            'user' => $user,
            '_serialize' => array('user')
        ));
	}


	public function add() {
		// avoid overwriting existing
		unset($this->request->data["id"]);

		if ($this->request->is('post')) {
			$this->User->create();
			if ($this->User->save($this->request->data)) {
				$success = true;
			} else {
				$success = false;
			}

			$invalidFields = $this->User->invalidFields();

	        $this->set(array(
	            'invalidFields' => $invalidFields,
	            'success' => $success,
	            '_serialize' => array('invalidFields', 'success')
	        ));
		}
	}

	public function edit($id = null) {
		if (!$this->User->exists($id)) {
			throw new NotFoundException(__('Invalid user'));
		}
		if ($this->request->is('post') || $this->request->is('put')) {
			if ($this->User->save($this->request->data)) {
				$success = true;
			} else {
				$success = false;
			}
		}

		$invalidFields = $this->User->invalidFields();

        $this->set(array(
            'invalidFields' => $invalidFields,
            'success' => $success,
            '_serialize' => array('invalidFields', 'success')
        ));
	}

    public function delete($id = null) {
        $this->User->id = $id;
        if (!$this->User->exists()) {
            throw new NotFoundException(__('Invalid user'));
        }

        $this->request->onlyAllow('post', 'delete');
        if ($this->User->delete()) {
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
//  * view method
//  *
//  * @throws NotFoundException
//  * @param string $id
//  * @return void
//  */
// 	public function view($id = null) {
// 		if (!$this->User->exists($id)) {
// 			throw new NotFoundException(__('Invalid user'));
// 		}
// 		$options = array('conditions' => array('User.' . $this->User->primaryKey => $id));
// 		$this->set('user', $this->User->find('first', $options));
// 	}

// *
//  * index method
//  *
//  * @return void
// public function index() {
// 	$this->User->recursive = 0;
// 	$this->set('users', $this->paginate());
// }

// /**
//  * add method
//  *
//  * @return void
//  */
// 	public function add() {
// 		if ($this->request->is('post')) {
// 			$this->User->create();
// 			if ($this->User->save($this->request->data)) {
// 				$this->Session->setFlash(__('The user has been saved'));
// 				$this->redirect(array('action' => 'index'));
// 			} else {
// 				$this->Session->setFlash(__('The user could not be saved. Please, try again.'));
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
// 		if (!$this->User->exists($id)) {
// 			throw new NotFoundException(__('Invalid user'));
// 		}
// 		if ($this->request->is('post') || $this->request->is('put')) {
// 			if ($this->User->save($this->request->data)) {
// 				$this->Session->setFlash(__('The user has been saved'));
// 				$this->redirect(array('action' => 'index'));
// 			} else {
// 				$this->Session->setFlash(__('The user could not be saved. Please, try again.'));
// 			}
// 		} else {
// 			$options = array('conditions' => array('User.' . $this->User->primaryKey => $id));
// 			$this->request->data = $this->User->find('first', $options);
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
// 		$this->User->id = $id;
// 		if (!$this->User->exists()) {
// 			throw new NotFoundException(__('Invalid user'));
// 		}
// 		$this->request->onlyAllow('post', 'delete');
// 		if ($this->User->delete()) {
// 			$this->Session->setFlash(__('User deleted'));
// 			$this->redirect(array('action' => 'index'));
// 		}
// 		$this->Session->setFlash(__('User was not deleted'));
// 		$this->redirect(array('action' => 'index'));
// 	}

}