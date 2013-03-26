from django.db import models


class User(models.Model):
    first_name = models.CharField()
    last_name = models.CharField()
    facebook_id = models.CharField()
    join_date = models.DateTimeField()
    facebook_token = models.CharField()

    def __unicode__(self):
        return '%s %s' % (self.first_name, self.last_name)


class Tag(models.Model):
    title = models.CharField(max_length=50)
    user = models.ForeignKey(User)

    def __unicode__(self):
        return '%s' % (self.title)


class Group(models.Model):
    title = models.CharField(max_length=50)
    members = models.ManyToManyField(User, through='Membership')

    def __unicode__(self):
        return '%s' % (self.title)


class Transaction(models.Model):
    title = models.CharField()
    creation_date = models.DateTimeField()
    tags = models.ManyToManyField(Tag)
    payers = models.ManyToManyField(User)

    def __unicode__(self):
        return '%s: %s' % (self.tag.title, self.title)


class SubTransaction(models.Model):
    borrower = models.ForeignKey(User)
    transaction = models.ForeignKey(Transaction)
    amount = models.IntegerField()
    accepted = models.BooleanField()

    def __unicode__(self):
        return '%s -> %s' % (self.payer.first_namse, self.borrower.first_name)


class GroupMembership(models.Model):
    user = models.ForeignKey(User)
    group = models.ForeignKey(Group)
    date_joined = models.DateField()


class GroupTransaction(models.Model):
    transaction = models.ForeignKey(Transaction)
    group = models.ForeignKey(Group)
