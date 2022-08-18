from configparser import ConfigParser
import time

import requests

parser = ConfigParser()
parser.read('login.ini')
username = parser.get('user', 'username')
password = parser.get('user', 'password')
url = 'http://192.168.1.3:8090/login.xml'
loginmode = 191
livemode = 192
timeout = 170
data = {
    'mode': loginmode,
    'username': username,
    'password': password,
    'a': str(time.time()),
    'producttype': '0'
}
try:
    r = requests.post(url=url, data=data)
    if(r.ok):
        print('Login successful for ' + username)
        while(True):
            try:
                r2 = requests.get(url='http://192.168.1.3:8090/live?mode=192&username=' +
                                  username+'&a='+str(time.time())+'&producttype=0')
                if(not r2.ok):
                    print('An error occured: ' + str(r) + ' Retrying...')
                    try:
                        r = requests.post(url=url, data=data)
                    except:
                        print("An unknown error occured")
                    if(r.ok):
                        print('Login successful for ' + username)
            except:
                print("An unknown error occured")
            time.sleep(170)

    else:
        print('Login failed successfully: Error code ' + str(r))
        input('Press any key to continue...')
except:
    print('Login failed successfully: An unknown error occured')
    input('Press any key to continue...')
