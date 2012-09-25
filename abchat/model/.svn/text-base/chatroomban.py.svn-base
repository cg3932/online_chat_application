# The class representing chatroom bannings.
# This maps through the ORM to table Chatroom_bans
# 
# Iain Macdonald
# ECSE 428 Team ABC
# Winter 2011

from sqlalchemy import Column, Integer, DateTime, String, ForeignKey
from sqlalchemy.orm import relationship, backref
from user import *
from chatroom import Chatroom
from datetime import datetime
from abchat.model import DeclarativeBase, metadata, DBSession

__all__ = ['ChatroomBan']

class ChatroomBan(DeclarativeBase):

	__tablename__ = 'Chatroom_bans'

	id = Column('id', Integer, nullable=False, primary_key=True)
	chatroom_id = Column('chatroom', Integer, ForeignKey('Chatroom.id'), nullable=False)
	chatroom = relationship(Chatroom, primaryjoin=chatroom_id==Chatroom.id, backref=backref('banned', order_by=id))
	user_id = Column('user', Integer, ForeignKey('Users.id'), nullable=False)
	user = relationship(User, primaryjoin=user_id==User.id, backref=backref('banned_from', order_by=id))
	expires = Column('expires', DateTime, nullable=False)

	def __init__(self, chatroom, user, expires=None):
		self.chatroom = chatroom
		self.chatroom_id = chatroom.id
		self.user = user
		self.user_id = user.id
		self.expires = expires

	def __repr__(self):
		rep = '<Chatroom Ban('
		rep = rep + self.chatroom.name + ', '
		rep = rep + self.user.username + ', '
		if self.expires is None:
			rep = rep + 'Indefinite'
		else:
			rep = rep + str(self.expires)
		rep = rep + ')>'
		return rep
