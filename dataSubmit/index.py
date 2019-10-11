from flask import Flask
import requests
from bs4 import BeautifulSoup
import re
import json

app = Flask(__name__)

@app.route('/gc/<gcname>')
def show_user_username(gcname):
    headers = {
    "X-Requested-With": "XMLHttpRequest"
    }
    data = {
        "a":"GET_KEYWORDS",
        "kw": gcname
    }
    def get_url(url):
        response = requests.post(url,data,headers)
        resp_string = response.text
        data2 = json.loads(resp_string)
        list_item = []
        if data2["kw_arr"]:
            for data_item in data2["kw_arr"]:
                item = {
                    "name":data_item["Name"],
                    "type":data_item["TypeKey"]
                }
                list_item.append(item)
            return json.dumps(list_item)
        else:
            return get("http://trash.lhsr.cn/sites/feiguan/trashTypes_3/TrashQuery.aspx?kw="+gcname)
    def get(url):
        print(url)
        response = requests.get(url)
        soup = BeautifulSoup(response.text,'lxml')
        sellist = soup.find("ul",class_="sellist_01")
        list_item = []
        if sellist.find("li").get("onclick"):
            for slist in sellist.find_all("li"):
                item = {
                    "name":slist.get("onclick").split("\"")[1],
                    "type":slist.get("onclick").split("\"")[3]
                }
                list_item.append(item)
        else:
            list_item.append({"status":-1})
        return json.dumps(list_item)
    return get_url("http://trash.lhsr.cn/sites/feiguan/trashTypes_3/Handler/Handler.ashx")

if __name__ == '__main__':
    app.run()