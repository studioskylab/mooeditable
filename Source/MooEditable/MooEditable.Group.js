/*
Script: MooEditable.Group.js
	A MooEditable extension for having multiple MooEditable instances on a page controlled by one toolbar.

License:
	MIT-style license.
*/

MooEditable.Group = new Class({

	Implements: [Options],
	
	options: {
		actions: 'bold italic underline strikethrough | insertunorderedlist insertorderedlist indent outdent | undo redo | createlink unlink | urlimage | toggleview'
	},
    
	initialize: function(toolbarEl, options){
		this.setOptions(options);
		this.actions = this.options.actions.clean().split(' ');
		var self = this;
		this.toolbar = new MooEditable.UI.Toolbar({
			onItemAction: function(){
				var args = $splat(arguments);
				var item = args[0];
                if (!self.activeEditor) return;
                self.activeEditor.focus();
                self.activeEditor.action(item.name, args);
                if (self.activeEditor.mode == 'iframe') self.activeEditor.checkStates();
			}
		}).render(this.actions);
		$(toolbarEl).adopt(this.toolbar);
	},

	add: function(el, options){
		return this.activeEditor = new MooEditable.Group.Item(el, this, $merge({toolbar: false}, options));
	}
	
});


MooEditable.Group.Item = new Class({

	Extends: MooEditable,

	initialize: function(el, group, options){
		this.group = group;
		this.parent(el, options);
		var focus = function(){
			this.group.activeEditor = this;
		}.bind(this);
		this.textarea.addEvent('focus', focus);
		this.win.addEvent('focus', focus);
	}

});