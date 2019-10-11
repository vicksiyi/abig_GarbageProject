# -*- coding: utf-8 -*-
from flask import Flask

#创建项目对象
app = Flask(__name__)

app.config.from_object('flaskData.setting')     #模块下的setting文件名，不用加py后缀 
app.config.from_envvar('FLASKR_SETTINGS')   #环境变量，指向配置文件setting的路径