window.App = Ember.Application.create();

App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Router.map(function () {
    this.resource('videos', {
        path: '/'
    });
});

App.Video = DS.Model.extend({
    order: DS.attr('number'),
    videoId: DS.attr('string'),
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

function getVideoId(url, _self){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[7].length==11){
        return match[7];
    } else {
        _self.set('addVideoError', true);
        jQuery('.videoInfo .url').addClass('alert alert-danger');
        return false;
    }
}

function getVideoExistence(videoId, totalVideos, _self) {
    var video = _self.store.find('video');
    for(var i = 1; i<=totalVideos; i++) {
        _self.store.find('video', i).then(function(post) {
            if(videoId == post._data.videoId) {
                alert('video already found');
                // prevent duplicate videos? ask if user wants to have two same videos?
            }
        });
    }
    return false;
}

function videoAdded(_self) {
    _self.set('addVideoError', false);
    jQuery('.videoInfo .url').removeClass('alert alert-danger');
    _self.set('url', '');
    _self.set('keywords', '');
    _self.set('rating', '');
    jQuery('#loading').hide();
    jQuery('.videoSuccess').show().delay(2500).fadeOut('slow');
}

function addVideo(videoId, keywords, rating, _self, totalVideos) {
    var videoData = [];
    jQuery('#loading').show();
    var videoExists = getVideoExistence(videoId, totalVideos, _self);
    if(!videoExists) {
    jQuery.getJSON('https://gdata.youtube.com/feeds/api/videos/' + videoId + '?v=2&alt=json',function(videoData, status, xhr){

            var id = totalVideos + 1;
            videoData['title'] =        videoData.entry.title.$t;
            videoData['uploader'] =     videoData.entry.author[0].name.$t;
            videoData['image'] =        videoData.entry.media$group.media$thumbnail[1].url;
            videoData['length'] =       Math.floor(videoData.entry.media$group.yt$duration.seconds / 60) + ':' + (videoData.entry.media$group.yt$duration.seconds % 60);
            videoData['uploaded'] =     new Date(videoData.entry.published.$t).toLocaleDateString();
            videoData['views'] =        videoData.entry.yt$statistics.viewCount;
            videoData['link'] =         videoData.entry.link[0].href;
            videoData['channelLink'] =  'http://www.youtube.com/channel/' + videoData.entry.media$group.yt$uploaderId.$t;
            videoData['views'] = videoData['views'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var video = _self.store.find('video');
            video = _self.store.createRecord('video', {
                id: id,
                order: id,
                videoId: videoId,
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
            video.save();
            videoAdded(_self);
        });
    } else {
        // throw an error, video already exists
    }
}


App.VideosController = Ember.ArrayController.extend({
    addVideoError: false,
    addVideoSuccess: false,
    loginFailed: false,
    video: [],
    filter: '',
    
    totalVideos: function() {
        var totalVideos = this.get('model.length');
        return totalVideos;
    }.property('model.[]'),
    
    actions: {
        addVideo: function () {
            var url = this.get('url');
            if(url === '' || typeof url == 'undefined') {
                this.set('addVideoError', true);
                jQuery('.videoInfo .url').addClass('alert alert-danger');
            } else {
                var keywords = this.get('keywords');
                var rating = this.get('rating');
                if(rating === '' || typeof rating == 'undefined') {
                    rating = "-";
                }
                var _self = this;
                var totalVideos = this.get('totalVideos');
                var videoId = getVideoId(url, _self);
                if(videoId) {
                    addVideo(videoId, keywords, rating, _self, totalVideos);
                }
            }
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
                $('.url').focus();
            });
            
            $('#buttonAddList').click(function(){
                $('.addVideo').hide('fast');
                $('.addList').toggle('slow');
                $('.url').focus();
            });
            runTime = 1;
        }
    }
});

App.NumberField = Ember.TextField.extend({
    attributeBindings: ['min', 'max', 'step']
});



App.Video.FIXTURES = [
    {
        id: 1,
        order: 1,
        videoId: 'FHtvDA0W34I',
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
    }
];

