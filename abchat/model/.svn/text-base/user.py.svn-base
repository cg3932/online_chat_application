# The User class that represents users of the system
# Maps through the ORM to the Users table
# 
# Iain Macdonald
# ECSE 428 Team ABC
# Winter 2011

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from abchat.model import DeclarativeBase, metadata, DBSession

__all__ = ['User']

class User(DeclarativeBase):

    __tablename__ = 'Users'

    id = Column('id', Integer, nullable=False, autoincrement=True, primary_key=True)
    user_name = Column('username', String(40), nullable=False, unique=True)
    password = Column('password', String(512), nullable=False)
    status = Column('status', String(255))
    isguest = Column('isguest', Boolean)
    #loggedin = Column('loggedin', Boolean)
    lastpoll = Column('lastpoll', DateTime)

    def __init__(self, user_name, password, isguest, status=None, loggedin=False):
        self.user_name = user_name
        self.password = password
        if status is not None:
            self.status = status
        else:
            self.status = ''
        self.isguest = bool(isguest)
        self.loggedin = loggedin

    def __repr__(self):
        rep = '<User('
        rep = rep + self.user_name + ', '
        rep = rep + '******, '
        rep = rep + self.status + ', '
        rep = rep + str(self.isguest) + ')>'
        return rep

    # TODO SHA the passwords...
    def validate_password(self, password):
        return self.password == password
