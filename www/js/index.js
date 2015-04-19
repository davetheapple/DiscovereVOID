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
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    }
};

$(document).ready(function() {
	var $q = $('input[name="query"]');
	
	$('#search').on('click', function() {
		console.log($q.css('width'));
		if(parseFloat($q.css('width')) <= 0) {
			$q.css({width: '55%', opacity: '.85'});
		} else if(parseFloat($q.css('width')) >= 0 && !$q.is(':focus')) {
			$q.css({width: '0', opacity: '0'});
		}
	});
	
	$('#content').on('click', '.cell', function() {
		var $name = $(this).children('h2').text();
		var $tags = $(this).children('p').text();
		var $imgurl = $(this).children('img').attr('src');
		console.debug($(this).children('img'));
		var $html = "<div id='header'><h2>"+$name+"</h2><p>"+$tags+"</p></div>"
		//$('#content').html($html); /*
		// swipe out old view
		$('#content').hide("slide", { direction: "left" }, 500, function() {		
			$('#content').html($html); // insert new one
			$('#content').css({'margin-left': '0', 'margin-right': '0'});
			$('#header').css({
				  'background-image': "url('"+$imgurl+"')"
			});
		}); 
		// slide in new view
		$('#content').show("slide", { direction: "right" }, 500, function() {});
		
	});
	
	$('#search').keypress(function( event ) {
		if ( event.which == 13 ) {
			event.preventDefault();
			$q.blur();
			
			$('#content').html('');
			var query = $q.val();
			var url = 	"http://developer.echonest.com/api/v4/artist/search?api_key=" +
						"DW2FLRWMOF77QF6S8" +
						"&format=json" +
						"&name=" + query +
						"&results=1" +
						"&bucket=images" +
						"&bucket=genre";
						
			var similarUrl = 	"http://developer.echonest.com/api/v4/artist/similar?api_key=" +
								"DW2FLRWMOF77QF6S8" +
								"&format=json" +
								"&name=" + query +
								"&results=7" +
								"&bucket=images" +
								"&bucket=genre";
			
			var $artists;
			$.get(url, function(data, status) {
			
				/*
					v Object
						v response: Object
							v artists: Array[1]
								v 0: Object
								> genres: Array[2]
								  id: "ARV3CRH1187B9A1B21"
								> images: Array[15]
								  name: "Green Day"
				*/
				
				console.debug(data);
				$artists = data.response.artists;
				var imageUrl = $artists[0].images[0].url;
				
				var tags = "<p>";
				$($artists[0].genres).each(function(index, value){
					tags += "#"+value.name+" ";
				});
				tags += "</p>";
				
				var name = "<h2 id='name'>"+$artists[0].name+"</h2>";
				var img = "<img style='display: none;' src='"+imageUrl+"' />";
				var cell = "<div class='cell' id='art0'>"+name+tags+img+"</div>";
				
				$('#content').append(cell);
				var r = Math.floor((Math.random()*3) + 1);
				$('#art0').css({
					'background-image': 'url(img/placeholder'+r+'.jpg)'
				});
				$('#art0').slideDown("slow");
				
				$.get(similarUrl, function(data2, status2) {
					$artists = data2.response.artists;
					console.debug($artists);
					for(var index = 0; index < $artists.length; index++) {
						var imageUrl = $artists[index].images[index].url;
						
						var tags = "<p>";
						$($artists[index].genres).each(function(index, value){
							tags += "#"+value.name+" ";
						});
						tags += "</p>";
						
						var name = "<h2 id='name'>"+$artists[index].name+"</h2>";
						var img = "<img style='display: none;' src='"+imageUrl+"' />";
						var cell = "<div class='cell' id='art"+(index+1)+"'>"+name+tags+img+"</div>";
						
						$('#content').append(cell);
						
						var r = Math.floor((Math.random()*3) + 1);
						$('#art'+(index+1)).css({
							'background-image': 'url(img/placeholder'+r+'.jpg)'
						});
						$('#art'+(index+1)).slideDown("slow");
					}
					window.plugins.toast.show('(ﾉ≧∀≦)ﾉ Success!', 'long', 'bottom', 
											function(a){console.log('toast success: ' + a)}, 
											function(b){alert('toast error: ' + b)})
				});
				
				
			});// end of get
			
			
			
		}
	});
});















