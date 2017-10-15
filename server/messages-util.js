var crypto
crypto = require('crypto');

function MessageLogic() {
    this.currentMsgNum = 0;
    this.userMsgs = new Array();
    this.connectedUsrs = new Array();

}

MessageLogic.prototype.addMessage = function (msgToadd) {
    
            switch (msgToadd.name) {
                case null:
                    msgToadd.name = "Anonimous";
    
                    break;
            }
            if (msgToadd.email == null) {
                msgToadd.email = "user@anonimous.co.il"
            }
    
            var newHashh = crypto.createHash('md5');
            var hashedMail = newHashh.update(msgToadd.email)
            msgToadd.hash = hashedMail.digest("hex");
    
            msgToadd.time = new Date(msgToadd.timestamp).getHours() + ":" + new Date(msgToadd.timestamp).getMinutes() + ":" + new Date(msgToadd.timestamp).getSeconds();
    
            var finalMsg = msgToadd;
    
            this.userMsgs.push(finalMsg);
    
    
            msgToadd.id = this.currentMsgNum;
            this.currentMsgNum = this.currentMsgNum +1;
            var idOfMsg = msgToadd.id;
            return idOfMsg;
        };

MessageLogic.prototype.getMessages = function (msgNumer) {
    var msgArrId;
    msgArrId = 0;
    for (const userMsg of this.userMsgs)
    {
        if (userMsg.id == msgNumer) {
            break;
        }
        msgArrId++;
    }

    return this.userMsgs.slice(msgArrId);
};

MessageLogic.prototype.deleteMessage = function (msgIdToDel) {
    var msgArrId = 0;
    this.userMsgs.forEach(function (currMsg) {
        if (currMsg.id == msgIdToDel)
        {
            this.userMsgs.splice(msgArrId, 1);
            return;
        }
        msgArrId++;
    }, this);
};

MessageLogic.prototype.AddClientToLogPollingWait = function (MsgNumOfCient, res) {
    this.connectedUsrs.push({"MsgNumOfCient": MsgNumOfCient, "res": res});
};

MessageLogic.prototype.RemoveClientFromLongPollingWait = function () {
    var busyWaitClients = new Array();

    while (this.connectedUsrs.length > 0) {

        var client = this.connectedUsrs.pop();
        if (!this.getNewMsgs(client.MsgNumOfCient)) {
            busyWaitClients.push(client);
        } else {
            client.res.json(this.getMessages(client.MsgNumOfCient)).send().end();
        }
    }

    while (busyWaitClients.length > 0) {
        this.connectedUsrs.push(busyWaitClients.pop());
    }
};

MessageLogic.prototype.MsgsInChat = function () {
    var msgsNum= this.userMsgs.length;
    return msgsNum;
};

MessageLogic.prototype.getNewMsgs = function (MsgIdToCheck) {
    var newMsgsRes = this.currentMsgNum > MsgIdToCheck;
    return newMsgsRes;
};

MessageLogic.prototype.usersNumInChat = function () {
    var numChatUsers = this.connectedUsrs.length;
    return numChatUsers;
};

    module.exports =
        new MessageLogic();
