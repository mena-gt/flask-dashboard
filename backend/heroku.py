import os

from core import create_app



server = create_app ('production')

if '__main__' == __name__:
	server.run ()