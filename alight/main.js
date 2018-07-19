function writeConfig(){return require("Storage").write("cfg",cfg);}
function readConfig(){
  cfg=require("Storage").readJSON("cfg");
  if (cfg===undefined){
    cfg={ver:0,ch:{t:[0,0,0,0,0,0,0,0,0],a:{p:[0,0,0,0,0,0,0,0,0],m:0},b:{p:[0,0,0,0,0,0,0,0,0],m:0},c:{p:[0,0,0,0,0,0,0,0,0],m:0},d:{p:[0,0,0,0,0,0,0,0,0],m:0}},esp:{ssid:"none",key:"none"},aplPass:"none",aplName:"aLight",iftttKey:"none"};
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
function s2flt(s){
  var i=parseFloat(parseFloat(s).toFixed(4));
  if (isNaN(i)||i>100||i<0) i=0;
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
          if (p.t0!==undefined && p.cmd===undefined){
            cfg.ch.t[0]=hm2t(p.t0); cfg.ch.t[1]=hm2t(p.t1); cfg.ch.t[2]=hm2t(p.t2); cfg.ch.t[3]=hm2t(p.t3);
            cfg.ch.t[4]=hm2t(p.t4); cfg.ch.t[5]=hm2t(p.t5); cfg.ch.t[6]=hm2t(p.t6); cfg.ch.t[7]=hm2t(p.t7); cfg.ch.t[8]=hm2t(p.t8);
            cfg.ch.a.p[0]=s2flt(p.ap0); cfg.ch.b.p[0]=s2flt(p.bp0); cfg.ch.c.p[0]=s2flt(p.cp0); cfg.ch.d.p[0]=s2flt(p.dp0);
            cfg.ch.a.p[1]=s2flt(p.ap1); cfg.ch.b.p[1]=s2flt(p.bp1); cfg.ch.c.p[1]=s2flt(p.cp1); cfg.ch.d.p[1]=s2flt(p.dp1);
            cfg.ch.a.p[2]=s2flt(p.ap2); cfg.ch.b.p[2]=s2flt(p.bp2); cfg.ch.c.p[2]=s2flt(p.cp2); cfg.ch.d.p[2]=s2flt(p.dp2);
            cfg.ch.a.p[3]=s2flt(p.ap3); cfg.ch.b.p[3]=s2flt(p.bp3); cfg.ch.c.p[3]=s2flt(p.cp3); cfg.ch.d.p[3]=s2flt(p.dp3);
            cfg.ch.a.p[4]=s2flt(p.ap4); cfg.ch.b.p[4]=s2flt(p.bp4); cfg.ch.c.p[4]=s2flt(p.cp4); cfg.ch.d.p[4]=s2flt(p.dp4);
            cfg.ch.a.p[5]=s2flt(p.ap5); cfg.ch.b.p[5]=s2flt(p.bp5); cfg.ch.c.p[5]=s2flt(p.cp5); cfg.ch.d.p[5]=s2flt(p.dp5);
            cfg.ch.a.p[6]=s2flt(p.ap6); cfg.ch.b.p[6]=s2flt(p.bp6); cfg.ch.c.p[6]=s2flt(p.cp6); cfg.ch.d.p[6]=s2flt(p.dp6);
            cfg.ch.a.p[7]=s2flt(p.ap7); cfg.ch.b.p[7]=s2flt(p.bp7); cfg.ch.c.p[7]=s2flt(p.cp7); cfg.ch.d.p[7]=s2flt(p.dp7);
            cfg.ch.a.p[8]=s2flt(p.ap8); cfg.ch.b.p[8]=s2flt(p.bp8); cfg.ch.c.p[8]=s2flt(p.cp8); cfg.ch.d.p[8]=s2flt(p.dp8);
            cfg.ch.a.m=s2flt(p.am); cfg.ch.b.m=s2flt(p.bm); cfg.ch.c.m=s2flt(p.cm); cfg.ch.d.m=s2flt(p.dm);
            ra+=": Applyed";
          }
          else if (p.cmd=="save"){
            if (writeConfig()===true) ra+=": Writed";
            else ra+=": Not writed (length>1k)";
          }
          else if (p.cmd=="restore"){
            readConfig();
            ra+=": Restored";
          }
          else if (p.cmd=="update"){
            ra+=": Updated";
          }
          else if (p.cmd=="reboot"){
            aplcode="aplcode";
            setTimeout(function(){load();},1500);
          }
        }
      }
      else if (reqStr.indexOf("favicon.ico",i+5)>=0){
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
  }
  else if (respAns===0){
    respStr=('HTTP/1.1 200 OK\r\nServer: '+cfg.aplName+'\r\nContent-Type: text/html\r\n\r\n'+'<html><body><p>'+ra+'<br>'+(new Date()).toUTCString().substr(0,25)+'</p>'+
'<form action="config" method="get">'+
'<table><tr><td>Time (hh:mm)</td><td>PWM1</td><td>PWM2</td><td>PWM3</td><td>PWM4</td></tr>'+
'<tr>'+m_txt(t2hm(cfg.ch.t[0]),"t0")+m_txt(cfg.ch.a.p[0],"ap0")+m_txt(cfg.ch.b.p[0],"bp0")+m_txt(cfg.ch.c.p[0],"cp0")+m_txt(cfg.ch.d.p[0],"dp0")+'</tr>'+
'<tr>'+m_txt(t2hm(cfg.ch.t[1]),"t1")+m_txt(cfg.ch.a.p[1],"ap1")+m_txt(cfg.ch.b.p[1],"bp1")+m_txt(cfg.ch.c.p[1],"cp1")+m_txt(cfg.ch.d.p[1],"dp1")+'</tr>');
    respAns++;
    return true;
  }
  else if (respAns==1){
    respStr=('<tr>'+m_txt(t2hm(cfg.ch.t[2]),"t2")+m_txt(cfg.ch.a.p[2],"ap2")+m_txt(cfg.ch.b.p[2],"bp2")+m_txt(cfg.ch.c.p[2],"cp2")+m_txt(cfg.ch.d.p[2],"dp2")+'</tr>'+
'<tr>'+m_txt(t2hm(cfg.ch.t[3]),"t3")+m_txt(cfg.ch.a.p[3],"ap3")+m_txt(cfg.ch.b.p[3],"bp3")+m_txt(cfg.ch.c.p[3],"cp3")+m_txt(cfg.ch.d.p[3],"dp3")+'</tr>');
    respAns++;
    return true;
  }
  else if (respAns==2){
    respStr=('<tr>'+m_txt(t2hm(cfg.ch.t[4]),"t4")+m_txt(cfg.ch.a.p[4],"ap4")+m_txt(cfg.ch.b.p[4],"bp4")+m_txt(cfg.ch.c.p[4],"cp4")+m_txt(cfg.ch.d.p[4],"dp4")+'</tr>'+
'<tr>'+m_txt(t2hm(cfg.ch.t[5]),"t5")+m_txt(cfg.ch.a.p[5],"ap5")+m_txt(cfg.ch.b.p[5],"bp5")+m_txt(cfg.ch.c.p[5],"cp5")+m_txt(cfg.ch.d.p[5],"dp5")+'</tr>');
    respAns++;
    return true;
  }
  else if (respAns==3){
    respStr=('<tr>'+m_txt(t2hm(cfg.ch.t[6]),"t6")+m_txt(cfg.ch.a.p[6],"ap6")+m_txt(cfg.ch.b.p[6],"bp6")+m_txt(cfg.ch.c.p[6],"cp6")+m_txt(cfg.ch.d.p[6],"dp6")+'</tr>'+
'<tr>'+m_txt(t2hm(cfg.ch.t[7]),"t7")+m_txt(cfg.ch.a.p[7],"ap7")+m_txt(cfg.ch.b.p[7],"bp7")+m_txt(cfg.ch.c.p[7],"cp7")+m_txt(cfg.ch.d.p[7],"dp7")+'</tr>');
    respAns++;
    return true;
  }
  else if (respAns==4){
    respStr=('<tr>'+m_txt(t2hm(cfg.ch.t[8]),"t8")+m_txt(cfg.ch.a.p[8],"ap8")+m_txt(cfg.ch.b.p[8],"bp8")+m_txt(cfg.ch.c.p[8],"cp8")+m_txt(cfg.ch.d.p[8],"dp8")+'</tr>'+
'<tr><td>Minimum:</td>'+m_txt(cfg.ch.a.m,"am")+m_txt(cfg.ch.b.m,"bm")+m_txt(cfg.ch.c.m,"cm")+m_txt(cfg.ch.d.m,"dm")+'</tr>'+'</table><br>');
    respAns++;
    return true;
  }
  else{
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
            srSt=1;
          }
          else{
            if (srTmr===0) srTmr=10;
            else if (srTmr==1) srData="";
            return;
          }
        }
      }
      break;
    case 1:
      srGrSt=getResponse();
      reqStr="";
      print("resp.length:"+respStr.length);
      Serial2.write('AT+CIPSEND='+respCID+','+respStr.length+'\r\n');
      srSt=2; srTmr=20; break;
    case 2:
      if ((srData.indexOf(">")>=0) || (srTmr===0)){
        Serial2.write(respStr+'\r\n');
        srSt=3; srTmr=20;
      }
      break;
    case 3:
      if ((srData.indexOf("SEND OK")>=0) || (srTmr===0)){
        if (srGrSt===true){srSt=1; srTmr=0;}
        else{srSt=4; srTmr=0;}
      }
      break;
    case 4:
      /*Serial2.write('AT+CIPCLOSE='+respCID+'\r\n');*/
      srSt=0; break;
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
      }
      else{
        iVar.srvR=true;
        iSerCmdV.st=-1;
      }
      break;
    case 10:
      var i=sdata.indexOf("Date: ");
      if (i>=0){
        var s=sdata.substr(i+6,25).split(' ');
        setTime(Date.parse(s[2]+' '+s[1]+', '+s[3]+' '+s[4]+' -0300')/1000);
        print((new Date()).toUTCString());
        iVar.espS="gtmOK";
        iVar.srvR=true;
        IftttMsg=[];
        iEspTO=24*60*60*1000;
        clearTimeout(iEspTmr);
        iEspTmr=setTimeout(iEsp,iEspTO);
      }
      else
        iVar.srvR=true;
      iSerCmdV.st=-1;
      break;
    default: iSerCmdV.st=-1;
  }
  iSerCmdV.st++;
}

