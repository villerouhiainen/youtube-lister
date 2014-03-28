window.App = Ember.Application.create();

App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Router.map(function () {
    this.resource('videos', {
        path: '/'
    });
});

App.Video = DS.Model.extend({
    title: DS.attr('string'),
    keywords: DS.attr('string'),
    rating: DS.attr('string'),
    views: DS.attr('string')
});

App.VideosRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('video');
    },
    getTotalVideos: function() {
        return this.store.find('video').length;
    }
});

App.VideosController = Ember.ArrayController.extend({
    addVideoError: false,
    loginFailed: false,

    actions: {
        addVideo: function () {
            var url = this.get('url');
            var keywords = this.get('keywords');
            var rating = this.get('rating');
            var views = '';
            
            if(url === "" || typeof url == "undefined") {
                this.set("addVideoError", true);
            }
            
            var video = this.store.createRecord('video', {
                title: 'get title of url: '+ url +'',
                keywords: keywords,
                rating: rating,
                views: 'get views of url: '+ url +''
            });
        },
        login: function() {
        this.setProperties({
            loginFailed: false
        });

        var _self = this;
        var request = $.post("./login.php", _self.getProperties("username", "password"), function(data) {
            data = JSON.parse(data);
            if(data.loggedIn === true) {
                document.location = "/welcome";
            } else {
                _self.set("loginFailed", true);
            }
        });
        
        
        }
      }
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

App.NumberField = Ember.TextField.extend({
    attributeBindings: ['min', 'max', 'step']
});

// testing
App.Video.FIXTURES = [{
    id: 1,
    title: 'list/song title'
}];


App.IndexController = Ember.Controller.extend({

  

});

