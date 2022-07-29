from pathlib import Path
from os import environ
from os import path



class BaseConfig ():
	SECRET_KEY   = environ.get ('SECRET', 'NONE')
	TESTING      = False
	DEBUG        = False

	DATASET_FILE = 'dataset.xlsx'
	UPLOAD_DIR   = path.join (Path(__file__).resolve().parent.parent,
						      'uploads');


class DevelopmentConfig (BaseConfig):
	DEBUG = True


class TestingConfig (BaseConfig):
	DEBUG = True
	TESTING = True


class ProductionConfig (BaseConfig):
	DEBUG = False
	TESTING = False


config = {
	'default': DevelopmentConfig,
	'development': DevelopmentConfig,
	'production': ProductionConfig,
	'testing': TestingConfig
}