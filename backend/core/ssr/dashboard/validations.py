from .exceptions import DayNotFound
from .exceptions import WrongInterval



class RequestValidation:
	def __init__ (self):
		self._min_value = 0
		self._max_value = 24
		self._allowed_days = [0, 1] 

	def validate (self, request):
		if self.is_great_then (request['start'], request['end']):
			raise WrongInterval ({})

		if self.is_equal (request['start'], request['end']):
			raise WrongInterval ({})

		if not self.is_day_in_range (request['day']):
			raise DayNotFound ({})

		if not self.is_hour_in_range (request['start']):
			print ('2')
			raise WrongInterval ({})

		if not self.is_hour_in_range (request['end']):
			print ('3')
			raise WrongInterval ({})

	def is_equal (self, start, end):
		return start == end

	def is_great_then (self, start, end):
		return start > end

	def is_hour_in_range (self, value):
		return self.is_in_range (self._min_value, self._max_value, value)

	def is_day_in_range (self, value):
		return self.is_in_range (self._allowed_days[0], self._allowed_days[1],
								 value)

	def is_in_range (self, min_value, max_value, value):
		return value >= min_value and value <= max_value