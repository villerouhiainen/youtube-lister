$(document).ready(function(){
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
        $('.addVideo').toggle("slow");
        $('#videoUrl').focus();
    });
    
    $("#buttonAddList").click(function(){
        $('.addVideo').hide('fast');
        $('.addList').toggle('slow');
        $('#videoUrl').focus();
    });
});
