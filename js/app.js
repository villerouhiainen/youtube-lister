window.Lister = Ember.Application.create();

Lister.ApplicationAdapter = DS.FixtureAdapter.extend();

Lister.Router.map(function () {
    this.resource('lister', {
        path: '/'
    });
});

Lister.List = DS.Model.extend({
    title: DS.attr('string')
});

Lister.ListerRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('list');
    }
});

Lister.ListerController = Ember.ArrayController.extend({
    actions: {
        createList: function () {
            var title = this.get('newTitle');
            if (!title.trim()) {
                return;
            }

            var list = this.store.createRecord('list', {
                title: title
            });
        }
    },

    removeList: function () {
        var list = this.get('model');
        list.deleteRecord();
        list.save();
    }
});

Lister.ListController = Ember.ObjectController.extend({

});


// testing
Lister.List.FIXTURES = [{
    id: 1,
    title: 'list/song title'
}];
