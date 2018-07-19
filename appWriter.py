# -*- coding: cp1251 -*-
#

import os, sys, getopt
import serial
import time # Старый низкоуровневый модуль
import datetime # Новый модуль для работы с датой и временем
from subprocess import call

version = 0.2

FLASH_START = 0x08000000
FLASH_SIZE_KB=128
FLASH_DISK_SIZE_KB=24
FLASH_LOADER_SIZE_KB=4

class CommandInterface(object):
    def open(self, aport='COM3', abaudrate=115200) :
        self.sp = serial.Serial(
            port=aport,
            baudrate=abaudrate,     # baudrate
            bytesize=8,             # number of databits
            parity=serial.PARITY_NONE,
            stopbits=1,
            xonxoff=0,              # enable software flow control
            rtscts=0,               # disable RTS/CTS flow control
            timeout=0.5             # set a timeout value, None for waiting forever
        )
    def encodeString(self,s):
        r=""
        i=0
        while i<len(s):
            if s[i]<='~' and s[i]>=' ':
                if s[i]!='\"' and s[i]!='\'' and s[i]!='\\':
                    r+=s[i]
                else:
                    r+="\\x"+'{:02X}'.format(ord(s[i]))
            else:
                r+="\\x"+'{:02X}'.format(ord(s[i]))
            i+=1
        return r
    def espruino(self,s):
        self.sp.flushInput()
        self.sp.write("\rrequire(\"Storage\").readJSON(\"cfg\");\r")
        time.sleep(1.0)
        cfg=self.sp.read(1000)
        print(cfg)
        i=cfg.find("={")
        j=cfg.rfind("}")
        if i>0:
            cfg="cfg"+cfg[i:(j+1)]
        #print(cfg)
        self.sp.write("\rclearTimeout();require(\"Storage\").eraseAll();reset();\r")
        time.sleep(5.0)
        print(self.sp.read(1000))
        self.sp.write("\recho(false);\r")
        time.sleep(0.1)
        print(self.sp.read(1000))
        n=len(s)
        pg=24
        print("page",24-pg)
        self.sp.write("\rvar f=require(\"Storage\");f.write(\".bootcde\",\""+self.encodeString(s[(24-pg)*1024:(24-pg+1)*1024])+"\",0,"+str(len(s))+");\r")
        time.sleep(0.1)
        ser=self.sp.read()
        if len(ser)>0:
            print(ser)
        if n<=1024:
            n=0
        else:
            n-=1024
        pg-=1
        while pg>0 and n>0:
            print("page",24-pg)
            if n<=1024:
                i=n
            else:
                i=1024
            self.sp.write("\rf.write(\".bootcde\",\""+self.encodeString(s[(24-pg)*1024:(24-pg+1)*1024])+"\","+str(len(s)-n)+","+str(i)+");\r")
            time.sleep(0.1)
            ser=self.sp.read()
            if len(ser)>0:
                print(ser)
            if n<=1024:
                n=0
            else:
                n-=1024
            pg-=1
        self.sp.write("\recho(true);\r"+str(cfg)+"\r")
        time.sleep(1.0)
        print(self.sp.read(1000))
        self.sp.write("require(\"Storage\").write(\"cfg\",cfg);\r")
        time.sleep(1.0)
        print(self.sp.read(1000))
        self.sp.write("load();\r")
        time.sleep(2.0)
        print(self.sp.read(1000))
        self.sp.close()

def usage():
    print("""Usage: %s [-hv] [file]
    -h          This help
    -v          Version
    """ % sys.argv[0])

conf = {
        'address': (FLASH_START+((FLASH_SIZE_KB-FLASH_DISK_SIZE_KB)*1024)),
        'lenght': (FLASH_DISK_SIZE_KB*1024),
        'port': 'COM3',
        'baud': 115200
    }

try:
    opts, args = getopt.getopt(sys.argv[1:], "ha:v")
except getopt.GetoptError as err:
    # print help information and exit:
    print(str(err)) # will print something like "option -a not recognized"
    usage()
    sys.exit(2)

for o, a in opts:
    if o == '-h':
        usage()
        sys.exit(0)
    elif o == '-a':
        conf['address'] = eval(a)
    elif o == '-l':
        conf['lenght'] = eval(a)
    elif o == '-v':
        print(version)
        sys.exit()
    else:
        assert False, "unhandled option"

try:
    f_name_in = args[0]
except:
    usage()
    sys.exit(2)

with open(f_name_in, 'rb') as f:
    s = f.read()

#minimise
s = s.replace('\r\n', '\n')
s = s.replace('\n\n', '\n')
s = s.replace('\t', ' ')
s1 = s.split('\n')
s = ''
for i in s1:
    i = ' '.join(i.split())
    s += i + '\n'

#create bin
free = (conf['lenght']-len(s))

print("used: "+str(conf['lenght'] - free), "free: "+str(free))
if free >= 0:
    with open('app.bin', 'wb') as f:
        f.write(s)
    cmd = CommandInterface()
    cmd.open(conf['port'], conf['baud'])
    with open('app.bin', 'rb') as f:
        s = f.read()
        cmd.espruino(s)
