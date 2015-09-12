
//online
var apipath="http://eapps001.cloudapp.net/smart_doctor/syncmobile_patient/";

//local
//var apipath="http://127.0.0.1:8000/smart_doctor/syncmobile_patient/";


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
	var real_value=string_value.replace(')','').replace('(','').replace('{','').replace('}','').replace('[','').replace(']','').replace('"','').replace("'","").replace("/'","").replace("\'","").replace('>','').replace('<','');
	return real_value;
}

$(document).ready(function(){
		$("#wait_image_login").hide();
		$("#loginButton").show();		
		
		$("#q_lat").val("");
		$("#q_long").val("");
		
		$("#wait_image_doctor_search").hide();
		$("#wait_image_doctor_list").hide();
		$("#wait_image_doctor_chamber").hide();
		$("#wait_image_profile").hide();	
		$("#btn_profile_update").show();
		
		$(".specialty_show").text("");
		$(".district_show").text("");
		$(".doctor_name_show").text("");
		$(".doctor_id_show").text("");
		
		//------------------------------			
		var url = "#pageHome";
		
		$.mobile.navigate(url);
		
	});



function get_login() {
	var url = "#login";
	$.mobile.navigate(url);
	}


//========================= Longin: Check user
function check_user() {
	var user_id=$("#user_id").val().toUpperCase();
	var user_pass=$("#user_pass").val();
	
	var base_url='';
	var photo_url='';
	
	//-----
	if (user_id=="" || user_id==undefined || user_pass=="" || user_pass==undefined){
		$("#error_login").html("Required User ID and Password");	
	}else{
		//-----------------
			//alert(apipath+'check_user?patient_id='+user_id+'&password='+encodeURIComponent(user_pass)+'&sync_code='+localStorage.sync_code);
						
			$.ajax({
					 type: 'POST',
					 url: apipath+'check_user?patient_id='+user_id+'&password='+encodeURIComponent(user_pass)+'&sync_code='+localStorage.sync_code,
					 success: function(result) {											
							if (result==''){
								$("#wait_image_login").hide();
								$("#loginButton").show();
								$("#error_login").html('Sorry Network not available');
								
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
									localStorage.user_id=user_id;
									localStorage.user_pass=user_pass
														
									localStorage.sync_code=syncResultArray[1];
									localStorage.districtStr=syncResultArray[2];
									localStorage.specialtyStr=syncResultArray[3];
									
									
									var doctorDistrictCombo='';
									
									var districtList = localStorage.districtStr.split('<fd>');
									var districtListLength=districtList.length
									
									
									for (var i=0; i < districtListLength; i++){
										var districtName = districtList[i]
										
										if (districtName!=''){
											doctorDistrictCombo+='<li class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-location" style="border-bottom-style:solid; border-color:#CBE4E4;border-bottom-width:thin"><a onClick="districtSearchNextLV(\''+districtName+'\')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+districtName+'</a></li>';
											}		
									}								
									localStorage.districtCombo_list=doctorDistrictCombo
									
									//----------------									
									var url = "#pageHome";
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


function search_page(specialty_name){
	$("#error_search_list").html("");
	$("#wait_image_doctor_search").hide();
	var spName=specialty_name;
	
	var specialtyList = localStorage.specialtyStr.split('<fd>');
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
	var url = "#page_search";
	$.mobile.navigate(url);
	
	doctor_specialty_cmb_ob.selectmenu("refresh");
	doctor_location_cmb_ob.listview("refresh");
	
}



function districtSearchNextLV(district) {
	$("#error_search_list").html("");
	$("#error_doctor_list").html("");		
	$("#wait_image_doctor_list").hide();
	$(".specialty_show").text("");
	$(".district_show").text("");
	
	$("#doctor_location_cmb_id").val(district);
	doctor_list();	
	}
	
	
function doctor_list(){
	var districtName=$("#doctor_location_cmb_id").val();
	
	var specialty=$("#doctor_specialty_cmb_id").val();	
	if (specialty==0 || specialty=='0'){
		specialty='';
		}
	
	if (districtName==''){		
		$("#error_search_list").text("Select Location");
	}else{
			$("#error_search_list").text("");
			$("#wait_image_doctor_search").show();
			
			//alert(apipath+'get_doctor_list?patient_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&speciality='+specialty+'&district='+districtName)
			// ajax-------
			$.ajax({
				 type: 'POST',
				 url: apipath+'get_doctor_list?patient_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&speciality='+specialty+'&district='+districtName,
				 success: function(result) {						
						if (result==''){
							$("#error_search_list").html('Sorry Network not available');							
							$("#wait_image_doctor_search").hide();
						}else{					
							var resultArray = result.split('<SYNCDATA>');			
							if (resultArray[0]=='FAILED'){						
								$("#error_search_list").html(resultArray[1]);
								$("#wait_image_doctor_search").hide();
							
							}else if (resultArray[0]=='SUCCESS'){
									
								var doctor_string=resultArray[1];
																
								//----------------
								var doctorList = doctor_string.split('<rd>');
								var doctorListLength=doctorList.length
								
								var doctor_cmb_list=''			
								for (var i=0; i < doctorListLength; i++){
									var doctorListArray = doctorList[i].split('<fd>');
									var doctorID=doctorListArray[0];
									var doctorName=doctorListArray[1];
									if (doctorID!=''){
										doctor_cmb_list+='<li style="border-bottom-style:solid; border-color:#CBE4E4;border-bottom-width:thin"><a onClick="doctorListNextLV(\''+doctorName+'-'+doctorID+'\')">'+doctorName+',</br>'+doctorID+'</a></li>';
									}
								}
								
								//-----------------
								$("#error_search_list").text("");
								$("#wait_image_doctor_search").hide();
								
								$(".specialty_show").text(specialty);
								$(".district_show").text(districtName);
								
								//-------------
								$("#doctor_cmb_id").val('');
								
								//---	
								var doctor_cmb_ob=$('#doctor_cmb_id_lv');
								doctor_cmb_ob.empty()
								doctor_cmb_ob.append(doctor_cmb_list);
								
								//--------------------------	
								var url = "#page_doctor";
								$.mobile.navigate(url);	
								doctor_cmb_ob.listview("refresh");
								
							}else{						
								$("#error_search_list").html('Server Error');
								$("#wait_image_doctor_search").hide();
								}
						}
					  },
				  error: function(result) {			  
					  $("#error_search_list").html('Invalid Request');
					  $("#wait_image_doctor_search").hide();	  
				  }
			 });//end ajax
	}
	
}

function doctorListNextLV(doctor) {
	$("#error_doctor_list").html("");
	
	$("#wait_image_doctor_list").hide();
	$(".doctor_name_show").text("");
	$(".doctor_id_show").text("");
	
	
	$("#doctor_cmb_id").val(doctor);
	doctor_chamber();	
	}
	
	
	
function doctor_chamber(){	
	var doctorNameID=$("#doctor_cmb_id").val();
	
	if (doctorNameID==''){		
		$("#error_doctor_list").text("Select Doctor");
	}else{
			$("#error_doctor_list").text("");
			$("#wait_image_doctor_list").show();
			
			var doctorArray=doctorNameID.split('-')
			var doctorName=doctorArray[0]
			var doctorId=doctorArray[1]
			
			//alert(apipath+'get_doctor_chamber?patient_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&doctorId='+doctorId)
			// ajax-------
			$.ajax({
				 type: 'POST',
				 url: apipath+'get_doctor_chamber?patient_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&doctorId='+doctorId,
				 success: function(result) {						
						if (result==''){
							$("#error_search_list").html('Sorry Network not available');							
							$("#wait_image_doctor_list").hide();
						}else{					
							var resultArray = result.split('<SYNCDATA>');			
							if (resultArray[0]=='FAILED'){						
								$("#error_doctor_list").html(resultArray[1]);
								$("#wait_image_doctor_list").hide();
							
							}else if (resultArray[0]=='SUCCESS'){
									
								var chamber_string=resultArray[1];
																
								//----------------
								var chamberList = chamber_string.split('<rd>');
								var chamberListLength=chamberList.length
								
								var chamber_cmb_list='<ul id="chamber_cmb_id_lv" data-role="listview" data-filter="false" data-inset="true">'			
								for (var i=0; i < chamberListLength; i++){
									var chamberListArray = chamberList[i].split('<fd>');
									var chamberID=chamberListArray[0];
									var chamberName=chamberListArray[1];
									var chamberArea=chamberListArray[2];
									var chamberThana=chamberListArray[3];
									if (chamberID!=''){
										chamber_cmb_list+='<li style="border-bottom-style:solid; border-color:#CBE4E4; border-bottom-width:thin"><label style="background:#81C0C0;"><input type="radio" name="RadioChamber"  value="'+chamberID+'" id="radio_'+chamberID+'">'+chamberID+'-'+chamberName+'</label><p>'+chamberName+', '+chamberArea+', '+chamberThana+'</p></li>';
									}
								}
								chamber_cmb_list+='</ul>'
								
								//-----------------
								$("#error_doctor_list").text("");
								$("#wait_image_doctor_list").hide();
								
								$(".doctor_name_show").text(doctorName);
								$(".doctor_id_show").text(doctorId);
								
								//-------------
								
								$("#chamber_cmb_id_div").empty();								
								$("#chamber_cmb_id_div").append(chamber_cmb_list).trigger('create');
								
								//---	
								//var chamber_cmb_ob=$('#chamber_cmb_id_lv');
								//chamber_cmb_ob.empty()
								//chamber_cmb_ob.append(chamber_cmb_list);
								
								
								//--------------------------	
								var url = "#page_doctor_chamber";
								$.mobile.navigate(url);	
								//chamber_cmb_ob.listview("refresh");
								
								
							}else{						
								$("#error_doctor_list").html('Server Error');
								$("#wait_image_doctor_list").hide();
								}
						}
					  },
				  error: function(result) {			  
					  $("#error_doctor_list").html('Invalid Request');
					  $("#wait_image_doctor_list").hide();	  
				  }
			 });//end ajax
	}
	
}


function appointment_submit(){	
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
					
					//alert(apipath+'submit_appointment?patient_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&doctorId='+doctorId+'&chamberId='+chamberId+'&appointmentDate='+appointmentDate)
					// ajax-------
					$.ajax({
						 type: 'POST',
						 url: apipath+'submit_appointment?patient_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&doctorId='+doctorId+'&chamberId='+chamberId+'&appointmentDate='+appointmentDate,
						 success: function(result) {						
								if (result==''){
									$("#error_chamber_list").html('Sorry Network not available');							
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
										var url = "#page_doctor_chamber";
										$.mobile.navigate(url);	
										
									}else{						
										$("#error_chamber_list").html('Server Error');
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
}

function get_profile(){
	$("#error_home_page").html("")
	$("#error_profile_edit").html("")	
	$("#wait_image_profile").hide();	 
	
	var patientID=localStorage.user_id
	if (patientID==''||patientID==undefined){
		$("#error_home_page").html("Required Sync")
	}else{
		
		$("#patient_id").val(patientID);
		
		//alert(apipath+'get_patient_profile?patient_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code)							
		$.ajax({
			 type: 'POST',
			 url: apipath+'get_patient_profile?patient_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code,
			 success: function(result) {						
					if (result==''){
						$("#error_home_page").html('Sorry Network not available');
					}else{
						var resultArray = result.split('<SYNCDATA>');			
						if (resultArray[0]=='FAILED'){						
							$("#error_home_page").html(resultArray[1]);
						
						}else if (resultArray[0]=='SUCCESS'){
							
							var result_string=resultArray[1];
							var patatientArray = result_string.split('<fd>');
							$("#patient_name").val(patatientArray[0]);
							$("#patient_mobile").val(patatientArray[1]);
							$("#patient_address").val(patatientArray[2]);
							
							//--------------------------	
							var url = "#page_profile";
							$.mobile.navigate(url);	
							
						}else{						
							$("#error_home_page").html('Server Error');
							}
					}
				  },
			  error: function(result) {			  
				  $("#error_home_page").html('Invalid Request');  
			  }
			  });//end ajax
	
	}
}

function profile_edit(){	
	$("#error_profile_edit").html("")	
	$("#wait_image_profile").hide();
	$("#btn_profile_update").show();
	
	var patientID=localStorage.user_id
	if (patientID==''||patientID==undefined){
		$("#error_profile_edit").html("Required Sync")
	}else{
		$("#wait_image_profile").show();
		
		var patient_name=$("#patient_name").val();
		var patient_mobile=$("#patient_mobile").val();
		var patient_address=$("#patient_address").val();
		
		if (patient_name==''){
			$("#error_profile_edit").html("Required Profile Name")
		}else{
			
			//alert(apipath+'patient_profile_edit?patient_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&patient_name='+encodeURIComponent(patient_name)+'&patient_mobile='+encodeURIComponent(patient_mobile)+'&patient_address='+encodeURIComponent(patient_address))							
			$.ajax({
				 type: 'POST',
				 url: apipath+'patient_profile_edit?patient_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&patient_name='+encodeURIComponent(patient_name)+'&patient_address='+encodeURIComponent(patient_address),
				 success: function(result) {						
						if (result==''){
							$("#error_profile_edit").html('Sorry Network not available');
							$("#wait_image_profile").hide();
						}else{
							var resultArray = result.split('<SYNCDATA>');			
							if (resultArray[0]=='FAILED'){						
								$("#error_profile_edit").html(resultArray[1]);
								$("#wait_image_profile").hide();
							}else if (resultArray[0]=='SUCCESS'){
								
								var result_string=resultArray[1];
								
								$("#error_profile_edit").html(result_string);
								$("#wait_image_profile").hide();
								//$("#btn_profile_update").hide();
								
								//--------------------------
								var url = "#page_profile";
								$.mobile.navigate(url);	
								
							}else{						
								$("#error_profile_edit").html('Server Error');
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







