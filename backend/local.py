#!/usr/bin/env python3
import click
import os

from core import create_app



DIR_PATH = os.path.dirname (os.path.realpath (__file__))


def load_environment_vars (env_file):
	from dotenv import load_dotenv
	load_dotenv (os.path.join (DIR_PATH, 'env', env_file))


@click.group ()
def cli ():
	pass


@click.command ()
def runserver ():
	load_environment_vars ('.develop')
	
	flask = create_app ('development')
	flask.run ()


cli.add_command (runserver)

if '__main__' == __name__:
	cli ()