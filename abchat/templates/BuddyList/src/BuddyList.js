function BuddyList(){
	var self = this;
	
	var myBudBtn = document.createElement("div");
	myBudBtn.className = "slide";
	
	var myBudBtnName = document.createElement("a");
	myBudBtnName.className = "btn-slide";
	myBudBtnName.setAttribute("href","#");
	myBudBtnName.textContent = "My Buddies";
	
	myBudBtn.appendChild(myBudBtnName);
	
	var addBudContainer = document.createElement("div");
	addBudContainer.id = "addBudContainer";
	
	var addBudBtn = document.createElement("span");
	addBudBtn.className = "addBud";
	
	var addBudBtnName = document.createElement("a");
	addBudBtnName.className = "btn-addBud";
	addBudBtnName.setAttribute("href","#");
	
	addBudBtn.appendChild(addBudBtnName);
	
	var addBudTxt = document.createElement("input");
	addBudTxt.id="addBudTxt";
	addBudTxt.type="text";
	addBudTxt.defaultValue="Enter buddy name";
	//txt box effects	
	addBudTxt.onfocus = function(){if(addBudTxt.value==addBudTxt.defaultValue) addBudTxt.value='';};
	addBudTxt.onblur= function(){if(addBudTxt.value=='') addBudTxt.value=addBudTxt.defaultValue;};
	
	addBudContainer.appendChild(addBudBtn);
	addBudContainer.appendChild(addBudTxt);
	
	var list = document.createElement("div");
	list.id = "buddyList";
	list.appendChild(addBudContainer);
	
	$(myBudBtnName).click(function(){onClick(list);});
	var budContainer = document.getElementById("buddyListContainer");
	budContainer.appendChild(list);
	budContainer.appendChild(myBudBtn);
}
BuddyList.prototype = {
	
}
function onClick(bList){
	if($(bList).is(":hidden")){
		$(bList).slideDown("fast");
	}
	else{
		$(bList).slideUp("fast");
	}
}