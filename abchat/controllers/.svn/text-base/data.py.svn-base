# -*- coding: utf-8 -*-
# The data controller  for the abchat application
# Mounted at /data, this code serves the data
# requests of clients, returning JSON code


from tg import expose, flash, require, url, request, redirect
from pylons.i18n import ugettext as _, lazy_ugettext as l_
from tgext.admin.tgadminconfig import TGAdminConfig
from tgext.admin.controller import AdminController
from repoze.what import predicates
import datetime, re, urllib2
from abchat.lib.base import BaseController
# from abchat.model import DBSession, metadata
from abchat.model import metadata
from abchat.model.session import __session__ as DBSessionmaker
from abchat import model
from abchat.controllers.secure import SecureController
from abchat.controllers.error import ErrorController
from abchat.model.model import *
from abchat.model import *
from sqlalchemy import and_, or_
import random


class DataController(BaseController):

    # Get buddies
    # returns a JSON array of buddies of the given user, 
    # as well as the statuses of these users. Otherwise, we
    # return just 'ERROR' if the user could not be found
    # or some other error occurred.
    @expose('json')
    def get_buddies(self, username):
        DBSession = DBSessionmaker()
        delta = datetime.timedelta(seconds=5)
        pollcutoff = datetime.datetime.now() - delta
        try:
            user = DBSession.query(User).filter(User.user_name==username).all()
        except:
            DBSession.close()
            return dict(buddies=['An internal server error occurred. Try reloading the page'])
        if len(user) < 1:
            DBSession.close()
            return dict(buddies=['Could not identify you. Try reloading the page'])
        user = user[0]
        if user is not None:
            user.lastpoll = datetime.datetime.now()
            DBSession.add(user)
            DBSession.commit()
            buddyobjectArray = user.buddies_initiated
            buddiesArray = []
            statuses = []
            loggedin = []
            confirmed = []
            for buddy in buddyobjectArray:
                if buddy.user_target is None:
                    continue
                elif buddy.user_target.user_name == 'NULL':
                    continue
                elif buddy.istmp:
                    continue
                buddiesArray = buddiesArray + [buddy.user_target.user_name]
                statuses = statuses + [buddy.user_target.status]
                if buddy.user_target.lastpoll is None:
                    loggedin = loggedin + [False]
                elif buddy.user_target.lastpoll >= pollcutoff:
                    loggedin = loggedin + [True]
                else:
                    loggedin = loggedin + [False]
                if buddy.user_target.user_name == username and buddy.accepted == False:
                    confirmed = confirmed + [False]
                else:
                    confirmed = confirmed + [True]
            buddyobjectArray = user.buddies_targeted
            for buddy in buddyobjectArray:
                if buddy.user_initiated is None:
                    continue
                elif buddy.user_initiated.user_name == 'NULL':
                    continue
                elif buddy.istmp:
                    continue
                buddiesArray = buddiesArray + [buddy.user_initiated.user_name]
                statuses = statuses + [buddy.user_initiated.status]
                if buddy.user_initiated.lastpoll is None:
                    loggedin = loggedin + [False]
                elif buddy.user_initiated.lastpoll >= pollcutoff:
                    loggedin = loggedin + [True]
                else:
                    loggedin = loggedin + [False]
                if buddy.user_target.user_name == username and buddy.accepted == False:
                    confirmed = confirmed + [False]
                else:
                    confirmed = confirmed + [True]
            DBSession.close()
            return dict(buddies=buddiesArray, status=statuses, online=loggedin, confirm=confirmed)
        DBSession.close()
        return dict(buddies=[])


    # Add buddy
    # This function adds a buddy relation between two users
    # started by one user. The other user must confirm the
    # operation.
    @expose('json')
    def add_buddy(self, user_initiate,  user_target):
        DBSession = DBSessionmaker()
        try:
            ui = DBSession.query(User).filter(User.user_name==user_initiate).all()
            ut = DBSession.query(User).filter(User.user_name==user_target).all()
        except:
            DBSession.close()
            return dict(status='Internal Server Error')
        if len(ui) != 0 and len(ut) != 0:
            ui = ui[0]
            ut = ut[0]
            try:
                buds1 = DBSession.query(Buddies).filter(Buddies.user_initiated==ui).filter(Buddies.user_target==ut).all()
                buds2 = DBSession.query(Buddies).filter(Buddies.user_target==ui).filter(Buddies.user_initiated==ui).all()
            except:
                DBSession.close()
                return dict(status='Internal Server Error')
            if len(buds1) == 0 and len(buds2) == 0 and ui != ut:
                buds = Buddies(ui, ut, 0, 0, 0)
                DBSession.add(buds)
                DBSession.commit()
            elif ui == ut:
                DBSession.close()
                return dict(status='You cannot be buddies with yourself.')
            else:
                DBSession.close()
                return dict(status='Already buddies.')
            DBSession.close()
            return dict(status='success')
        DBSession.close()
        return dict(status='Invalid users')


    # Delete buddy
    # This function deletes a buddy relation between two
    # users, if,for instance, two users are no loner friends
    @expose('json')
    def del_buddy(self, user1, user2):
        DBSession = DBSessionmaker()
        try:
            u1 = DBSession.query(User).filter(User.user_name==user1).all()
            u2 = DBSession.query(User).filter(User.user_name==user2).all()
        except:
            DBSession.close()
            return dict(status='Internal Server Error')
        if len(u1) != 0 and len(u2) != 0:
            u1 = u1[0]
            u2 = u2[0]
            try:
                buds = DBSession.query(Buddies).filter(and_(Buddies.user_initiated==u1, Buddies.user_target==u2)).all()
            except:
                DBSession.close()
                return dict(status='Internal Server Error')
            if len(buds) == 0:
                buds = DBSession.query(Buddies).filter(and_(Buddies.user_initiated==u2, Buddies.user_target==u1)).all()
            if len(buds) != 0:
                buds = buds[0]
                DBSession.delete(buds)
                DBSession.commit()
                DBSession.close()
                return dict(status='success')
            else:
                DBSession.close()
                return dict(status='not buddies')
        else:
            DBSession.close()
            return dict(status='Invalid users.')


    # Confirm buddy relation
    # This function confirms a buddy relation between two buddies.
    # The ordering input does not matter.
    @expose('json')
    def confirm_buddy(self, user1, user2):
        DBSession = DBSessionmaker() 
        try:
            u1 = DBSession.query(User).filter(User.user_name==user1).all()
            u2 = DBSession.query(User).filter(User.user_name==user2).all()
        except:
            DBSession.close()
            return dict(status='Internal Server Error')
        if len(u1) != 0 and len(u2) != 0:
            u1 = u1[0]
            u2 = u2[0]
            try:
                buds = DBSession.query(Buddies).filter(and_(Buddies.user_initiated==u1, Buddies.user_target==u2)).all()
            except:
                DBSession.close()
                return dict(status='Internal Server Error')
            if len(buds) == 0:
                try:
                    buds = DBSession.query(Buddies).filter(and_(Buddies.user_initiated==u2, Buddies.user_target==u1)).all()
                except:
                    DBSession.close()
                    return dict(status='Internal Server Error')
            if len(buds) != 0:
                buds = buds[0]
                buds.accepted = True
                DBSession.commit()
        DBSession.close()
        return dict(status='success')

    # Send message
    # This function sends a message from one user to
    # another, by creating an entry in the database 
    # linking the two users and the message.
    @expose('json')
    def send_message(self, userfrom, userto, message):
        message = message.replace('<', '&lt;').replace('>', '&gt;')
        message = message.replace('\n', '<br />')
        image = re.compile('\S+:\S+/\S+.[gif,png,jpe?g,bmp]')
        yt = re.compile('\S*youtube.com/watch\?v=([\w,-]+)\S*')
        urlRE = re.compile('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
        
        urls = urlRE.findall(message)
        for url in urls:
            message = message.replace(url, '<a href="' +url+'">'+url+'</a>')
            
        urls = urlRE.findall(message)
        images = image.findall(message)
        youtube = yt.findall(message)
        
        message = message +'<br />'
        for i in images:
            try:
                request = urllib2.Request(i)
                request.get_method = lambda : 'HEAD'
                response = urllib2.urlopen(request)
                if response.info().gettype()[0:5] == 'image': 
                    message += '<IMG src="'+i+'" style="max-width: 400px;"/><br />'                
            except:
                pass
             
        for videoID in youtube:
            message += '<iframe title="YouTube video player" width="480" height="390" src="http://www.youtube.com/embed/' +videoID+'" frameborder="0" allowfullscreen></iframe><br />'

        DBSession = DBSessionmaker()
        delta = datetime.timedelta(seconds=5)
        floodcutoff = datetime.datetime.now() - delta
        try:
            ufrom = DBSession.query(User).filter(User.user_name==userfrom).all()
            uto = DBSession.query(User).filter(User.user_name==userto).all()
        except:
            DBSession.close()
            return dict(status='Internal Server Error')
        if len(ufrom) == 0 or len(uto) == 0:
            DBSession.close()
            return dict(status='Invalid users.')
        if len(message) > 1024:
            DBSession.close()
            return dict(status='Message too long.')
        try:
            msgs = DBSession.query(Message).filter(and_(Message.ufrom == ufrom[0], Message.uto == uto[0])).order_by(Message.time).all()
        except:
            DBSession.close()
            return dict(status='Internal Server Error')
        if len(msgs) > 5:
            if msgs[-5].time > floodcutoff:
                DBSession.close()
                return dict(status='Flood control.')
        ufrom = ufrom[0]
        uto = uto[0]
        msg = Message(uto, ufrom, datetime.datetime.now() , message)
        DBSession.add(msg)
        DBSession.commit()
        DBSession.close()
        return dict(status='success')


    # Get Messages
    # This function gets messages sent to the user since
    # last, which is a time.
    @expose('json')
    def get_messages(self, username, last):
        DBSession = DBSessionmaker()
        if username is not None:
            try:
                user = DBSession.query(User).filter(User.user_name==username).all()
            except:
                DBSession.close()
                return dict(messages=[])
            if len(user) < 1:
                DBSession.close()
                return dict(messages=[])
            user = user[0]
            try:
                msg = DBSession.query(Message).filter(or_(Message.uto==user, Message.ufrom==user)).order_by(Message.time).all()
            except:
                DBSession.close()
                return dict(messages=[])
            if len(msg) < 1:
                DBSession.close()
                return dict(messages=[dict(message='', ufrom=None, time=datetime.datetime.now().strftime('%Y-%m-%d-%H:%M:%S'), id=0)])
            formatted_msg = []
            try:
                last_time = datetime.datetime.strptime(last, '%Y-%m-%d-%H:%M:%S')
            except:
                DBSession.close()
                return dict(messages=[dict(message='', ufrom=None, time=datetime.datetime.now().strftime('%Y-%m-%d-%H:%M:%S'), id=0)])
            for m in msg:
                try:
                    if m.ufrom is None or m.uto is None:
                        continue
                except:
                    continue
                if last_time is not None:
                    if last_time > m.time:
                        continue
                #if m.ufrom == user:
                #    formatted_msg = formatted_msg + [dict(message=(m.ufrom.user_name + ': ' + m.message + '\n'), ufrom=m.uto.user_name, time=m.time, id=m.id)]
                # some issue down here...
                if last_time is None:
                    if m.uto == user:
                        formatted_msg = formatted_msg + [dict(message=(m.ufrom.user_name + ': ' + m.message + '\n'), ufrom=m.ufrom.user_name, time=m.time, id=m.id)]
                    elif m.ufrom == user:
                        formatted_msg = formatted_msg + [dict(message=(m.ufrom.user_name + ': ' + m.message + '\n'), ufrom=m.uto.user_name, time=m.time, id=m.id)]
                elif m.time is not None:
                    if last_time < m.time:
                        if m.uto == user:
                            formatted_msg = formatted_msg + [dict(message=(m.ufrom.user_name + ': ' + m.message + '\n'), ufrom=m.ufrom.user_name, time=m.time, id=m.id)]
                        elif m.ufrom == user:
                            formatted_msg = formatted_msg + [dict(message=(m.ufrom.user_name + ': ' + m.message + '\n'), ufrom=m.uto.user_name, time=m.time, id=m.id)]
            DBSession.close()
            return dict(messages=formatted_msg)
        DBSession.close()
        return dict(messages=[])


    # Get History
    # This function gets the entire conversation history between
    # two users. This is useful for the new method of conversations
    # where we only display new messages, but want history to show up
    @expose('json')
    def get_history(self, user1, user2):
        DBSession = DBSessionmaker()
        try:
            u1 = DBSession.query(User).filter(User.user_name == user1).all()
            u2 = DBSession.query(User).filter(User.user_name == user2).all()
        except:
            DBSession.close()
            return dict(status='Internal Server Error')
        if len(u1) == 0 or len(u2) == 0:
            DBSession.close()
            return dict(status='Invalid Users')
        try:
            b1 = DBSession.query(Buddies).filter(and_(Buddies.user_initiated == u1[0], Buddies.user_target == u2[0])).all()
            b2 = DBSession.query(Buddies).filter(and_(Buddies.user_initiated == u2[0], Buddies.user_target == u1[0])).all()
        except:
            DBSession.close()
            return dict(status='Internal Server Error')
        if (len(b1) + len(b2)) == 0:
            DBSession.close()
            return dict(status='Not buddies')
        elif len(b1) == 0:
            if b2[0].istmp:
                DBSession.close()
                return dict(status='Temporary buddies')
        elif len(b2) == 0:
            if b1[0].istmp:
                DBSession.close()
                return dict(status='Temporary buddies')
        u1 = u1[0]
        u2 = u2[0]
        try:
            dbmsgs = DBSession.query(Message).filter(or_(and_(Message.uto==u1, Message.ufrom==u2), and_(Message.uto==u2, Message.ufrom==u1))).order_by(Message.time).all()
        except:
            DBSession.close()
            return dict(status='Internal Server Error')
        formatted_msg = []
        for m in dbmsgs:
            try:
                if m.ufrom is None or m.uto is None:
                    continue
            except:
                continue
            formatted_msg = formatted_msg + [dict(message=(m.ufrom.user_name + ': ' + m.message + '\n'), ufrom=m.uto.user_name, time=m.time, id=m.id)]
        DBSession.close()
        return dict(messages=formatted_msg)


    # Get Status gets the status of the given buddy and returns it as json.
    @expose('json')
    def get_status(self, user):
        DBSession = DBSessionmaker()
        try:
            u = DBSession.query(User).filter(User.user_name == user).all()
        except:
            DBSession.close()
            return dict(status='')
        if len(u) == 0:
            DBSession.close()
            return dict(status='')
        DBSession.close()
        return dict(status = u[0].status)


    # Set Status sets the status of the given buddy
    @expose('json')
    def set_status(self, user, status):
        DBSession = DBSessionmaker()
        try:
            u = DBSession.query(User).filter(User.user_name == user).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        if len(u) == 0:
            DBSession.close()
            return dict(status='That user does not exist')
        u.status = status
        DBSession.add(u)
        DBSession.commit()
        DBSession.close()
        return dict(status = 'OK')


    # Connect connects a user to a chatroom by adding the user to the list
    # of users in the room, and returning all of the messages from times past
    @expose('json')
    def connect(self, username, chatroom):
        DBSession = DBSessionmaker()
        try:
            room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
        except:
            DBSession.close()
            return dict(status='Internal server error.')
        if len(room) == 0:
            room = self.create(username, chatroom)
            if not room:
                DBSession.close()
                return dict(status='Internal server error.')
            try:
                room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
            except:
                DBSession.close()
                return dict(status='Internal server error.')
        room = room[0]
        try:
            user = DBSession.query(User).filter(User.user_name == username).all()
        except:
            DBSession.close()
            return dict(status='Internal server error.')
        if len(user) == 0:
            DBSession.close()
            return dict(status='User does not exist.')
        user = user[0]
        try:
            mem = DBSession.query(ChatroomMember).filter(and_(ChatroomMember.chatroom == room, ChatroomMember.user == user)).all()
        except:
            DBSession.close()
            return dict(status='Internal server error.')
        if len(mem) != 0:
            DBSession.close()
            return dict(status='Already connected to that chatroom')
        try:
            bans = DBSession.query(ChatroomBan).filter(and_(ChatroomBan.user == user, ChatroomBan.chatroom == room)).all()
        except:
            DBSession.close()
            return dict(status='Internal server error.')
        if len(bans) != 0:
            for ban in bans:
                if datetime.datetime.now() < ban.expires:
                    DBSession.close()
                    return dict(status='That user is banned from that chatroom')
        mema = ChatroomMember(room, user)
        print(mema)
        DBSession.add(mema)
        DBSession.commit()
        #return dict(status='OK', users=room.members, msgids=[r.id for r in room.messages], messages=[r.message for r in room.messages], times=[r.time for r in room.messages])
        DBSession.close()
        return dict(status='OK')


    # get_topic returns the topic of the specified chatroom
    @expose('json')
    def get_topic(self, chatroom):
        DBSession = DBSessionmaker()
        try:
            room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
        except:
            DBSession.close()
            return dict(topic='Internal server error')
        if len(room) != 1:
            DBSession.close()
            return dict(topic='That room does not exist')
        DBSession.close()
        return dict(topic=room[0].topic)


    # create_chat creates a chatroom, which is done when a user
    # tries to connect to a nonexistent chatroom
    def create(self, username, chatroom):
        DBSession = DBSessionmaker()
        try:
            user = DBSession.query(User).filter(User.user_name == username).all()
        except:
            DBSession.close()
            return False 
        if len(user) == 0:
            DBSession.close()
            return None
        user = user[0]
        room = Chatroom(chatroom, user, chatroom)
        DBSession.add(room)
        DBSession.commit()
        DBSession.close()
        return True


    # get_chatroom_messages retrieves the messages from a certain chatroom,
    # only messages since a certain date
    @expose('json')
    def get_chatroom_messages(self, chatroom, last, user):
        DBSession = DBSessionmaker()
        delta = datetime.timedelta(seconds=5)
        pollcutoff = datetime.datetime.now() - delta
        try:
            u = DBSession.query(User).filter(User.user_name == user).all()
        except:
            DBSession.close()
            return dict(messages=[])
        if len(u) < 1:
            DBSession.close()
            return dict(messages=[])
        u = u[0]
        if chatroom is not None:
            try:
                room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
            except:
                DBSession.close()
                return dict(messages=[])
            if len(room) < 1:
                DBSession.close()
                return dict(messages=[])
            room = room[0]
            try:
                mem = DBSession.query(ChatroomMember).filter(and_(ChatroomMember.chatroom == room, ChatroomMember.user == u)).all()
            except:
                try:
                    bans = DBSession.query(ChatroomBan).filter(and_(ChatroomBan.chatroom == room, ChatroomBan.user == u)).all()
                except:
                    DBSession.close()
                    return dict(messages=[])
                bant = []
                for b in bans:
                    if b.expires > datetime.datetime.now():
                        if b.expires.year != 3000:
                            bant = bant + [b.user.user_name + '*']
                        else:
                            bant = bant + [b.user.user_name]
                DBSession.close()
                return dict(messages=[], bans=bant)
            if len(mem) < 1:
                try:
                    bans=DBSession.query(ChatroomBan).filter(and_(ChatroomBan.chatroom == room, ChatroomBan.user == u)).all()
                except:
                    DBSession.close()
                    return dict(messages=[])
                bant = []
                for b in bans:
                    if b.expires > datetime.datetime.now():
                        if b.expires.year != 3000:
                            bant = bant + [b.user.user_name + '*']
                        else:
                            bant = bant + [b.user.user_name]
                DBSession.close()
                DBSession.close()
                return dict(messages=[], bans=bant)
            mem[0].lastpoll = datetime.datetime.now()
            DBSession.add(mem[0])
            DBSession.commit()
            try:
                bans = DBSession.query(ChatroomBan).filter(ChatroomBan.chatroom == room).all()
            except:
                DBSession.close()
                return dict(messages=[])
            try:
                mem = DBSession.query(ChatroomMember).filter(ChatroomMember.chatroom == room).all()
            except:
                DBSession.close()
                return dict(messages=[])
            members = []
            for m in mem:
                #if m.lastpoll is None:
                #    self.disconnect_quiet(m.user.user_name, chatroom)
                if m.lastpoll is not None:
                    if m.lastpoll < pollcutoff:
                        self.disconnect_quiet(m.user.user_name, chatroom)
                elif m.user.user_name != u.user_name:
                    members = members + [m.user.user_name]
            if room.admin is not None:
                admin = room.admin.user_name
            else:
                admin = None
            #self.update_chatroom_members()
            try:
                msg = DBSession.query(ChatroomMessage).filter(ChatroomMessage.chatroom == room).order_by(ChatroomMessage.time).all()
            except:
                DBSession.close()
                return dict(messages=[])
            if len(msg) < 1:
                DBSession.close()
                return dict(messages=[dict(message='', ufrom=None, time=datetime.datetime.now().strftime('%Y-%m-%d-%H:%M:%S'), id=0)], members=members, admin=admin)
            formatted_msg = []
            try:
                last_time = datetime.datetime.strptime(last, '%Y-%m-%d %H:%M:%S')
            except:
                last_time = None
                #return dict(messages=[dict(message='', ufrom=None, time=datetime.datetime.now().strftime('%Y-%m-%d-%H:%M:%S'), id=0)])
            for m in msg:
                try:
                    if m.ufrom is None:
                        continue
                except:
                    continue
                if last_time is not None:
                    if last_time >= m.time:
                        continue
                formatted_msg = formatted_msg + [dict(message=(m.ufrom.user_name + ': ' + m.message + '\n'), ufrom=m.ufrom.user_name, time=m.time, id=m.id)]
            formatted_bans = []
            for b in bans:
                if b.expires < datetime.datetime.now():
                    continue
                formatted_bans = formatted_bans + [b.user.user_name]
            DBSession.close()
            if len(formatted_msg) == 0:
                return dict(messages=[dict(message='', ufrom=None, time=datetime.datetime.now().strftime('%Y-%m-%d-%H:%M:%S'), id=0)], members=members, admin=admin, bans=formatted_bans)
            return dict(messages=formatted_msg, members=members, admin=admin, bans=formatted_bans)
        DBSession.close()
        return dict(messages=[], members=members, admin=admin, bans=formatted_bans)


    # send_chatroom_message sends a message to the chatroom
    # by simply creating an entry in the database
    @expose('json')
    def send_chatroom_message(self, ufrom, chatroom, message):
        DBSession = DBSessionmaker()
        message = message.replace('<', '&lt;').replace('>', '&gt;')
        message = message.replace('\n', '<br />')        
        image = re.compile('\S+:\S+/\S+.[gif,png,jpe?g,bmp]')
        yt = re.compile('\S*youtube.com/watch\?v=([\w,-]+)\S*')
        urlRE = re.compile('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
        
        urls = urlRE.findall(message)
        for url in urls:
            message = message.replace(url, '<a href="' +url+'">'+url+'</a>')
        
        
        images = image.findall(message)
        youtube = yt.findall(message)
        
        message = message +'<br />'
        for i in images:
            try:
                request = urllib2.Request(i)
                request.get_method = lambda : 'HEAD'
                response = urllib2.urlopen(request)
                if response.info().gettype()[0:5] == 'image': 
                    message += '<IMG src="'+i+'" style="max-width: 400px;"/><br />'
                
            except:
                pass
        
            
        for videoID in youtube:
            message += '<iframe title="YouTube video player" width="480" height="390" src="http://www.youtube.com/embed/' +videoID+'" frameborder="0" allowfullscreen></iframe><br />'

        try:
            user = DBSession.query(User).filter(User.user_name == ufrom).all()
            room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
            mem = DBSession.query(ChatroomMember).filter(and_(ChatroomMember.user == user[0], ChatroomMember.chatroom == room[0])).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        if len(user) != 1:
            DBSession.close()
            return dict(status='That user does not exist')
        if len(room) != 1:
            DBSession.close()
            return dict(status='That chatroom does not exist')
        if len(mem) != 1:
            DBSession.close()
            return dict(status='That user is not connected to that chatroom')
        try:
            mute = DBSession.query(ChatroomMute).filter(and_(ChatroomMute.user == user[0], ChatroomMute.chatroom == room[0])).all()
        except: 
            DBSession.close()
            return dict(status='Internal server error')
        if len(mute) != 0:
            for m in mute:
                if m.expires == None:
                    return dict(status='That user is muted')
                elif m.expires >= datetime.datetime.now():
                    return dict(status='That user is muted')
        try:
            msgs = DBSession.query(ChatroomMessage).filter(and_(ChatroomMessage.chatroom == room[0], ChatroomMessage.ufrom == user[0])).order_by(ChatroomMessage.time).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        delta = datetime.timedelta(seconds=5)
        floodcutoff = datetime.datetime.now() - delta
        if len(msgs) > 5:
            if msgs[-5].time > floodcutoff:
                DBSession.close()
                return dict(status='Flood control.')
        msg = ChatroomMessage(room[0], user[0], message)
        DBSession.add(msg)
        DBSession.commit()
        DBSession.close()
        return dict(status='OK')


    # disconnect disconnects the user from a chatroom
    def disconnect_quiet(self, username, chatroom):
        DBSession = DBSessionmaker()
        try:
            user = DBSession.query(User).filter(User.user_name == username).all()
            room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
        except:
            DBSession.close()
            return 
        if len(user) != 1:
            DBSession.close()
            return
        if len(room) != 1:
            DBSession.close()
            return
        try:
            mem = DBSession.query(ChatroomMember).filter(and_(ChatroomMember.user == user[0], ChatroomMember.chatroom == room[0])).all()
        except:
            DBSession.close()
            return
        if len(mem) != 1:
            DBSession.close()
            return
        if user[0] == room[0].admin:
            DBSession.delete(mem[0])
            DBSession.commit()
            newadmin = self.pick_new_admin(room[0].name)
            if newadmin == None:
                if self.delete_chatroom_quiet(room[0].name):
                    DBSession.close()
                    return
                else:
                    DBSession.close()
                    return
            if not self.set_admin_quiet(room[0].name, newadmin):
                DBSession.close()
                return
        else:
            DBSession.delete(mem[0])
            DBSession.commit()
        DBSession.close()
        return


    # disconnect disconnects the user from a chatroom
    @expose('json')
    def disconnect(self, username, chatroom):
        DBSession = DBSessionmaker()
        try:
            user = DBSession.query(User).filter(User.user_name == username).all()
            room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        if len(user) != 1:
            DBSession.close()
            return dict(status='That user does not exist')
        if len(room) != 1:
            DBSession.close()
            return dict(status='That room does not exist')
        try:
            mem = DBSession.query(ChatroomMember).filter(and_(ChatroomMember.user == user[0], ChatroomMember.chatroom == room[0])).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        if len(mem) != 1:
            DBSession.close()
            return dict(status='That user is not connected to that room')
        if user[0] == room[0].admin:
            DBSession.delete(mem[0])
            DBSession.commit()
            newadmin = self.pick_new_admin(room[0].name)
            if newadmin == None:
                if self.delete_chatroom_quiet(room[0].name):
                    DBSession.close()
                    return dict(status='OK')
                else:
                    DBSession.close()
                    return dict(status='Internal server error')
            if not self.set_admin_quiet(room[0].name, newadmin):
                DBSession.close()
                return dict(status='Internaal server error')
        else:
            DBSession.delete(mem[0])
            DBSession.commit()
        DBSession.close()
        return dict(status='OK')


    # pick_new_admin gets a new administrator from the list of
    # users connected to a chatroom, it returns the username of
    # the new administrator
    def pick_new_admin(self, chatroom):
        DBSession = DBSessionmaker()
        try:
            room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
        except:
            DBSession.close()
            return None
        if len(room) != 1:
            DBSession.close()
            return None
        if len(room[0].members) == 0:
            DBSession.close()
            return None
        uname = room[0].members[random.randint(0, len(room[0].members)) - 1].user.user_name
        DBSession.close()
        return uname


    # delete_chatroom deletes a chatroom from the database
    @expose('json')
    def delete_chatroom(self, chatroom):
        DBSession = DBSessionmaker()
        try:
            room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        if len(room) != 1:
            DBSession.close()
            return dict(status='That room does not exist')
        DBSession.delete(room[0])
        DBSession.commit()
        DBSession.close()
        return dict(status='OK')


    # delete_chatroom_quiet does the same thing as
    # delete_chatroom, but without exposing and JSON
    def delete_chatroom_quiet(self, chatroom):
        DBSession = DBSessionmaker()
        try:
            room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
        except:
            DBSession.close()
            return False
        if len(room) != 1:
            DBSession.close()
            return False
        try:
            mems = DBSession.query(ChatroomMember).filter(ChatroomMember.chatroom == room[0]).all()
            messes = DBSession.query(ChatroomMessage).filter(ChatroomMessage.chatroom == room[0]).all()
        except:
            DBSession.close()
            return False
        for m in mems:
            DBSession.delete(m)
        for m in messes:
            DBSession.delete(m)
        DBSession.delete(room[0])
        DBSession.commit()
        DBSession.close()
        return True


    # kick kicks a user from the chatroom
    # Should we check that the kicker is an admin?
    @expose('json')
    def kick(self, chatroom, username):
        DBSession = DBSessionmaker()
        try:
            room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
            user = DBSession.query(User).filter(User.user_name == username).all()
            mem = DBSession.query(ChatroomMember).filter(and_(ChatroomMember.user == user[0], ChatroomMember.chatroom == room[0])).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        if len(room) != 1:
            DBSession.close()
            return dict(status='That chatroom does not exist')
        if len(user) != 1:
            DBSession.close()
            return dict(status='That user does not exist')
        if len(mem) != 1:
            DBSession.close()
            return dict(status='That user is not in that chatroom')
        delta = datetime.timedelta(seconds=1)
        ban = ChatroomBan(room[0], user[0], datetime.datetime.now() + delta);
        DBSession.add(ban)
        DBSession.delete(mem[0])
        m = ChatroomMessage(room[0], room[0].admin, 'User ' + user[0].user_name + ' has been kicked')
        DBSession.add(m)
        DBSession.commit()
        DBSession.close()
        return dict(status='OK')


    # ban bans a user from the chatroom for a period
    # of time (if not specified, indefinitely)
    @expose('json')
    def ban(self, chatroom, username, expires=None):
        DBSession = DBSessionmaker()
        try:
            room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
            user = DBSession.query(User).filter(User.user_name == username).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        if len(room) == 0:
            DBSession.close()
            return dict(status='No such chatroom')
        if len(user) == 0:
            DBSession.close()
            return dict(status='No such user')
        try:
            mem = DBSession.query(ChatroomMember).filter(and_(ChatroomMember.user == user[0], ChatroomMember.chatroom == room[0])).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        if expires is None:
            # If ABChat is still in use in the year 3000
            # change this...
            expires = datetime.datetime(3000, 1, 1)
        ban = ChatroomBan(room[0], user[0], expires)
        DBSession.add(ban)
        if len(mem) != 0:
            DBSession.delete(mem[0])
        banmsg = ChatroomMessage(room[0], room[0].admin, 'User ' + username + ' has been banned')
        DBSession.add(banmsg)
        DBSession.commit()
        DBSession.close()
        return dict(status='OK')


    # unban removes all bans on a user from a chatroom
    @expose('json')
    def unban(self, chatroom, username):
        DBSession = DBSessionmaker()
        try:
            room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
            user = DBSession.query(User).filter(User.user_name == username).all()
        except:
            return dict(status='Internal server error')
            DBSession.close()
        if len(room) != 1:
            DBSession.close()
            return dict(status='That room does not exist')
        if len(user) != 1:
            DBSession.close()
            return dict(status='that user does not exist')
        try:
            bans = DBSession.query(ChatroomBan).filter(and_(ChatroomBan.user == user[0], ChatroomBan.chatroom == room[0])).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        if len(bans) == 0:
            DBSession.close()
            return dict(status='That user is not banned from that chatroom')
        for ban in bans:
            DBSession.delete(ban)
        banmsg = ChatroomMessage(room[0], room[0].admin, 'User ' + username + ' has been unbanned')
        DBSession.commit()
        DBSession.close()
        return dict(status='OK')


    # set_admin sets the administrator for a chatroom
    @expose('json')
    def set_admin(self, chatroom, username):
        DBSession = DBSessionmaker()
        try:
            room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
            user = DBSession.query(User).filter(User.user_name == username).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        if len(room) != 1:
            DBSession.close()
            return dict(status='That room does not exist')
        if len(user) != 1:
            DBSession.close()
            return dict(status='that user does not exist')
        try:
            mem = DBSession.query(ChatroomMember).filter(and_(ChatroomMember.chatroom == room[0], ChatroomMember.user == user[0])).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        if len(mem) == 0:
            DBSession.close()
            return dict(status='The user must be connected to be an administrator')
        room[0].admin = user[0]
        msg = ChatroomMessage(room[0], user[0], 'USER ' + user[0].user_name + ' IS NOW THE ADMIN')
        DBSession.add(room[0])
        DBSession.commit()
        DBSession.close()
        return dict(status='OK')
        

    # set_admin_quiet does the same thing as set_admin
    # but without exposing and JSON
    def set_admin_quiet(self, chatroom, username):
        DBSession = DBSessionmaker()
        try:
            room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
            user = DBSession.query(User).filter(User.user_name == username).all()
        except:
            DBSession.close()
            return False
        if len(room) != 1:
            DBSession.close()
            return False
        if len(user) != 1:
            DBSession.close()
            return False
        try:
            mem = DBSession.query(ChatroomMember).filter(and_(ChatroomMember.chatroom == room[0], ChatroomMember.user == user[0])).all()
        except:
            DBSession.close()
            return False
        if len(mem) == 0:
            return False
        room[0].admin = user[0]
        DBSession.add(room[0])
        DBSession.commit()
        DBSession.close()
        return True
        

    # set_offline sets the passed buddy to be offline
    @expose('json')
    def set_offline(self, user):
        DBSession = DBSessionmaker()
        try:
            user = DBSession.query(User).filter(User.user_name == user).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        if len(user) != 1:
            DBSession.close()
            return dict(status='That user does not exist')
        user[0].loggedin = False
        DBSession.add(user[0])
        DBSession.commit()
        DBSession.close()
        return dict(status='OK')


    # set_online sets the passed buddy to be offline
    @expose('json')
    def set_online(self, user):
        DBSession = DBSessionmaker()
        try:
            user = DBSession.query(User).filter(User.user_name == user).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        if len(user) != 1:
            DBSession.close()
            return dict(status='That user does not exist')
        user[0].loggedin = True
        DBSession.add(user[0])
        DBSession.commit()
        DBSession.close()
        return dict(status='OK')


    # set_offline_quiet does the same as set_offline, but without
    # exposing any JSON
    def set_offline_quiet(self, user):
        DBSession = DBSessionmaker()
        try:
            user = DBSession.query(User).filter(User.user_name == user).all()
        except:
            DBSession.close()
            return False
        if len(user) != 1:
            DBSession.close()
            return False
        user[0].loggedin = False
        DBSession.add(user[0])
        DBSession.commit()
        DBSession.close()
        return True


    # set_online sets the passed buddy to be offline
    def set_online_quiet(self, user):
        DBSession = DBSessionmaker()
        try:
            user = DBSession.query(User).filter(User.user_name == user).all()
        except:
            DBSession.close()
            return False
        if len(user) != 1:
            DBSession.close()
            return False
        user[0].loggedin = True
        DBSession.add(user[0])
        DBSession.commit()
        DBSession.close()
        return True


    # random_chat indicates that the user would like to chat
    # with a random user by creating such an entry in the
    # database. If  there are unpaired random users, the
    # user is paired with one of them
    @expose('json')
    def random_chat(self, username):
        DBSession = DBSessionmaker()
        try:
            user = DBSession.query(User).filter(User.user_name == username).all()
            dummy = DBSession.query(User).filter(User.user_name == 'NULL').all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        if len(user) != 1:
            DBSession.close()
            return dict(status='That user does not exist')
        if len(dummy) != 1:
            dummy = User('NULL', 'nopassword', 0)
            DBSession.add(dummy)
            DBSession.commit()
        else:
            dummy = dummy[0]
        try:
            random = DBSession.query(Buddies).filter(or_(Buddies.user_target == dummy, Buddies.user_initiated == dummy)).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        other = None
        user = user[0]
        delta = datetime.timedelta(seconds=5)
        pollcutoff = datetime.datetime.now() - delta
        self.set_online_quiet(user.user_name)
        for rand in random:
            if rand.user_initiated.user_name != 'NULL' and rand.user_initiated.lastpoll >= pollcutoff:
                if rand.user_initiated == user:
                    DBSession.close()
                    return dict(status='This user already has a random request pending')
                rand.user_target = user
                other = rand.user_initiated
                break
            elif rand.user_target.user_name != 'NULL' and rand.user_target.lastpoll >= pollcutoff:
                if rand.user_target == user:
                    DBSession.close()
                    return dict(status='This user already has a random request pending')
                rand.user_initiated = user
                other = rand.user_target
                break
        # no waiting users, indicate this user is waiting
        if other is None:
            buds = Buddies(user, dummy, True, False, True)
            DBSession.add(buds)
            DBSession.commit()
            DBSession.close()
            return dict(status='Waiting')
        DBSession.add(rand)
        DBSession.commit()
        # Send a message to each user
        # what is going on here? Times are funky...
        m1 = Message(user, other, datetime.datetime.now() + delta, 'Paired with random user ' + other.user_name)
        m2 = Message(other, user, datetime.datetime.now() + delta, 'Paired with random user ' + user.user_name)
        DBSession.add(m1)
        DBSession.add(m2)
        DBSession.commit()
        DBSession.close()
        return dict(status='Connected')

   
    @expose('json')
    # Mute prevents a user from talking in a chatroom, but still allows them to
    # read the conversation and remain in the chatroom
    def mute(self, chatroom, username):
        DBSession = DBSessionmaker()
        try:
            room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
            user = DBSession.query(User).filter(User.user_name == username).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        if len(room) == 0:
            DBSession.close()
            return dict(status='No such chatroom')
        if len(user) == 0:
            DBSession.close()
            return dict(status='No such user')

        mute = ChatroomMute(room[0], user[0])
        #mute = ChatroomBan(room[0], user[0])
        msg = ChatroomMessage(room[0], room[0].admin, 'USER ' + user[0].user_name + ' HAS BEEN MUTED BY ' + room[0].admin.user_name)
        DBSession.add(mute)
        DBSession.commit()
        DBSession.close()
        return dict(status='OK')
        
    @expose('json')
    # Mute prevents a user from talking in a chatroom, but still allows them to
    # read the conversation and remain in the chatroom
    def unmute(self, chatroom, username):
        DBSession = DBSessionmaker()
        try:
            room = DBSession.query(Chatroom).filter(Chatroom.name == chatroom).all()
            user = DBSession.query(User).filter(User.user_name == username).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
            
        if len(room) != 1:
            DBSession.close()
            return dict(status='That room does not exist')
        if len(user) != 1:
            DBSession.close()
            return dict(status='that user does not exist')
        try:
            mute = DBSession.query(ChatroomMute).filter(and_(ChatroomMute.user == user[0], ChatroomMute.chatroom == room[0])).all()
        except:
            DBSession.close()
            return dict(status='Internal server error')
        
        if len(mute) == 0:
            DBSession.close()
            return dict(status='This  user is not muted')
            
        for m in mute:
            DBSession.delete(m)
        msg = ChatroomMessage(room[0], room[0].admin, 'USER ' + user[0].user_name + ' HAS BEEN UNMUTED BY ' + room[0].admin.user_name)
        DBSession.commit()
        DBSession.close()
        return dict(status='OK')




    # seems to work
    @expose('json')
    def convclose(self, user1, user2):
        DBSession = DBSessionmaker()
        try:
            u1 = DBSession.query(User).filter(User.user_name == user1).all()
            u2 = DBSession.query(User).filter(User.user_name == user2).all()
        except:
            DBSession.close()
            return
        if len(u1) == 0 or len(u2) == 0:
            DBSession.close()
            return
        try:
            b1 = DBSession.query(Buddies).filter(and_(Buddies.user_initiated == u1, Buddies.user_targer == u2)).all()
            b2 = DBSession.query(Buddies).filter(and_(Buddies.user_initiated == u2, Buddies.user_targer == u1)).all()
        except:
            DBSession.close()
            return
        if len(b1) == 0:
            b = b2
        if len(b2) == 0:
            b = b1
        if len(b) == 0:
            DBSession.close()
            return
        if b.istmp:
            DBSession.delete(b)
            DBSession.commit()
            try:
                m1 = DBSession.query(Message).filter(and_(Messages.uto == u1, Messages.ufrom == u2)).all()
                m2 = DBSession.query(Message).filter(and_(Messages.uto == u2, Messages.ufrom == u1)).all()
            except:
                DBSession.close()
            for m in m1:
                DBSession.delete(m)
            for m in m2:
                DBSession.delete(m)
            DBSession.commit()
            DBSession.close()
        return


    def update_chatroom_members(self):
        DBSession = DBSessionmaker()
        delta = datetime.timedelta(seconds=3)
        pollcutoff = datetime.datetime.now() - delta
        try:
            mems = DBSession.query(ChatroomMember).order_by(ChatroomMember.lastpoll).all()
        except:
            DBSession.close()
            return
        for mem in mems:
            if mem.lastpoll is None:
                DBSession.delete(mem)
            elif mem.lastpoll < pollcutoff:
                DBSession.delete(mem)
        DBSession.commit()
        DBSession.close()
        return
