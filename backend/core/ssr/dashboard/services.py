import json

import pandas as pd

from .interfaces import Advice
from .interfaces import CostApi
from .interfaces import HomeAppliance
from .interfaces import Housing



def stats_service (request, filepath):
	registers_per_hour = 60
	df_excel = pd.read_excel (filepath, sheet_name=request['day'])

	house = Housing (df_excel, registers_per_hour)
	home = HomeAppliance (df_excel, registers_per_hour)
	costs = CostApi (df_excel, registers_per_hour)

	cons = pd.merge (house.get_stats (request['start'], request['end']),
					 home.get_stats (request['start'], request['end']),
					 how='outer',
					 left_index=True,
					 right_index=True)
	result = pd.merge (costs.get_stats (request['start'], request['end']),
					   cons, 
					   how='outer',
					   left_index=True,
					   right_index=True)

	ads = Advice (filepath)
	advices = ads.get_advices (request['day'],
							   request['start'],
							   request['end'])

	return {
		'data': json.loads (result.to_json (orient='records')),
		'advices': advices
	}
