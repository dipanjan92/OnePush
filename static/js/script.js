
var autocomplete_data = [];
var page_size = 25;
var current_page = 1;
var dataSource = [];


$(document).ready(function(){

	$(".clearSearch").on("click", function(){
    	$("#searchInput").val('');
    	goTo(1);
		$(".result-pagination").show();
	});//clear the search field

	$("#searchInput").keypress(function(e){
		if(e.which == 13){
			//do something
		}
	});//search on click of enter

//Push site information to API
	$("#addSite").on("click", function(){
		var site = {
            title : $("#title").val(),
            url : $("#url").val(),
            tag : $("#tag").val()
        };

        $.ajax({
            url: 'https://hackerearth.0x10.info/api/one-push?type=json&query=push',
            type: 'post',
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
      			alert(data.message);
      			if(data.status != 403){
      				getListItem();
      			}
            },
            error: function(data, textStatus, jqXHR){
            	alert("Something went wrong!");
            },
            data: site
        });
	});

	$("#select_length").on("change", function(){
		var selected = $(this).val();
		page_size = parseInt(selected);
		paginateList(dataSource);
		goTo(1);
	});


	var $loading = $('#loading-icon').hide();
	$(document)
	.ajaxStart(function () {
    	$loading.show();
  	})
  	.ajaxStop(function () {
    	$loading.hide();
  	});

	getListItem();
});

//Get site information from the API
function getListItem(){
	var url = "https://hackerearth.0x10.info/api/one-push?type=json&query=list_websites";

	$.ajax({
  			dataType: 'json',
  			url: url,
  			type: "GET",
  			success: function(data, textStatus, jqXHR){
				
				$(".site-result").html("");

				dataSource = data.websites;
				
				initAutoComplete(dataSource);

				createList(dataSource);

				$("#searchAlert").text("We have found "+ dataSource.length +" personal web portfolio");

				paginateList(dataSource);
				
  			},
  			error: function(){
  				$(".site-result").html("");
				var list_html = '<li class="list-group-item">No web portfolio found!</li>';
				$(".site-result").append(list_html);
  			} 
	});
}

function createList(resultList){
	if(resultList.length > 0){

		var counter = 0;

		$.each(resultList, function(key, value){
			counter++;
			
			var id = (value.id == null) ? "" : value.id;
			var title = (value.title == null) ? "" : value.title;
			var fav_img = (value.favicon_image == null) ? "" :  value.favicon_image ;
			var url = (value.url_address == null) ? "" :  value.url_address;
			var tag = (value.tag == null) ? "" : value.tag;

			var list_html = '<li class="list-group-item" id="li-'+counter+'" data-id="'+id+'"><div class="media"><div class="media-left"><a href="#">';
			list_html += '<img class="media-object" src="'+fav_img+'" alt="'+title+'"></a></div>';
			list_html += '<div class="media-body"><div class="list-row-1"><a href="'+url;
			list_html += '" target="_blank" title="This link will open in a new window" class="list-link">'+title;
			list_html += '</a></div><div class="list-row-2"><label class="list-details"><i class="fa fa-tag li-icon"></i>'+tag;
			list_html += '<span class="list-bar">|</span><i class="fa fa-link li-icon"></i><a href="'+url+'" target="_blank" title="This link will open in a new window">'+url;
			list_html += '</a></label></div></div></div></li>';
			$(".site-result").append(list_html);
		});
	}
	else{			
		$(".site-result").html("");
		var list_html = '<li class="list-group-item">No web portfolio found!</li>';
		$(".site-result").append(list_html);
	}
}

function initAutoComplete(data){
	$.each(data, function(key, value){
			var title = (value.title == null) ? "" : value.title;
			var url = (value.url_address == null) ? "" :  value.url_address;
			var tag = (value.tag == null) ? "" : value.tag;

			var item = null;
			if(title !== "" && autocomplete_data.indexOf(title)==-1){
			autocomplete_data.push(title);		
			}
			if(url !== "" && autocomplete_data.indexOf(url)==-1){
			autocomplete_data.push(url);		
			}
			if(tag !== "" && autocomplete_data.indexOf(tag)==-1){
			autocomplete_data.push(tag);
			}
			
		});
}

function paginateList(data){
	var page_nos = Math.ceil(data.length / page_size);
	var page_html = '';
	if(page_nos >= 5){
		page_html = '<div class="btn-group" role="group" aria-label="...">';
		page_html += '<button type="button" class="btn btn-default" onclick="goTo(1)">1</button>';
		page_html += '<button type="button" class="btn btn-default" onclick="goTo(2)">2</button>';
		page_html += '<button type="button" class="btn btn-default" onclick="switchTo()">..</button>';
		page_html += '<button type="button" class="btn btn-default" onclick="goTo('+String(page_nos - 1)+')">'+String(page_nos - 1)+'</button>';
		page_html += '<button type="button" class="btn btn-default" onclick="goTo('+page_nos+')">'+page_nos+'</button>';
		page_html += '</div>';
		$("#jump-to").append('<label>Jump to page <select id="jump-to-select"></select></label>');
		for (i = 1; i <= page_nos; i++) { 
    		var options = '<option value="'+i+'">'+i+'</option>';
    		$("#jump-to-select").append(options);
		}
		
	}
	else{
		page_html = '<div class="btn-group" role="group" aria-label="...">';
		for (i = 1; i <= page_nos; i++) { 
    		page_html += '<button type="button" class="btn btn-default" onclick="goTo('+i+')">'+i+'</button>';
		}
		page_html += '</div>';
		
	}
	$(".site-result li").hide();
	for(i=1; i<= page_size; i++){
		var _id = String("#li-"+i);
		$(_id).show();
	}
	$(".result-pagination").html("");
	$(".result-pagination").append(page_html);
}


function goTo(pagin){
	$(".site-result li").hide();
	var page_no = parseInt(pagin);
	var end = page_no * page_size;
	var start = (end - page_size) + 1;
	for(i=start; i<= end; i++){
		var _id = String("#li-"+i);
		$(_id).show();
	}
}

function filterResults(obj, term){
	var results = [];
	for (var i=0 ; i < obj.length ; i++)
	{
    	if (obj[i].title == term || obj[i].url_address == term || obj[i].tag == term) {
        	results.push(obj[i].id);
    	}
	}
	
	for(var j=0; j< results.length; j++){
		var _selector = String('li[data-id="'+results[j]+'"]');
		$(_selector).show();
	}

}

var dialog;

function switchTo(){
	dialog.dialog( "open" );
}


$( function() {
 
    $( "#searchInput" ).autocomplete({
      source: autocomplete_data,
      minLength: 2,
      select: function( event, ui ) {
		$(".site-result li").hide();
		$(".result-pagination").hide();
		filterResults(dataSource, ui.item.value);
      }
    });

    dialog = $( "#jump-to" ).dialog({
      autoOpen: false,
      resizable: false,
      height: "auto",
      width: "auto",
      modal: true
    });

    $("ui-button-icon.ui-icon.ui-icon-closethick").remove();

    $('.ui-dialog-titlebar-close').addClass("ui-button-icon ui-icon ui-icon-closethick");

  } );



