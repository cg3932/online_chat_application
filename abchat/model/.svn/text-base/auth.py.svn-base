# The permission class represents the permissions used by
# repoze.what for authentaction in abchat. This shouldn't
# be used by any of the coders in the project, it's
# entirely internal
# 
# Iain Macdonald
# ECSE 428 Team ABC
# Winter 2011

from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from abchat.model import DeclarativeBase, metadata, DBSession

class User(DeclarativeBase):

    __tablename__ = 'Users'

    id = Column('id', Integer, nullable=False, autoincrement=True, primary_key=True)
    username = Column('username', String(40), nullable=False, unique=True)
    password = Column('password', String(512), nullable=False)
    status = Column('status', String(255))
    isguest = Column('isguest', Boolean)
    #buddies = relationship('Buddies', backref='user', primaryjoin='Buddies.user_initiated_id==User.id and Buddies.user_target_id==User.id')
    #messages_sent = relationship('Message', backref='user_from', primaryjoin='Message.ufrom_id==User.id')
    # For some reason this one doesn't work with a backref?
    #messages_received = relationship('Message', backref='user_to', primaryjoin='Message.uto_id==User.id')

    def __init__(self, username, password, isguest, status=None):
        self.username = username
        self.password = password
        if status is not None:
            self.status = status
        else:
            self.status = ''
        self.isguest = bool(isguest)

    def __repr__(self):
        rep = '<User('
        rep = rep + self.username + ', '
        rep = rep + '******, '
        rep = rep + self.status + ', '
        rep = rep + str(self.isguest) + ')>'
        return rep

    # TODO SHA the passwords...
    def validate_pword(self, password):
        return self.password == password

# -*- coding: utf-8 -*-
"""
Auth* related model.

This is where the models used by :mod:`repoze.who` and :mod:`repoze.what` are
defined.

It's perfectly fine to re-use this definition in the abchat application,
though.

"""
import os
from datetime import datetime
import sys
try:
    from hashlib import sha1
except ImportError:
    sys.exit('ImportError: No module named hashlib\n'
             'If you are on python2.4 this library is not part of python. '
             'Please install it. Example: easy_install hashlib')

from sqlalchemy import Table, ForeignKey, Column
from sqlalchemy.types import Unicode, Integer, DateTime
from sqlalchemy.orm import relation, synonym

from abchat.model import DeclarativeBase, metadata, DBSession

__all__ = ['User', 'Group', 'Permission']


#{ Association tables


# This is the association table for the many-to-many relationship between
# groups and permissions. This is required by repoze.what.
group_permission_table = Table('tg_group_permission', metadata,
    Column('group_id', Integer, ForeignKey('tg_group.group_id',
        onupdate="CASCADE", ondelete="CASCADE"), primary_key=True),
    Column('permission_id', Integer, ForeignKey('tg_permission.permission_id',
        onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
)

# This is the association table for the many-to-many relationship between
# groups and members - this is, the memberships. It's required by repoze.what.
user_group_table = Table('tg_user_group', metadata,
    Column('user_id', Integer, ForeignKey('tg_user.user_id',
        onupdate="CASCADE", ondelete="CASCADE"), primary_key=True),
    Column('group_id', Integer, ForeignKey('tg_group.group_id',
        onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
)


#{ The auth* model itself


class Group(DeclarativeBase):
    """
    Group definition for :mod:`repoze.what`.

    Only the ``group_name`` column is required by :mod:`repoze.what`.

    """

    __tablename__ = 'tg_group'

    #{ Columns

    group_id = Column(Integer, autoincrement=True, primary_key=True)

    group_name = Column(Unicode(16), unique=True, nullable=False)

    display_name = Column(Unicode(255))

    created = Column(DateTime, default=datetime.now)

    #{ Relations

    users = relation('User', secondary=user_group_table, backref='groups')

    #{ Special methods

    def __repr__(self):
        return ('<Group: name=%s>' % self.group_name).encode('utf-8')

    def __unicode__(self):
        return self.group_name

    #}


# The 'info' argument we're passing to the email_address and password columns
# contain metadata that Rum (http://python-rum.org/) can use generate an
# admin interface for your models.
class User(DeclarativeBase):
    """
    User definition.

    This is the user definition used by :mod:`repoze.who`, which requires at
    least the ``user_name`` column.

    """
    __tablename__ = 'tg_user'

    #{ Columns

    user_id = Column(Integer, autoincrement=True, primary_key=True)

    user_name = Column(Unicode(16), unique=True, nullable=False)

    email_address = Column(Unicode(255), unique=True, nullable=False,
                           info={'rum': {'field':'Email'}})

    display_name = Column(Unicode(255))

    _password = Column('password', Unicode(80),
                       info={'rum': {'field':'Password'}})

    created = Column(DateTime, default=datetime.now)

    #{ Special methods

    def __repr__(self):
        return ('<User: name=%r, email=%r, display=%r>' % (
                self.user_name, self.email_address, self.display_name)).encode('utf-8')

    def __unicode__(self):
        return self.display_name or self.user_name

    #{ Getters and setters

    @property
    def permissions(self):
        """Return a set with all permissions granted to the user."""
        perms = set()
        for g in self.groups:
            perms = perms | set(g.permissions)
        return perms

    @classmethod
    def by_email_address(cls, email):
        """Return the user object whose email address is ``email``."""
        return DBSession.query(cls).filter_by(email_address=email).first()

    @classmethod
    def by_user_name(cls, username):
        """Return the user object whose user name is ``username``."""
        return DBSession.query(cls).filter_by(user_name=username).first()

    def _set_password(self, password):
        """Hash ``password`` on the fly and store its hashed version."""
        # Make sure password is a str because we cannot hash unicode objects
        if isinstance(password, unicode):
            password = password.encode('utf-8')
        salt = sha1()
        salt.update(os.urandom(60))
        hash = sha1()
        hash.update(password + salt.hexdigest())
        password = salt.hexdigest() + hash.hexdigest()
        # Make sure the hashed password is a unicode object at the end of the
        # process because SQLAlchemy _wants_ unicode objects for Unicode cols
        if not isinstance(password, unicode):
            password = password.decode('utf-8')
        self._password = password

    def _get_password(self):
        """Return the hashed version of the password."""
        return self._password

    password = synonym('_password', descriptor=property(_get_password,
                                                        _set_password))

    #}

    def validate_password(self, password):
        """
        Check the password against existing credentials.

        :param password: the password that was provided by the user to
            try and authenticate. This is the clear text version that we will
            need to match against the hashed one in the database.
        :type password: unicode object.
        :return: Whether the password is valid.
        :rtype: bool

        """
        hash = sha1()
        if isinstance(password, unicode):
            password = password.encode('utf-8')
        hash.update(password + str(self.password[:40]))
        return self.password[40:] == hash.hexdigest()


class Permission(DeclarativeBase):
    """
    Permission definition for :mod:`repoze.what`.

    Only the ``permission_name`` column is required by :mod:`repoze.what`.

    """

    __tablename__ = 'tg_permission'

    #{ Columns

    permission_id = Column(Integer, autoincrement=True, primary_key=True)

    permission_name = Column(Unicode(63), unique=True, nullable=False)

    description = Column(Unicode(255))

    #{ Relations

    groups = relation(Group, secondary=group_permission_table,
                      backref='permissions')

    #{ Special methods

    def __repr__(self):
        return ('<Permission: name=%r>' % self.permission_name).encode('utf-8')

    def __unicode__(self):
        return self.permission_name

    #}


#}
