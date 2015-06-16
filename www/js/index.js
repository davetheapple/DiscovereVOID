/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        document.addEventListener("backbutton", onBackKeyDown, false);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    }
};

function onBackKeyDown(evt) {
	evt.preventDefault();
	evt.stopPropagation();
	if($('.section').data('section').val() == "profile") {
		$('#content').html('');
	}
}

var start = true;
function loading() {
	$( "#dot" ).animate({"margin-left": "100%"}, 2000, function(){
		$(this).css("margin-left", "-3px");
		console.log("start is " + start);
		if(start) {
			loading();
		}
	});
}

$(document).ready(function() {
	
	var $q = $('input[name="query"]');
	var in_artist = false;
	var section = "home";

	$('#content').on('click', '.cell', displayArtistProfile);
	$('#search').keypress(getSimilar); 

	function displayArtistProfile() {
	
		$('.cell').animate({left: '-400px', opacity: '0'}, 500, function(){}).queue(function(){
		
		var $name = $(this).children('h2').text();
			var $tags = $(this).children('p').text();
			var bg = $(this).css('background-image');
			bg = bg.replace('url(','').replace(')','');
			
			var $html = "<div id='header'><span class='section' data-section='"+section+"'></span><h2>"+$name+"</h2><p>"+$tags+"</p></div>"
			$('#content').html($html);
			$('#header').css({
				  'background-image': "url('"+bg+"')"
			});
			in_artist = true;
			var client_id = "9efa09e998c48f23a554e02042d84a91";
			
			var jsonSC;
			var songs = "";
			var urlSC = "http://api.soundcloud.com/search?client_id="+client_id+"&q="+$name;
			$.get(urlSC, function(data, status) {
				
				jsonSC = data.collection;
				console.debug(data);
				songs = "<iframe width='100%' height='166' scrolling='no' frameborder='no' src='https://w.soundcloud.com/player/?url="+jsonSC[0].uri+"&color=0066cc'></iframe>";
				$('#content').append(songs);
				
			});
			});
	}
	
	function getSimilar( event ) {
		var $q = $('input[name="query"]');
		if ( event.which == 13 ) {
			event.preventDefault();
			start = true;
			loading();
			$q.blur();
			in_artist = false;
			url = "http://franciscompany.org/process_image/process.php?delete=true";
			$.get(url, function(d) {});
			
			$('#content').html('');
			
			var query = $q.val();
			var url = 	"http://developer.echonest.com/api/v4/artist/search?api_key=" +
						"DW2FLRWMOF77QF6S8" +
						"&format=json" +
						"&name=" + query +
						"&results=1" +
						"&bucket=images" +
						"&bucket=genre";
			
			var $artists;
			$.get(url, getArtist);
			
		}
	}
	
	function getArtist(data, status) {
		var query = $('input[name="query"]').val();
		$artists = data.response.artists;
		var similarUrl = 	"http://developer.echonest.com/api/v4/artist/similar?api_key=" +
							"DW2FLRWMOF77QF6S8" +
							"&format=json" +
							"&name=" + query +
							"&results=10" +
							"&bucket=images" +
							"&bucket=genre";
		
		for(var index = 0; index < $artists.length; index++) {
			//var imageUrl = $artists[index].images[0].url;
			var id = 'art'+($artists.length > 1 ? index+1 : 0);
			
			var tags = "<p>"+$artists[index].genres[0].name+"</p>";
			//$($artists[index].genres).each(function(index, value){
			//	tags += "#"+value.name+" ";
			//});
			//tags += "</p>";
			
			var name = "<h2 id='name'>"+$artists[index].name+"</h2>";
			/*<a href="./page1" class="animsition-link">animsition link 1</a>*/
			var cell = "<div class='cell' id='"+id+"'>"+name+tags+"</div>";
			
			$('#content').append(cell);
			
			var default_img = 'img/placeholder' + Math.floor((Math.random()*3) + 1) + '.jpg';
			$('#'+id).css('background-image', 'url('+default_img+')');
			
			//fetchImage(id, $artists[index].images, 0);
			var img = $artists[index].images[0].url;
			$('#'+id).css('background-image', 'url('+img+')');
			$('.cell').css({height: '70px', opacity: '0.9'});

		}
		if($artists.length == 1) { 
			$.get(similarUrl, getArtist); 
		}
		if($artists.length > 1) start = false;
		window.plugins.toast.show('(ﾉ≧∀≦)ﾉ Success!', 'long', 'bottom');
				
	}
	
	function fetchImage(id, imagelist, attempt) {
		var imgUrl = imagelist[attempt].url;
		var request;
		  request = $.ajax({
		    type: "HEAD",
		    url: imgUrl,
		    success: function () {
		      console.log("Size is " + request.getResponseHeader("Content-Length"));
		    }
		  });
	/*
		imgUrl = imagelist[attempt].url
		var default_img;
		var url = "http://franciscompany.org/process_image/process.php";
		$.ajax({
			type: 'GET',
			dataType: 'text',
			url: url,
			data: {image: imgUrl},
			success:function(data){
				console.log("data: "+data);
				console.debug(data);
				default_img = "http://franciscompany.org/process_image/images/" + data;
				$('#'+id).css('background-image', 'url('+default_img+')');
			},
			error: function(e) {
				if(attempt < 5) {
					fetchImage(id, imagelist, attempt+1);
				} else {
					default_img = 'img/placeholder' + Math.floor((Math.random()*3) + 1) + '.jpg';
					$('#'+id).css('background-image', 'url('+default_img+')');
				} 
			}
		});
		*/
	}


});















