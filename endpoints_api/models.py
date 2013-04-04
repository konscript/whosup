import peewee
import datetime
import logging

database = peewee.MySQLDatabase('whosup', user='root', passwd='tismando', threadlocals=True)


class User(peewee.Model):
    facebook_id = peewee.IntegerField(unique=True)
    first_name = peewee.CharField()
    last_name = peewee.CharField()
    join_date = peewee.DateTimeField(default=datetime.datetime.now)
    facebook_token = peewee.CharField(default="")
    middle_name = peewee.CharField(default="")
    link = peewee.CharField(default="")
    username = peewee.CharField(default="")
    gender = peewee.CharField(default="")
    email = peewee.CharField(default="")
    locale = peewee.CharField(default="")

    def __unicode__(self):
        return '%s %s' % (self.first_name, self.last_name)

    class Meta:
        database = database

    def balance(self):
        return SubTransaction.select(
            SubTransaction.borrower.alias("payer"),
            peewee.fn.Sum(SubTransaction.amount).alias("balance")
        ).join(Transaction).where(
            ((Transaction.payer == self) & (SubTransaction.borrower != self)) | ((SubTransaction.borrower == self) & (Transaction.payer != self))
        )

    def balance_against(self, user=None):
        if user:
            return User.select(
                SubTransaction.borrower.alias("payer"),
                SubTransaction.borrower.alias("borrower"),
                peewee.fn.Sum(SubTransaction.amount).alias("balance"),
                User.select(peewee.fn.Sum(SubTransaction.amount)).join(SubTransaction).join(Transaction).where(
                    ((SubTransaction.payer == user) & (SubTransaction.payer == self))
                ).alias("balance_against")
            ).join(SubTransaction).join(Transaction).where(
                ((SubTransaction.payer == self) & (SubTransaction.payer == user))
            )
        else:
            return User.select(
                User,
                peewee.fn.Sum(SubTransaction.amount).alias("balance"),
                User.select(peewee.fn.Sum(SubTransaction.amount)).join(SubTransaction).join(Transaction).where(
                    (SubTransaction.borrower == self) & (Transaction.payer == peewee.R("t1.`id`"))
                ).alias("balance_against")
            ).join(SubTransaction).join(Transaction).where(
                (Transaction.payer == self) & (SubTransaction.borrower != self)
            ).group_by(SubTransaction.borrower)

    def tag_balances(self, tag=None):
        query = Tag.select(
            Tag.id,
            Tag.title,
            SubTransaction.select(peewee.fn.Sum(SubTransaction.amount)).join(Transaction).join(TagTransaction).where(SubTransaction.borrower != self & Transaction.payer == self & TagTransaction.tag == Tag.id).alias("balance"),
            SubTransaction.select(peewee.fn.Sum(SubTransaction.amount)).join(Transaction).join(TagTransaction).where(SubTransaction.borrower == self & Transaction.payer != self & TagTransaction.tag == Tag.id).alias("balance_against")
        ).join(TagUser).where(
            (TagUser.user == self)
        ).group_by(Tag)

        if tag:
            query.where(Tag.id == tag)

        logging.info(query)

        return query


class Tag(peewee.Model):
    title = peewee.CharField(max_length=50)

    def __unicode__(self):
        return '%s' % (self.title)

    class Meta:
        database = database

    def members(self):
        return User.select().join(TagUser).join(Tag).where(TagUser.tag == self)

    def balances(self):
        return TagUser.select(
            User,
            peewee.fn.Sum(SubTransaction.amount)
        ).join(SubTransaction).switch(TagTransaction).join(Tag).switch(TagUser).join(User).where(Tag == self).group_by(User)


class Transaction(peewee.Model):
    title = peewee.CharField()
    payer = peewee.ForeignKeyField(User)
    creation_date = peewee.DateTimeField(default=datetime.datetime.now)

    class Meta:
        database = database

    def __unicode__(self):
        return '%s: %s' % (self.tag.title, self.title)

    def total(self):
        return self.select(
            peewee.fn.Sum(SubTransaction.amount).alias("total")
        ).join(SubTransaction)


class SubTransaction(peewee.Model):
    borrower = peewee.ForeignKeyField(User)
    transaction = peewee.ForeignKeyField(Transaction)
    amount = peewee.IntegerField()
    accepted = peewee.BooleanField(default=False)

    class Meta:
        database = database

    def __unicode__(self):
        return '%s' % (self.amount)


class TagTransaction(peewee.Model):
    tag = peewee.ForeignKeyField(Tag)
    transaction = peewee.ForeignKeyField(Transaction)

    class Meta:
        database = database


class TagUser(peewee.Model):
    tag = peewee.ForeignKeyField(Tag)
    user = peewee.ForeignKeyField(User)

    class Meta:
        database = database


def create_tables():
    database.connect()
    User.create_table()
    Tag.create_table()
    Transaction.create_table()
    SubTransaction.create_table()
    TagTransaction.create_table()
    TagUser.create_table()
