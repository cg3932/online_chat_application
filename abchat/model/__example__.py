#!/pub/tg/bin/python

# This file will serve as an example for how to use SQLAlchemy, the ORM,
# the data model, and database sessions. For the most part, you'll just
# need to do queries, updates, and deletes.

# ABChat - Team ABC ECSE 428 Winter 2011
# Iain Macdonald

# The model has one class for each of the tables in the database.
# See the database documentation for more details on the database.
# To start with, we will import all of the entities from the model.
# In practice, you need only import the entities that you need. When
# running, however, an exception will be thrown if you try to use a
# model you haven't imported. Each model class corresponds to the
# similarly named table in the database.
"""
from abchat.model.buddies import Buddies
from abchat.model.chatroomban import ChatroomBan
from abchat.model.chatroommember import ChatroomMember
from abchat.model.chatroommessage import ChatroomMessage
from abchat.model.chatroom import Chatroom
from abchat.model.file import File
from abchat.model.message import Message
from abchat.model.user import User
"""
# That is one way of doing it, but I've also defined a script to let
# you do it much easier... This is the same as the above
from abchat.model.model import *

# Now that we have all of our model objects imported, we need to get
# a database session readied. Fortunately for you, I've set up a
# script to do this easily. Just import the session like so and
# it is ready to use
from abchat.model.session import session

# Now we're ready to interact with the database. It was really just
# as simple as importing all of those things to create ourselves a
# usable database interface.

# Let's start by making a few users to play around with.
# In python, you can provide arguments to a function in
# two forms, by saying:
#           argname=value
# or simply
#           value
# the difference is that in the second, the order is important,
# whereas in the first, they can be in any order.
# Let's use the first method, just to be super clear.
# Each of these constructors has some required data and some
# optional data. You can see what these are by looking at the
# __init__ function in each of the classes.
# Note that None is NULL in python.
iain = User(username='iain', password='abc', isguest=0, status=None)
armen = User(username='armen', password='def', isguest=0, status=None)
julian = User(username='julian', password='ghi', isguest=0, status=None)

# Now that we've got our user objects, let's add these into
# the database. We can add objects to the database using session.add()
session.add(iain)
session.add(armen)
session.add(julian)

# At this stage, if you ran a query, you wouldn't see these
# entries in the database. That's because SQLAlchemy uses
# a lazy method for evaluation. Until you actually ask for it
# or modify them, they won't be added to the databse.
# You can override this by forcing a commi.t
session.commit()

# Now these things are in the database.
# Let's do a quick query on the database.
# Queries in SQLAlchemy are done using the session.query()
# object. This object has a few functions that we'll look at.
# First, though, a query object requires a type, the
# data to query. We're querying users, so let's set that up
# The all() function retrieves all of the records from
# the database.
user = session.query(User).all()
print('There are ' + str(len(user)) + ' users in the database')

# The first function gets the first object from the database
user = session.query(User).first()
print('The first is ' + user.username)

# That's not too useful though, because what if you want
# to query? The filter function does this for you.
# filter requires a bit more understanding of the classes
# though. You need to know the Python name of the field
# you're querying. Take a look at the model files for an
# idea of what these are. Underneath __tablename__ are listed
# the fields for each of the objects.
# Note that the filter function still returns a query, so you do
# need to use an operator to get data entries from that query.
user = session.query(User).filter(User.username=='iain').first()
print('iain? ' + user.username)

# You can use any sort of boolean operation on the filter
# Sometimes you won't get any results though... You can
# use the count function to generate only the number of
# mathing records
user = session.query(User).filter(User.username=='sabourin').count()
if user == 0:
        print('No sabourin users...')
else:
        print('found a sabourin user!')

# There are a dearth of other query fucntions available. Quite
# frankly, I've never used anything more than all, first,
# filter, order_by, and count, you can get information about them
# all at www.sqlalchemy.org/docs/orm/query.html


# Let's look at some relationships now.
# We can establish some buddy relationships, let's go ahead and
# do that now. Notice how we're only dealing in terms of the
# Python objects we've been working with, there's no talk of user
# ids or referencing, or any of that business.
b1 = Buddies(iain, armen)
b2 = Buddies(iain, julian)
b3 = Buddies(armen, julian)

# Again, we can add these relationships to the database
session.add(b1)
session.add(b2)
session.add(b3)
session.commit()

# Something interesting has happened now, though. Let's say we want
# to find out all of Armen's buddies. We could do a query on buddies
# and filter where either of the users involved are Armen. Or we could
# just let SQLAlchemy take care of all of that for us.
# In fact, because of the way the buddies table is defined, there are
# two sorts of buddies: buddies that the user friended and buddies
# that the user was friended by. These are called buddies_initiated
# and buddies_targeted, respectively
print('Armens buddies_initiated: ' + str(armen.buddies_initiated))
print('Armens buddies_targeted: ' + str(armen.buddies_targeted))

# Because there is a relationship defined in the model this way, the
# ORM will automatically update these relationship fields for us to
# match this new data. That's pretty useful because now we don't have
# to worry about joins and everything.

# We know how to add entries to the database. Deletion is just as easy.
session.delete(armen)
session.commit()

# This should have generated a warning, becuase now that armin is out
# of the picture, there are two orphaned relationships with iain
# and julian. It's not a big deal, because there should be cascading
# of this stuff (I'm not sure if it's configure properly at the moment).
print('That should have generated a warning')

if session.query(User).filter(User.username=='armen').count() == 0:
        print('Armen was deleted from the database.')
else:
        print('Armen is still hanging around in the database.')

# This tutorial is pretty long already and there are a lot of new concepts
# so I won't talk about EVERY object in the model (there are 8 classes)
# I'll let you poke around these on your own. When you're using each of them
# remember you must import them. Then, you should have easy access to a list
# of fields in each class, you can find these by reading the code in the model
# for that class. You'll use these fairly frequenyly in your code.
# Let's look at some more features of SQLAlchemy now
evil = User(username='eviluser', password='pass', isguest=0)
session.add(evil)

# Ooops, didn't mean to do that, because evil user isn't supposed to be in
# the database. No problem, we'll just rollback that transaction.
session.rollback()
if session.query(User).filter(User.username=='eviluser').count() == 0:
        print('Eviluser was not added to the database.')
else:
        print('Eviluser was added to the database. :(')


# That's about everything I can think of that you would want to do with a
# database session. Let's go ahead and clean up after ourselves.
session.delete(b1)
session.delete(b2)
session.delete(b3)
session.delete(iain)
session.delete(julian)
session.commit()

# For any more information on using queries, feel free to ask me
# via e-mail at xiainx@gmail.com, or you can check out the SQLAlchemy docs
# at www.sqlalchemy.org/docs/orm/session.html
# These docs are great, if you go there and just search something, you can
# usually figure out how to do it within a few minutes.
