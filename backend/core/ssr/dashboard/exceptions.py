
class BadRequest (Exception):
	def __init__ (self, message):
		super ().__init__ (message)
		self.code = 400
		self.message = message

class DayNotFound (BadRequest):
	def __init__ (self, description):
		super ().__init__ ('El día no existe o se encontro')
		self.description = description


class WrongInterval (BadRequest):
	def __init__ (self, description):
		super ().__init__ ('Error en el intervalo de horas a soliticar')
		self.description = description


