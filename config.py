# -*- coding: utf-8 -*-
import os

__author__ = 'Jakob Holmelund'
__website__ = 'balancebot-eu.appspot.com'

# Settings
CONFIG = {}

CONFIG['client_id'] = "balancebot"

# Version
CONFIG['static_content_version'] = "vFF11"

# Possible values:
# True: will use minified and concatenated js (no console.log)
# False: will use raw js sources
# "auto": True on production, False on development
use_compiled_js = "auto"


# Webapp2 app name
CONFIG["app_name"] = "BalanceBot"

#################### End of CONFIGurations ######################################

is_development_server = os.environ.get('SERVER_SOFTWARE', '').startswith('Dev')
APP_ID = os.environ.get('APPLICATION_ID', None) or "kobstadendev"

# session settings
CONFIG['webapp2_extras.sessions'] = {
    'cookie_name': '_simpleauth_sess',
    'cookie_args': {
        'httponly': True,
    },
    'secret_key': '8OJznS64IxB1gonkQgPsjcnCv'
}

# templates
CONFIG['webapp2_extras.jinja2'] = {
    'compiled_path': 'templates_compiled',
    'force_compiled': False,
    'environment_args': {'autoescape': True, 'extensions': ['jinja2.ext.autoescape', 'jinja2.ext.with_', ]}
}

# authorization
CONFIG['webapp2_extras.auth'] = {
    'user_attributes': ['auth_ids', 'email', ],
    'facebook.app_id': "191611900970322",
    'facebook.app_secret': "f1318e612bead81dd6808b10974f3379"
}

# Development/Produtions settings
CONFIG["is_development_server"] = is_development_server  # will become true when on local. False on GAE
if use_compiled_js == "auto":
    CONFIG["use_compiled_js"] = not CONFIG["is_development_server"]
else:
    CONFIG["use_compiled_js"] = use_compiled_js
