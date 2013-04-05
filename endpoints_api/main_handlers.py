from main import BaseHandler
from models import create_tables


class IndexHandler(BaseHandler):
    def get(self):
        self.render_response("index.html", **{})


class CreateTablesHandler(BaseHandler):
    def get(self):
        create_tables()
        self.response.write("Tables Creates")
