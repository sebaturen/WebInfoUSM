<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
        <meta name="totemUSM" content="true">
        <title>Punto Informativo Táctil</title>
        <link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
        <link href="css/estilos.css" rel="stylesheet" media="screen">
        <!-- js web, ajustar URL final al cargar en el sitio! -->
        <link href="http://www.inf.jmc.utfsm.cl/wp-content/themes/infjmc-mk2/assets/dist/css/infjmc.min.css" rel="stylesheet" media="screen">
    </head>
    <body>
        <?php
            //Tomando la seccion vieja, para evitar que el menu se carge cada ves
            //que openquiosk reinicia la pagina
            $pEntrada = false;
            if (empty($_COOKIE["lastSession"]))
            {
                //1º Entrada
                echo "<div id='lastSession' data-content='1'></div>";
                setcookie("lastSession", 1);
                $pEntrada = true;
            }
        ?>
        <!-- iFrame! -->
        <div id="iframeBox" class="fullDiv" style="display: none; background-color: rgba(0,0,0,0);">
            <div id="controliFrame">
                <section id="m_headMasck" class="main"></section>
                <section id="m_iFrameCerrar" class="main">
                    <div class="soyBoton btn btn-default botonesControl" style="position: absolute; z-index:99999999; margin-left: 15px;">Cerrar</div>
                </section>
            </div>
            <div id="iframeContent">
                <iframe id="iframeExternalLink" name="iframe1" frameborder="0" src="" style="width: 100%; height: 100%;"></iframe>
            </div>
        </div>
        <!-- Despliegue de mensaje de carga...-->
        <div id="loadingDiv" class="hidden fullDiv">
            <div class="vertical-center">
                <div class="sprite-spinner">
                    <img src="img/spinner.png" alt=""/>
                </div>
            </div>
        </div>
        <!-- Despliegue de mensaje a toda pantalla (errores)...-->
        <div id="mensajeDiv" class="hidden fullDiv">
            <div class="vertical-center">
                <div id="divContentMensaje">
                    <h1 id="textMensaje" class="text-center"></h1>
                    <div class="msngDiv">
                        <button onclick="showError()" type="button" class="btnCancel btn btn-danger">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Wrap Conten (all)-->
        <div id="wrapper">
            <header onclick="location.reload();">
                <div class="container-fluid text-right">
                    <div class="titPrinc">Punto Informativo Táctil</div>
                    <h3>Técnico Universitario en Informática</h3>
                    <h4 id="fechaActual">&nbsp;</h4>
                </div>
            </header>
            <div class="container-fluid" id="contentPage">
                <!-- Control Section Atras -->
                <section id="m_atras" class="main" style="display: none;">
                    <div class="soyBoton btn btn-default botonesControl">Atras</div>
                </section>
                <!-- Menu principal! -->
                <section id="menuPrincipal" class="main">
                    <div id="mascara" <?php if (!$pEntrada) { echo "style='display: none;'"; }?>></div>
                    <div>
                        <ul class="list-group lGrupMenu">
                            <li id="m_oferta_laboral" class="row-eq-height m_list_group">
                                <div class="row">
    								<div class="col-sm-2 hidden-xs colImagen">
    									<img src="img/icon_ofertas_laborales.png" alt="Ofertas Laborales" class="img-circle imgLogMenu">
    								</div>
    								<div class="col-sm-10 colTitulos">
    									<div class="textPrincipalMenu">Ofertas laborales</div>
    									<div id="mas_oferta" class="textMasUno"></div>
    								</div>
                                </div>
                            </li>
                            <li id="m_practica_profecional" class="soyBoton m_list_group">
                                <div class="row">
    								<div class="col-sm-2 hidden-xs colImagen">
    									<img src="img/icon_practicas_profesionales.png" alt="Practicas Laborales" class="img-circle imgLogMenu">
    								</div>
    								<div class="col-sm-10 colTitulos">
    									<div class="textPrincipalMenu">Prácticas profesionales</div>
    									<div id="mas_practica" class="textMasUno"></div>
    								</div>
                                </div>
                            </li>
                            <li id="m_noticias_carrera" class="soyBoton m_list_group">
                                <div class="row">
    								<div class="col-sm-2 hidden-xs colImagen">
    									<img src="img/icon_noticias.png" alt="Noticias" class="img-circle imgLogMenu">
    								</div>
    								<div class="col-sm-10 colTitulos">
    									<div class="textPrincipalMenu">Noticias de carrera</div>
    									<div id="mas_noticias" class="textMasUno"></div>
    								</div>
                                </div>
                            </li>
                            <li id="m_horario_labs" class="soyBoton m_list_group">
                                <div class="row">
    								<div class="col-sm-2 hidden-xs colImagen">
    									<img src="img/icon_horarios.png" alt="Horario Laboratorios" class="img-circle imgLogMenu">
    								</div>
    								<div class="col-sm-10 colTitulos">
    									<div class="textPrincipalMenu">Horarios laboratorios</div>
    									<div class="textMasUno"></div>
    								</div>
                                </div>
                            </li>
                            <li id="m_eventos" class="soyBoton m_list_group">
                                <div class="row">
    								<div class="col-sm-2 hidden-xs colImagen">
    									<img src="img/icon_eventos.png" alt="Eventos" class="img-circle imgLogMenu">
    								</div>
    								<div class="col-sm-10 colTitulos">
    									<div class="textPrincipalMenu">Eventos</div>
    									<div id="mas_eventos" class="textMasUno"></div>
    								</div>
                                </div>
                            </li>
                            <li id="m_videos" class="m_list_group">
                                <div class="row">
    								<div class="col-sm-2 hidden-xs colImagen">
    									<img src="img/icon_videos.png" alt="Videos" class="img-circle imgLogMenu">
    								</div>
                                    <div class="col-sm-2 videos_text">
                                            <div class="textVidTit">
                                                Canales
                                            </div>
                                            <div class="textMasUno">
                                                - Tecnológico<br/>
                                                - Gamer<br/>
                                            </div>
                                    </div>
    								<div class="colTitulos videos">
                                        <div id="videoIncial">
                                            <div id="contorl_Izq" class="control_videos"></div>
                                            <div id="videoIzq" class="videoMuestra"></div>
                                        </div>
                                        <div id="videoSecundario">
                                            <div id="contorl_Der" class="control_videos"></div>
                                            <div id="videoDer" class="videoMuestra"></div>
                                        </div>
    								</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
                <!-- Contenido... -->
                <section id="contentPrincipal" class="main" style="display: none;">
                    <div id="content"></div>
                </section>
                <!-- Control Section -->
                <section id="m_atrasP_adelanteP" class="main" style="display: none;">
                    <div class="row">
                        <div class="col-xs-6 text-left">
    						<div id="m_atrasPage" class="btn btn-default botonesControl">Pagina Anterior</div>
                        </div>
                        <div class="col-xs-6 text-right">
    						<div id="m_siguentePage" class="btn btn-default botonesControl">Pagina Siguiente</div>
                        </div>
                    </div>
                </section>
            </div>
            <footer>
                <div id="fondoImg"></div>
                <div class="imgCenter"><img src="img/UTFSM_logo.png" style="height: 74%;padding-top: 53px;" /></div>
            </footer>
        </div>
        <!-- Area de script!-->
        <!-- JQuery --><script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
        <!-- Bootstrap --><script src="js/bootstrap.min.js"></script>
        <!-- Spinner (png loading rotation sistem) --><script src="js/Spinner.js"></script>
        <!-- Pila Controler --><script src="js/PilaControl.js"></script>
        <!-- Maquetas visuales -->
            <!-- Titulos --><script src="js/maquetaTitulos.js"></script>
            <!-- HorarioLabPDF--><script src="js/maquetaHorariosLab.js"></script>
            <!-- Controlador de Actualizaciones --><script src="js/statUpdate.js"></script>
        <!-- YouTubeAPI Control --><script src="js/youTubeController.js"></script>
        <!-- Propios del sistema, control de eventos general --><script src="js/eventos.js"></script>
    </body>
</html>
