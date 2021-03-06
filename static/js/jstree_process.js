function show_detail(ind, type){
    /*
        Show detail of item in data set and config folder
        @params:
                ind: index of data array
                type: "config" or "dataset"

        @return:
                None
    */

    if (!detail_flag) return;
    var content = "";
    if (type === 0){
        content += 'Name: ' + data_sets[ind].name + '\n\n';
        content += 'Size: ' + data_sets[ind].size + '\n\n';
        content += 'Date modified: ' + data_sets[ind].date_modified + '\n';
    } else {
        content += 'Name: ' + configs[ind].name + '\n\n';
        content += 'Date modified: ' + configs[ind].date_modified + '\n\n';
        content += configs[ind].content + '\n';
    }
    $('#status-text').html(content)
}


function set_jstree_state(tree_id, id_arr){
    /*
        Set checked state in jstree
        @params:
                ind: index of data array
                type: "config" or "dataset"

        @return:
                None
    */

    setTimeout(function(){
        var _tree = $('#' + tree_id).jstree(true);
        for ( i = 0 ; i < id_arr.length; i++ ){
            _tree.select_node(id_arr[i]);
        }
    }, 200);
}

function create_results_tree(paths){
    // console.log(paths);
    $('#hierarchy').remove();
    $("#hierarchy_div").append('<div id="hierarchy"></div>');
    $('#hierarchy')
        .on("changed.jstree", function (e, data) {
            if(data.selected.length) {
                
                if (data.node.li_attr.type === 'folder') return;

                var full_path = data.instance.get_path(data.node,'/').replace(data.node.text, data.node.li_attr.title).replace("results/", '');

                full_path = 'results/' + ana_prefix + timestamp + '/' + full_path;
                console.log( "selected node path", full_path);
                show_file_content(full_path, ana_id);
            }
        })
        .jstree({
            'plugins':["wholerow", "contextmenu"],
            contextmenu: {
                items: function(node){
                    // The default set of all items
                    var items = {
                        downItem: { // The "delete" menu item
                            label: "Download",
                            action: function () {
                                var tree = $('#hierarchy').jstree(true);
                                var path = get_full_path_of_node(node, tree);
                                path = path.replace("results/", '');
                                var key =  'results/' + ana_prefix + timestamp + "/" + path;
                                down_action(node, key.slice(0, -1));
                            }
                        }
                    };

                    return items;
                },
                select_node: false,
                icon: true,
            },
            'core' : {
                'data' : get_json_from_array(paths, "results")
            }
        });
}


// create jstrees for data_sets
function create_data_set_jstree(paths){

    $('#data_set_folder').remove();
    $("#data_set_div").append('<div id="data_set_folder"></div>');
    $('#data_set_folder')
        .on("changed.jstree", function (e, data) {
            if (data.node.li_attr.type === 'folder') return;
            var filename = data.instance.get_path(data.node,'/').replace(data.node.text, data.node.li_attr.title).replace("inputs/", '');
            console.log(filename);

            for ( var i=0; i< data_sets.length; i++ ){
                if (data_sets[i].name === filename) show_detail(i, 0);
            }
        })
        .jstree({
            'plugins':["wholerow", "checkbox", "contextmenu"],
            contextmenu: {
                items: function(node){                    
                    // The default set of all items
                    var tree = $('#data_set_folder').jstree(true);

                    var items = {
                        deleteItem: { // The "delete" menu item
                            label: "Delete",
                            action: function () {
                                delete_action(node, tree);
                            }
                        }
                    };

                    // Delete the "delete" menu item if selected node is folder
                    if (node.li_attr.type === 'folder') {                        
                        var key = get_full_path_of_node(node, tree);
                        if (key === 'inputs/' || key === 'configs/')
                            delete items.deleteItem;
                        delete items.downItem;
                    }
                    return items;
               },
                select_node: false,
                icon: true,
            },
            'core' : {
                'data' : get_json_from_array(paths, "data_set"),
                "check_callback" : true,
                'themes': {
                    'responsive': false,
                    'variant': 'medium',
                }
            }
        });

    if (_Nodes && 'data_set' in _Nodes && processing_status){
        data_set = _Nodes['data_set'];
        set_jstree_state("data_set_folder", data_set);
    }
}


// create jstree for configs
function create_config_jstree(paths){
    $('#config_folder').remove();
    $("#config_div").append('<div id="config_folder"></div>');

    $('#config_folder')
        .on("changed.jstree", function (e, data) {
            var filename = data.node.li_attr.title;
            if (data.node.li_attr.type === 'folder') return;

            for ( var i=0; i< configs.length; i++ ){
                if (configs[i].name === filename) show_detail(i, 1);
            }
        })
        .jstree({
            'plugins':["wholerow","conditionalselect", "contextmenu"],
            contextmenu: {
                items: function(node){
                    // The default set of all items
                    var items = {
                        deleteItem: { // The "delete" menu item
                            label: "Delete",
                            action: function () {
                                var tree = $('#config_folder').jstree(true);
                                delete_action(node, tree);
                            }
                        },
                        downItem: { // The "delete" menu item
                            label: "Download",
                            action: function () {
                                var tree = $('#config_folder').jstree(true);
                                var path = get_full_path_of_node(node, tree);                                
                                down_action(node, path.slice(0, -1));
                            }
                        }
                    };

                    // Delete the "delete" menu item if selected node is folder
                    if (node.li_attr.type === 'folder') {
                        // delete items.deleteItem;
                        //delete items.downItem;
                    }

                    return items;
                },
                select_node: false,
                icon: true,
            },
            'core' : {
                'data' : get_json_from_array(paths, "config"),
                "check_callback" : true,
                'themes': {
                    'responsive': false,
                    'variant': 'medium',
                }
            }
        });

    if (_Nodes && 'config' in _Nodes && processing_status){
        configs = _Nodes['config'];
        
        set_jstree_state("config_folder", configs);
    }
}


// create dataset and config jstrees
function refresh_data_jstrees(){

    // create data_set jstree
    data = [];
    for ( var i = 0; i < data_sets.length; i++){
        data.push("/inputs/" + data_sets[i].name);
    }
    if (data.length > 0) create_data_set_jstree(data);

    // create config jstree
    data = [];
    for ( var i = 0; i < configs.length; i++){
        data.push("/configs/" + configs[i].name);
    }

    if (data.length > 0) create_config_jstree(data);
}


// update JSTree
function update_jstree(){
    var paths = [];
    results_links.forEach(function(item){
        paths.push('/results/' + item.path);
    });
    create_results_tree(paths);
}