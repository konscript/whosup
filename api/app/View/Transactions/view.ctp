<div class="transactions view">
<h2><?php  echo __('Transaction'); ?></h2>
	<dl>
		<dt><?php echo __('Id'); ?></dt>
		<dd>
			<?php echo h($transaction['Transaction']['id']); ?>
			&nbsp;
		</dd>
		<dt><?php echo __('Title'); ?></dt>
		<dd>
			<?php echo h($transaction['Transaction']['title']); ?>
			&nbsp;
		</dd>
		<dt><?php echo __('Description'); ?></dt>
		<dd>
			<?php echo h($transaction['Transaction']['description']); ?>
			&nbsp;
		</dd>
		<dt><?php echo __('Total Amount'); ?></dt>
		<dd>
			<?php echo h($transaction['Transaction']['total_amount']); ?>
			&nbsp;
		</dd>
		<dt><?php echo __('Date'); ?></dt>
		<dd>
			<?php echo h($transaction['Transaction']['date']); ?>
			&nbsp;
		</dd>
		<dt><?php echo __('Created'); ?></dt>
		<dd>
			<?php echo h($transaction['Transaction']['created']); ?>
			&nbsp;
		</dd>
		<dt><?php echo __('Modified'); ?></dt>
		<dd>
			<?php echo h($transaction['Transaction']['modified']); ?>
			&nbsp;
		</dd>
		<dt><?php echo __('User'); ?></dt>
		<dd>
			<?php echo $this->Html->link($transaction['User']['first_name'], array('controller' => 'users', 'action' => 'view', $transaction['User']['id'])); ?>
			&nbsp;
		</dd>
	</dl>
</div>
<div class="actions">
	<h3><?php echo __('Actions'); ?></h3>
	<ul>
		<li><?php echo $this->Html->link(__('Edit Transaction'), array('action' => 'edit', $transaction['Transaction']['id'])); ?> </li>
		<li><?php echo $this->Form->postLink(__('Delete Transaction'), array('action' => 'delete', $transaction['Transaction']['id']), null, __('Are you sure you want to delete # %s?', $transaction['Transaction']['id'])); ?> </li>
		<li><?php echo $this->Html->link(__('List Transactions'), array('action' => 'index')); ?> </li>
		<li><?php echo $this->Html->link(__('New Transaction'), array('action' => 'add')); ?> </li>
		<li><?php echo $this->Html->link(__('List Users'), array('controller' => 'users', 'action' => 'index')); ?> </li>
		<li><?php echo $this->Html->link(__('New User'), array('controller' => 'users', 'action' => 'add')); ?> </li>
		<li><?php echo $this->Html->link(__('List Subtransactions'), array('controller' => 'subtransactions', 'action' => 'index')); ?> </li>
		<li><?php echo $this->Html->link(__('New Subtransaction'), array('controller' => 'subtransactions', 'action' => 'add')); ?> </li>
	</ul>
</div>
<div class="related">
	<h3><?php echo __('Related Subtransactions'); ?></h3>
	<?php if (!empty($transaction['Subtransaction'])): ?>
	<table cellpadding = "0" cellspacing = "0">
	<tr>
		<th><?php echo __('Id'); ?></th>
		<th><?php echo __('Amount'); ?></th>
		<th><?php echo __('Accepted'); ?></th>
		<th><?php echo __('Created'); ?></th>
		<th><?php echo __('Modified'); ?></th>
		<th><?php echo __('Payer Id'); ?></th>
		<th><?php echo __('Borrower Id'); ?></th>
		<th><?php echo __('Transaction Id'); ?></th>
		<th class="actions"><?php echo __('Actions'); ?></th>
	</tr>
	<?php
		$i = 0;
		foreach ($transaction['Subtransaction'] as $subtransaction): ?>
		<tr>
			<td><?php echo $subtransaction['id']; ?></td>
			<td><?php echo $subtransaction['amount']; ?></td>
			<td><?php echo $subtransaction['accepted']; ?></td>
			<td><?php echo $subtransaction['created']; ?></td>
			<td><?php echo $subtransaction['modified']; ?></td>
			<td><?php echo $subtransaction['payer_id']; ?></td>
			<td><?php echo $subtransaction['borrower_id']; ?></td>
			<td><?php echo $subtransaction['transaction_id']; ?></td>
			<td class="actions">
				<?php echo $this->Html->link(__('View'), array('controller' => 'subtransactions', 'action' => 'view', $subtransaction['id'])); ?>
				<?php echo $this->Html->link(__('Edit'), array('controller' => 'subtransactions', 'action' => 'edit', $subtransaction['id'])); ?>
				<?php echo $this->Form->postLink(__('Delete'), array('controller' => 'subtransactions', 'action' => 'delete', $subtransaction['id']), null, __('Are you sure you want to delete # %s?', $subtransaction['id'])); ?>
			</td>
		</tr>
	<?php endforeach; ?>
	</table>
<?php endif; ?>

	<div class="actions">
		<ul>
			<li><?php echo $this->Html->link(__('New Subtransaction'), array('controller' => 'subtransactions', 'action' => 'add')); ?> </li>
		</ul>
	</div>
</div>
