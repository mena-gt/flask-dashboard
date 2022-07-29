from flask import Flask

from core.configs import config



def create_app (environ):
	app = Flask (__name__)
	
	register_settings (app, environ)
	register_extensions (app)
	register_blueprints (app)
	register_errorhandlers (app)
	register_commands (app)

	return app


def register_settings (app, environ):
	app.config.from_object (config[environ])


def register_extensions (app):
	pass


def register_blueprints (app):
	from core.ssr import register_ssr_blueprints
	register_ssr_blueprints (app)


def register_errorhandlers (app):
	pass


def register_commands (app):
	pass