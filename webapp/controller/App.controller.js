(function() {
	'use strict';

	sap.ui.controller('todo.controller.App', {

		onInit: function() {
			this.oModel = new sap.ui.model.json.JSONModel({
				newTodo: '',
				todos: [
					{
						title: 'Start this app',
						completed: false
					},
					{
						title: 'Learn OpenUI5',
						completed: false
					}
				],
				completed:[],
				someCompleted: false,
				completedCount: 0
			});
			this.getView().setModel(this.oModel);
		},

		addTodo: function() {
			var aTodos = this.oModel.getObject('/todos');
			aTodos.unshift({
				title: this.oModel.getProperty('/newTodo'),
				completed: false
			});
			this.oModel.setProperty('/newTodo', '');
			this.oModel.refresh();
		},

		toggleCompleted: function(oEvent) {
			var iCompletedCount = 0,
				aTodos = this.oModel.getObject('/todos'),
				completedTodos = this.oModel.getObject('/completed'),
				i = aTodos.length;
			 aTodos.map(function (obj,i) {
			//	var oTodo = aTodos[i];
				if (obj.completed) {
					obj.completed = false;
					completedTodos.unshift(obj);
					aTodos.splice(i, 1);
					iCompletedCount++;
				}
			});
			//this.oModel.setData({todos:aTodos});
			this.setCompletedCount(iCompletedCount);
			this.oModel.refresh();
		},

		clearCompleted: function(oEvent) {
			var aTodos = this.oModel.getObject('/completed');
			var iCompletedCount = 0;
			var i = aTodos.length;
			aTodos.map((obj,i)=>{
				var oTodo = aTodos[i];
				if (oTodo.completed) {
					aTodos.splice(i, 1);
					iCompletedCount++;
				}
			});
			this.setCompletedCount(iCompletedCount);
			this.oModel.refresh();
		},
		clearAllCompleted: function(oEvent) {
			//var aTodos = this.oModel.getObject('/completed');
			this.oModel.setProperty('/completed', []);
			this.setCompletedCount(0);
			this.oModel.refresh();
		},
		setCompletedCount: function(iCount) {
			this.oModel.setProperty('/completedCount', iCount);
			this.oModel.setProperty('/someCompleted', iCount > 0);
			this.oModel.refresh();
		}

	});

})();
