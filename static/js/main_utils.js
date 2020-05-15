// show dataset and config file list

function get_tr_template(file, type, name, ind, flag=0){
	return '<tr onclick="show_detail(' + ind + ', ' + flag + ')"><td class="value">' + file + '</td><td><input type="' + type + '" name="' + name + '"></td>';
}

function show_detail(ind, type){
    if (!detail_flag) return;
    var content = "";
    if (type === 0){
        content += 'Name: ' + datasets[ind].name + '\n\n';
        content += 'Size: ' + datasets[ind].size + '\n\n';
        content += 'Date modified: ' + datasets[ind].date_modified + '\n';
    } else {
        content += 'Name: ' + configs[ind].name + '\n\n';
        content += 'Date modified: ' + configs[ind].date_modified + '\n\n';
        content += configs[ind].content + '\n';
    }
    $('#status-text').html(content)
}

function refresh_databucket_list(){
    var loading_template = "<tr><td>loading ...</td></tr>";
    var empty_template = "<tr><td> No files found. </td></tr>";

    $('#dataset_folder').html(loading_template);
    $('#config_folder').html(loading_template);

	$.ajax({
		url: '/get_user_files/',
		success: function(res){
			console.log(res);
			if (res.status == 200){
			    configs = res.configs;
			    datasets = res.datasets;

				var dataset_html = '';
				for ( var i = 0 ; i < datasets.length ; i++)
					dataset_html += get_tr_template(datasets[i].name, "checkbox", "dataset_file", i, 0)

				dataset_html === '' ? $('#dataset_table tbody').html(empty_template) : $('#dataset_table tbody').html(dataset_html);

				var config_html = '';
				for ( var i = 0 ; i < configs.length ; i++)
					config_html += get_tr_template(configs[i].name, "radio", "config_file", i, 1)

                 config_html === '' ? $('#config_table tbody').html(empty_template) : $('#config_table tbody').html(config_html);

				// add eventlistener for each tr
				$('tr').click(function(event){
					if (event.target.type !== 'checkbox') {
                        $(':checkbox', this).trigger('click');                        
                    }

                    if (event.target.type !== 'radio') {
                        $(':radio', this).trigger('click');                        
                    }                    

                    if ($(this).find('input').is(":checked") === true){
                    	$(this).addClass('active');
                    }
                    else
                    	$(this).removeClass('active');

                    if ($(this).find('input[type="radio"]').val() === 'on'){
                        $('input[type="radio"]').parent().parent().removeClass('active');
                        $(this).addClass('active');
                    }
				})

				refresh_data_jstrees();

				datasets.length == 0 ? $('#dataset_folder').html(empty_template): null;
                configs.length == 0 ? $('#config_folder').html(empty_template): null;
			}
		}
	})
}

function submit(){
    var dataset_files = [];
    var config_file = null;

    // get list of dataset files' names
    var chkboxes = $('#dataset_folder a.jstree-anchor.jstree-clicked');

    for ( var i = 0 ; i < chkboxes.length; i++ ){
        if (chkboxes[i].text !== 'dataset')
            dataset_files.push(chkboxes[i].text);
    }

    if (dataset_files.length < 1) {
    	alert('Select dataset files');
    	return;
    }

    // get config file name
    var radioboxes = $('#config_folder a.jstree-anchor.jstree-clicked');

    for ( var i = 0 ; i < radioboxes.length; i++ ){
        if (radioboxes[i].text !== 'config')
            config_file = radioboxes[i].text;
    }

    if (config_file === null) {
    	alert('Select config file');
    	return;
    }
    console.log(dataset_files, config_file);

    $('#btn-spinner').css('display', 'inline-block');

    // set the processing status to TRUE
    processing_status = true;

    // disabled showing detail of dataset and config files
    detail_flag = false;

    $.ajax({
    	url: window.location.pathname,
    	method: 'POST',
    	data: {
    		dataset_files: dataset_files,
    		config_file: config_file
    	},
    	success: function(res){
    	    $('#btn-spinner').css('display', 'none');
    		console.log(res)
    		trigger_function(res.timestamp);
    	},
    	error: function(err){
    	    $('#btn-spinner').css('display', 'none');
    		console.log(err);
    		$('#submit_button').attr('disabled', false);		
    	}
    })
    $('#submit_button').attr('disabled', true);
}