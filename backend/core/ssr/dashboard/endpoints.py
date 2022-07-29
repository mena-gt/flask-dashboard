from flask import Blueprint

from .controllers import dashboard_v1_controller
from .controllers import dashboard_v2_controller
from .controllers import get_stadistics_controller



bp = Blueprint (name='dashboard',
				import_name=__name__,
				url_prefix='/')

bp.add_url_rule ('/v1',
				 'index_V1',
				 dashboard_v1_controller,
				 methods=('GET',))

bp.add_url_rule ('/v2',
				 'index_v2',
				 dashboard_v2_controller,
				 methods=('GET',))

bp.add_url_rule ('/stats/<int:day>/<int:from_hour>/<int:to_hour>',
				 'by_hours',
				 get_stadistics_controller,
				 methods=('GET',))