<div class="subtransactions form">
<?php echo $this->Form->create('Subtransaction'); ?>
	<fieldset>
		<legend><?php echo __('Edit Subtransaction'); ?></legend>
	<?php
		echo $this->Form->input('id');
		echo $this->Form->input('amount');
		echo $this->Form->input('accepted');
		echo $this->Form->input('payer_id');
		echo $this->Form->input('borrower_id');
		echo $this->Form->input('transaction_id');
	?>
	</fieldset>
<?php echo $this->Form->end(__('Submit')); ?>
</div>
<div class="actions">
	<h3><?php echo __('Actions'); ?></h3>
	<ul>

		<li><?php echo $this->Form->postLink(__('Delete'), array('action' => 'delete', $this->Form->value('Subtransaction.id')), null, __('Are you sure you want to delete # %s?', $this->Form->value('Subtransaction.id'))); ?></li>
		<li><?php echo $this->Html->link(__('List Subtransactions'), array('action' => 'index')); ?></li>
		<li><?php echo $this->Html->link(__('List Users'), array('controller' => 'users', 'action' => 'index')); ?> </li>
		<li><?php echo $this->Html->link(__('New Payer'), array('controller' => 'users', 'action' => 'add')); ?> </li>
		<li><?php echo $this->Html->link(__('List Transactions'), array('controller' => 'transactions', 'action' => 'index')); ?> </li>
		<li><?php echo $this->Html->link(__('New Transaction'), array('controller' => 'transactions', 'action' => 'add')); ?> </li>
	</ul>
</div>
