function writeConfig(){return require("Storage").write("cfg",cfg);}
function readConfig(){
  cfg=require("Storage").readJSON("cfg");
  if (cfg===undefined){
    cfg={ver:0,esp:{ssid:"none",key:"none"},aplPass:"none",aplName:"aPomp",iftttKey:"none"};
    writeConfig();
  }
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
    case 5: serCmd("AT+CIFSR",1000); break;
    case 6:
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
        delete lcdO.ip;
        iLcdExUpd();
      } else iVar.srvR=true;
      iSerCmdV.st=-1;
      break;
    default: iSerCmdV.st=-1;
  }
  iSerCmdV.st++;
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
  for (i=0;i<3;i++) lcd_wr(s.charCodeAt(i));
  lcd_wr(0x20);
  if ((inpOld&1)===0) lcd_wr(0xEE);
  else lcd_wr(0xEF);
  if ((inpOld&2)===0) lcd_wr(0xEE);
  else lcd_wr(0xEF);
  if ((inpOld&4)===0) lcd_wr(0xEE);
  else lcd_wr(0xEF);
  iLcdTmr=0;
}

function iLcdExUpd(){
  if (iHlcdi===0){
    lcdO.date=(new Date()).toUTCString().substr(0,16);
    iHlcd=[];
    iHlcdi=0;
    for (var k in lcdO) iHlcd[iHlcdi++]=lcdO[k];
  }
  iHlcdi--;
}
function iLcdEx(){
  iLcdExUpd();
  setTimeout(iLcdEx,iLcdExTO);
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

function iLogic(){
  digitalWrite(B11,0);
  var secEv=false;
  var t=parseInt(getTime());
  if (t!=timeSec){
    timeSec=t; secEv=true;
    if (iLcdTmr===0) iLcdTmr=setTimeout(iLcd1,100);
  }

  logicLcd[0]=" ";
  var str="";
  var c=logicConst,v=logicVar,w=logicWave;
  var ch2=v.ch2max,ch3=c.ch3max,ch4=c.ch4max,ch4n=0;
  var hms=timeSec%86400;
  v.powVAv4=(analogRead(A6)*40.425-(v.powVAv4/4))+v.powVAv4;

  w.on=1;
  if (parseInt(hms/3600)>=8){
    if (parseInt(hms/3600)>=21){
      if (w.cnfg.n!=1) w.cnfg={n:1,dt:1,level:0.47,ampl:0};
    } else{
      if (w.cnfg.n!=2) w.cnfg={n:2,dt:1,level:0.25,ampl:0.51};
    }
  } else{
    if (w.cnfg.n!=1) w.cnfg={n:1,dt:1,level:0.47,ampl:0};
  }

  if (secEv===true){
    if (v.tmr.feed){
      if(--v.tmr.feed===0) v.tmr.pPomp=60;
    }
    if (v.tmr.autoFeed) v.tmr.autoFeed--;
    if (v.tmr.pPomp) v.tmr.pPomp--;
    if (v.tmr.pPompOff) v.tmr.pPompOff--;
    if (v.tmr.mPomp) v.tmr.mPomp--;
    if (v.tmr.mPompOff) v.tmr.mPompOff--;
    if (v.tmr.elGate) v.tmr.elGate--;
    if (v.tmr.ch2low) v.tmr.ch2low--;
    if (v.tmr.ch2hi) v.tmr.ch2hi--;
  }

  if (kbdSt==3){
    if (v.tmr.feed===0){
      v.tmr.autoFeed=86400+60; v.tmr.feed=600; v.ch2max=c.ch2max;
    } else{
      v.tmr.feed=0; v.tmr.pPomp=60;
    }
  } else if (kbdSt==2){
    if (v.tmr.pPomp===0) v.tmr.pPomp=60;
    else v.tmr.pPomp=0;
  }
  kbdSt=0;

  if (hms==c.autoOnTime && v.tmr.feed===0){
    if (v.tmr.autoFeed===0){
      v.tmr.autoFeed=86400+60; v.tmr.feed=60; v.ch2max=c.ch2max;
      IftttMsg[IftttMsg.length]="auto_feeding";
      iEspTimeout(1000);
    } else{
      v.tmr.pPomp=30; v.tmr.pPompOff=3600;
    }
  }

  i=7-digitalRead([A11,B4,B3]);

  if (udsVal>0.0013 && udsVal<0.0027){
    if (udsVal<udsAv){
      if ((udsAv-udsVal)>udsRate)
        udsVal=udsAv-udsRate;
    } else{
      if ((udsVal-udsAv)>udsRate)
        udsVal=udsAv+udsRate;
    }
    udsAv=(udsAv+udsVal)/2;
    if (udsAv>udsThr)
      logicLcd[2]="L";
    else{
      logicLcd[2]="H";
      i|=8;
    }
  } else{
    logicLcd[2]="*";
    i|=8;
  }
  udsVal=0;

  if (i==inpOld){
    if ((i&2)===0){
      if (v.tmr.feed===0){
        str="High water level"; logicLcd[0]="H";
        v.tmr.elGate=10;
        if (v.tmr.mPomp===0){
          if (v.tmr.mPompOff===0){
            v.tmr.mPomp=4; v.tmr.mPompOff=600; v.ch2max=c.ch2max;
            IftttMsg[IftttMsg.length]="high_wt_level";
            iEspTimeout(1000);
          }
        }
      } else v.tmr.feed=1;
    }
    if ((i&8)===0){
      str="Low water level"; logicLcd[0]="L";
      if (v.tmr.pPompOff===0){
        v.tmr.pPomp=30; v.tmr.pPompOff=3600;
        IftttMsg[IftttMsg.length]="low_wt_level";
        iEspTimeout(1000);
      }
    }
    if ((i&8)===0){
      if (v.ch2v<=c.ch2min) v.ch2v=c.ch2min;
      else v.ch2v-=0.02;
      if (v.tmr.ch2low===0){
        v.tmr.ch2low=300;
        v.tmr.ch2hi=86400;

        v.ch2max-=0.5;
        if (v.ch2max<=c.ch2min) v.ch2max=c.ch2min;

        IftttMsg[IftttMsg.length]="pomp_volt_dec";
        IftttMsg[IftttMsg.length]=parseInt(v.ch2max*1000)+"mV";
        iEspTimeout(1000);
      }
    } else if ((i&8)==1){
      if (v.ch2v>=v.ch2max) v.ch2v=v.ch2max;
      else v.ch2v+=0.02;
      if (v.tmr.ch2hi===0 && v.ch2max<c.ch2max){
        v.tmr.ch2hi=86400;

        v.ch2max+=0.5;
        if (v.ch2max>=c.ch2max) v.ch2max=c.ch2max;

        IftttMsg[IftttMsg.length]="pomp_volt_inc";
        IftttMsg[IftttMsg.length]=parseInt(v.ch2max*1000)+"mV";
        iEspTimeout(1000);
      }
    }
  }
  inpOld=i;

  if (v.tmr.feed===0)
    ch2=v.ch2v;
  else{
    str="Pause of feeding"; logicLcd[0]="F";
    w.on=0; ch2=0; ch3=0; v.tmr.elGate=10;
  }

  if (v.tmr.pPomp){
    str="Peristaltic pump"; logicLcd[0]="P";
    if (v.tmr.elGate) ch4n=3;
    else ch4n=1;
  } else{
    if (v.tmr.elGate) ch4n=2;
    else ch4n=0;
  }

  if (v.tmr.mPomp)
    ch2=0;

  if (str!=="")
    lcdO.lstr=str;
  else if (lcdO.lstr){
    delete lcdO.lstr;
  }

  if ((v.powVAv4/4)<c.powVoltLv){
    w.on=0; ch3=0;
    lcdO.pow="Backup power";
  } else if (lcdO.pow){
    delete lcdO.pow;
    iVar.espS="srvNO";
    IftttMsg[IftttMsg.length]="backup_power";
    iEspTimeout(5*60*1000);
  }

  if (w.on){
    if (w.cnt) w.cnt--;
    if (w.cnt===0){
      w.cnt=w.cnfg.dt;
      var wVal=(1+Math.sin((w.idx-16)*Math.PI/32))*w.cnfg.ampl/2+w.cnfg.level;
      if (wVal==wValOld) logicLcd[1]="-";
      else if (wVal>wValOld) logicLcd[1]="\xD9";
      else logicLcd[1]="\xDA";
      wValOld=wVal;
      analogWrite(B6,(1.0-wVal),{freq:100000});
      w.idx+=1;
      if (w.idx>63) w.idx=0;
    }
  } else{
    logicLcd[1]="_";
    w.idx=0; w.cnt=1;
    analogWrite(B6, 1.0, {freq:100000});
  }

  if (ch2!=v.ch2Old){
    analogWrite(B7, (0.84265176790-(0.03444134167*ch2)), {freq:100000});
    v.ch2Old=ch2;
  }
  if (ch3!=v.ch3Old){
    analogWrite(B8, (0.31121964744-(0.01596216538*ch3)), {freq:100000});
    v.ch3Old=ch3;
  }
  if (ch4!=v.ch4Old){
    analogWrite(B9, (0.31121964744-(0.01596216538*ch4)), {freq:100000});
    v.ch4Old=ch4;
  }
  if (ch4n!=v.ch4nOld){
    if (ch4n&1) digitalWrite(A7,0);
    else digitalWrite(A7,1);
    if (ch4n&2) digitalWrite(A8,0);
    else digitalWrite(A8,1);
    v.ch4nOld=ch4n;
  }

  digitalPulse(A0,1,0.01);
  stm32f1.kickWatchdog();
  setTimeout(iLogic,100);
  digitalWrite(B11,1);
}

function start(){
  readConfig();
  stm32f1.enableWatchdog(4.0, false);

  Serial2.setup(115200);
  sdata="";
  Serial2.on("data",function(d){var i=d.length; if ((i+sdata.length)>512) sdata=sdata.substr(i)+d; else sdata+=d;});

  iLcdTO=1000;
  iLcdExTO=4000;
  iEspTO=3000;
  lcdO={};
  lcdO.ver="JS:"+process.version+" 2.6/"+cfg.ver;

  iSerCmdV={st:0,conn:0,ifttt:8};
  IftttR=["GET /trigger/","/with/key/"," HTTP/1.1\r\nHost: maker.ifttt.com\r\n\r\n"];
  IftttMsg=["power_restart"];
  IftttRStr="";

  inpOld=undefined;
  logicLcd=[' ',' ',' '];
  iHlcd=[lcdO.ver];
  iHlcdi=0;
  iLcdTmr=0;

  iVar={espS:"pon",srvR:false,ip:""};
  iEspTmr=undefined;

  A0.reset();
  A4.mode("input_pullup");
  A5.mode("input_pullup");
  A11.mode("input_pullup");
  B4.mode("input_pullup");
  B3.mode("input_pullup");
  lcd_init();
  setTimeout(iLcdEx,iLcdExTO);
  setTimeout(iEsp,iEspTO);

  /*---Logic---*/
  logicConst={ch2min:10.0,ch2max:15.0,ch3max:9.0,ch4max:12.0,powVoltLv:21.0,autoOnTime:(9*3600+30*60)};
  logicVar={ch2v:logicConst.ch2max,ch2max:logicConst.ch2max,tmr:{feed:0,autoFeed:0,pPomp:0,pPompOff:0,mPomp:0,mPompOff:0,elGate:0,ch2low:0,ch2hi:0},ch2Old:undefined,ch3Old:undefined,ch4Old:undefined,ch4nOld:undefined,powVAv4:24*4};
  logicWave={idx:0,on:1,cnt:1,cnfg:{n:0,dt:1,level:0,ampl:0}};
  timeSec=0;
  wValOld=0;
  kbdSt=0;
  udsTm=0;
  udsVal=0;
  udsAv=0.0013;
  udsThr=0.00155;
  udsRate=0.000006;

  setTimeout(iLogic,100);
  setWatch(function(e){udsTm=e.time;},A1,{repeat:true, edge:'rising'});
  setWatch(function(e){udsVal=e.time-udsTm;},A1,{repeat:true, edge:'falling'});
  setWatch(function(e){if((e.time-e.lastTime)>0.2) kbdSt=2;},A4,{repeat:true, edge:'falling', debounce:20});
  setWatch(function(e){if((e.time-e.lastTime)>0.2) kbdSt=3;},A5,{repeat:true, edge:'falling', debounce:20});
}

start();
print(cfg.aplName+" started");
print(lcdO.ver);
print((new Date()).toUTCString());
