function writeConfig(){return require("Storage").write("cfg",cfg);}
function readConfig(){
  cfg=require("Storage").readJSON("cfg");
  if (cfg===undefined){
    cfg={ver:0,ch:{a:{t:0,n:0,m:0,c:0,a:"note"},b:{t:0,n:0,m:0,c:0,a:"note"},c:{t:0,n:0,m:0,c:0,a:"note"},d:{t:0,n:0,m:0,c:0,a:"note"}},esp:{ssid:"none",key:"none"},aplPass:"none",aplName:"aDispenser",iftttKey:"none"};
    writeConfig();
  }
}

function getUrlPar(u){
  var i,q,s,r={};
  q=u.split('&');
  for(i=0;i<q.length;i++){
    s=q[i].split('=');
    r[s[0]]=s[1];
  }
  return r;
}

function hm2t(s){
  var i=parseInt(s.substr(0,2),0);
  if (isNaN(i)||i>23||i<0) i=0;
  var j=parseInt(s.slice(-2),0);
  if (isNaN(j)||j>59||j<0) j=0;
  return i*60+j;
}
function t2hm(i){
  return ('0'+parseInt(i/60)).slice(-2)+":"+('0'+parseInt(i%60)).slice(-2);
}
function s2int(s){
  var i=parseInt(s,0);
  if (isNaN(i)||i>1000||i<0) i=0;
  return i;
}

