# The python class describing buddy relationships.
# This maps through the ORM to Buddies table.
# 
# Iain Macdonald
# ECSE 428 Team ABC
# Winter 2011

from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship, backref
from user import User
from abchat.model import DeclarativeBase, metadata, DBSession

__all__ = ['Buddies']

class Buddies(DeclarativeBase):

	__tablename__ = 'Buddies'

	id = Column('id', Integer, nullable=False, primary_key=True)
	user_initiated_id = Column('user_initiated', Integer, ForeignKey('Users.id'), nullable=False)
	user_initiated = relationship(User, primaryjoin=user_initiated_id==User.id, backref=backref('buddies_initiated', order_by=id))
	user_target_id = Column('user_target', Integer, ForeignKey('Users.id'), nullable=False)
	user_target = relationship(User, primaryjoin=user_target_id==User.id, backref=backref('buddies_targeted', order_by=id))
	istmp = Column('istmp', Boolean, default=0)
	blocked = Column('blocked', Boolean, default=0)
	accepted = Column('accepted', Boolean, default=0)

	def __init__(self, user_initiated, user_target, istmp=False, blocked=False, accepted=True):
		self.user_initiated = user_initiated
		self.user_initiated_id = user_initiated.id
		self.user_target = user_target
		self.user_target_id = user_target.id
		self.istmp = istmp
		self.blocked = blocked
		self.accepted = accepted

	def __repr__(self):
		rep = '<Buddies('
		rep = rep + self.user_initiated.user_name + ', '
		rep = rep + self.user_target.user_name
		if self.istmp:
			rep = rep + ', TEMPORARY'
		if self.blocked:
			rep = rep + ', BLOCKED'
		if not self.accepted:
			rep = rep + ', NOT ACCEPTED'
		rep = rep + ')>'
		return rep
