/*
Manages the interface between the UI and the server. Creates "Conversation" objects when needed.
Pierre-Alexandre Bastarache Roberge	
February 5th 2011
*/

//Params
//myName : the loged-in user.
//bodyBox : the div in which we put the conversation text
//sendBox : the div in which the user writes to send messages
function ConversationManager(myName, bodyBoxID, sendBoxID, onConversationCreate, onConversationDestroy, onConversationActivate)
{
	var intervalTime = 300; //Miliseconds
	this._myName = myName;
	var ref = this;
	this._timer = setInterval(function(){ref.pollServer();}, intervalTime);
	this._conversations = [];
	this._conversationNumber = 0;
	this._lastReceivedTime = -1;
    this._lastid = -1;
	
	this._activeConversation = null;
	this._bodyDiv = document.getElementById(bodyBoxID);
	this._sendDiv = document.getElementById(sendBoxID);
	this._onConversationCreate = onConversationCreate;
	this._onConversationDestroy = onConversationDestroy;
	this._onConversationActivate = onConversationActivate;
	
	var conv = this.createConversation("test");
	conv.appendBody("How are you gentleman");
	
	var conv2 = this.createConversation("Barney");
	conv2.appendBody("Barney says: This project will be LEGENDARY");
}

ConversationManager.prototype =
{
	createConversation:function( converserName )
	{
        if (converserName == null){
            return;
        }
		this._conversations[converserName] = new Conversation( converserName );
		this._onConversationCreate(converserName);

        var curusr = document.getElementById("username").value
        var page = this;
        $.post("http://iain.homelinux.com:8000/data/get_history?user1=" + curusr + "&user2=" + converserName, { }, function(data){
                var mes;
				if (data == null ){
                    alert('Message retrieval failed.');
				} else {
                    if (data.messages.length == 0){
                        return;
                    }
                    else {
                        page._lastReceivedTime = data.messages[data.messages.length - 1].time;
                    }
                    for (var mes in data.messages){
                        if (page._conversations[converserName] != null){
                            if (data.messages[mes].id > page._lastid){
                                page._conversations[converserName].appendBody(data.messages[mes].message);

                                if (page._activeConversation = page._conversations[converserName]){
                                    page._bodyDiv.value = page._activeConversation.getBody();
                                }
                                page._lastid = data.messages[mes].id;
                            }
                        }
                    }
				}
			}
		);

		return this._conversations[converserName];
	},
	
	deleteConversation:function ( converserName )
	{
		var temp = this._conversationNumber;
		for (var i in this._conversations)
		{
			if (this._conversations[i].getTarget() == converserName)
			{
				this._onConversationDestroy(converserName);
				this._conversations[i].destroy();
				delete this._conversations[i];
			}
		}
	},

	pollServer:function ()
	{
		var messages;
        var msgs;
        var page = this;
        var curusr = document.getElementById("username").value;

        try {
            var lrt = this._lastReceivedTime.replace(" ", "-");
        }
        catch (_) {
            var lrt = "-1"
        }
		$.post("http://iain.homelinux.com:8000/data/get_messages?username=" + curusr + "&last=" + lrt, {
                    
			}, function(data){
                var mes;
				if (data == null ){
                    alert('Message retrieval failed.');
				} else {
                    messages = data.messages;
                    if (messages.length == 0){
                        return;
                    }
                    else {
                        page._lastReceivedTime = data.messages[data.messages.length - 1].time;
                    }
                    for (var mes in data.messages){
                        var mesConversation = page.findConversation(data.messages[mes].ufrom);
                        if (mesConversation != null){
                            if (data.messages[mes].id > page._lastid){
                                mesConversation.appendBody(data.messages[mes].message);
                                page._bodyDiv.value = page._activeConversation.getBody();
                                page._lastid = data.messages[mes].id;
                            }
                        }
                        else {
                            page.createConversation(data.messages[mes].ufrom);
                            //page.createConversation(data.messages[mes].ufrom).appendBody(data.messages[mes].message);
                        }
                    }
				}
			}
		);

	},

	findConversation:function (sender)
	{
		return this._conversations[sender];
		return null;
	},

	activateConversation:function (converserName)
	{
		if (this._conversations[converserName] == null) return;
				
		if (this._activeConversation != null)
		{	
			this._activeConversation.saveSendText(this._sendDiv.value);
		}	
				
		this._activeConversation = this._conversations[converserName];
				
		this._bodyDiv.value = this._activeConversation.getBody();
		this._sendDiv.value = this._activeConversation.getSendText();
				
		this._onConversationActivate(converserName);
	},
	
	sendMessage:function ()
	{
		$.post("http://iain.homelinux.com:8000/data/send_message?" + "userfrom=" + this._myName + "&userto=" + this._activeConversation.getTarget() + "&message=" + this._sendDiv.value, {
                    
			},function(data){
				
				if (data == null ){
					alert('An error occured, please contact administrator.');
				} else {
                    if (data.status != "success"){
                        alert('Failed to send message. ' + data.status);
                    }
				}
			}
		);
	
		this._sendDiv.value = "";
		this._activeConversation.saveSendText("");
	}
}