function m_txt(v,n){return '<td><input type="text" value='+v+' name='+n+'></td>';}
function m_btn(v){return '<input type="button" value='+v+' onClick=\'location.href="/config?aplcode='+aplcode+'&cmd='+v+'"\'>';}
function getResponse(){
  if (respAns===0){
    var i=reqStr.indexOf("GET /");
    var j=reqStr.indexOf(" HTTP/");
    var ra=cfg.aplName;
    aplcode="aplcode";
    if (i>=0 && j>i){
      if (reqStr.indexOf("config?",i+5)>=0){
        var p=getUrlPar(reqStr.substring(i+12,j));
        aplcode=p.aplcode;
        if (aplcode==cfg.aplPass){
          ra+=": Configuration";
          if (p.chan!==undefined && p.cmd===undefined){
            cfg.ch.a.t=hm2t(p.chat); cfg.ch.b.t=hm2t(p.chbt); cfg.ch.c.t=hm2t(p.chct); cfg.ch.d.t=hm2t(p.chdt);
            cfg.ch.a.n=s2int(p.chan); cfg.ch.b.n=s2int(p.chbn); cfg.ch.c.n=s2int(p.chcn); cfg.ch.d.n=s2int(p.chdn);
            cfg.ch.a.m=s2int(p.cham); cfg.ch.b.m=s2int(p.chbm); cfg.ch.c.m=s2int(p.chcm); cfg.ch.d.m=s2int(p.chdm);
            cfg.ch.a.c=s2int(p.chac); cfg.ch.b.c=s2int(p.chbc); cfg.ch.c.c=s2int(p.chcc); cfg.ch.d.c=s2int(p.chdc);
            cfg.ch.a.a=p.chaa; cfg.ch.b.a=p.chba; cfg.ch.c.a=p.chca; cfg.ch.d.a=p.chda;
            ra+=": Applyed";
          } else if (p.cmd=="save"){
            if (writeConfig()===true) ra+=": Writed";
            else ra+=": Not writed";
          } else if (p.cmd=="restore"){
            readConfig();
            ra+=": Restored";
          } else if (p.cmd=="ch1cal"){
            ra+=": Calibration ch1";
            if (pChStTO===0)
              pChCal[0]=true;
            else{
              pChStTO=1; ra+=": Denied";
            }
          } else if (p.cmd=="ch2cal"){
            ra+=": Calibration ch2";
            if (pChStTO===0)
              pChCal[1]=true;
            else{
              pChStTO=1; ra+=": Denied";
            }
          } else if (p.cmd=="ch3cal"){
            ra+=": Calibration ch3";
            if (pChStTO===0)
              pChCal[2]=true;
            else{
              pChStTO=1; ra+=": Denied";
            }
          } else if (p.cmd=="ch4cal"){
            ra+=": Calibration ch4";
            if (pChStTO===0)
              pChCal[3]=true;
            else{
              pChStTO=1; ra+=": Denied";
            }
          } else if (p.cmd=="update"){
            ra+=": Updated";
          } else if (p.cmd=="reboot"){
            aplcode="aplcode";
            setTimeout(function(){load();},1500);
          }
        }
      } else if (reqStr.indexOf("favicon.ico",i+5)>=0){
        respStr=('HTTP/1.1 200 OK\r\nServer: '+cfg.aplName+'\r\nContent-Type: image/x-icon\r\n\r\n'+
'\0\0\1\0\1\0\20\20\20\0\1\0\4\0(\1\0\0\26\0\0\0(\0\0\0\20\0\0\0 \0\0\0\1\0\4\0\0\0\0\0\x80\0\0\0\0\0\0\0\0\0\0\0\20\0\0\0\0\0\0\0\0\0\0\0\xff\0]\0\xff\xdd\0\0M\xff\0\0\0\0\xff\0\0\xf2\xff\0\0\x8c\xff\0\xa8\0\x81\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0ff`\0\0\0\0\0\0\0\0\0\0\0\0DDD@\0@\0\6fff`\6`\0U\5UUUUP\0\3\x03333\x030\0\0\"\"\"\0\0 \0\0\0\0\0\0\0\0\0\0\0\21\21\0\0\0\0\0\0\7p\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\xff\xff\0\0\xff\xff\0\0\xff\xff\0\0\xfc\37\0\0\xf8\17\0\0\xf0\14\0\0\xe0\10\0\0\xc0\0\0\0\x80\0\0\0\xc0\0\0\0\xe0\10\0\0\xf0\34\0\0\xf8\36\0\0\xfc?\0\0\xfe\x7f\0\0\xff\xff\0\0');
        return false;
      }
    }
  }

  if (aplcode!=cfg.aplPass){
    respStr=('HTTP/1.1 200 OK\r\nServer: '+cfg.aplName+'\r\nContent-Type: text/html\r\n\r\n'+'<html><body><p>'+cfg.aplName+
'<br></p><form action="config" method="get"><input type="text" value="aplcode" name="aplcode"><input type="submit" value="apply"></form></body></html>');
    return false;
  } else if (respAns===0){
    respStr=('HTTP/1.1 200 OK\r\nServer: '+cfg.aplName+'\r\nContent-Type: text/html\r\n\r\n'+'<html><body><p>'+ra+'<br>'+(new Date()).toUTCString().substr(0,25)+'</p>'+
'<form action="config" method="get">'+
'<table><tr><td>Time (hh:mm)</td><td>Volume (mL)</td><td>Note</td></tr>'+
'<tr>'+m_txt(t2hm(cfg.ch.a.t),"chat")+m_txt(cfg.ch.a.n,"chan")+m_txt(cfg.ch.a.a,"chaa")+'</tr>'+
'<tr>'+m_txt(t2hm(cfg.ch.b.t),"chbt")+m_txt(cfg.ch.b.n,"chbn")+m_txt(cfg.ch.b.a,"chba")+'</tr>'+
'<tr>'+m_txt(t2hm(cfg.ch.c.t),"chct")+m_txt(cfg.ch.c.n,"chcn")+m_txt(cfg.ch.c.a,"chca")+'</tr>'+
'<tr>'+m_txt(t2hm(cfg.ch.d.t),"chdt")+m_txt(cfg.ch.d.n,"chdn")+m_txt(cfg.ch.d.a,"chda")+'</tr></table><br>');
    respAns++;
    return true;
  } else if (respAns==1){
    respStr=('<table><tr><td>Calibration: </td><td>Flow rate (mL/min)</td><td>Capacity (mL)</td></tr>'+
'<tr><td>'+m_btn("ch1cal")+'</td>'+m_txt(cfg.ch.a.m,"cham")+m_txt(cfg.ch.a.c,"chac")+'</tr>'+
'<tr><td>'+m_btn("ch2cal")+'</td>'+m_txt(cfg.ch.b.m,"chbm")+m_txt(cfg.ch.b.c,"chbc")+'</tr>');
    respAns++;
    return true;
  } else if (respAns==2){
    respStr=('<tr><td>'+m_btn("ch3cal")+'</td>'+m_txt(cfg.ch.c.m,"chcm")+m_txt(cfg.ch.c.c,"chcc")+'</tr>'+
'<tr><td>'+m_btn("ch4cal")+'</td>'+m_txt(cfg.ch.d.m,"chdm")+m_txt(cfg.ch.d.c,"chdc")+'</tr></table><br>');
    respAns++;
    return true;
  } else{
    respStr=('<input type="hidden" value='+aplcode+' name="aplcode">'+
'<input type="submit" value="apply">'+' '+m_btn("save")+' '+m_btn("restore")+' '+m_btn("reboot")+' '+m_btn("update")+'</form></body></html>');
    respAns=0;
    return false;
  }
}

