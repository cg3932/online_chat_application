# The file class linked to messages for sharing files
# maps through the ORM to table Files
# 
# Iain Macdonald
# ECSE 428 Team ABC
# Winter 2011

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, backref
from message import Message
from abchat.model import DeclarativeBase, metadata, DBSession

__all__ = ['Files']

class File(DeclarativeBase):

	__tablename__ = 'Files'

	id = Column('id', Integer, nullable=False, primary_key=True)
	msg_id = Column('msg', Integer, ForeignKey('Messages.id'), nullable=False)
	msg = relationship(Message, primaryjoin=msg_id==Message.id, backref=backref('file', order_by=id))
	path = Column('path', String(4096), nullable=False)

	def __init__(self, msg, path):
		self.msg = msg
		self.msg_id = msg.id
		self.path = path

	def __repr__(self):
		rep = '<File('
		rep = rep + self.msg.message + ', '
		rep = rep + self.path
		rep = rep + ')>'
		return rep
