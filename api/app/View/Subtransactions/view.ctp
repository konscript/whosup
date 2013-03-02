<div class="subtransactions view">
<h2><?php  echo __('Subtransaction'); ?></h2>
	<dl>
		<dt><?php echo __('Id'); ?></dt>
		<dd>
			<?php echo h($subtransaction['Subtransaction']['id']); ?>
			&nbsp;
		</dd>
		<dt><?php echo __('Amount'); ?></dt>
		<dd>
			<?php echo h($subtransaction['Subtransaction']['amount']); ?>
			&nbsp;
		</dd>
		<dt><?php echo __('Accepted'); ?></dt>
		<dd>
			<?php echo h($subtransaction['Subtransaction']['accepted']); ?>
			&nbsp;
		</dd>
		<dt><?php echo __('Created'); ?></dt>
		<dd>
			<?php echo h($subtransaction['Subtransaction']['created']); ?>
			&nbsp;
		</dd>
		<dt><?php echo __('Modified'); ?></dt>
		<dd>
			<?php echo h($subtransaction['Subtransaction']['modified']); ?>
			&nbsp;
		</dd>
		<dt><?php echo __('Payer'); ?></dt>
		<dd>
			<?php echo $this->Html->link($subtransaction['Payer']['id'], array('controller' => 'users', 'action' => 'view', $subtransaction['Payer']['id'])); ?>
			&nbsp;
		</dd>
		<dt><?php echo __('Borrower'); ?></dt>
		<dd>
			<?php echo $this->Html->link($subtransaction['Borrower']['id'], array('controller' => 'users', 'action' => 'view', $subtransaction['Borrower']['id'])); ?>
			&nbsp;
		</dd>
		<dt><?php echo __('Transaction'); ?></dt>
		<dd>
			<?php echo $this->Html->link($subtransaction['Transaction']['title'], array('controller' => 'transactions', 'action' => 'view', $subtransaction['Transaction']['id'])); ?>
			&nbsp;
		</dd>
	</dl>
</div>
<div class="actions">
	<h3><?php echo __('Actions'); ?></h3>
	<ul>
		<li><?php echo $this->Html->link(__('Edit Subtransaction'), array('action' => 'edit', $subtransaction['Subtransaction']['id'])); ?> </li>
		<li><?php echo $this->Form->postLink(__('Delete Subtransaction'), array('action' => 'delete', $subtransaction['Subtransaction']['id']), null, __('Are you sure you want to delete # %s?', $subtransaction['Subtransaction']['id'])); ?> </li>
		<li><?php echo $this->Html->link(__('List Subtransactions'), array('action' => 'index')); ?> </li>
		<li><?php echo $this->Html->link(__('New Subtransaction'), array('action' => 'add')); ?> </li>
		<li><?php echo $this->Html->link(__('List Users'), array('controller' => 'users', 'action' => 'index')); ?> </li>
		<li><?php echo $this->Html->link(__('New Payer'), array('controller' => 'users', 'action' => 'add')); ?> </li>
		<li><?php echo $this->Html->link(__('List Transactions'), array('controller' => 'transactions', 'action' => 'index')); ?> </li>
		<li><?php echo $this->Html->link(__('New Transaction'), array('controller' => 'transactions', 'action' => 'add')); ?> </li>
	</ul>
</div>
