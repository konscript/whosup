# -*- coding: utf-8 -*-

from config import CONFIG
import sys

if 'libs' not in sys.path:
    # Add libs as primary libraries directory
    sys.path[0:0] = ['libs', ]

import webapp2

from webapp2_extras import sessions, sessions_ndb, jinja2, auth
from google.appengine.api import users


class BaseHandler(webapp2.RequestHandler):
    """
        BaseHandler for all requests

        Holds the auth and session properties so they are reachable for all requests
    """

    def __init__(self, request, response):
        """ Override the initialiser in order to set the language.
        """
        self.initialize(request, response)
        self.locale = "da_DK"

    def render_response(self, filename, **kwargs):
        kwargs.update({
            'current_url': self.request.url,
            'host_url': self.request.host_url
        })

        self.response.headers.add_header('X-UA-Compatible', 'IE=Edge,chrome=1')
        self.response.write(self.jinja2.render_template(filename, **kwargs))

    @webapp2.cached_property
    def jinja2(self):
        # Returns a Jinja2 renderer cached in the app registry.
        j = jinja2.get_jinja2(app=self.app)

        # Set global variables
        j.environment.globals.update({
            'host_url': self.request.host_url
        })

        return j

    def dispatch(self):
        # Get a session store for this request.
        self.session_store = sessions.get_store(request=self.request)
        try:
            # Dispatch the request.
            webapp2.RequestHandler.dispatch(self)
        finally:
            # Save all sessions.
            self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def auth(self):
        return auth.get_auth()

    @webapp2.cached_property
    def session_store(self):
        return sessions.get_store(request=self.request)

    @webapp2.cached_property
    def session(self):
        # Returns a session using the default cookie key.
        return self.session_store.get_session()

    @webapp2.cached_property
    def session_ndb(self):
        # Returns a session using the default cookie key.
        return self.session_store.get_session(name='db_session', factory=sessions_ndb.DatastoreSessionFactory)

    @webapp2.cached_property
    def messages(self):
        return self.session.get_flashes(key='_messages')

    def add_message(self, message, level=None):
        self.session.add_flash(message, level, key='_messages')

    @webapp2.cached_property
    def user(self):
        user = self.auth.get_user_by_session()
        if user:
            user["is_site_admin"] = users.is_current_user_admin()
        return user

    @webapp2.cached_property
    def user_id(self):
        return str(self.user['user_id']) if self.user else None

    def render_template(self, filename, **kwargs):
        kwargs.update({
            'app_name': CONFIG["app_name"],
            'user_id': self.user_id,
            'url': self.request.url,
            'path': self.request.path,
            'query_string': self.request.query_string,
        })

        self.response.headers.add_header('X-UA-Compatible', 'IE=Edge,chrome=1')
        self.response.write(self.jinja2.render_template(filename, **kwargs))


APPLICATION = webapp2.WSGIApplication([
    webapp2.Route(r'/', handler="main_handlers.IndexHandler", name='home'),
], debug=CONFIG["is_development_server"], config=CONFIG)

ADMIN_APPLICATION = webapp2.WSGIApplication([
    webapp2.Route(r'/admin/create_tables', handler="main_handlers.CreateTablesHandler", name='create_tables'),
], debug=CONFIG["is_development_server"], config=CONFIG)
