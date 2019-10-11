from flask import Flask

app = Flask(__name__)
user = {
    'liuchunming': ['12345']
}
client_id = '1234567890'
user[client_id] = []

redirect_uri='http://localhost:5000/client/passport'

@app.route('/client/login',methods=["POST","GET"])
def client_login():
    url = "http://localhost:5000/oauth?response_type=code&client_id=%s&redirect_uri=%s' %(client_id,redirect_uri)"
    return redirect(uri)

    
if __name__ == '__main__':
    app.run()