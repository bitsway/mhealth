
//online
var apipath="http://eapps001.cloudapp.net/smart_doctor/";
var imgPath="http://eapps001.cloudapp.net/smart_doctor/";

//local
//var apipath="http://127.0.0.1:8000/smart_doctor/";
//var imgPath="http://127.0.0.1:8000/smart_doctor/static/doc_image/";


var url =''
var latitude="";
var longitude="";

function getLocationInfoAch() {	
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError);		
	$(".errorChk").html("Confirming location. Please wait.");
}
// onSuccess Geolocation
function onSuccess(position) {
	$("#q_lat").val(position.coords.latitude);
	$("#q_long").val(position.coords.longitude);
	$(".errorChk").html("Location Confirmed");
}
// onError Callback receives a PositionError object
function onError(error) {
   $("#q_lat").val(0);
   $("#q_long").val(0);
   $(".errorChk").html("Failed to Confirmed Location.");
}

function replace_special_char(string_value){
	var real_value=string_value.replace(/\)/g,'').replace(/\(/g,'').replace(/\$/g,'').replace(/\{/g,'').replace(/\}/g,'').replace(/\[/g,'').replace(/\]/g,'').replace(/\"/g,'').replace(/\'/g,"").replace(/\>/g,'').replace(/\</g,'').replace(/\%/g,'').replace(/\&/g,'').replace(/\#/g,'').replace(/\@/g,'').replace(/\|/g,'').replace(/\//g,"").replace(/\\/g,'').replace(/\~/g,'').replace(/\!/g,'').replace(/\;/g,'');
	return real_value;
}

// -------------

$(document).ready(function(){
		
		$("#btn_reg").show();
		$("#h_user_name").hide();
		
		$("#wait_image_login").hide();
		$("#loginButton").show();		
		
		$("#q_lat").val("");
		$("#q_long").val("");
		
		$("#wait_image_doctor_search").hide();
		$("#wait_image_doctor_list").hide();
		$("#wait_image_doctor_chamber").hide();
		$("#wait_image_profile").hide();	
		$("#btn_profile_update").show();
		$("#btn_sync_location").show();
		
		$(".specialty_show").text("");
		
		
		$(".district_show").text("");
		$("#doctor_area_district").val("");
		
		$(".doctor_name_show").text("");
		$(".doctor_id_show").text("");
		
		//alert(localStorage.synced)
		// -------------- If Not synced, Show login
		/*if ((localStorage.synced!='YES')){	
			$("#user_id").val("")
			$("#user_pass").val("")
			$("#user_name").val("");
			$("#user_address").val("");
		
				
			url = "#login";		
		}else{*/
			//alert(localStorage.user_name);
			
			
			
			//----------------- last three
			
			//$("#error_home_page").text(apipath+'syncmobile_patient/check_doc_apoinment?patient_mobile='+localStorage.user_mobile);
			
			
			
			if (localStorage.user_mobile==undefined){
				url = "#pageHome";
			
			}else{
				
				$("#h_user_name").show();
				$("#btn_reg").hide();
				
				$("#user_id").val(localStorage.user_id)
				$("#user_pass").val(localStorage.user_pass)
				$("#user_name").val(localStorage.user_name);
				$("#h_user_name").text(localStorage.user_name);
				$("#user_address").val(localStorage.user_address);
				
								
				$.ajax({
					 type: 'POST',
					 url: apipath+'syncmobile_patient/check_doc_apoinment?patient_mobile='+localStorage.user_mobile,
					 success: function(result) {
						
						var doctorList = result.split('<rd>');
						var doctorListLength=doctorList.length
						
						var doctor_cmb_list=''			
						for (var i=0; i < doctorListLength; i++){
							var doctorListArray = doctorList[i].split('<fd>');
							var doctorID=doctorListArray[0];
							var doctorName=doctorListArray[1];
							var showSpecialty=doctorListArray[2];
							if (doctorID!=''){
								doctor_cmb_list+='<li style="border-bottom-style:solid;border-color:#CBE4E4;border-bottom-width:thin; padding:10px 5px;"><a style="height:auto;" onClick="doctorListNextLV(\''+doctorName+'-'+doctorID+'\')">'+doctorName+'-'+doctorID+'</li>';
							}
						}
						
						$(".specialty_show").text(showSpecialty);
						//$(".district_show").text(districtAreaName);
								
						$("#patient_doctor_cmb_id_lv").append(doctor_cmb_list);
						
						
					 }
				});			
				
				url = "#pageHome";	
			}
			
				
			
		/*}*/
		
		$.mobile.navigate(url);
		
	});



function get_login() {
	url = "#login";
	$.mobile.navigate(url);
	}


function menuClick(){
	location.reload();
	/*if (localStorage.synced!='YES'){	
			$("#user_id").val("")
			$("#user_pass").val("")
			$("#user_name").val("");
			$("#user_address").val("");	
				
			url = "#login";
	}else{
		url = "#pageHome";		
	}*/
	url = "#pageHome";	
	$.mobile.navigate(url);	
	
}

function goBackPage(){
	$.mobile.back();
	
	var doctor_location_cmb_list=localStorage.districtCombo_list;
	//alert(doctor_location_cmb_list)
	//---	
	var doctor_location_cmb_ob=$('#doctor_location_cmb_id_lv');
	doctor_location_cmb_ob.empty()
	doctor_location_cmb_ob.append(doctor_location_cmb_list).trigger('create');
	
	
	if (localStorage.lastAreaDistName==undefined ){
		$("#doctor_location_cmb_id").val('DHAKA');		
	}else{
		$("#doctor_location_cmb_id").val(localStorage.lastAreaDistName);
	}	
	doctor_location_cmb_ob.listview("refresh");
}


//========================= Longin: Check user
function check_user() {
	var mobile_no=$("#mobile_no").val();
	var user_pass=$("#user_pass").val();
	
	var user_name=$("#user_name").val();
	user_name=replace_special_char(user_name)
	
	//var user_address=$("#user_address").val();
	//user_address=replace_special_char(user_address)
	
	var base_url='';
	var photo_url='';
	
	//-----
	if (mobile_no=="" || mobile_no==undefined || user_pass=="" || user_pass==undefined || user_name=="" || user_name==undefined){
		$("#error_login").html("Required Member ID, PIN and Name");	
	}else{
			localStorage.synced='NO'
			$("#wait_image_login").show();
			$("#loginButton").hide();
			$("#error_home_page").html("")
			
			//-----------------
			//alert(apipath+'syncmobile_patient/check_user?mobile_no='+mobile_no+'&password='+encodeURIComponent(user_pass)+'&patient_name='+encodeURIComponent(user_name)+'&sync_code='+localStorage.sync_code);
			
			$.ajax({
					 type: 'POST',
					 url: apipath+'syncmobile_patient/check_user?mobile_no='+mobile_no+'&password='+encodeURIComponent(user_pass)+'&patient_name='+encodeURIComponent(user_name)+'&sync_code='+localStorage.sync_code,
					 success: function(result) {											
							if (result==''){
								$("#wait_image_login").hide();
								$("#loginButton").show();
								$("#error_login").html('Network timeout. Please ensure you have active internet connection.');
								
							}else{
								syncResult=result
																
								var syncResultArray = syncResult.split('<SYNCDATA>');
								//alert (syncResultArray[0]);
								if (syncResultArray[0]=='FAILED'){						
									$("#error_login").html(syncResultArray[1]);
									$("#wait_image_login").hide();
									$("#loginButton").show();
								}else if (syncResultArray[0]=='SUCCESS'){
									
									localStorage.synced='YES';		
									//localStorage.user_id=user_id;
									localStorage.user_pass=user_pass
									localStorage.user_name=user_name
									//localStorage.user_address=user_address
									
									localStorage.sync_code=syncResultArray[1];
									localStorage.locationStr=syncResultArray[2];
									localStorage.specialtyStr=syncResultArray[3];
									
									localStorage.user_mobile=syncResultArray[4];
									
									var doctorDistrictCombo='';
									
									var districtList = localStorage.locationStr.split('<fd>');
									var districtListLength=districtList.length
									
									
									for (var i=0; i < districtListLength; i++){
										var districtAreaName = districtList[i]
										
										if (districtAreaName!=''){
											doctorDistrictCombo+='<li class="ui-btn-icon-left ui-icon-location" onClick="doctor_list(\''+districtAreaName+'\')" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+districtAreaName+'</li>';
											}		
									}								
									localStorage.districtCombo_list=doctorDistrictCombo
									
									
									$("#wait_image_login").hide();
									$("#loginButton").show();
									
									
									$("#h_user_name").text(localStorage.user_name);
									$("#h_user_name").show();
									$("#btn_reg").hide();
									//----------------									
									url = "#pageHome";
									$.mobile.navigate(url);								
									
								}else {									
									$("#wait_image_login").hide();
									$("#loginButton").show();									
									$("#error_login").html("Sync Failed. Authorization or Network Error.");									
								}								
							}
						  },
					  error: function(result) {					 
						  $("#wait_image_login").hide();
						  $("#loginButton").show();
						  $("#error_login").html("Sync Failed. Network Error.");		
						
					  }
				  });//end ajax
				}//base url check
	
	}//function




function x_sync_location(){	
	$("#error_search_list").html("");
	$("#wait_image_doctor_search").hide();
	
	var user_mobile=localStorage.user_mobile
	if (user_mobile==''||user_mobile==undefined){
		$("#error_search_list").html("Required Registration")
	}else{
		$("#doctor_location_cmb_id_lv").hide();
		$("#btn_sync_location").hide();		
		$("#wait_image_doctor_search").show();
		
		//alert(apipath+'syncmobile_patient/sync_location?user_mobile='+localStorage.user_mobile+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code)							
		
		$.ajax({
			 type: 'POST',
			 url: apipath+'syncmobile_patient/sync_location?user_mobile='+localStorage.user_mobile+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code,
			 success: function(result) {						
					if (result==''){
						$("#error_search_list").html('Network timeout. Please ensure you have active internet connection.');
						$("#wait_image_profile").hide();
						$("#doctor_location_cmb_id_lv").show();
						$("#btn_sync_location").show();		
					}else{
						var resultArray = result.split('<SYNCDATA>');			
						if (resultArray[0]=='FAILED'){						
							$("#error_search_list").html(resultArray[1]);
							$("#wait_image_doctor_search").hide();
							$("#doctor_location_cmb_id_lv").show();
							$("#btn_sync_location").show();		
						}else if (resultArray[0]=='SUCCESS'){
							
							localStorage.locationStr=resultArray[1];
							localStorage.specialtyStr=resultArray[2];
							
							
							
							var doctorDistrictCombo='';									
							var districtList = localStorage.locationStr.split('<fd>');
							var districtListLength=districtList.length
							for (var i=0; i < districtListLength; i++){
								var districtAreaName = districtList[i]
								
								if (districtAreaName!=''){
									doctorDistrictCombo+='<li class="ui-btn ui-corner-all ui-btn-icon-left ui-icon-location" style="border-bottom-style:solid; border-color:#CBE4E4;border-bottom-width:thin"><a onClick="districtSearchNextLV(\''+districtAreaName+'\')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+districtAreaName+'</a></li>';
									}		
							}								
							localStorage.districtCombo_list=doctorDistrictCombo
							
							
							$("#wait_image_doctor_search").hide();
							$("#doctor_location_cmb_id_lv").show();
							$("#btn_sync_location").hide();		
							
							search_page('');
							
							//--------------------------
							/*var specialtyList = localStorage.specialtyStr.split('<fd>');
							var specialtyListLength=specialtyList.length;	
							var selectedValue=0;
							var specialty_cmb='<option value="0" >Select Specialty</option>'
							for (var i=0; i < specialtyListLength; i++){
								var specialtyName=specialtyList[i];										
								specialty_cmb+='<option value="'+specialtyName+'" >'+specialtyName+'</option>';	
								
								if (specialtyName==spName){
									selectedValue=i+1;
								}
										
							}
							
							//------------------
							var doctor_specialty_cmb_ob=$('#doctor_specialty_cmb_id');
							doctor_specialty_cmb_ob.empty()
							doctor_specialty_cmb_ob.append(specialty_cmb);
							doctor_specialty_cmb_ob[0].selectedIndex = selectedValue;
							
							//-------------
							$("#doctor_location_cmb_id").val('');
							var doctor_location_cmb_list=localStorage.districtCombo_list;
							
							//---	
							var doctor_location_cmb_ob=$('#doctor_location_cmb_id_lv');
							doctor_location_cmb_ob.empty()
							doctor_location_cmb_ob.append(doctor_location_cmb_list);
							
							//--------------------------	
							url = "#page_search";
							$.mobile.navigate(url);
							
							doctor_specialty_cmb_ob.selectmenu("refresh");
							doctor_location_cmb_ob.listview("refresh");*/
							
						}else{						
							$("#error_search_list").html('Authentication error. Please register and sync to retry.');
							$("#wait_image_doctor_search").hide();
							$("#doctor_location_cmb_id_lv").show();
							$("#btn_sync_location").show();		
							}
					}
				  },
			  error: function(result) {			  
				  $("#error_search_list").html('Invalid Request'); 
				  $("#wait_image_doctor_search").hide();
				  $("#doctor_location_cmb_id_lv").show();
				  $("#btn_sync_location").show();		
			  }
			  });//end ajax
	
	}
}


function search_page(specialty_name){
	$("#error_search_list").html("");
	$("#wait_image_doctor_search").hide();
	$("#doctor_location_cmb_id_lv").show();
	$("#btn_sync_location").show();
	
		
	localStorage.specialty=specialty_name;	
		
	//-------------
	
/*	var doctorDistrictCombo='';									
	var districtList = localStorage.locationStr.split('<fd>');
	var districtListLength=districtList.length
	
	
	for (var i=0; i < districtListLength; i++){
		var districtAreaName = districtList[i]		
		if (districtAreaName!=''){
			doctorDistrictCombo+='<li class="ui-btn-icon-left ui-icon-location" onClick="districtSearchNextLV(\''+districtAreaName+'\')" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+districtAreaName+'</li>';
			}		
	}								
	localStorage.districtCombo_list=doctorDistrictCombo*/
	
	var doctor_location_cmb_list=localStorage.districtCombo_list;
	//alert(doctor_location_cmb_list)
	//---	
	var doctor_location_cmb_ob=$('#doctor_location_cmb_id_lv');
	doctor_location_cmb_ob.empty()
	doctor_location_cmb_ob.append(doctor_location_cmb_list);
	
	
	if (localStorage.lastAreaDistName==undefined ){
		$("#doctor_location_cmb_id").val('DHAKA');		
	}else{
		$("#doctor_location_cmb_id").val(localStorage.lastAreaDistName);
	}
	
	
	$(".specialty_show").text(localStorage.specialty);
	//--------------------------	
	url = "#page_search";
	$.mobile.navigate(url);
	
	//doctor_specialty_cmb_ob.selectmenu("refresh");
	doctor_location_cmb_ob.listview("refresh");
}

function x_districtSearchNextLV(district) {
	
	$("#error_search_list").html("");
	$("#error_doctor_list").html("");		
	$("#wait_image_doctor_list").hide();
	$(".specialty_show").text("");
	$(".district_show").text("");
	$("#doctor_area_district").val("");
	
	$("#doctor_cmb_id_lv").show();
	
	$("#doctor_location_cmb_id").val(district);
	doctor_list();	
	}
	
	
function doctor_list(district){	
	$("#doctor_location_cmb_id").val(district);	
	var districtAreaName=$("#doctor_location_cmb_id").val();
	
/*	var specialty=$("#doctor_specialty_cmb_id").val();
	var showSpecialty=specialty;
	if (specialty==0 || specialty=='0'){
		specialty='';
		showSpecialty='Any';
		}*/
	
	if (districtAreaName==''){		
		$("#error_search_list").text("Search Location");
	}else{
			$("#error_search_list").text("");
			
			$("#doctor_location_cmb_id_lv").hide();
			$("#wait_image_doctor_search").show();
			
			//alert(apipath+'syncmobile_patient/get_doctor_list?patient_mobile='+localStorage.user_mobile+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&speciality='+localStorage.specialty+'&district_area='+districtAreaName)
			
			// ajax-------
			$.ajax({
				 type: 'POST',
				 url: apipath+'syncmobile_patient/get_doctor_list?patient_mobile='+localStorage.user_mobile+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&speciality='+localStorage.specialty+'&district_area='+districtAreaName,
				 success: function(result) {						
						if (result==''){
							$("#error_search_list").html('Network timeout. Please ensure you have active internet connection.');							
							$("#wait_image_doctor_search").hide();
							$("#doctor_location_cmb_id_lv").show();
							
						}else{					
							var resultArray = result.split('<SYNCDATA>');			
							if (resultArray[0]=='FAILED'){						
								$("#error_search_list").html(resultArray[1]);
								$("#wait_image_doctor_search").hide();
								$("#doctor_location_cmb_id_lv").show();
								
							}else if (resultArray[0]=='SUCCESS'){
									
								var doctor_string=resultArray[1];
																
								//----------------
								var doctorList = doctor_string.split('<rd>');
								var doctorListLength=doctorList.length
								
								var doctor_cmb_list='';
								
								for (var i=0; i < doctorListLength; i++){
									var doctorListArray = doctorList[i].split('<fd>');
									var doctorID=doctorListArray[0];
									var doctorName=doctorListArray[1];
									var docImg=doctorListArray[2];
									var description=doctorListArray[3];
									var chemberName=doctorListArray[4];
									var chemberAdd=doctorListArray[5];
									
													
									if (doctorID!=''){
										doctor_cmb_list+='<ul data-role="listview" data-inset="true" style="margin-bottom:2px;">';
										if (docImg==""){
											doctor_cmb_list+='<li data-icon="false" onClick="doctorListNextLV(\''+doctorName+'-'+doctorID+'\')"><img src="'+imgPath+'default.png" style="margin:10px;" ><h3>'+doctorName+'</h3><h4>'+chemberName+'</h4><p>'+chemberAdd+'</p><p>'+description+'</p></li>';										
										}else{
											doctor_cmb_list+='<li data-icon="false" onClick="doctorListNextLV(\''+doctorName+'-'+doctorID+'\')"><img src="'+imgPath+docImg+'" style="margin:10px;" ><h3>'+doctorName+'</h3><h4>'+chemberName+'</h4><p>'+chemberAdd+'</p><p>'+description+'</p></li>';										
										}
										doctor_cmb_list+='</ul>';									
									}
									
								}
								 
								//-----------------
								$("#error_search_list").text("");
								$("#wait_image_doctor_search").hide();
								$("#doctor_location_cmb_id_lv").show();
								
								
								$(".specialty_show").text(localStorage.specialty);
								$(".district_show").text(districtAreaName);
								$("#doctor_area_district").val(districtAreaName);
								
								
								//-------------
								$("#doctor_cmb_id").val('');	
								$("#doctor_cmb_id_lv").show();
								
								var doctor_cmb_ob=$('#doctor_cmb_id_lv');
								doctor_cmb_ob.empty()
								doctor_cmb_ob.append(doctor_cmb_list).trigger('create');
								
								//--------------------------	
								url = "#page_doctor";
								$.mobile.navigate(url);	
								doctor_cmb_ob.listview("refresh");
								
							}else{						
								$("#error_search_list").html('Authentication error. Please register and sync to retry.');
								$("#wait_image_doctor_search").hide();
								$("#doctor_location_cmb_id_lv").show();
								}
						}
					  },
				  error: function(result) {				  		
					  $("#error_search_list").html('Invalid Request');
					  $("#wait_image_doctor_search").hide();
					  $("#doctor_location_cmb_id_lv").show();	  
				  }
			 });//end ajax
	}
	
}

function doctorListNextLV(doctor) {
	$("#error_doctor_list").html("");
	
	$("#wait_image_doctor_list").hide();
	$(".doctor_name_show").text("");
	$(".doctor_id_show").text("");
	$("#appointment_date").val("");
	$("#error_chamber_list").html("");
	
	
	$("#doctor_cmb_id").val(doctor);
	doctor_chamber();	
	}
	
	
	
function doctor_chamber(){
	var areaDistrictName=$("#doctor_area_district").val();
	
	var doctorNameID=$("#doctor_cmb_id").val();
	if (doctorNameID==''){		
		$("#error_doctor_list").text("Select Doctor");
	}else{	
			$("#doctor_cmb_id_lv").hide();			
			$("#error_doctor_list").text("");
			$("#wait_image_doctor_list").show();
			
			var doctorArray=doctorNameID.split('-')
			var doctorName=doctorArray[0]
			var doctorId=doctorArray[1]
			
			//alert(apipath+'syncmobile_patient/get_doctor_chamber?patient_mobile='+localStorage.user_mobile+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&doctorId='+doctorId)
			// ajax-------
			$.ajax({
				 type: 'POST',
				 url: apipath+'syncmobile_patient/get_doctor_chamber?patient_mobile='+localStorage.user_mobile+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&doctorId='+doctorId,
				 success: function(result) {						
						if (result==''){
							$("#error_doctor_list").html('Network timeout. Please ensure you have active internet connection.');							
							$("#wait_image_doctor_list").hide();
							$("#doctor_cmb_id_lv").show();
						}else{					
							var resultArray = result.split('<SYNCDATA>');			
							if (resultArray[0]=='FAILED'){						
								$("#error_doctor_list").html(resultArray[1]);
								$("#wait_image_doctor_list").hide();
								$("#doctor_cmb_id_lv").show();
							}else if (resultArray[0]=='SUCCESS'){
									
								var chamber_string=resultArray[1];																
								
								//----------------						
								
								var chamberListArray = chamber_string.split('<rdrdrd>');
								
								var chamber_cmb_list="";
								
								for (var i=0; i < chamberListArray.length; i++){
									
									var chamberIdListArray=chamberListArray[i];
									
									
									var chamberIdListArray = chamberIdListArray.split('<fd>');
									var chamberID=chamberIdListArray[0];
									var chamberName=chamberIdListArray[1];
									var chamberArea=chamberIdListArray[2];
									var chamberDistrict=chamberIdListArray[3];
									var chambersAddress=chamberIdListArray[4];
									var chambersDay=chamberIdListArray[5];									
									var chamberAreaDistrict=chamberArea+'-'+chamberDistrict;
									
									chamber_cmb_list+='<ul data-role="listview" data-inset="false" style="margin-bottom:2px;">'
																		
									if (chamberID!=''){											
										var scheduleArray = chambersDay.split('<rd>');										
										scheduleStr='';
										chambersDaySchedule='';
										if (chambersDay!=undefined){
											chambersDaySchedule='<ul data-role="listview" data-inset="true">';
											for (var j=0; j < scheduleArray.length; j++){
												scheduleStr=scheduleArray[j]											
												dayTimeArray=scheduleStr.split('<rdrd>');
												if (dayTimeArray[1]!=undefined){											
													chambersDaySchedule+='<li style="font-size:12px;">'+dayTimeArray[0]+'-'+dayTimeArray[1]+'</li>';
												}else{
													chambersDaySchedule+='<li style="font-size:12px;">Not Available</li>';
													}												
											}
											chambersDaySchedule+='</ul>';
											if(areaDistrictName.toUpperCase()==chamberAreaDistrict.toUpperCase()){											
												chamber_cmb_list+='<li style="background-color:#F2F8FD;"><label ><input type="radio" name="RadioChamber" value="'+chamberID+'" id="radio_'+chamberID+'" checked >'+chamberID+'-'+chamberName+'</label><p>'+chamberArea+'</p><p>'+chamberDistrict+'</p><p>'+chambersAddress+'</p><p>'+chambersDaySchedule+'</p>';									
											}else{
												chamber_cmb_list+='<li style="background-color:#F2F8FD;"><label ><input type="radio" name="RadioChamber" value="'+chamberID+'" id="radio_'+chamberID+'" >'+chamberID+'-'+chamberName+'</label><p>'+chamberArea+'</p><p>'+chamberDistrict+'</p><p>'+chambersAddress+'</p><p>'+chambersDaySchedule+'</p>';									
												}
										}else{
											chamber_cmb_list+='<li style="background-color:#F2F8FD;"><label ><input type="radio" name="RadioChamber" value="'+chamberID+'" id="radio_'+chamberID+'" >'+chamberID+'-'+chamberName+'</label><p>'+chamberArea+'</p><p>'+chamberDistrict+'</p><p>'+chambersAddress+'</p>';								
											}
									}									
									chamber_cmb_list+='</li>'									
									chamber_cmb_list+='</ul>'
																	
								}
								
								//-----------------
								//$("#error_doctor_list").text("");
								$("#wait_image_doctor_list").hide();
								$("#doctor_cmb_id_lv").show();
								
								$(".doctor_name_show").text(doctorName+'-'+doctorId);
								//$(".doctor_id_show").text(doctorId);
								
								//-------------
								
								$("#chamber_cmb_id_div").empty();								
								$("#chamber_cmb_id_div").append(chamber_cmb_list).trigger('create');
								
								//---	
							
								
								$("#submitButton1").show();
								$("#submitButton2").show();
								
								
								//--------------------------	
								url = "#page_doctor_chamber";
								$.mobile.navigate(url);	
								//chamber_cmb_ob.listview("refresh");
																
							}else{						
								$("#error_doctor_list").html('Authentication error. Please register and sync to retry.');
								$("#wait_image_doctor_list").hide();
								$("#doctor_cmb_id_lv").show();
								}
						}
					  },
				  error: function(result) {	
				  	  //$("#error_doctor_list").html(apipath+'syncmobile_patient/get_doctor_chamber?patient_mobile='+localStorage.user_mobile+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&doctorId='+doctorId)		  
					  $("#error_doctor_list").html('Invalid Request');
					  $("#wait_image_doctor_list").hide();
					  $("#doctor_cmb_id_lv").show();
				  }
			 });//end ajax
	}
	
}


function chamberDetails(chamberIdName){
	$("#wait_image_doctor_chamber_details").hide();
	$("#doctor_chamber_details_id").val("");
	
	//alert(localStorage.lastAreaDistName);
	
	var chamberIdName=chamberIdName
	
	var chamberArray=chamberIdName.split('-')
	var chamberId=chamberArray[0]
	var chamberName=chamberArray[1]
	
	var areaDistrictName=$("#doctor_area_district").val();
	
	var doctorNameID=$("#doctor_cmb_id").val();
	if (doctorNameID==''){		
		$("#error_chamber_list").text("Select Doctor");
	}else{	
			$("#chamber_cmb_id_div").hide();			
			$("#error_chamber_list").text("");
			$("#wait_image_doctor_chamber").show();
			
			$("#submitButton1").hide();
	
			var doctorArray=doctorNameID.split('-')
			var doctorName=doctorArray[0]
			var doctorId=doctorArray[1]
			
			//alert(apipath+'syncmobile_patient/get_chamber_details?patient_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&doctorId='+doctorId+'&chamberId='+chamberId)
			// ajax-------
			$.ajax({
				 type: 'POST',
				 url: apipath+'syncmobile_patient/get_chamber_details?patient_mobile='+localStorage.user_mobile+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&doctorId='+doctorId+'&chamberId='+chamberId,
				 success: function(result) {						
						if (result==''){
							$("#error_chamber_list").html('Network timeout. Please ensure you have active internet connection.');							
							$("#wait_image_doctor_chamber").hide();
							$("#chamber_cmb_id_div").show();
							$("#submitButton1").show();
	
						}else{
							var resultArray = result.split('<SYNCDATA>');			
							if (resultArray[0]=='FAILED'){						
								$("#error_doctor_list").html(resultArray[1]);
								$("#wait_image_doctor_chamber").hide();
								$("#chamber_cmb_id_div").show();
								$("#submitButton1").show();
							}else if (resultArray[0]=='SUCCESS'){
									
								var chamber_string=resultArray[1];
																
								//----------------
								
								//alert(chamberListLength)
								var chamber_cmb_list='<ul id="chamber_cmb_id_lv_details" data-role="listview" data-filter="false" data-inset="false">'			
								
								var chamberListArray = chamber_string.split('<fd>');
								var chamberID=chamberListArray[0];
								var chamberName=chamberListArray[1];
								var chambersAddress=chamberListArray[2];
								var chambersDay=chamberListArray[3];
								
								if (chamberID!=''){	
									var chambersDaySchedule='<table border="1" width="100%" class="ui-body-d ui-shadow table-stripe ui-responsive" data-role="table" data-theme="d"  data-mode="display:none" style="cell-spacing:1px; width:100%; border-bottom:solid 1px; border-bottom-color:#4E9A9A; font-size:80%;">'
									var scheduleArray = chambersDay.split('<rd>');
									
									for (var j=0; j < scheduleArray.length; j++){
										var scheduleStr=scheduleArray[j]
										
										var dayTimeArray=scheduleStr.split('<rdrd>');
										
										chambersDaySchedule+='<tr style="border-color:#4E9A9A;"><td style="border-color:#4E9A9A;">'+dayTimeArray[0]+'</td><td style="border-color:#4E9A9A;">'+dayTimeArray[1]+'</td></tr>'
										
										/*if (chambersDaySchedule==''){
											chambersDaySchedule=scheduleStr;
										
										}else{
											chambersDaySchedule+='</br>'+scheduleStr;
											}*/																					
									}
									chambersDaySchedule+='</table>'
											
									chamber_cmb_list+='<li style="border-bottom-style:solid;border-color:#CBE4E4;border-bottom-width:thin;"><a data-role="button" >'+chamberID+'-'+chamberName+'</a></li><p style="font-size:13px; margin-top:0px; padding-top:0px; background-color:#A4D6EE;">'+chambersAddress+'</p><p style="font-size:15px; margin-top:0px; padding-top:0px; background-color:#A4D6EE;">'+chambersDaySchedule+'</p>';
								}
								
								chamber_cmb_list+='</ul>'
								
								//-----------------
								$("#error_chamber_list").text("");
								$("#wait_image_doctor_chamber").hide();
								$("#chamber_cmb_id_div").show();
								
								$("#doctor_chamber_details_id").val(chamberID);
								
								//$(".doctor_name_show").text(doctorName+'-'+doctorId);
								//$(".doctor_id_show").text(doctorId);
								
								//-------------
								
								$("#chamber_cmb_id_div_chamber_details").empty();								
								$("#chamber_cmb_id_div_chamber_details").append(chamber_cmb_list).trigger('create');
								
								//---	
								//var chamber_cmb_ob=$('#chamber_cmb_id_lv');
								//chamber_cmb_ob.empty()
								//chamber_cmb_ob.append(chamber_cmb_list);
								
								$("#submitButton1").show();
								$("#submitButton2").show();
								//--------------------------	
								url = "#page_chamber_details";
								$.mobile.navigate(url);	
								//chamber_cmb_ob.listview("refresh");
																
							}else{						
								$("#error_chamber_list").html('Authentication error. Please register and sync to retry.');
								$("#wait_image_doctor_chamber").hide();
								$("#chamber_cmb_id_div").show();
								$("#submitButton1").show();
								}
						}
					  },
				  error: function(result) {			  
					  $("#error_chamber_list").html('Invalid Request');
					  $("#wait_image_doctor_chamber").hide();
					  $("#chamber_cmb_id_div").show();
					  $("#submitButton1").show();
				  }
			 });//end ajax
	}
	
}

function appointment_submit(submitFrom){	
	var lastAreaDistName=$("#last_district_show").text();
	localStorage.lastAreaDistName=lastAreaDistName
	
	var submitFrom=submitFrom;
	
	$("#error_chamber_list").text("");
	$("#wait_image_doctor_chamber").hide();
	
	$("#error_chamber_details").text("");
	$("#wait_image_doctor_chamber_details").hide();
	
	
	var doctorNameID=$("#doctor_cmb_id").val();
		
	if (doctorNameID==''){		
		$("#error_chamber_list").text("Select Doctor");
	}else{
		var chamberId=''
		if (submitFrom=='MAIN'){		
			chamberId=($("input:radio[name='RadioChamber']:checked").val())
		}else{
			chamberId=$("#doctor_chamber_details_id").val();
		}
		
		if (chamberId=="" || chamberId==undefined){
			$("#error_chamber_list").html("Chamber Required");
			$("#error_chamber_details").html("Chamber Required");			
		}else{
			
			var appointmentDate=''
			if (submitFrom=='MAIN'){		
				appointmentDate=$("#appointment_date").val();
			}else{
				appointmentDate=$("#appointment_date_chamber_details").val();
			}
			
			var now = new Date();
			var month=now.getUTCMonth()+1;
			if (month<10){
				month="0"+month
				}
			var day=now.getUTCDate();
			if (day<10){
				day="0"+day
				}
				
			var year=now.getUTCFullYear();
			
			var currentDay = new Date(year+ "-" + month + "-" + day);	
			var appointment_date = new Date(appointmentDate);
			
			
			if (appointment_date=='Invalid Date'){		
				$("#error_chamber_list").text("Select a date");
				$("#error_chamber_details").html("Select a date");			
				
			}else{
				if (appointment_date<currentDay){
					$("#error_chamber_list").text("Previous date not allowed");
					$("#error_chamber_details").html("Previous date not allowed");
				}else{	
					
					$("#wait_image_doctor_chamber").show();
					$("#wait_image_doctor_chamber_details").show();
					
					$("#submitButton1").hide();
					$("#submitButton2").hide();
					
					var doctorArray=doctorNameID.split('-')
					var doctorName=doctorArray[0]
					var doctorId=doctorArray[1]
					
					var msg="DOC"+doctorId+chamberId+"."+appointmentDate.substring(8,10)+"."+localStorage.user_name;
					//alert(appointmentDate.substring(8,10))
					//alert(apipath+"sms_api/sms_submit?password=Compaq510DuoDuo&mob="+localStorage.user_mobile+"&midia=app&msg="+msg)
					
					//url_sms= "http://eapps001.cloudapp.net/smart_doctor/sms_api/sms_submit?password=Compaq510DuoDuo&mob="+str(mob)+"&midia=app&msg="+str(msg)
					//url: apipath+'syncmobile_patient/submit_appointment?patient_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&doctorId='+doctorId+'&chamberId='+chamberId+'&appointmentDate='+appointmentDate,
					
					//alert(apipath+"sms_api/sms_submit?password=Compaq510DuoDuo&mob="+localStorage.user_mobile+"&midia=app&msg="+msg+'&sync_code='+localStorage.sync_code);
						 			
					// ajax------- 2015-10-20
					$.ajax({
						 type: 'POST',
						 url: apipath+"sms_api/sms_submit?password=Compaq510DuoDuo&mob="+localStorage.user_mobile+"&midia=app&msg="+msg+'&sync_code='+localStorage.sync_code,
						 success: function(result) {								
								if (result==''){
									result_string='Network timeout. Please ensure you have active internet connection.'
									
									$("#error_chamber_list").html(result_string);							
									$("#wait_image_doctor_chamber").hide();
									
									$("#error_chamber_details").html(result_string);							
									$("#wait_image_doctor_chamber_details").hide();
									
									$("#submitButton1").show();
							  		$("#submitButton2").show();
									
								}else{
									var resultArray = result.split('.');	
									var result_string=""		
									if (resultArray[0]=='STARTFailed'){						
										
										result_string='Authentication error. Please register and sync to retry.';
										
										$("#error_chamber_list").html(result_string);
										$("#wait_image_doctor_chamber").hide();
										
										$("#error_chamber_details").html(result_string);							
										$("#wait_image_doctor_chamber_details").hide();
										
										$("#submitButton1").show();
							  			$("#submitButton2").show();
							  
									}else if (resultArray[0]=='STARTSuccess'){
										
										//var result_string=resultArray[1];
										
										result_string=result.replace("STARTSuccess.","")										
										//-----------------
										//$("#error_chamber_list").text(result_string);
										$("#wait_image_doctor_chamber").hide();
										
										//$("#error_chamber_details").html(result_string);							
										$("#wait_image_doctor_chamber_details").hide();
									
										$("#success_message").html('</br></br>'+result_string);
										
										//--------------------------	
										
										/*if (submitFrom=='MAIN'){		
											url = "#page_doctor_chamber";
										}else{
											url = "#page_chamber_details";
										}*/
										$("#submitButton1").show();
										$("#submitButton2").show();
	
										url = "#page_success";
										
										$.mobile.navigate(url);	
										
									}else{
										result_string='Authentication error. Please register and sync to retry.'					
										$("#error_chamber_list").html(result_string);
										$("#wait_image_doctor_chamber").hide();
										
										$("#error_chamber_details").html(result_string);							
										$("#wait_image_doctor_chamber_details").hide();
										
										$("#submitButton1").show();
							  			$("#submitButton2").show();
							  			
										}
								}
							  },
						  error: function(result) {			  
							  $("#error_chamber_list").html('Invalid Request');
							  $("#wait_image_doctor_chamber").hide();
							  
							  $("#error_chamber_details").html('Invalid Request');							
							  $("#wait_image_doctor_chamber_details").hide();
							  
							  $("#submitButton1").show();
							  $("#submitButton2").show();
										  
						  }
					 });//end ajax
				}
			}
		}
	}
}

/*
function appointment_submit_details(){	
	$("#error_chamber_list").text("");
	$("#wait_image_doctor_chamber").hide();
	
	
	var doctorNameID=$("#doctor_cmb_id").val();
	
	if (doctorNameID==''){		
		$("#error_chamber_list").text("Select Doctor");
	}else{
		var chamberId=($("input:radio[name='RadioChamber']:checked").val())
		
		if (chamberId=="" || chamberId==undefined){
			$("#error_chamber_list").html("Chamber Required");
		}else{
			
			appointmentDate=$("#appointment_date").val();
	
			var now = new Date();
			var month=now.getUTCMonth()+1;
			if (month<10){
				month="0"+month
				}
			var day=now.getUTCDate();
			if (day<10){
				day="0"+day
				}
				
			var year=now.getUTCFullYear();
			
			var currentDay = new Date(year+ "-" + month + "-" + day);	
			var appointment_date = new Date(appointmentDate);
			
			if (appointment_date=='Invalid Date'){		
				$("#error_chamber_list").text("Invalid date");
			}else{
				if (appointment_date<currentDay){
					$("#error_chamber_list").text("Previous date not allowed");
				}else{	
					
					$("#wait_image_doctor_chamber").show();
					
					var doctorArray=doctorNameID.split('-')
					var doctorName=doctorArray[0]
					var doctorId=doctorArray[1]
					
					//alert(apipath+'syncmobile_patient/submit_appointment?patient_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&doctorId='+doctorId+'&chamberId='+chamberId+'&appointmentDate='+appointmentDate)
					// ajax-------
					$.ajax({
						 type: 'POST',
						 url: apipath+'syncmobile_patient/submit_appointment?patient_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&doctorId='+doctorId+'&chamberId='+chamberId+'&appointmentDate='+appointmentDate,
						 success: function(result) {						
								if (result==''){
									$("#error_chamber_list").html('Network timeout. Please ensure you have active internet connection.');							
									$("#wait_image_doctor_chamber").hide();
								}else{
									var resultArray = result.split('<SYNCDATA>');			
									if (resultArray[0]=='FAILED'){						
										$("#error_chamber_list").html(resultArray[1]);
										$("#wait_image_doctor_chamber").hide();
									
									}else if (resultArray[0]=='SUCCESS'){
										
										var result_string=resultArray[1];
																				
										//-----------------
										$("#error_chamber_list").text(result_string);
										$("#wait_image_doctor_chamber").hide();
										
										//--------------------------	
										url = "#page_doctor_chamber";
										$.mobile.navigate(url);	
										
									}else{						
										$("#error_chamber_list").html('Authentication error. Please register and sync to retry.');
										$("#wait_image_doctor_chamber").hide();
										}
								}
							  },
						  error: function(result) {			  
							  $("#error_chamber_list").html('Invalid Request');
							  $("#wait_image_doctor_chamber").hide();	  
						  }
					 });//end ajax
				}
			}
		}
	}
}*/


function get_profile(){
	$("#error_home_page").html("")
	$("#error_profile_edit").html("")	
	$("#wait_image_profile").hide();	 
	$("#btn_profile_update").show();
	
	//var patientID=localStorage.user_id
	var patient_mobile=localStorage.user_mobile
	var patient_name=localStorage.user_name
	var patient_address=localStorage.user_address
	
	if ( patient_mobile=='' || patient_mobile==undefined || patient_name=='' || patient_name==undefined){
		$("#error_home_page").html("Required Registration")
	}else{
		
		//$("#patient_id").val(patientID);
		$("#patient_mobile").val(patient_mobile);		
		$("#patient_name").val(patient_name);
		
		$("#patient_address").val(patient_address);
		
		
		//--------------------------	
		url = "#page_profile";
		$.mobile.navigate(url);	
				
			  
	
	}
}

function profile_edit(){	
	$("#error_profile_edit").html("")
		
	$("#wait_image_profile").hide();
	$("#btn_profile_update").show();
	
	var patient_mobile=localStorage.user_mobile
	
	if (patient_mobile==''|| patient_mobile==undefined){
		$("#error_profile_edit").html("Required Registration")
	}else{
		
		$("#wait_image_profile").show();
		$("#btn_profile_update").hide();
		
		var patient_name=$("#patient_name").val();
		patient_name=replace_special_char(patient_name)
		
		var patient_mobile=$("#patient_mobile").val();
		
		var patient_address=$("#patient_address").val();
		patient_address=replace_special_char(patient_address)
		
		if (patient_name==''){
			$("#error_profile_edit").html("Required Profile Name")
		}else{
			
			//alert(apipath+'syncmobile_patient/patient_profile_edit?patient_mobile='+localStorage.user_mobile+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&patient_name='+encodeURIComponent(patient_name)+'&patient_address='+encodeURIComponent(patient_address))							
			
			$.ajax({
				 type: 'POST',
				 url: apipath+'syncmobile_patient/patient_profile_edit?patient_mobile='+localStorage.user_mobile+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&patient_name='+encodeURIComponent(patient_name)+'&patient_address='+encodeURIComponent(patient_address),
				 success: function(result) {						
						if (result==''){
							$("#error_profile_edit").html('Network timeout. Please ensure you have active internet connection.');
							$("#wait_image_profile").hide();
							
						}else{
							var resultArray = result.split('<SYNCDATA>');			
							if (resultArray[0]=='FAILED'){						
								$("#error_profile_edit").html(resultArray[1]);
								$("#wait_image_profile").hide();
							}else if (resultArray[0]=='SUCCESS'){
								
								var result_string=resultArray[1];
								
								localStorage.user_name=patient_name;
								localStorage.user_address=patient_address;
								
								$("#patient_name").val(localStorage.user_name);
								$("#patient_address").val(localStorage.user_address);
								
								$("#user_name").val(localStorage.user_name);
								$("#user_address").val(localStorage.user_address);
								
								$("#error_profile_edit").html(result_string);
								$("#wait_image_profile").hide();
								//$("#btn_profile_update").hide();
								
								//--------------------------
								url = "#page_profile";
								$.mobile.navigate(url);	
								
							}else{						
								$("#error_profile_edit").html('Authentication error. Please register and sync to retry.');
								$("#wait_image_profile").hide();
								}
						}
					  },
				  error: function(result) {				  	 
					  $("#error_profile_edit").html('Invalid Request'); 
					  $("#wait_image_profile").hide();
				  }
				  });//end ajax
		}
	}
}

//---------------------- Exit Application
function exit() {	
	navigator.app.exitApp();
}







