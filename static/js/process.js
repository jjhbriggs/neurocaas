/* function to show processing status from certificate.txt */
async function get_status(timestamp){
    url = "/results/" + ana_id + "?timestamp=" + timestamp;

    var res = await AjaxRequest(url, 'GET', null, false);
    console.log(res);

    $('#status-text').html(res.cert_file);
    if (res.cert_file !== '')
        $('#down_cert').removeClass('hidden');

    if (processing_status)
        setTimeout(function(){
            get_status(timestamp)
        }, 10000);

}


/* function to show processing results from log and hp_optimum folder */
async function get_results(timestamp){    
    var url = "/results/" + ana_id;
    var data = {
        timestamp: timestamp
    }

    var res = await AjaxRequest(url, 'POST', data, false);
    console.log(res);

    if(res.result_links.length > 0) {
        results_links = res.result_links;

        if (res.end) end_effect();
        update_jstree();
    }

    if (processing_status)
        setTimeout(function(){
            get_results(timestamp)
        }, 30000);
}


function end_effect(){
    // set the processing status to FALSE
    processing_status = false;
    $('.spinner').css('display', 'none');
    $('#btn-spinner').css('display', 'none');
    localStorage.setItem("timestamp", null);
    localStorage.setItem("ana_id", null);
    localStorage.setItem("Nodes", null);
    alert("Process has just finished.");
}


function submit_effect(){
    $('#btn-spinner').css('display', 'inline-block');

    // set the processing status to TRUE
    processing_status = true;

    // disabled showing detail of dataset and config files
    detail_flag = false;
    $('#submit_button').attr('disabled', true);
}


function submit(){
    var data_set_files = [];
    var config_file = null;

    data_set_files = get_selected_nodes('data_set_folder', 'inputs/');

    if (data_set_files.length < 1) {
    	alert('Select dataset files');
    	return;
    }

    // get config file name
    config_files = get_selected_nodes('config_folder', 'configs/');

    if (config_files.length === 0) {
    	alert('Select config file');
    	return;
    }

    console.log(data_set_files, config_files[0]);

    submit_effect();


    $.ajax({
    	url: window.location.pathname,
    	method: 'POST',
    	data: {
    		data_set_files: data_set_files,
    		config_file: config_files[0]
    	},
    	success: function(res){
    	    // $('#btn-spinner').css('display', 'none');
    		console.log(res)
    		timestamp = res.timestamp;

            localStorage.setItem("timestamp", timestamp);
            localStorage.setItem("ana_id", ana_id);
            
            var data_set_Nodes = $('#data_set_folder').jstree(true).get_selected();
            var config_Nodes = $('#config_folder').jstree(true).get_selected();
            var m_Nodes = {
                "data_set": data_set_Nodes,
                "config": config_Nodes
            };
            localStorage.setItem("Nodes", JSON.stringify(m_Nodes));

    		trigger_function(res.timestamp);
    	},
    	error: function(err){
    	    $('#btn-spinner').css('display', 'none');
    		console.log(err);
    		$('#submit_button').attr('disabled', false);
    	}
    })    
}


async function refresh_bucket(){
    var loading_template = "<tr><td>loading ...</td></tr>";
    var empty_template = "<tr><td> No files found. </td></tr>";

    $('#data_set_folder').html(loading_template);
    $('#config_folder').html(loading_template);

    var url = '/user_files/' + ana_id;
    var res = await AjaxRequest(url, 'GET', null, false);
    console.log(res);

    if (res.status == 200){
        configs = res.configs;
        data_sets = res.data_sets;

        refresh_data_jstrees();

        data_sets.length == 0 ? $('#data_set_folder').html(empty_template): null;
        configs.length == 0 ? $('#config_folder').html(empty_template): null;
    }
}


var trigger_function = function(timestamp){
    $('.spinner').css('display', 'block');
    setTimeout(function(){
        get_status(timestamp);
        get_results(timestamp);
    }, 1000);
}


var submit_trigger = function(){
    setTimeout(function(){
        refresh_bucket();
        data_set_area.clear_status();
        config_area.clear_status();
    }, 700);
}