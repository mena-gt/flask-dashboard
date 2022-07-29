import os

from core import create_app



DIR_PATH = os.path.dirname (os.path.realpath (__file__))


def load_environment_vars (env_file):
	from dotenv import load_dotenv
	load_dotenv (os.path.join (DIR_PATH, 'env', env_file))


load_environment_vars ('.production')

application = create_app ('production')

if '__main__' == __name__:
	application.run ()