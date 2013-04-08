from main import BaseHandler
from models import create_tables
from config import CONFIG

import logging
import os


class IndexHandler(BaseHandler):
    def get(self):
        logging.info("FISSE FISSE KRAS KRAS")
        logging.info(os.environ)
        self.render_response("index.html", **{"is_development_server": CONFIG["is_development_server"]})


class CreateTablesHandler(BaseHandler):
    def get(self):
        create_tables()
        self.response.write("Tables Creates")
