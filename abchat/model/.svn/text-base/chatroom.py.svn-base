# The chatroom class
# Maps through the ORM to table Chatroom
# 
# Iain Macdonald
# ECSE 428 Team ABC
# Winter 2011

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from user import *
from abchat.model import DeclarativeBase, metadata, DBSession

__all__ = ['Chatroom']

class Chatroom(DeclarativeBase):

	__tablename__ = 'Chatroom'

	id = Column('id', Integer, nullable=False, primary_key=True)
	name = Column('name', String(64), nullable=False)
	admin_id = Column('admin', Integer, ForeignKey('Users.id'), nullable=False)
	admin = relationship(User, primaryjoin=admin_id==User.id)
	topic = Column('topic', String(1024))
	#messages = relationship('ChatroomMessage', backref='Chatroom', primaryjoin='ChatroomMessage.chatroom_id==Chatroom.id')
	#bans = relationship('ChatroomBan', backref='Chatroom', primaryjoin='ChatroomBan.chatroom_id==Chatroom.id')
	#members = relationship('ChatroomMember', backref='Chatroom', primaryjoin='ChatroomMember.chatroom_id==Chatroom.id')

	def __init__(self, name, admin, topic=None):
		self.name = name
		self.admin = admin
		self.admin_id = admin.id
		self.topic = topic

	def __repr__(self):
		rep = '<Chatroom('
		rep = rep + self.name + ', '
		rep = rep + self.admin.user_name
		if self.topic is not None:
			rep = rep + ', ' + self.topic
		rep = rep + ')>'
		return rep
