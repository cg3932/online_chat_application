# The database session that should be used in the ABChat application.
# This script just sets up a database session using a [fixed] URL
# Fortunately, this URL won't change for our project, so this is fine.
# To use this session, one need only type...
# from abchat.model.session import session
# Then, bam, session is your database session for doing all kinds of
# fun things.
#
# Iain Macdonald
# ECSE 428 Team ABC
# Winter 2011

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# from user import User
# from base import DeclarativeBase

# Use this engine if you want SQLAlchemy to print all of its database operations
# __engine__ = create_engine('mysql://abchat:teamabc@localhost:3306/abchat', echo=True)

# Use this engine if you DONT want SQLAlchemy to print all of its database operations
__engine__ = create_engine('mysql://abchat:teamabc@localhost:3306/abchat', echo=False)

__session__ = sessionmaker(__engine__)
session = __session__()
