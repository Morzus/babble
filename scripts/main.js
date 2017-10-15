   
    var Babble = new Object();
    counter = 0;
    
    function xhttpsendmsg(themsg) {

    var userfromlocalstorage = JSON.parse(localStorage.getItem("babble"));
    themsg = JSON.stringify(themsg);

    var xhttprequest = new XMLHttpRequest();
    xhttprequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //take response and make it to msg
            //newmsg(this.responseText);
            //xhttpgetmsgs();
        }
    };
    xhttprequest.open("POST","/messages", true);
    xhttprequest.setRequestHeader("Content-type", "application/json");
    xhttprequest.send(themsg);
    }

    
    function xhttpdeletemsg(_delete) {        
            var xhttprequest = new XMLHttpRequest();
            xhttprequest.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                   
                }
            };
            xhttprequest.open("DELETE","/messages/"+_delete, true);
            xhttprequest.send();
    }    
    
    function xhttpgetmsgs() {
    var xhttprequest = new XMLHttpRequest();
    xhttprequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //take response and make it to msg
            newmsg(this.responseText);
            counter = counter+1;
            xhttpgetmsgs();
        }
    };
    console.log(counter);
    xhttprequest.open("GET","/messages?counter="+counter, true);
    xhttprequest.send();
    }
    
    function xhttpgetstats() {
    var xhttprequest = new XMLHttpRequest();
    xhttprequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //take response make stats
            responseofstats=JSON.parse(this.responseText);
            // TODO change this
            document.getElementById("NumberMsgs").innerHTML = responseofstats.users;
            document.getElementById("NumberUsers").innerHTML = responseofstats.messages;
            setTimeout(function(){xhttpgetstats()},10000);
        }
    };
    xhttprequest.open("GET","/stats", true);
    xhttprequest.send();
    }

    window.onload = function () {

        if (localStorage.getItem("babble")!=null) {
            document.getElementById('modal').style.display = "none";
        }
        else {
            register = {"userInfo" : {"name" : undefined,"email" : undefined},"currentMessage" : 0};
        }

        document.getElementById('button').onclick = function () {
            document.getElementById('modal').style.display = "none";
            register.name= 'Anonymous';
        };
        document.getElementById('button1').onclick = function () {
            document.getElementById('modal').style.display = "none";
            register.userInfo.name = document.getElementById("fullname").value;
            register.userInfo.email = document.getElementById("email").value;
            register.currentMessage = 0;
            Babble.register(register);
        };
    };

    function delmsg(element,del){
        var list = document.getElementById("msglist");
        //var to_delete = document.getElementById("num");
        var to_delete = element.parentElement.parentElement;
        list.removeChild(to_delete);
        Babble.deleteMessage(del,xhttpdeletemsg);
        //list.removeChild(candidate);
    };

    function newmsg(msg){

        if (msg=="") return;

        msg = JSON.parse(msg);
        msg = msg[0];

        var _name = msg.name;
        var _msg = msg.msg;
        var _datetime = msg.time;
        var _id = msg.id;
        var _avatar = msg.hash;

        var NewListItem = document.createElement("li");
        var alldiv = document.createElement("div");
        var list = document.getElementById("msglist");
        var msgid;
        var ind = parseInt(list.getAttribute('index'));
        list.setAttribute('index', ind +1);
        NewListItem.setAttribute('index',ind);
        NewListItem.setAttribute('id',ind);
        
        //alert(list.children.length);
        document.getElementById("bottom").style.height = "100px";
        document.getElementById("to_print").style.height = "100px";

        //user name
        var span_name = document.createElement("span");
        span_name.appendChild(document.createTextNode(_name+' '));
        span_name.style.fontWeight='bold';
        span_name.style.fontSize='larger';
        span_name.style.color='black';
        span_name.id ="cb";

        //time stamp
        var span_name_time=document.createElement('span');
        var now = new Date();
        span_name_time.appendChild(document.createTextNode(now.getHours()+':'+ ((now.getMinutes()<10?'0':'')+now.getMinutes())));
        span_name_time.style.fontSize='small';

        //picture
        var pic = document.createElement("img");
        if (span_name.innerHTML == "Anonymous "){
            pic.setAttribute('src', 'ano.png');
            pic.setAttribute('border', '1px solid');
            pic.setAttribute('alt', _name);
        }else{
            pic.setAttribute('src', 'https://www.gravatar.com/avatar/'+_avatar);
        }
        pic.setAttribute('class', 'usrpic');

        //content
        var text_div = document.createElement("div");
        //var content = document.getElementById("to_print").value;
        var content = _msg;
        
        var textnode=document.createTextNode(content);
        var pre = document.createElement("pre");
        pre.appendChild(textnode);
        document.getElementById("to_print").value='';
        //document.getElementById("bottom").style.height= 100 px;
        
        //x button
        var xb = document.createElement("span_name");
        xb.onclick =  function() {delmsg(this,_id)};
        xb.appendChild(document.createTextNode('x'));
        xb.style.fontWeight='bold';
        xb.setAttribute('class','cb');
        xb.setAttribute('id','cb');

        //build the div message
        text_div.appendChild(span_name);
        text_div.appendChild(span_name_time);
        text_div.appendChild(document.createElement("br"));
        text_div.appendChild(textnode);
        alldiv.appendChild(pic);
        alldiv.appendChild(text_div);
        alldiv.appendChild(xb);
        NewListItem.appendChild(alldiv);
        list.appendChild(NewListItem);
        foc();
    };    

    function foc(){
        window.setTimeout(function (){
        document.getElementById('to_print').focus();}, 0);
        document.getElementById("to_print").value="";
        return false;
    }

    function setHeight(el){
        el.style.height = '100px';
        if ((el.scrollHeight >= 100) && (el.scrollHeight<=300)){
            el.style.height = el.scrollHeight+'px';
        }
        if(el.scrollHeight > 300){
            el.style.height = 300 + 'px';
        }
        document.getElementById("bottom").style.height = el.style.height;
    };


    function sendnewmsg(){
        if (window.event.keyCode == 13) {
            window.location = "#pageend";
            var info = JSON.parse(localStorage.getItem("babble"));
            var date = new Date();      
            //cretae message
            if (info==null) {
                var message = {
                    "name" : null,
                    "email" : null,
                    "msg" : document.getElementById("to_print").value,
                    "timestamp" : date.getTime()
                }                
            }
            else {
                var message = {
                    "name" : info.userInfo.name,
                    "email" : info.userInfo.email,
                    "msg" : document.getElementById("to_print").value,
                    "timestamp" : date.getTime()
                }
            }
            Babble.postMessage(message, xhttpsendmsg);
            //document.getElementById("btnsend").click();
        }
    }

    Babble.getMessages = function(counter, callback) {
        callback();
    }

    Babble.getStats = function(callback) {
        callback();
    }

    Babble.postMessage = function(message, callback) {
        callback(message);
    }

    Babble.register = function(userInfo) {
        localStorage.setItem("babble",JSON.stringify(userInfo));
    }

    Babble.deleteMessage = function(id, callback) {
        callback(id);
    }

    Babble.getMessages(counter, xhttpgetmsgs);
    Babble.getStats(xhttpgetstats);
