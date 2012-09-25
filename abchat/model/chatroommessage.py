# The class for chatroom messages to be passed.
# This class maps through the ORM to the table Chatroom_messages
# 
# Iain Macdonald
# ECSE 428 Team ABC
# Winter 2011

from sqlalchemy import Column, Integer, DateTime, String, ForeignKey
from sqlalchemy.orm import relationship, backref
from user import User
from chatroom import Chatroom
from datetime import datetime
from abchat.model import DeclarativeBase, metadata, DBSession

__all__ = ['ChatroomMessage']

class ChatroomMessage(DeclarativeBase):

	__tablename__ = 'Chatroom_messages'

	id = Column('id', Integer, nullable=False, primary_key=True)
	chatroom_id = Column('chatroom', Integer, ForeignKey('Chatroom.id'), nullable=False)
	chatroom = relationship(Chatroom, primaryjoin=chatroom_id==Chatroom.id, backref=backref('messages', order_by=id))
	ufrom_id = Column('ufrom', Integer, ForeignKey('Users.id'), nullable=False)
	ufrom = relationship(User, primaryjoin=ufrom_id==User.id, backref=backref('room_messages', order_by=id))
	time = Column('time', DateTime, nullable=False)
	message = Column('message', String(1024), nullable=False)

	def __init__(self, chatroom, ufrom, message, time=datetime.now()):
		self.chatroom = chatroom
		self.chatroom_id = chatroom.id
		self.ufrom = ufrom
		self.ufrom_id = ufrom.id
		self.time = time
		self.message = message

	def __repr__(self):
		rep = '<Chatroom Message('
		rep = rep + self.chatroom.name + ', '
		rep = rep + self.ufrom.username + ', '
		rep = rep + str(self.time) + ', '
		rep = rep + '"' + self.message + '")>'
		return rep
