# The class for chatroom member tracking
# This maps through the ORM to Chatroom_members
# 
# Iain Macdonald
# ECSE 428 Team ABC
# Winter 2011

from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship, backref
from base import DeclarativeBase
from user import User
from chatroom import Chatroom
from abchat.model import DeclarativeBase, metadata, DBSession

__all__ = ['ChatroomMember']

class ChatroomMember(DeclarativeBase):

    __tablename__ = 'Chatroom_members'

    id = Column('id', Integer, nullable=False, primary_key=True)
    chatroom_id = Column('chatroom', Integer, ForeignKey('Chatroom.id'), nullable=False)
    chatroom = relationship(Chatroom, primaryjoin=chatroom_id==Chatroom.id, backref=backref('members', order_by=id))
    user_id = Column('user', Integer, ForeignKey('Users.id'), nullable=False)
    user = relationship(User, primaryjoin=user_id==User.id)
    lastpoll = Column('lastpoll', DateTime)

    def __init__(self, chatroom, user):
        self.chatroom = chatroom
        #self.chatroom_id = chatroom.id
        self.user = user
        #self.user_id = user.id

    def __repr__(self):
        rep = '<Chatroom Member('
        rep = rep + self.chatroom.name + ', '
        rep = rep + self.user.user_name
        rep = rep + ')>'
        return rep