function serverReq(){
  if (sdata.length>0){
    srData+=sdata;
    sdata="";
  }
  if (srTmr) srTmr--;
  switch (srSt){
    case 0:
      if (srData.length>0){
        /*print("{"+srData+"}");*/
        var i=srData.indexOf("+IPD,");
        if (i>=0){
          var j=srData.indexOf("\r\n",i+7);
          if (j>=0){
            respCID=srData.substr(i+5,1);
            reqStr=srData.substring(i,j);
            print(reqStr);
            respAns=0;
            srTmr=0;
            srGrSt=true;
            srSt=1;
          } else{
            if (srTmr===0) srTmr=10;
            else if (srTmr==1) srData="";
            return;
          }
        }
      }
      break;
    case 1:
      if ((srData.indexOf("SEND OK")>=0) || (srTmr===0)){
        if (srGrSt===true){
          srGrSt=getResponse();
          reqStr="";
          print("resp.length:"+respStr.length);
          Serial2.write('AT+CIPSEND='+respCID+','+respStr.length+'\r\n');
          srSt=2; srTmr=20;
        } else{srSt=0; srTmr=0;}
      }
      break;
    case 2:
      if ((srData.indexOf(">")>=0) || (srTmr===0)){
        Serial2.write(respStr+'\r\n');
        srSt=1; srTmr=20;
      }
      break;
    default: srSt=0;
  }
  srData="";
}

function serCmd(cmd,to){
  sdata="";
  Serial2.write(cmd+"\r\n");
  setTimeout(iSerCmd,to);
}

function iSerCmd(){
  switch (iSerCmdV.st){
    case 0: serCmd("\r\nAT+RST",5000); break;
    case 1: serCmd("ATE0",500); break;
    case 2: serCmd("AT+CIPMUX=1",500); break;
    case 3: serCmd("AT+CWMODE=1",500); break;
    case 4: serCmd("AT+CWJAP="+JSON.stringify(cfg.esp.ssid)+","+JSON.stringify(cfg.esp.key),20000); break;
    case 5: serCmd("AT+CIPSERVER=1,80",5000); break;
    case 6: serCmd("AT+CIFSR",1000); break;
    case 7:
      var i=sdata.indexOf("STAIP,");
      if (i>=0){
        iVar.ip=JSON.parse(sdata.slice(i+6));
        if (iVar.ip!="0.0.0.0"){
          print(iVar.ip);
          iVar.espS="srvOK";
          iVar.srvR=true;
          delete lcdO.ver;
          delete lcdO.msg;
          lcdO.ip="IP:"+iVar.ip;
          iLcdExUpd();
        }
      }
      iSerCmdV.st=-1;
      break;
    case 8:
      if (IftttMsg.length===0) IftttMsg[0]="time_syncron";
      IftttRStr=IftttR[0]+cfg.aplName+IftttR[1]+cfg.iftttKey+"?value1="+IftttMsg[0];
      if (IftttMsg[1]!==undefined) IftttRStr+="&value2="+IftttMsg[1];
      if (IftttMsg[2]!==undefined) IftttRStr+="&value3="+IftttMsg[2];
      IftttRStr+=IftttR[2];
      serCmd('AT+CIPSEND=0,'+IftttRStr.length,1000);
      break;
    case 9:
      if (sdata.indexOf(">")>=0){
        serCmd(IftttRStr,10000);
      } else{
        iVar.srvR=true;
        iSerCmdV.st=-1;
      }
      break;
    case 10:
      var i=sdata.indexOf("Date: ");
      if (i>=0){
        var s=sdata.substr(i+6,25).split(' ');
        setTime(Date.parse(s[2]+' '+s[1]+', '+s[3]+' '+s[4]+' -0300')/1000+10);
        print((new Date()).toUTCString());
        iVar.espS="gtmOK";
        iVar.srvR=true;
        IftttMsg=[];
        iEspTO=24*60*60*1000;
        iEspTimeout(iEspTO);
        delete lcdO.msg;
        iLcdExUpd();
      } else iVar.srvR=true;
      iSerCmdV.st=-1;
      break;
    default: iSerCmdV.st=-1;
  }
  iSerCmdV.st++;
}

