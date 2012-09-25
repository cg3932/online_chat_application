/*
 *@author Farzad Towhidi
 *@param user json object user
 */
function UserOptions(username){
	var self = this;
	this.username = username;
	
	var contentCenter = document.getElementById("contentCenterUser");
    // var contentCenter = document.getElementById("useropts");
	
	var welcomeMsg = document.createElement("h3");
	welcomeMsg.textContent = "Welcome "+this.username+"!";
	contentCenter.appendChild(welcomeMsg);
	
	var horizontalRule = document.createElement("div");
	horizontalRule.className = "horizontalRule";
	contentCenter.appendChild(horizontalRule);
	
	this.br = document.createElement("br");
	contentCenter.appendChild(this.br);
	
	var userContainer = document.createElement("div");
	userContainer.className = "userContainer";
	
	//TODO: get the user icon from database later on
	var userIcon = document.createElement("div");
	userIcon.className = "userIcon";
	userContainer.appendChild(userIcon);
	
	var userOptions = document.createElement("div");
	userOptions.className = "userOptions";
	
	self.createBtns(userOptions);
	userContainer.appendChild(userOptions);
	
	contentCenter.appendChild(userContainer);
	contentCenter.appendChild(this.br);

	var buddyList = BuddyList();
	contentCenter.appendChild(buddyList);
    post_to_getbuddies();
    //var buddyList = document.getElementsByClassName("buddyentry");
    var i;
    var j;
    /* for (i = 0; i < buddyList.length; i++){
        buddyList[i].id = buddyList[i].innerText;
        // create confirm buttons here?
        thing = document.createElement("td");
        thing2 = document.createTextNode("test");
        thing.appendChild(thing2);
        buddyList[i].appendChild(thing); 
    } */
}
UserOptions.prototype = {
	createBtns:function(parent){
		var self = this;
		/* OLD DESIGN 
		var addBtnContainer = document.createElement("div");
		addBtnContainer.className = "addBtnContainer";
		
		var addBtnImage = document.createElement("p");
		addBtnImage.className = "addBtnImage";
		
		addBtnImage.addEventListener("click",function(){self.onAddBtnClick();},false);
		
		addBtnContainer.appendChild(addBtnImage);*/
		
		var txtBox = document.createElement("input");
		txtBox.id = "status-box";
		txtBox.name = "q";
		txtBox.className = "input";
		txtBox.type = "text";
		txtBox.onblur = function(){if(txtBox.value == ''){this.value='Enter Buddy Name';}}
		txtBox.onfocus = function(){if(txtBox.value == 'Enter Buddy Name'){this.value = '';}}
		txtBox.defaultValue = 'Enter Buddy Name';
		
		parent.appendChild(txtBox);
		parent.appendChild(this.br);
		
		/* Add Buddy Button*/
		
		var addBtnImage = document.createElement("div");
		addBtnImage.className = "addUserImg";
		parent.appendChild(addBtnImage);
		
		var addBtnContainer = document.createElement("div");
		addBtnContainer.className = "addUserTxt";
		addBtnContainer.textContent = "Add Buddy";
		addBtnContainer.addEventListener("click",function(){self.onAddBtnClick(txtBox.value);},false);
		addBtnImage.addEventListener("click",function(){self.onAddBtnClick(txtBox.value);},false);
		parent.appendChild(addBtnContainer);
		
		
		/* Delete Buddy Button */
		var delBtnImage = document.createElement("div");
		delBtnImage.className = "deleteUserImg";
		parent.appendChild(delBtnImage);
		
		var delBtnContainer = document.createElement("div");
		delBtnContainer.className = "addUserTxt";
		delBtnContainer.textContent = "Delete Buddy";
		delBtnContainer.addEventListener("click",function(){self.onDelBtnClick(txtBox.value);},false);
		delBtnImage.addEventListener("click",function(){self.onDelBtnClick(txtBox.value);},false);
		parent.appendChild(delBtnContainer);
		
		var spacer = document.createElement("div");
		spacer.className = "spacer";
		parent.appendChild(spacer);
		
		/* Random Chat Implementation */
		
				var usrname = $('#username').val();
		manager = new ConversationManager(usrname,"userChatBody","userMsgBody",
		function(targetName, isChatRoom) {
			var tabBar = document.getElementById('TabBar');
			var newTab = document.createElement('li');
			var newDiv = document.createElement('a');
			var xButton = document.createElement('div');
			
			newTab.appendChild(newDiv);
			newTab.appendChild(xButton);
			
			newDiv.innerHTML = targetName;
			tabBar.insertBefore(newTab, tabBar.firstChild);
			xButton.className = "closeTabButton";
			xButton.onclick = function() { manager.deleteConversation(targetName, isChatRoom); document.getElementById("TabBar").removeChild(newTab);};
			newTab.onclick = function() { manager.activateConversation(targetName, isChatRoom); };
		},
		function(targetName, isChatRoom) {
			document.getElementById("buddy").style.display = '';
			document.getElementById("chat").style.display = 'none';
		},
		function(targetName, isChatRoom) {
			document.getElementById("buddy").style.display = 'none';
			document.getElementById("chat").style.display = '';
			if (isChatRoom) document.getElementById('ConvHeader').innerHTML = "Chat Room: " + targetName;
			else document.getElementById('ConvHeader').innerHTML = "Conversation with " + targetName;
		}
		);
		randomChat = new RandomConversationManager(usrname,manager);
		
		/* Random Chat Button Button */
		var randBtnImage = document.createElement("div");
		randBtnImage.className = "randChatImg";
		parent.appendChild(randBtnImage);
		
		var randBtnContainer = document.createElement("div");
		randBtnContainer.className = "randChatTxt";
		randBtnContainer.textContent = "Random Chat";
		randBtnContainer.addEventListener("click",function(){randomChat.startRandomChat();},false);
		randBtnImage.addEventListener("click",function(){randomChat.startRandomChat();},false);
		parent.appendChild(randBtnContainer);
	},
    onAddBtnClick:function(buddyName){
		//var buddyName = prompt("Enter the name of your buddy you wish to add");
		//TODO: create a new window which will be used to add buddy
		addBuddy(buddyName);
	},
	onDelBtnClick:function(buddyName){
		//var buddyName = prompt("Enter the name of your buddy you wish to delete");
		//TODO: check if the buddy exists and delete him
        delBuddy(buddyName);
		var buddies = document.getElementsByClassName("buddyContainer");
		var buddy, tableRow, table;
		for(var i=0; i<buddies.length;i++){
			buddy = buddies.item(i);
			if(buddy.textContent == buddyName){
				tableRow = buddy.parentNode.parentNode;
				table = tableRow.parentNode;
				$(buddy).fadeOut();
				setTimeout(function() {table.removeChild(tableRow);},500);
				break;
			}
		}
		
	}
}
