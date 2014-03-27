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


Lister.NumberField = Ember.TextField.extend({
    attributeBindings: ['min', 'max', 'step']
});


Lister.ListerController = Ember.ArrayController.extend({
  addVideoError: false,
    actions: {
        addVideo: function () {
            var url = this.get('url');
            var keywords = this.get('keywords');
            var rating = this.get('rating');
            
            if(url === "" || typeof url == "undefined") {
                this.set("addVideoError", true);
            }

            var list = this.store.createRecord('list', {
                title: 'get title of url: '+ url +'',
                keywords: keywords,
                rating: rating
            });
        }
    },
        totalVideos: function() {
            var count =  $('tr').size();
            if(count === 0) {
                //this.set("noVideosFound", true);
            }
            return count;
        }.property('tr.length')
});


var runTime = 0;
Ember.View.reopen({
    didInsertElement : function(){
        Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
    },
    afterRenderEvent : function(){
        if(runTime === 0) {
            console.log('afterRenderEvent');
            $('#holder table .song').hover(function () {
                $(this).find('.setup').animate({marginLeft:'-55px'}, {queue: false, duration: 250});
            }, function () {
                $(this).find('.setup').animate({marginLeft:'135px'}, {queue: false, duration: 250});
            });
            
            $('.setup').on('click', function(){
                $(this).parents().closest('.song').remove();
            });
            
            $('#buttonAddVideo').click(function(){
                $('.addList').hide('fast');
                $('.addVideo').toggle('slow');
                $('#videoUrl').focus();
            });
            
            $('#buttonAddList').click(function(){
                $('.addVideo').hide('fast');
                $('.addList').toggle('slow');
                $('#videoUrl').focus();
            });
            runTime = 1;
        }
    }
});

// testing
Lister.List.FIXTURES = [{
    id: 1,
    title: 'list/song title'
}];