function iEspTimeout(timeout){
  if (iEspTmr!==undefined) clearTimeout(iEspTmr);
  iEspTmr=setTimeout(iEsp,timeout);
}
function iEsp(){
  switch (iVar.espS){
    case "gtmOK":
    case "srvOK":
      if (IftttMsg.length===0) IftttMsg[0]="time_syncron";
      print("putIftttMsg: "+IftttMsg);
      lcdO.msg="M: "+IftttMsg[0];
      iLcdExUpd();
      iVar.espS="gtmNO";
      iVar.srvR=false;
      iEspTO=60000;
      iSerCmdV.st=iSerCmdV.ifttt;
      serCmd('AT+CIPSTART=0,"TCP","maker.ifttt.com",80',1000);
      break;
    case "gtmNO":
    case "srvNO":
    case "pon":
      print("connect to "+cfg.esp.ssid);
      lcdO.msg="M: "+cfg.esp.ssid+" Conn...";
      iLcdExUpd();
      iVar.espS="srvNO";
      iVar.srvR=false;
      iEspTO=60000;
      iSerCmdV.st=iSerCmdV.conn;
      serCmd("\r\nAT+RST",5000);
      break;
    default:
      iVar.espS="srvNO";
      iVar.srvR=false;
      iEspTO=1000;
  }
  iEspTmr=setTimeout(iEsp,iEspTO);
}

function iSerReq(){
  var t=parseInt(getTime());
  if (t!=timeSec){
    timeSec=t;
    if (iLcdTmr===0) iLcdTmr=setTimeout(iLcd1,100);
  }
  shortVAv4=(analogRead(A6)*6.6-(shortVAv4/4))+shortVAv4;
  if (iVar.srvR) serverReq();
  setTimeout(iSerReq,100);
  wdSerReq=true;
}

function lcd_wr(x,c){
  var dp=[B15,B14,B13,B12];
  var d=digitalWrite;
  d(B1,!c); d(dp,x>>4); d(B0,1); d(B0,0); d(dp,x); d(B0,1); d(B0,0);
}
function lcd_init(){
  var d=digitalWrite;
  var w=lcd_wr;
  d(B1,1); d([B1,B0],0); w(0x33,1); w(0x32,1); w(0x28,1); w(0x0C,1); w(0x06,1); w(0x01,1);
}

function iLcd1(){
  var s=iHlcd[iHlcdi];
  lcd_wr(0x80,1);
  for (var i=0;i<16;i++){
    if (i<s.length) lcd_wr(s.charCodeAt(i));
    else lcd_wr(0x20);
  }
  setTimeout(iLcd2,400);
}
function iLcd2(){
  var s=(new Date()).toISOString().substr(11,8);
  lcd_wr(0xC0,1);
  for (var i=0;i<8;i++) lcd_wr(s.charCodeAt(i));
  lcd_wr(0x20);
  s=logicLcd.join('');
  for (i=0;i<7;i++) lcd_wr(s.charCodeAt(i));
  iLcdTmr=0;
}

function iLcdExUpd(){
  if (iHlcdi==0){
    lcdO.date=(new Date()).toUTCString().substr(0,16);
    iHlcd=[];
    iHlcdi=0;
    for (var k in lcdO) iHlcd[iHlcdi++]=lcdO[k];
  }
  iHlcdi--;
}
function iLcdEx(){
  iLcdExUpd();
  setTimeout(iLcdEx,4000);
}

