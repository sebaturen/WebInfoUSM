    //Constantes de eventos
    const YOUTUBE_UNSTARTED = -1;
    const YOUTUBE_ENDED     = 0;
    const YOUTUBE_PLAYING   = 1;
    const YOUTUBE_PAUSE     = 2;
    const YOUTUBE_BUFFERING = 3;
    const YOUTUBE_VIDEO_CUED= 5;

    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var player;
    var player2;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('videoIzq', {
            height: '390',
            width: '640',
            playerVars: {
                'autoplay': 1,
                'controls': 0,
                'showinfo': 0,
                'html5': 1,
                'modestbranding': 1,
                'iv_load_policy': 3, // hide annotations by default
                'listType': 'playlist',
                'list': 'PL445tm8Zog7Qa6PVqHwaR20Md5k4pbPA7'
            },
            events: {
                'onReady': onPlayerReady
            }
        });
        player2 = new YT.Player('videoDer', {
            height: '390',
            width: '640',
            videoId: 'M7lc1UVf-VE',
            playerVars: { 'html5': 1, 'autoplay': 1, 'controls': 0, 'showinfo': 0, 'modestbranding': 1},
            events: {
                'onReady': onPlayerReady
            }
        });
    }

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        //event.target.playVideo();
        event.target.mute();
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event)
    {
        if (event.data == YOUTUBE_PAUSE)
        {
            event.target.playVideo();
            playFullScreen(event.target);
        }
    }

    function startVideo()
    {
        player.playVideo();
        player2.playVideo();
    }

    /* Muestra el video */
    var puntoActual;
    var fullPlayer;
    function playFullScreen(target)
    {
        var vData = target.getVideoData();
        puntoActual = target.getCurrentTime();

        setActualPost(POST_VIDEO_VIEW);
        //Tomamos el contenido y mostramos
        setContentIframe("<div id='control_full_video' class='noselect'></div><div id='videoFull'></div>");
        fullPlayer = new YT.Player('videoFull', {
            videoId: vData.video_id,
            playerVars: {
                    'modestbranding': 1,
                    'showinfo': 0,
                    'iv_load_policy': 3, // hide annotations by default
                    'fs': 0,
                    'controls': 0,
                    'html5': 1
                    },
            events: {
                'onReady': onPlayerReadyFullVideo,
                'onStateChange': onPlayerStateChangeFullVideo
            }
        });
        //player.pauseVideo();
        //player2.pauseVideo();
    }

    var idleIntervalFullVideo;
    var idlTimeFullVideo = 0;
    var estadoPausa = false;
    function onPlayerStateChangeFullVideo(event)
    {
        //Video terminado!
        if (event.data == YOUTUBE_ENDED)
        {
            cerrarIframe();
        }
        if (event.data == YOUTUBE_PAUSE)
        {
            estadoPausa = true;
            idleIntervalFullVideo = setInterval(timerIncrementFullVideo, 1000); // 1seg
        }
        if (event.data == YOUTUBE_PLAYING)
        {
            clearInterval(idleIntervalFullVideo);
            estadoPausa = false;
        }
    }

    function timerIncrementFullVideo()
    {
        idlTimeFullVideo += 1;
        if (idlTimeFullVideo == 5)
        {
            clearInterval(idleIntervalFullVideo);
            idlTimeFullVideo = 0;
            cerrarIframe();
        }
    }

    function onPlayerReadyFullVideo(event)
    {
        event.target.setPlaybackQuality('hd720');
        event.target.seekTo(puntoActual);
        event.target.playVideo();
    }

    /** Mascaras de Control */
    $("#contorl_Izq").click(function () {
        playFullScreen(player);
    });

    $("#contorl_Der").click(function () {
        playFullScreen(player2);
    });

    $("#iframeContent").on("click", "#control_full_video", function (obCliked) {
        if (estadoPausa)
        {
			$("#control_full_video").html("");
            fullPlayer.playVideo();
        }
        else
        {
			$("#control_full_video").html("<p style='background-color: rgba(0, 0, 0, 0.45);'>Video en Pausa</p>");
            fullPlayer.pauseVideo();
        }
    });
