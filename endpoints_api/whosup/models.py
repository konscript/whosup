from django.db import models
from django.contrib.auth.models import User


class Tag(models.Model):
    title = models.CharField(max_length=50)
    user = models.ForeignKey(User)

    def __unicode__(self):
        return '%s' % (self.title)


class Group(models.Model):
    title = models.CharField(max_length=50)
    members = models.ManyToManyField(User, through='GroupMembership')

    def __unicode__(self):
        return '%s' % (self.title)


class Transaction(models.Model):
    title = models.CharField(max_length=50)
    creation_date = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(Tag)
    payer = models.ForeignKey(User)

    def __unicode__(self):
        return '%s: %s' % (self.tag.title, self.title)


class SubTransaction(models.Model):
    borrower = models.ForeignKey(User)
    transaction = models.ForeignKey(Transaction)
    amount = models.IntegerField()
    accepted = models.BooleanField(default=False)

    def __unicode__(self):
        return '%s -> %s' % (self.payer.first_namse, self.borrower.first_name)


class GroupMembership(models.Model):
    user = models.ForeignKey(User)
    group = models.ForeignKey(Group)
    date_joined = models.DateField()


class GroupTransaction(models.Model):
    transaction = models.ForeignKey(Transaction)
    group = models.ForeignKey(Group)
