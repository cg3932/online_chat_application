# The permissionss class represenlts the permissions used by
# repoze.what for authentication in abchat.
# This shouldn't be used by any coders of the
# project, it's entirely internal.
# 
# Iain Macdonald
# ECSE 428 Team ABC
# Winter 2011

from sqlalchemy import Table, ForeignKey, Column
from sqlalchemy.types import String, Integer
from sqlalchemy.orm import relationship
from abchat.model.group import Group
from abchat.model import DeclarativeBase, metadata, DBSession

_all__ = ['Permission', 'group_permission_table']

# Group-to-Permission secondary association table
group_permission_table = Table('Group_Perm', metadata,
    Column('group_id', Integer, ForeignKey('UGroup.id',
        onupdate="CASCADE", ondelete="CASCADE"), primary_key=True),
    Column('perm_id', Integer, ForeignKey('Permissions.id',
        onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
)


class Permission(DeclarativeBase):

    __tablename__ = 'Permissions'

    id = Column('id', Integer, nullable=False, autoincrement=True, primary_key=True)
    permission_name = Column('name', String(32), unique=True, nullable=False)

    groups = relationship(Group, secondary=group_permission_table,
                      backref='permissions')

    def __init__(self, permission_name):
        self.permission_name = permission_name

    def __repr__(self):
        return ('<Permission(%r)>' % self.permission_name)

    def __unicode__(self):
        return self.permission_name
