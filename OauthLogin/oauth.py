#!/usr/bin/env python
# -*- coding: utf-8 -*-

import base64
import random
import time

from flask import Flask, request, redirect

app = Flask(__name__)

# 登录字典
users = {
    "magigo": ["123456"]
}

redirect_uri = 'http://localhost:5000/client/passport'
client_id = '123456'
users[client_id] = []
auth_code = {}

oauth_redirect_uri = []

# 生成token


def gen_token(uid):
    str_bs_token = ':'.join(
        [uid+"", str(random.random()), str(time.time() + 7200)])
    token = base64.b64encode(str_bs_token.encode('utf-8'))
    users[uid].append(token)
    return token

# 生成code


def gen_auth_code(uri):
    code = random.randint(0, 10000)
    auth_code[code] = uri
    return code

# 登录验证token


def verify_token(token):
    try:
        _token = str(base64.b64decode(token), 'utf-8')
    except BaseException:
        return 0
    else:
        print('解析成功...')
    if not len(users.get(_token.split(':')[0])):
        return -1
    if not str(users.get(_token.split(':')[0])[-1], 'utf-8') == token:
        return -1
    if float(_token.split(':')[-1]) >= time.time():
        return 1
    else:
        return 0


@app.route('/index', methods=['POST', 'GET'])
def index():
    print(request.headers)
    return 'hello'


@app.route('/login', methods=['POST', 'GET'])
def login():
    uid, pw = base64.b64decode(
        request.headers['Authorization'].split(' ')[-1].encode('utf-8')).split(':')
    if users.get(uid)[0] == pw:
        return gen_token(uid)
    else:
        return 'error'


@app.route('/oauth', methods=['POST', 'GET'])
def oauth():
    # 验证用户身份并且返回code
    if request.args.get('user'):
        if users.get(request.args.get('user'))[0] == request.args.get('pw') and oauth_redirect_uri:
            uri = oauth_redirect_uri[0] + \
                '?code=%s' % gen_auth_code(oauth_redirect_uri[0])
            # uri:http://localhost:5000/client/passport?code=随机数
            print('-------------------------------------------------%s' % uri)
            return redirect(uri)  # 重定向去拼接链接拿token
        else:
            return '用户不存在或者密码错误'
    # 通过code返回token
    if request.args.get('code'):
        if auth_code.get(int(request.args.get('code'))) and request.args.get('redirect_uri'):
            print('-------------------------%s' %
                  request.args.get('client_id'))
            return gen_token(request.args.get('client_id'))
    if request.args.get('redirect_uri'):
        oauth_redirect_uri.append(request.args.get('redirect_uri'))
        # oauth_redirect_uri:http://localhost:5000/client/passport
    return 'please login'


@app.route('/client/login', methods=['POST', 'GET'])
def client_login():
    uri = 'http://localhost:5000/oauth?response_type=code&client_id=%s&redirect_uri=%s' % (
        client_id, redirect_uri)
    return redirect(uri)
    # http://localhost:5000/oauth?response_type=code&client_id=123456&redirect_uri=http://localhost:5000/client/passport

# 拼接code&重定向oauth验证拿token
@app.route('/client/passport', methods=['POST', 'GET'])
def client_passport():
    code = request.args.get('code')
    uri = 'http://localhost:5000/oauth?grant_type=authorization_code&code=%s&redirect_uri=%s&client_id=%s' % (
        code, redirect_uri, client_id)
    return redirect(uri)
    # http://localhost:5000/oauth?grant_type=authorization_code&code=%s&redirect_uri=%s&client_id=%s

# 测试
@app.route('/test1', methods=['POST', 'GET'])
def test():
    token = request.args.get('token')
    if verify_token(token) == 1:
        return 'data'
    else:
        return 'error'


if __name__ == '__main__':
    app.run(debug=False)
