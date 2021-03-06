<?php
App::uses('AppController', 'Controller');
/**
 * Groups Controller
 *
 * @property Group $Group
 */
class GroupsController extends AppController {

   public function index() {
        //$log = $this->Group->getDataSource()->getLog(false, false);

        $this->set(array(
            'groups' => $this->Group->find('all'),
            '_serialize' => array('groups')
        ));
    }

	public function view($id = null) {
		if (!$this->Group->exists($id)) {
			throw new NotFoundException(__('Invalid group'));
		}
		$options = array('conditions' => array('Group.' . $this->Group->primaryKey => $id));
		$group = $this->Group->find('first', $options);
        $this->set(array(
            'group' => $group,
            '_serialize' => array('group')
        ));
	}


	public function add() {
		// avoid overwriting existing
		unset($this->request->data["id"]);

		if ($this->request->is('post')) {
			$this->Group->create();
			if ($this->Group->save($this->request->data)) {
				$success = true;
			} else {
				$success = false;
			}

			$invalidFields = $this->Group->invalidFields();

	        $this->set(array(
	            'invalidFields' => $invalidFields,
	            'success' => $success,
	            '_serialize' => array('invalidFields', 'success')
	        ));
		}
	}

	public function edit($id = null) {
		if (!$this->Group->exists($id)) {
			throw new NotFoundException(__('Invalid group'));
		}
		if ($this->request->is('post') || $this->request->is('put')) {
			if ($this->Group->save($this->request->data)) {
				$success = true;
			} else {
				$success = false;
			}
		}

		$invalidFields = $this->Group->invalidFields();

        $this->set(array(
            'invalidFields' => $invalidFields,
            'success' => $success,
            '_serialize' => array('invalidFields', 'success')
        ));
	}


	/**
	* Get balances by group id
	*
	*/
	public function balances($id){
		$this->loadModel('GroupBalance');
		$balances = $this->GroupBalance->getBalanceByGroupId($id);
		$hiscore = 0;
		$whosup = array();
		foreach ($balances as $b){
			if ($b['balance'] < $hiscore){
				$whosup = $b['user'];
				$hiscore = $b['balance'];
			}
		}
		$group = $this->Group->findById($id);

		$this->set(array(
            'balances' => $balances,
            'group' => $group['Group'],
            'whosup' => $whosup,
            '_serialize' => array('group','whosup','balances')
        ));
	}

	public function getUsers($group_id){
		$this->loadModel('User');
		$this->Group->recursive = 2;
		$users = $this->Group->findById($group_id);
		$users = $users['User'];
		$this->set(array(
			'users' => $users,
            '_serialize' => array('users')
        ));
	}

// /**
//  * index method
//  *
//  * @return void
//  */
// 	public function index() {
// 		$this->Group->recursive = 0;
// 		$this->set('groups', $this->paginate());
// 	}

// /**
//  * view method
//  *
//  * @throws NotFoundException
//  * @param string $id
//  * @return void
//  */
// 	public function view($id = null) {
// 		if (!$this->Group->exists($id)) {
// 			throw new NotFoundException(__('Invalid group'));
// 		}
// 		$options = array('conditions' => array('Group.' . $this->Group->primaryKey => $id));
// 		$this->set('group', $this->Group->find('first', $options));
// 	}

// /**
//  * add method
//  *
//  * @return void
//  */
// 	public function add() {
// 		if ($this->request->is('post')) {
// 			$this->Group->create();
// 			if ($this->Group->save($this->request->data)) {
// 				$this->Session->setFlash(__('The group has been saved'));
// 				$this->redirect(array('action' => 'index'));
// 			} else {
// 				$this->Session->setFlash(__('The group could not be saved. Please, try again.'));
// 			}
// 		}
// 		$users = $this->Group->User->find('list');
// 		$this->set(compact('users'));
// 	}

// /**
//  * edit method
//  *
//  * @throws NotFoundException
//  * @param string $id
//  * @return void
//  */
// 	public function edit($id = null) {
// 		if (!$this->Group->exists($id)) {
// 			throw new NotFoundException(__('Invalid group'));
// 		}
// 		if ($this->request->is('post') || $this->request->is('put')) {
// 			if ($this->Group->save($this->request->data)) {
// 				$this->Session->setFlash(__('The group has been saved'));
// 				$this->redirect(array('action' => 'index'));
// 			} else {
// 				$this->Session->setFlash(__('The group could not be saved. Please, try again.'));
// 			}
// 		} else {
// 			$options = array('conditions' => array('Group.' . $this->Group->primaryKey => $id));
// 			$this->request->data = $this->Group->find('first', $options);
// 		}
// 		$users = $this->Group->User->find('list');
// 		$this->set(compact('users'));
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
// 		$this->Group->id = $id;
// 		if (!$this->Group->exists()) {
// 			throw new NotFoundException(__('Invalid group'));
// 		}
// 		$this->request->onlyAllow('post', 'delete');
// 		if ($this->Group->delete()) {
// 			$this->Session->setFlash(__('Group deleted'));
// 			$this->redirect(array('action' => 'index'));
// 		}
// 		$this->Session->setFlash(__('Group was not deleted'));
// 		$this->redirect(array('action' => 'index'));
// 	}
}
