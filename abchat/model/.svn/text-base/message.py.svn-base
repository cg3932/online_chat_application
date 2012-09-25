# The class for messages passed between two users.
# Maps through the ORM to the table Messages
# 
# Iain Macdonald
# ECSE 428 Team ABC
# Winter 2011

from sqlalchemy import Column, Integer, DateTime, String, ForeignKey
from sqlalchemy.orm import relationship, backref
from user import *
from abchat.model import DeclarativeBase, metadata, DBSession

__all__ = ['Message']

class Message(DeclarativeBase):

    __tablename__ = 'Messages'

    id = Column('id', Integer, nullable=False, primary_key=True)
    uto_id = Column('uto', Integer, ForeignKey('Users.id'), nullable=False)
    uto = relationship(User, primaryjoin=uto_id==User.id, backref=backref('messages_received', order_by=id))
    ufrom_id = Column('ufrom', Integer, ForeignKey('Users.id'), nullable=False)
    ufrom = relationship(User, primaryjoin=ufrom_id==User.id, backref=backref('messages_sent', order_by=id))
    time = Column('time', DateTime, nullable=False)
    message = Column('message', String(1024), nullable=False)
    #file = relationship('File', backref='message', primaryjoin='Message.id==File.msg_id')

    def __init__(self, uto, ufrom, time, message):
		self.uto = uto
		self.uto_id = uto.id
		self.ufrom = ufrom
		self.ufrom_id = ufrom.id
		self.time = time
		self.message = message

    def __repr__(self):
		rep = '<Message('
		rep = rep + 'To: ' + self.uto.user_name + ', '
		rep = rep + 'From: ' + self.ufrom.user_name + ', '
		rep = rep + str(self.time) + ', '
		rep = rep + '"' + self.message + '")>'
		return rep
