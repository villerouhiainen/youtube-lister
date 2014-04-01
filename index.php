<!DOCTYPE html>
<html>
<head>
    <title>youtube-lister</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="css/libs/bootstrap.min.css">
    <link rel="stylesheet" href="css/libs/bootstrap.icon-large.min.css">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
 
    <script type="text/x-handlebars" data-template-name="videos">
        <div id="window">
            <div id="content">
                <div class="header">
                    <div class="left">
                        <h1>youtube-lister</h1>
                        <span class="slogan">create your own and better 'youtube like' listing!</span>
                    </div>
                    <div id="login">
                        <form class="form-horizontal" {{action "login" on="submit"}}>
                            {{#if loginFailed}}
                                <div class="alert">Invalid username or password.</div>
                            {{/if}}
                              
                            <div class="input-group">
                                {{input value=username type="text" class="form-control" placeholder="username or email"}}                                      
                                <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                            </div>
                            
                            <div class="input-group">
                                {{input value=password type="password" class="form-control" placeholder="password"}}
                                <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                            </div>
                            <button type="submit" class="btn btn-default btn-sm" {{bindAttr disabled="isProcessing"}}>log in</button> or <a href="#">sign up</a>
                        </form>
                    </div>
                </div>
                <hr />
                <div id="wrapper">
                    <div id="holder">
                        <div id="options">
                            <button type="button" class="btn btn-default btn-lg" id="buttonAddVideo">
                                <span class="icon-folder-plus icon-large"></span> add video
                            </button>
                            <button type="button" class="btn btn-default btn-lg" id="buttonAddList">
                                <span class="icon-list icon-large"></span> create list
                            </button>
                            <button type="button" class="btn btn-default btn-lg" id="buttonSharelist">
                                <span class="icon-link icon-large"></span> share current list
                            </button>
                            <div class="addVideo">
                                <form class="form-horizontal" {{action "addVideo" on="submit"}}>
                                    {{#if addVideoError}}
                                        <div class="alert alert-danger">Please check your inputs.</div>
                                    {{/if}}
                                    <div class="input-group videoInfo">
                                        {{input type="text" class="form-control url" placeholder="url" value=url}}
                                        <div class="input-group-btn">
                                            <button class="btn btn-default" type="submit" tabindex="2"><i class="icon-link icon-large"></i></button>
                                        </div>
                                    </div>
                                    <div class="input-group videoInfo">
                                        {{input type="text" class="form-control" placeholder="keywords (optional)" value=keywords}}
                                        <div class="input-group-btn">
                                            <button class="btn btn-default" type="submit" tabindex="2"><i class="icon-tags icon-large"></i></button>
                                        </div>
                                    </div>
                                    <div class="input-group videoInfo rating">
                                        {{view App.NumberField type="number" class="form-control" min="0.0" max="5.0" step="0.1" placeholder="rating (optional)" value=rating}}
                                        <div class="input-group-btn">
                                            <button class="btn btn-default" type="submit" tabindex="2"><i class="icon-star icon-large"></i></button>
                                        </div>
                                    </div><div id="loading" style="display: none;">loading..</div>
                                    <button class="btn btn-success" type="submit">add</button>
                                </form>


                            </div>
                            <div class="addList">
                                <div class="input-group videoInfo">
                                    <input type="text" class="form-control" placeholder="name of list" id="listName">
                                    <div class="input-group-btn">
                                        <button class="btn btn-default" type="submit"  tabindex="1"><i class="icon-tag icon-large"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <hr />
                        <div id="menu">
                            <div class="left">
                                <span class="descr">
                                    listing {{model.length}} video from list `<b>all</b>`
                                    <span class="videoSuccess">1 video successfully added</span></span>
                                <div class="search">
                                    <div class="input-group searcher">
                                        {{view Ember.TextField valueBinding=filter class="form-control" placeholder="search"}}
                                        <div class="input-group-btn">
                                            <button class="btn btn-default" type="submit"><i class="glyphicon glyphicon-search"></i></button>
                                        </div>                       
                                    </div>
                                </div>
                            </div>
                            <div class="right">
                                <div class="list">list:
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                        all
                                        <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu pull-right">
                                          <li><a href="#">all</a></li>
                                          <li><a href="#">funny</a></li>
                                          <li><a href="#">rap songs</a></li>
                                          <li><a href="#">pop and hip-hop</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="sorting">sort by:
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                          id
                                          <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu pull-right">
                                          <li><a href="#">id</a></li>
                                          <li><a href="#">rating</a></li>
                                          <li><a href="#">title</a></li>
                                          <li><a href="#">uploader</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <table  class="sortable">
                            {{#each video in filteredVideos}}
                                <tr class="song">
                                    <td class="nr">{{video.id}}</td>
                                    <td class="image">
                                        <a {{bindAttr href="video.link"}}>
                                            <span class="time">{{video.length}}</span>
                                            <img {{bind-attr src=video.image}} />
                                        </a>
                                    </td>
                                    <td class="title">
                                        <a {{bindAttr href="video.link"}}>{{video.title}}</a><br />
                                        <span  class="uploader"><a {{bindAttr href="video.channelLink"}}>{{video.uploader}}</a> (uploaded {{video.uploaded}}, views {{video.views}})</span>
                                    </td>
                                    <td class="keywords">
                                        <span class="keywords">{{video.keywords}}</span>
                                    </td>
                                    <td class="rating">{{video.rating}}
                                        <div class="setup">
                                            <button type="button" style="float: right;" class="btn btn-default btn-xs" {{action "removeVideo" video on="click"}}><span class="glyphicon glyphicon-trash"></span></button><button type="button" style="float: right;" class="btn btn-default btn-xs" {{action "removeVideo" video on="click"}}><span class="glyphicon glyphicon-pencil"></span> Edit</button>
                                            
                                        </div>
                                    </td>
                                </tr>
                            {{/each}}
                        </table>
                        <ul class="pagination pagination-centered">
                            <li><a href="#">&laquo;</a></li>
                            <li class="active"><a href="#">1</a></li>
                            <li><a href="#">2</a></li>
                            <li><a href="#">3</a></li>
                            <li><a href="#">4</a></li>
                            <li><a href="#">5</a></li>
                            <li><a href="#">&raquo;</a></li>
                        </ul>
                    </div>
                <hr />
                <div id="footer">
                    <div class="left">
                        <span class="copy">Created by Ville Rouhiainen <?php echo date('Y'); ?></span>
                    </div>
                    <div class="right"></div>
                </div>
                </div>
            </div>
        </div>
    </script>
    <script src="js/libs/jquery.js"></script>
    <script src="js/libs/handlebars.js"></script>
    <script src="js/libs/ember.js"></script>
    <script src="js/libs/ember-data.js"></script>
    <script src="js/app.js"></script>
    <script src="js/libs/bootstrap.min.js"></script>
</body>
</html>