function iEsp(){
  switch (iVar.espS){
    case "gtmOK":
    case "gtmNO":
    case "srvOK":
      if (IftttMsg.length===0) IftttMsg[0]="time_syncron";
      print("putIftttMsg: "+IftttMsg);
      iVar.espS="gtmNO";
      iVar.srvR=false;
      iEspTO=60000;
      iSerCmdV.st=iSerCmdV.ifttt;
      serCmd('AT+CIPSTART=0,"TCP","maker.ifttt.com",80',1000);
      break;
    case "srvNO":
    case "pon":
      print("connect to "+cfg.esp.ssid);
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
  }
  if (iVar.srvR) serverReq();
  setTimeout(iSerReq,100);
  wdSerReq=true;
}

function lineFunc(chp,i,x,y_min,y_max){
  var y=(((x - (cfg.ch.t[i]*60)) * (chp.p[i+1] - chp.p[i]) / ((cfg.ch.t[i+1]*60) - (cfg.ch.t[i]*60) )) + chp.p[i]);
  if (y<y_min) return y_min;
  if (y>y_max) return y_max;
  else return y;
}

function iLight(){
  digitalWrite(B11,0);

  var k,i,pp,th=timeSec%86400,cv=0;
  var cfgch=[cfg.ch.a,cfg.ch.b,cfg.ch.c,cfg.ch.d];
  for(k in cfgch){
    pp=0;
    for(i=0;i<cfg.ch.t.length;i++){
      if ((th >= (cfg.ch.t[i]*60)) && (th < (cfg.ch.t[i+1]*60))){
        pp=lineFunc(cfgch[k],i,th,0,64);
        break;
      }
    }
    if(pp>5) cv=1;
    pp/=100; if(pp!=pChVal[k]){pChVal[k]=pp; analogWrite(pChNum[k],pp,{freq:400});}
  }
  if(cv!=pChVal[4]){pChVal[4]=cv; digitalWrite(A4,!cv); digitalWrite(A6,cv);}

  if (wdSerReq===true){
    stm32f1.kickWatchdog();
    wdSerReq=false;
  }
  setTimeout(iLight,1000);
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

  iSerCmdV={st:0,conn:0,ifttt:8};
  IftttR=["GET /trigger/","/with/key/"," HTTP/1.1\r\nHost: maker.ifttt.com\r\n\r\n"];
  IftttMsg=["power_restart"];
  IftttRStr="";

  iVar={espS:"pon",srvR:false,ip:""};
  iEspTmr=undefined;

  timeSec=0;
  wdSerReq=false;

  pChNum=["B6","B7","B8","B9"];
  pChVal=[0,0,0,0,1];

  digitalWrite(B12,1);/*esp_rst*/
  digitalWrite(A4,0);/*sys_cool_on*/
  digitalWrite(A6,1);/*led_cool_on*/
  analogWrite(pChNum[0],0.0,{freq:400});
  analogWrite(pChNum[1],0.0,{freq:400});
  analogWrite(pChNum[2],0.0,{freq:400});
  analogWrite(pChNum[3],0.0,{freq:400});
  setTimeout(iEsp,iEspTO);
  setTimeout(iSerReq,100);
  setTimeout(iLight,1000);
}

start();
print(cfg.aplName+" started!");
print("JS:"+process.version+" 2.0/"+cfg.ver);
print((new Date()).toUTCString());
