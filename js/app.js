window.App = Ember.Application.create();

App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Router.map(function () {
    this.resource('videos', {
        path: '/'
    });
});

App.Video = DS.Model.extend({
    order: DS.attr('number'),
    title: DS.attr('string'),
    uploader: DS.attr('string'),
    image: DS.attr('string'),
    length: DS.attr('string'),
    uploaded: DS.attr('string'),
    keywords: DS.attr('string'),
    views: DS.attr('string'),
    link: DS.attr('string'),
    channelLink: DS.attr('string'),
    rating: DS.attr('string')
});

App.VideoList = DS.Model.extend({
    name: DS.attr('string'),
    videos: DS.attr('string'),
    sortProperties: ['order'],
    sortAscending: true
});

App.VideosRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('video');
    }
});

App.VideoListRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('videoList');
    }
});


var runTime = 0;
function runjQueryAfterInsert() {
    $('#holder table .song').hover(function () {
        $(this).find('.setup').show();
    }, function () {
        $(this).find('.setup').hide();
    });

}

function getVideoId(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[7].length==11){
        return match[7];
    }
}

function addVideo(videoId, keywords, rating, _self) {
    var videoData = [];
    jQuery("#loading").show();
    jQuery.getJSON('https://gdata.youtube.com/feeds/api/videos/' + videoId + '?v=2&alt=json',function(videoData, status, xhr){
        videoData['title'] =    videoData.entry.title.$t;
        videoData['uploader'] = videoData.entry.author[0].name.$t;
        videoData['image'] =    videoData.entry.media$group.media$thumbnail[1].url;
        videoData['length'] =   Math.floor(videoData.entry.media$group.yt$duration.seconds / 60) + ':' + (videoData.entry.media$group.yt$duration.seconds % 60);
        videoData['uploaded'] = new Date(videoData.entry.published.$t).toLocaleDateString();
        videoData['views'] =    videoData.entry.yt$statistics.viewCount;
        videoData['link'] =    videoData.entry.link[0].href;
        videoData['channelLink'] =    videoData.entry.author[0].yt$userId.$t;
        videoData['channelLink'] =    'https://www.youtube.com/channel/UC' +  videoData['channelLink'];
        console.log(videoData['channelLink']);
        
        var video = _self.store.createRecord('video', {
            title: videoData['title'],
            uploader: videoData['uploader'],
            image: videoData['image'],
            length: videoData['length'],
            uploaded: videoData['uploaded'],
            keywords: keywords,
            views: videoData['views'],
            link: videoData['link'],
            channelLink: videoData['channelLink'],
            rating: rating
        });
    });
    jQuery("#loading").hide();

}

App.VideosController = Ember.ArrayController.extend({
    addVideoError: false,
    loginFailed: false,
    video: [],
    filter: '',

    actions: {
        addVideo: function () {
            var url = this.get('url');
            
            if(url === '' || typeof url == 'undefined') {
                this.set('addVideoError', true);
            }
            
            var keywords = this.get('keywords');
            var rating = this.get('rating');
            var videoId = getVideoId(url);
            var _self = this;
            addVideo(videoId, keywords, rating, _self);
        },
        
        login: function() {
            this.setProperties({
                loginFailed: false
            });

            var _self = this;
            var request = $.post('./login.php', _self.getProperties('username', 'password'), function(data) {
                data = JSON.parse(data);
                if(data.loggedIn === true) {
                    document.location = '/welcome';
                } else {
                    _self.set('loginFailed', true);
                }
            });
        },
        
        removeVideo: function(video){             
                video.deleteRecord();
        }
    },
    
    filteredVideos: function() {
        var filter = this.get('filter');
        
        return this.get('store').filter('video', function(video){
            return video.get('title').toLowerCase().match(filter.toLowerCase());
        });

    }.property('filter', 'video.@each')
});

App.VideoListController = Ember.ArrayController.extend({

});

Ember.View.reopen({
    didInsertElement : function() {
        Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
        runjQueryAfterInsert();
    },
    afterRenderEvent : function() {
        if(runTime === 0) {
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
App.VideoList.FIXTURES = [
    {
        id: 1,
        name: 'all',
        videos: '1, 3'
    }
];

App.Video.FIXTURES = [
    {
        id: 1,
        order: 1,
        title: 'Felix Baumgartner\'s supersonic freefall from 128k\' - Mission Highlights',
        uploader: 'Red  Bull',
        image: 'https://i1.ytimg.com/vi/FHtvDA0W34I/mqdefault.jpg',
        length: '1:31',
        uploaded: '14/10/2013',
        keywords: 'cool, space',
        views: '36,301,090',
        link: 'https://www.youtube.com/watch?v=FHtvDA0W34I',
        channelLink: 'https://www.youtube.com/user/redbull',
        rating: '3.50'
    },
];

