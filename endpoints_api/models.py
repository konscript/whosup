import peewee

database = peewee.MySQLDatabase('whosup2', user='root', password='tismando')


class User(peewee.Model):
    first_name = peewee.CharField()
    last_name = peewee.CharField()
    facebook_id = peewee.CharField()
    join_date = peewee.DateTimeField()
    facebook_token = peewee.CharField()

    def __unicode__(self):
        return '%s %s' % (self.first_name, self.last_name)

    class Meta:
        database = database

    def balance(self):
        return SubTransaction.select(
            SubTransaction.borrower.alias("payer"),
            peewee.fn.Sum(SubTransaction.amount)
        ).where(
            (SubTransaction.payer == self) | (SubTransaction.borrower == self)
        )

    def balance_against(self, user):
        return SubTransaction.select(
            SubTransaction.borrower.alias("payer"),
            SubTransaction.borrower.alias("borrower"),
            peewee.fn.Sum(SubTransaction.amount).alias("balance")
        ).where(
            ((SubTransaction.payer == user) & (SubTransaction.payer == self)) | ((SubTransaction.payer == self) & (SubTransaction.payer == user))
        )

    def tag_balances(self):
        return TagTransaction.select(
            peewee.fn.Sum(SubTransaction.amount)
        ).join(SubTransaction).switch(TagTransaction).join(Tag).where(
            (SubTransaction.payer == self) | (SubTransaction.borrower == self)
        )


class Tag(peewee.Model):
    title = peewee.CharField(max_length=50)

    def __unicode__(self):
        return '%s' % (self.title)

    class Meta:
        database = database

    def balances(self):
        return TagUser.select(
            User,
            peewee.fn.Sum(SubTransaction.amount)
        ).join(SubTransaction).switch(TagTransaction).join(Tag).switch(TagUser).join(User).where(Tag == self).group_by(User)


class Transaction(peewee.Model):
    title = peewee.CharField()
    creation_date = peewee.DateTimeField()

    class Meta:
        database = database

    def __unicode__(self):
        return '%s: %s' % (self.tag.title, self.title)


class SubTransaction(peewee.Model):
    payer = peewee.ForeignKeyField(User)
    borrower = peewee.ForeignKeyField(User)
    transaction = peewee.ForeignKeyField(Transaction)
    amount = peewee.IntegerField()
    accepted = peewee.BooleanField()

    class Meta:
        database = database

    def __unicode__(self):
        return '%s -> %s' % (self.payer.first_namse, self.borrower.first_name)


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
    User.create_table()
    Tag.create_table()
    Transaction.create_table()
    SubTransaction.create_table()
    TagTransaction.create_table()
    TagUser.create_table()
