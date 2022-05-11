var n = 1;
var $li = $('ul.tab-title li');
var checkbill_close = 0 ; //0 means current_state is close
$(function(){
	$($li. eq(2) .addClass('active').find('a').attr('href')).siblings('.tab-inner').hide();
	/*$li.click(function(){
		$($li. eq(n) .find('a'). attr ('href')).show().siblings ('.tab-inner').hide();
		$li. eq(n) .addClass('active'). siblings ('.active').removeClass('active');
		
		n++;
		if(n>2){
			n=0;
		}
	
	});*/
});
	

function change_page(page_number){
	var container = document.getElementById("__Page__menu__container");
	if(page_number==0 |page_number==1 |page_number==3 |page_number==4){
		container.style.display = "flex";
	}else{
		container.style.display = "none";
	}
	$($li. eq(page_number) .find('a'). attr ('href')).show().siblings ('.tab-inner').hide();
	$li. eq(page_number) .addClass('active'). siblings ('.active').removeClass('active');
	menu_openorclose(1);
	
}


var price = 100;
function add_checkbox(){
	var container = document.getElementById("__Page6__bill__container");
	
	var checkboxs = document.createElement("input");
	checkboxs.type = "checkbox";
	checkboxs.id = "__Page6__bill_content";
	checkboxs.onclick = function(){
	 //you want event
	/* checkboxs.color="black"*/
	}
	
	// initialize
	var label = document.createElement("label");
	label.id = "delete_id";
	label.classList.add("__Page6__bill_check");
	
	
	var br = document.createElement("br");
	
	container.appendChild(label);
	label.appendChild(checkboxs);
	label.appendChild(document.createTextNode("4/31 COCO"+price));
	label.appendChild(br);
	price++;

}

function add_checkbox2(){
	var container = document.getElementById("__Page6__bill__container");
	
	var checkboxs = document.createElement("div");
	checkboxs.id = "__Page6__bill_content2 " + price;
	checkboxs.classList.add("__Page6__bill_content2");
	

	
	// initialize
	var label = document.createElement("label");
	label.id = "delete_id";
	label.classList.add("__Page6__bill_check");
	label.onclick = function() {
		change_checkbox_color(this.firstChild.id);
	};

	var br = document.createElement("br");
	
	container.appendChild(label);
	label.appendChild(checkboxs);
	label.appendChild(document.createTextNode("4/31 COCO"+price));
	label.appendChild(br);
	price++;
}


function change_checkbox_color(this_id){
	/*console.log(document.getElementById(this_id).style.backgroundColor);*/
	if (document.getElementById(this_id).style.backgroundColor == 'rgb(107, 220, 255)') {
        document.getElementById(this_id).style.backgroundColor = '#FFFFFF';
    }else{
		document.getElementById(this_id).style.backgroundColor = '#6BDCFF';
	}
}

function lock_checkbox(){
	/*console.log(document.getElementById(this_id).style.backgroundColor);*/
	if (document.getElementById(this_id).style.backgroundColor == 'rgb(107, 220, 255)') {
        document.getElementById(this_id).style.backgroundColor = '#FFFFFF';
    }else{
		document.getElementById(this_id).style.backgroundColor = '#6BDCFF';
	}
}

function add_person(){
	var container = document.getElementById("__Page16__teammate__container");
	var label = document.createElement("label");
	label.id = "delete_id";
	label.classList.add("__Page16__teammatename");
　　var img = document.createElement("img");
　　img.classList.add("__Page16__userimg");
　　img.src = "./icon/team2.png";
	container.appendChild(label);
	label.appendChild(img);
	label.appendChild(document.createTextNode("BRYAN"));

}	

function add_notification(){
	var container = document.getElementById("__Page7__inform__container");
	var label = document.createElement("label");
	label.id = "delete_id";
	label.classList.add("__Page7__inform");
	var br = document.createElement('br');
	container.appendChild(label);
	label.appendChild(document.createTextNode("5/13 啟賢新增了水費項目"));
	label.appendChild(br);

}	

function delete_checkbox(){
	var delete_item = document.getElementById("delete_id");
	var inputParent = delete_item.parentNode;
    inputParent.removeChild(delete_item);
}	

function yes_checkbill(n){ // n=1 means change to 催帳 page,0 means restore the page ,2 means change to 梗圖 page
	var text_content = document.getElementById("__Page18__bill_word");
	var check_bar = document.getElementById("__Page18__result__container");
	var check_bar2 = document.getElementById("__Page18__result2__container");
	var check_bar3 = document.getElementById("__Page18__result3__container");
	var funnypicture = document.getElementById("__Page18__result3-2__container");
	var bill__container = document.getElementById("__Page18__bill__container");
	var personcheck__container = document.getElementById("__Page18__personcheck__container");
	
	if(n==1){
		var check_text = "分帳給付狀況";
		check_bar.style.display = "none";
		check_bar2.style.display = "flex";
		check_bar3.style.display = "none";
		funnypicture.style.display = "none";
	}else if(n==0){
		var check_text = "分帳結果";
		check_bar.style.display = "flex";
		check_bar2.style.display = "none";
		check_bar3.style.display = "none";
		funnypicture.style.display = "none";
		bill__container.style.display = "flex";
		personcheck__container.style.display = "block";
	}else if(n==2){
		var check_text = "催帳";
		check_bar.style.display = "none";
		check_bar2.style.display = "none";
		check_bar3.style.display = "flex";
		funnypicture.style.display = "flex";
		bill__container.style.display = "none";
		personcheck__container.style.display = "none";
	}
	text_content.innerHTML=check_text;
}

function update_checkbill(){
	var check_text = "等待確認<br>請核對你的帳目是否正確<br>(APP會跳通知給所有成員，點選進入APP確認)";
	var text_content = document.getElementById("__Page18__bill_word");
	var check_bar = document.getElementById("__Page18__result__container");
	text_content.innerHTML=check_text;
	check_bar.style.display = "flex";
}

function menu_openorclose(choose){ /*if mouse touchs the home star,the star will light and show it's name*/
	var __Page__menu__bar = document.getElementById('__Page__menu__bar'); 	
	checkbill_close=1;
	checkbill_openorclose();
	if(choose==0){ //0 means open menu 1 means close menu
		__Page__menu__bar.style.transform = "translate(70vw ,0)";
	}else{__Page__menu__bar.style.transform = "translate(0 ,0)";}
}

function checkbill_openorclose(){ /*if mouse touchs the home star,the star will light and show it's name*/
	var __Page7__bottomimg = document.getElementById('__Page7__bottomimg');
	var __Page7__bottomimg2 = document.getElementById('__Page7__bottomimg2');
	var __Page7__bottomimg3 = document.getElementById('__Page7__bottomimg3');  
	if(checkbill_close==0){ //0 means open menu 1 means close menu
		__Page7__bottomimg.style.transform = "rotate(90deg)";
		__Page7__bottomimg2.style.transform = "translate(-8vh ,-8vh)";
		__Page7__bottomimg3.style.transform = "translate(8vh ,-8vh)";
		
		checkbill_close=1;
	}else{
		__Page7__bottomimg.style.transform = "rotate(0deg)";
		__Page7__bottomimg2.style.transform = "translate(0 ,0)";
		__Page7__bottomimg3.style.transform = "translate(0 ,0)";
		checkbill_close=0;
 }
}