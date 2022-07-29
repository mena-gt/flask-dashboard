from flask import jsonify
from flask import make_response
from flask import render_template
from flask import current_app

from os import path

from .exceptions import BadRequest
from .validations import RequestValidation
from .services import stats_service



def dashboard_v1_controller ():
	ctx = {}
	return render_template ('dashboard-v1-page.html', **ctx)


def dashboard_v2_controller ():
	ctx = {}
	return render_template ('dashboard-v2-page.html', **ctx)


def get_stadistics_controller (day, from_hour, to_hour):
	try:
		request = {
			'day': day,
			'start': from_hour,
			'end': to_hour
		}

		validation = RequestValidation ()
		validation.validate (request)

		filepath = path.join (current_app.config['UPLOAD_DIR'],
							  current_app.config['DATASET_FILE'])

		result = stats_service (request, filepath)

		response = {
			'success': True,
			'message': 'Data',
			'data': result
		}

		return make_response (jsonify (response), 200)
	except BadRequest as e:
		return make_response (jsonify ({ 
			'success': False,
			'message': e.message,
			'error': [
				e.description
			]
		}), e.code)
	except Exception as e:
		return make_response (jsonify ({
			'success': False,
			'message': str (e)
		}), 500) 