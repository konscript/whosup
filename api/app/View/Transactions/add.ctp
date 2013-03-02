<div class="transactions form">
<?php echo $this->Form->create('Transaction'); ?>
	<fieldset>
		<legend><?php echo __('Add Transaction'); ?></legend>
	<?php
		echo $this->Form->input('title');
		echo $this->Form->input('description');
		echo $this->Form->input('total_amount');
		echo $this->Form->input('date');
		echo $this->Form->input('created_by');
	?>
	</fieldset>
<?php echo $this->Form->end(__('Submit')); ?>
</div>
<div class="actions">
	<h3><?php echo __('Actions'); ?></h3>
	<ul>

		<li><?php echo $this->Html->link(__('List Transactions'), array('action' => 'index')); ?></li>
		<li><?php echo $this->Html->link(__('List Users'), array('controller' => 'users', 'action' => 'index')); ?> </li>
		<li><?php echo $this->Html->link(__('New User'), array('controller' => 'users', 'action' => 'add')); ?> </li>
		<li><?php echo $this->Html->link(__('List Subtransactions'), array('controller' => 'subtransactions', 'action' => 'index')); ?> </li>
		<li><?php echo $this->Html->link(__('New Subtransaction'), array('controller' => 'subtransactions', 'action' => 'add')); ?> </li>
	</ul>
</div>
