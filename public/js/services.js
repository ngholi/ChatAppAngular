var services = angular.module('services',['ngResource']);

services.factory('ChatUIRender', function(){
	var print2number = function(number){
		if(number<10)
			return '0' + number;
		return number;
	};

	var encodeStr = function(str){
		var encode = str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
		   return '&#'+i.charCodeAt(0)+';';
		});
		return encode.replace(/\n/g, '<br/>');
	};
	return {
		messageInWithContainer: function(data){
			return '<div class="left-chat user-chat"><img src="'+ 
					data.avatarUrl +
					'" class="img-rounded left"/><div class="messages left"><div class="direct-chat-text">' + 
					data.text + 
					'</div></div></div>';
		},
		messageOutWithContainer: function(data){
			return '<div class="right-chat user-chat"><img src="'+ 
					data.avatarUrl +
					'" class="img-rounded right"/><div class="messages right"><div class="direct-chat-text" time="'+ data.time +'">' + 
					data.text + 
					'</div></div></div>';
		},
		singleLine: function(timeInMillis){
			if(timeInMillis)
				var date = new Date(timeInMillis);
			else
				var date = new Date();
			let time = print2number(date.getHours()) + ':' + print2number(date.getMinutes()) + ' ' + print2number(date.getDate()) + '/' + print2number((date.getMonth()+1)) + '/' + date.getFullYear();
			return '<div class="chat-box-single-line"><span class="timestamp">' + 
					time + 
					'</span></div>';
		},
		messageOut: function(data){
			return '<div class="direct-chat-text" time="'+ data.time +'">' + data.text + '</div>';
		},
	};
});