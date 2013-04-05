# -*- coding: utf-8 -*-

import sys

if 'libs' not in sys.path:
    # Add lib as primary libraries directory, with fallback to lib/dist
    # and optionally to lib/dist.zip, loaded using zipimport.
    sys.path[0:0] = ['libs']

# def logger(m, *args, **kw):
#     print m

if __name__ == '__main__':
    from jinja2 import Environment, FileSystemLoader
    jinja_env = Environment(loader=FileSystemLoader('templates'))
    jinja_env.compile_templates('templates_compiled', extensions=["html", "html", "txt"], filter_func=None, zip=None, log_function=None, ignore_errors=False, py_compile=False)
