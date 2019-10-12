from flask import Flask
from requests import RequestException
from urllib.parse import urlencode
import requests
from bs4 import BeautifulSoup
import re
import json
import random


app = Flask(__name__)

ua = [
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; AcooBrowser; .NET CLR 1.1.4322; .NET CLR 2.0.50727)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Acoo Browser; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)",
    "Mozilla/4.0 (compatible; MSIE 7.0; AOL 9.5; AOLBuild 4337.35; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)",
    "Mozilla/5.0 (Windows; U; MSIE 9.0; Windows NT 9.0; en-US)",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0)",
    "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 1.0.3705; .NET CLR 1.1.4322)",
    "Mozilla/4.0 (compatible; MSIE 7.0b; Windows NT 5.2; .NET CLR 1.1.4322; .NET CLR 2.0.50727; InfoPath.2; .NET CLR 3.0.04506.30)",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN) AppleWebKit/523.15 (KHTML, like Gecko, Safari/419.3) Arora/0.3 (Change: 287 c9dfb30)",
    "Mozilla/5.0 (X11; U; Linux; en-US) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3) Arora/0.6",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.2pre) Gecko/20070215 K-Ninja/2.1.1",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9) Gecko/20080705 Firefox/3.0 Kapiko/3.0",
    "Mozilla/5.0 (X11; Linux i686; U;) Gecko/20070322 Kazehakase/0.4.5",
    "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20",
    "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168 Version/11.52",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.11 TaoBrowser/2.0 Safari/536.11",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.71 Safari/537.1 LBBROWSER",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; LBBROWSER)",
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E; LBBROWSER)",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.84 Safari/535.11 LBBROWSER",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)",
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; SV1; QQDownload 732; .NET4.0C; .NET4.0E; 360SE)",
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)",
    "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1",
    "Mozilla/5.0 (iPad; U; CPU OS 4_2_1 like Mac OS X; zh-cn) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:2.0b13pre) Gecko/20110307 Firefox/4.0b13pre",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:16.0) Gecko/20100101 Firefox/16.0",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11",
    "Mozilla/5.0 (X11; U; Linux x86_64; zh-CN; rv:1.9.2.10) Gecko/20100922 Ubuntu/10.10 (maverick) Firefox/3.6.10"
]


@app.route('/gc/<gcname>')
def show_user_username(gcname):
    randomUA = random.randint(1, 33)

    headers = {
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": ua[randomUA]
    }
    data = {
        "a": "GET_KEYWORDS",
        "kw": gcname
    }

    def get_url(url):
        print(data)
        response = requests.post(url, headers=headers, data=data)
        resp_string = response.text
        print(response)
        data2 = json.loads(resp_string)
        list_item = []
        if data2["kw_arr"]:
            for data_item in data2["kw_arr"]:
                item = {
                    "name": data_item["Name"],
                    "type": data_item["TypeKey"]
                }
                list_item.append(item)
            return json.dumps(list_item)
        else:
            return get("http://trash.lhsr.cn/sites/feiguan/trashTypes_3/TrashQuery.aspx?kw="+gcname)

    def get(url):
        print(url)
        randomUA2 = random.randint(1, 33)
        header2 = {
            "User-Agent": ua[randomUA2]
        }
        response = requests.get(url, headers=header2)
        soup = BeautifulSoup(response.text, 'lxml')
        sellist = soup.find("ul", class_="sellist_01")
        list_item = []
        if sellist.find("li").get("onclick"):
            for slist in sellist.find_all("li"):
                item = {
                    "name": slist.get("onclick").split("\"")[1],
                    "type": slist.get("onclick").split("\"")[3]
                }
                list_item.append(item)
        else:
            list_item.append({"status": -1})
        return json.dumps(list_item)

    return get_url("http://trash.lhsr.cn/sites/feiguan/trashTypes_3/Handler/Handler.ashx")


@app.route('/gcurl')
def get_page_index():

        # data中的内容就是我们上图中访问参数，可以直接复制下来，把最后的timestamp参数删掉
    data = {
        'aid': '24',
        'app_name': 'web_search',
        'offset': 0,  # 注意这要换成我们传入的参数
        'format': 'json',
        'keyword': "垃圾分类",  # 注意这要换成我们传入的参数
        'autoload': 'true',
        'count': '20',
        'en_qc': '1',
        'cur_tab': '1',
        'from': 'search_tab',
        'pd': 'synthesis'
    }

    # 构造访问的url
    url = 'https://www.toutiao.com/api/search/content/?'+urlencode(data)
    url_basic = 'https://www.toutiao.com/'
    # 这里要传入一个浏览器信息，和一个cookie信息，在开发者界面可以找到
    randomUA3 = random.randint(1, 33)
    header = {
        'User-Agent': ua[randomUA3],
        'cookie': 'csrftoken=398603c55732ea34d74515841f4a97cf; tt_webid=6725434263187801603; tt_webid=6725434263187801603; uuid="w:eec4d9df508544d7af2993500132a231"; __utma=24953151.260410577.1567977145.1567977145.1567977145.1; __utmz=24953151.1567977145.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); WEATHER_CITY=%E5%8C%97%E4%BA%AC; s_v_web_id=e55c4f4c6300ae8752cbda275bbff233; __tasessionId=4me6vvy2t1570891589391'
    }

    try:
        # 开始访问url
        response = requests.get(url, headers=header)
        if response.status_code == 200:
                # 访问成功则返回
            data_all = json.loads(response.text)["data"]
            item = []
            for data in data_all:
                if data.get("abstract"):
                    item.append({
                        "abstract": data["abstract"],
                        "datetime": data["datetime"],
                        "url": url_basic + "a" + data["group_id"],
                        "image": data["image_url"]

                    })
            return json.dumps(item)
        return None
    except RequestException:
        print('请求索引页面出错')
        return None


if __name__ == '__main__':
    app.run()
    debug = True
