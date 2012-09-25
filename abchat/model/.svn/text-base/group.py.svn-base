# The groups class represents the groups used by
# repoze.what for authentication in abchat.
# This shouldn't be used by any coders of the
# project, it's entirely internal.
# 
# Iain Macdonald
# ECSE 428 Team ABC
# Winter 2011

from sqlalchemy import Table, ForeignKey, Column, MetaData
from sqlalchemy.types import String, Integer
from sqlalchemy.orm import relationship
from abchat.model.user import User
from abchat.model import DeclarativeBase, metadata, DBSession

__all__ = ['Group', 'user_group_table']

# Group-to-User secondary association table
user_group_table = Table('User_Group', DeclarativeBase.metadata,
    Column('user_id', Integer, ForeignKey('Users.id',
        onupdate='CASCADE', ondelete='CASCADE'), primary_key=True),
    Column('group_id', Integer, ForeignKey('UGroup.id',
        onupdate='CASCADE', ondelete='CASCADE'), primary_key = True)
)


class Group(DeclarativeBase):

    __tablename__ = 'UGroup'
    id = Column('id', Integer, nullable=False, autoincrement=True, primary_key=True)
    group_name = Column('groupname', String(32), unique=True, nullable=False)
    users = relationship(User, secondary=user_group_table, backref='groups')

    def __init__(self, group_name):
        self.group_name = group_name

    def __repr__(self):
        return ('<Group(%s)>' % self.group_name).encode('utf-8')

    def __unicode__(self):
        return self.group_name
