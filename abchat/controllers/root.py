# -*- coding: utf-8 -*-
"""Main Controller"""
# Main controller for ABChat application. This controller
# mounts other controllers and contains user-accessible
# pages under the root directory.

from tg import expose, flash, require, url, request, redirect
from pylons.i18n import ugettext as _, lazy_ugettext as l_
from tgext.admin.tgadminconfig import TGAdminConfig
from tgext.admin.controller import AdminController
from repoze.what import predicates
from sqlalchemy import or_

from abchat.lib.base import BaseController
# from abchat.model import DBSession, metadata
from abchat.model.session import __session__ as DBSessionmaker
from abchat import model
from abchat.controllers.secure import SecureController
from abchat.controllers.error import ErrorController
from abchat.controllers.data import DataController
from abchat.model.model import *

__all__ = ['RootController']


class RootController(BaseController):


    # secc = SecureController()
    # admin = AdminController(model, DBSession, config_type=TGAdminConfig)
    data = DataController()
    error = ErrorController()


    # The index page is the simply login page
    @expose('abchat.templates.login')
    def index(self):
        if request.identity is not None:
            redirect('/post_login')
        return dict()


    # Login page
    # Just exposes the login.html page in templates
    @expose('abchat.templates.login')
    def login(self):
        return dict()


    # Post_login handler
    # This will verify the user for us using repoze.what
    # and then redirect us to the login again if the credentials were
    # invalid, with a flash message, or to a temporary page if the
    # login attempt was valid
    @expose('abchat.templates.login')
    def post_login(self):
        if not request.identity:
            login_counter = request.environ['repoze.who.logins'] + 1
            flash(_('Wrong credentials'), 'warning')
            return dict()
        userid = request.identity['repoze.who.userid']
        flash(_('Welcome back, %s!') % userid)
        redirect('root')


    # Register page
    # Exposes the register.html page in templates
    @expose('abchat.templates.register')
    def register(self):
        return dict()


    # Registration Handling Code
    # Just checks that the passwords match and that the username does not
    # already exist. If all is good, we add the user to the DB, otherwise
    # a flash error message shows.
    # The parameters x, y, Submit.x, Submit.y are the coordinates of the mouse,
    # I believe and the function won't work without them (though we don't care
    # about their value...)
    @expose('abchat.templates.register')
    def register_handler(self, username=None, password=None, confirm_password=None, y=None, x=None, Submit=None):
        DBSession = DBSessionmaker()
        if password == confirm_password and username is not None and password is not None and confirm_password is not None:
            if DBSession.query(User).filter(User.user_name==username).count() == 0:
                newuser = User(username, password, 0)
                normal = DBSession.query(Group).filter(Group.group_name=='normal').first()
                newuser.groups = newuser.groups + [normal]
                DBSession.add(newuser)
                DBSession.commit()
                flash(_('Successfully Registered, %s!') % username)
                redirect('/')
            else:
                flash(_('Username %s already registered') %username)
                redirect('/register')
        elif password != confirm_password:
            flash(_('Passwords do not match'))
            redirect('/register')
        else:
            flash(_('Insufficient information'))
            redirect('/register')
        return


    # Logout function
    # A simple redirect to the actual logout function
    # Clean up if guest account...
    @expose()
    def logout(self, came_from='/'):
        if request.identity is not None:
            username = request.identity['repoze.who.userid']
            if 'GUEST-' in username:
                DBSession = DBSessionmaker()
                try:
                    u = DBSession.query(User).filter(User.user_name == username).all()
                except:
                    DBSession.close()
                    redirect('/logout_handler')
                if len(u) == 0:
                    DBSession.close()
                    redirect('/logout_handler')
                buds = DBSession.query(Buddies).filter(or_(Buddies.user_initiated == u[0], Buddies.user_target == u[0])).all()
                msgs = DBSession.query(Message).filter(or_(Message.uto == u[0], Message.ufrom == u[0])).all()
                try:
                    buds = DBSession.query(Buddies).filter(or_(Buddies.user_initiated == u[0], Buddies.user_target == u[0])).all()
                    msgs = DBSession.query(Message).filter(or_(Message.uto == u[0], Message.ufrom == u[0])).all()
                except:
                    DBSession.close()
                    redirect('/logout_handler')
                DBSession.delete(u[0])
                for b in buds:
                    DBSession.delete(b)
                for m in msgs:
                    DBSession.delete(m)
                DBSession.commit()
                DBSession.close()
        redirect('/logout_handler')


    # Logout function
    # Repoze will take care of the user's DBSession, we just
    # have to redirect them and show a pretty flash message
    @expose()
    def post_logout(self, came_from='/'):
        flash(_('We hope to see you soon!'))
        redirect('/')


    # Main Page
    # This function displays the main page for logged in users
    @expose('abchat.templates.root2')
    @require(predicates.has_permission('normal', msg=l_('You must login to view this page')))
    def root(self):
        # redirect('/data/get_buddies')
        if request.identity is None:
            redirect('/')
        user = request.identity['repoze.who.userid']
        if user is None:
            return dict()
        return dict(username=[user])


    # Guest account
    # First it gets the number of the next guest account, and then it creates a new guest
    # account GUEST-#+1, with password abc. Then it forwards this to auto_login to
    # log the new guest into the system.
    @expose()
    def guest(self):
        DBSession = DBSessionmaker()
        guests = DBSession.query(User).order_by(User.user_name).all()
        try:
            guests = DBSession.query(User).order_by(User.user_name).all()
        except:
            DBSession.close()
            redirect('/')
        last = -1
        for guest in guests:
            if 'GUEST-' in guest.user_name:
                tmp = int(guest.user_name.split('GUEST-')[1])
                if tmp > last:
                    last = tmp
        username = 'GUEST-' + str(last + 1)
        password = 'abchat'
        confirm_password = 'abchat'
        if password == confirm_password and username is not None and password is not None and confirm_password is not None:
            if DBSession.query(User).filter(User.user_name==username).count() == 0:
                newuser = User(username, password, 0)
                normal = DBSession.query(Group).filter(Group.group_name=='normal').first()
                newuser.groups = newuser.groups + [normal]
                DBSession.add(newuser)
                DBSession.commit()
                DBSession.close()
                redirect('/auto_login?username=' + username + '&password=' + password)
            else:
                flash(_('Username %s already registered') %username)
                DBSession.close()
                redirect('/')
        elif password != confirm_password:
            flash(_('Passwords do not match'))
            DBSession.close()
            redirect('/')
        else:
            flash(_('Insufficient information'))
            DBSession.close()
            redirect('/')


    # Auto_login employs a silly automatic login hack
    # basically, with the passed username and passowrd, it returns a
    # pre-filled in form which a Javascript onLoad event automatically
    # submits, logging the user in with these credentials.
    @expose('abchat.templates.auto')
    def auto_login(self, username, password):
        return dict(username=username, password=password)