function pChX(t,c,n){
  if (c.n!==0 && c.m!==0 && t==c.t){
    if (pChSt[n]===false){
      if (n===0 || n==3) analogWrite(pChNum[n],1.0,{freq: 1000});
      else analogWrite(pChNum[n],0.7,{freq: 1000});
      logicLcd[0]='d'; logicLcd[1]=n+1; logicLcd[3+n]='\xEF';
      pChStTO=parseInt(60*c.n/c.m);
      if (pChStTO<1) pChStTO=1;
      c.c-=c.n;
      if (c.c<0) c.c=0;
      if (c.c<(c.n*3)){
        IftttMsg[IftttMsg.length]="ch_"+(n+1)+"_low_lev";
        iEspTimeout(10*60000);
      }
      pChSt[n]=true;
      lcdO.chn="Pomp: Chan"+(n+1);
      iLcdExUpd();
      return true;
    }
  } else if (pChCal[n]===true){
    if (n===0 || n==3) analogWrite(pChNum[n],1.0,{freq: 1000});
    else analogWrite(pChNum[n],0.7,{freq: 1000});
    logicLcd[0]='c'; logicLcd[1]=n+1; logicLcd[3+n]='\xEF';
    pChSt=[false,false,false,false];
    pChCal=[false,false,false,false];
    pChStTO=60;
    lcdO.chn="Calibr: Chan"+(n+1);
    iLcdExUpd();
    return true;
  } else pChSt[n]=false;
  return false;
}
function iPump(){
  digitalWrite(B11,0);
  if (pChStTO){
    if ((--pChStTO<1)||(shortVAv4<10)){
      var i=logicLcd[1];
      logicLcd=[' ',' ',' ','\xEE','\xEE','\xEE','\xEE'];
      if (shortVAv4<10){
        logicLcd[2+i]='x';
        IftttMsg[IftttMsg.length]="ch_"+i+"_alarm";
        iEspTimeout(10000);
      }
      pChStTO=0;
      analogWrite(pChNum[0],0.0,{freq: 1000});
      analogWrite(pChNum[1],0.0,{freq: 1000});
      analogWrite(pChNum[2],0.0,{freq: 1000});
      analogWrite(pChNum[3],0.0,{freq: 1000});
      delete lcdO.chn;
      iLcdExUpd();
    }
  } else{
    var th=parseInt(timeSec/60%1440);
    if (pChX(th,cfg.ch.a,0)===false){
      if (pChX(th,cfg.ch.b,1)===false){
        if (pChX(th,cfg.ch.c,2)===false){
          pChX(th,cfg.ch.d,3);
        }
      }
    }
  }
  if (wdSerReq===true){
    stm32f1.kickWatchdog();
    wdSerReq=false;
  }
  setTimeout(iPump,1000);
  digitalWrite(B11,1);
}

function start(){
  readConfig();
  stm32f1.enableWatchdog(4.0, false);

  Serial2.setup(115200);
  sdata="";
  Serial2.on("data",function(d){if ((d.length+sdata.length)<512) sdata+=d;});

  reqStr="";
  respAns=0;
  respStr="";
  respCID=0;
  aplcode="aplcode";

  srSt=0;
  srTmr=0;
  srData="";
  srGrSt=false;

  iEspTO=3000;
  lcdO={};
  lcdO.ver="JS:"+process.version+" 2.1/"+cfg.ver;

  iSerCmdV={st:0,conn:0,ifttt:8};
  IftttR=["GET /trigger/","/with/key/"," HTTP/1.1\r\nHost: maker.ifttt.com\r\n\r\n"];
  IftttMsg=["power_restart"];
  IftttRStr="";

  logicLcd=[' ',' ',' ','\xEE','\xEE','\xEE','\xEE'];
  iHlcd=[lcdO.ver];
  iHlcdi=0;
  iLcdTmr=0;

  iVar={espS:"pon",srvR:false,ip:""};
  iEspTmr=undefined;

  timeSec=0;
  wdSerReq=false;
  shortVAv4=5.0*4;

  pChSt=[false,false,false,false];
  pChCal=[false,false,false,false];
  pChNum=["B6","B7","B8","B9"];
  pChStTO=0;

  analogWrite(pChNum[0],0.0,{freq: 1000});
  analogWrite(pChNum[1],0.0,{freq: 1000});
  analogWrite(pChNum[2],0.0,{freq: 1000});
  analogWrite(pChNum[3],0.0,{freq: 1000});
  lcd_init();
  setTimeout(iLcdEx,4000);
  setTimeout(iEsp,iEspTO);
  setTimeout(iSerReq,100);
  setTimeout(iPump,1000);
}

start();
print(cfg.aplName+" started");
print(lcdO.ver);
print((new Date()).toUTCString());
