
def register_ssr_blueprints (app):
	from core.ssr.dashboard import bp as dash_bp
	app.register_blueprint (dash_bp)