        manager = new ConversationManager("%USERNAME!!!","userChatBody","userMsgBody",
		function(targetName) {
			var tabBar = document.getElementById('TabBar');
			var newTab = document.createElement('li');
			var newDiv = document.createElement('a');
			var xButton = document.createElement('div');
			
			newTab.appendChild(newDiv);
			newTab.appendChild(xButton);
			
			newDiv.innerHTML = targetName;
			tabBar.insertBefore(newTab, tabBar.firstChild);
			xButton.className = "closeTabButton";
			newTab.ondblclick = function() { manager.deleteConversation(targetName);  document.getElementById("TabBar").removeChild(newTab);};
			newTab.onclick = function() { manager.activateConversation(targetName); };
		},
		function(targetName) {
			document.getElementById("buddy").style.display = '';
			document.getElementById("chat").style.display = 'none';
		},
		function(targetName) {
			document.getElementById("buddy").style.display = 'none';
			document.getElementById("chat").style.display = '';
			document.getElementById('ConvHeader').innerHTML = "Conversation with " + targetName;
		}
		);
