(function($) {
    /*
     * ============================================
     * Inicializando as configuracaoes dos plugins
     * --------------------------------------------
     */
    $('body').append(
            '<div id="dev-wait"><div class="dev-wait-progressbar"></div></div>');
    var devWait = $('#dev-wait').css("z-index", "3000");
    var progressBar = $('.dev-wait-progressbar');//.css('margin-top', '40px');

    devWait.dialog({
        title: 'Aguarde o processamento',
        autoOpen: false,
        modal: true,
        closeOnEscape: false,
        draggable: false,
        resizable: false,
        height: 80
    });

    progressBar.progressbar({
        value: 100
    });

    devWait.prev('.ui-dialog-titlebar').find('.ui-dialog-titlebar-close').remove();

    /*
     * Movimenta o progressbar da caixa de dialogo de espera
     */
    var moveProgressBar = function() {
    }
    /*
     * Estado da movimentacao do dialogo. 
     * Utilizado para terminar a animacao
     */
    var stateProgressBar = null;

    /*
     * Define como deve ser o controle da barra de progresso nas requisições ajax
     * Se estiver como true, a barra de progresso é automaticamente aberta no início de uma requisição e fechada a cada requisição concluída
     * Se estiver como false, o desenvolvedor deverá chamar os comandos "$.devDialog.wait.open()" e "$.devDialog.wait.close()" manualmente
     */
    var ajaxProgressBarAutoControl = true;

    $.setAjaxProgressBarAutoControl = function(valor) {
        ajaxProgressBarAutoControl = valor;
    }

    $.getAjaxProgressBarAutoControl = function(valor) {
        return ajaxProgressBarAutoControl;
    }

    /*
     * Construtor interno de Janelas 
     */
    var buildDialog = function(conf) {
        $.devDialog.id++;
        conf = $.extend({
            text: 'Aviso',
            icon: 'ui-icon-alert',
            title: 'Aviso',
            callback: function() {
            }
        }, conf);

        var id = 'dev-dialog-' + $.devDialog.id;

        var html = '<div id="' + id + '">'
                + '  <p class="dev-dialog">'
                + '    <span class="ui-icon ' + conf.icon + '" style="float: left; margin-right: .3em;"></span>'
                + conf.text
                + '  </p>'
                + '</div>';

        $('body').append(html);

        var devDialog = $('#' + id);
        //devDialog.children().css("margin-top", '20px');
        devDialog.dialog({
            title: conf.title,
            width: conf.width,
            modal: true,
            closeOnEscape: false,
            buttons: {
                "Ok": function() {
                    $(this).dialog('destroy');
                    devDialog.remove();
                    conf.callback();
                }
            }
        });
        devDialog.prev('.ui-dialog-titlebar').find('.ui-dialog-titlebar-close').remove();
        /*
         devDialog.prev('.ui-dialog-titlebar').find('.ui-dialog-titlebar-close')
         .click(function() {
         devDialog.dialog('destroy');
         devDialog.remove();
         conf.callback();
         });*/
    };

    /**
     * Configuracoes padrao para todo o aplicativo
     */
    var $confs = {
        /**
         * Mensagens padrao para modulos. Acessado via
         * $.devModules.nomeDoModulo.msg.confirmText [exemplo]
         */
        messages: {
            confirmText: 'Você deseja realmente realizar esta tarefa ?',
            confirmTitle: 'Confirmação',
            alertText: 'Erro ao executar. Tente novamente ou procure o suporte caso o erro persista.',
            alertTitle: 'Alerta',
            successText: 'A tarefa foi realizada com sucesso.',
            alertTitle:'Concluído',
                    errorText: 'Erro ao executar a tarefa.',
            errorTitle: 'Erro'
        },
        /**
         * Funcoes padrao
         */
        funcs: {
            notFound: function() {
                $.devDialog.error("Erro ao realizar a requisição");
            },
            notAllow: function() {
                $.devDialog.error("Você não possui previlégios para executar esta ação");
            },
            beforeDefault: function() {
            },
            successDefault: function() {
            },
            completeDefault: function() {
            },
            errorDefault: function(param) {
                if (param != undefined && param.line != undefined && param.__error != undefined)
                    $.devDialog.alert(param.__error + "<br/><div>" + param.line + "</div>", "Erro na requisição");
            },
            templatePopule: function(response) {
                var tpl = $("#" + response.template);
                if (!tpl.length) {
                    throw Error("Template [" + response.template + "] nao foi encontrado. Revise o ID no objeto response");
                }
                tpl.template("update", response)
            },
            imprimir: function(el)
            {
                var context = el.attr("imprimir");
                if (context)
                {
                    var win = window.open();
                    var body = $(win.document).find('body');
                    body.append($(context).clone());
                    win.focus();
                    win.print();
                    win.close();
                }
            },
            openJReport: function (el)
            {
                var strTitulo = el.attr('titlejreports');
                var intCodRelatorio = el.attr('codjreports');
                var intCodInstituicao = el.attr('codinst');
                var strParametros = el.attr('paramjreports');
                var bolImprimir = el.attr('imprimir') === "" || el.attr('imprimir') === "1" || el.attr('imprimir') === undefined ? true : false;
                var bolModal = el.attr('modal') === "" || el.attr('modal') === "0" || el.attr('modal') === undefined ? false : true;
                
                strParametros = strParametros.replace(new RegExp('%3D', 'g'), '=').slice(0,-2);                
                strParametros = atob(strParametros);
                
                if (el.is('select'))
                {
                    var objJson = el.combobox('json');
                    if (objJson != '' && objJson != null)
                    {
                        for (var strCampo in objJson)
                        {
                            strParametros = strParametros.replace('%' + strCampo + '%', objJson[strCampo]);
                            strParametros = strParametros.replace('%3D', "=");
                        }
                    } else
                        return false;
                } else
                {
                    var strJson = el.attr('namejson');
                    var intLinha = el.attr('numlinhatabela');
                    if (strJson && intLinha != '' && intLinha != undefined)
                    {
                        eval('var objJson = ' + strJson + '[' + intLinha + '];');
                        if (objJson != '' && objJson != null)
                        {
                            for (var strCampo in objJson)
                            {
                                strParametros = strParametros.replace('%' + strCampo + '%', objJson[strCampo]);
                            }
                        }
                    }
                }
                
                strParametros = btoa(strParametros);
                strParametros = encodeURI(strParametros);
                
                $.devReportDialog({
                    title: strTitulo,
                    width: 800,
                    height: 600,
                    data: {
                        CODRELATORIO: intCodRelatorio,
                        PARAMETROS: strParametros,
                        CODINSTITUICAO: intCodInstituicao
                    },
                    url: "relatorio/jreports/exibir",
                    frame: true,
                    modal: bolModal,
                    google: false,
                    impress: bolImprimir
                });
            },
            openJReportPDF: function(el)
            {

                var strTitulo = el.attr('titlejreports');
                var nomeRelatorio = el.attr('nomerelatorio');
                var intCodRelatorio = el.attr('codjreports');
                var intCodInstituicao = el.attr('codinst');
                var strParametros = el.attr('paramjreports');

                strParametros = strParametros.replace(new RegExp('%3D', 'g'), '=').slice(0,-2);                
                strParametros = atob(strParametros);
                
                if (el.is('select'))
                {
                    var objJson = el.combobox('json');
                    if (objJson != '' && objJson != null)
                    {
                        for (var strCampo in objJson)
                        {
                            strParametros = strParametros.replace('%' + strCampo + '%', objJson[strCampo]);
                            strParametros = strParametros.replace('%3D', "=");
                        }
                    }
                    else
                        return false;
                }
                else
                {
                    var strJson = el.attr('namejson');
                    var intLinha = el.attr('numlinhatabela');
                    if (strJson && intLinha != '' && intLinha != undefined)
                    {
                        eval('var objJson = ' + strJson + '[' + intLinha + '];');
                        if (objJson != '' && objJson != null)
                        {
                            for (var strCampo in objJson)
                            {
                                strParametros = strParametros.replace('%' + strCampo + '%', objJson[strCampo]);
                            }
                        }
                    }
                }
                
                strParametros = btoa(strParametros);
                strParametros = encodeURI(strParametros);
                
                $.devAjax({
                    data: {
                        CODRELATORIO: intCodRelatorio,
                        PARAMETROS: strParametros,
                        CODINSTITUICAO: intCodInstituicao,
                        GERARPDF: 1,
                        NOMERELATORIO: nomeRelatorio
                    },
                    action: 'relatorio/jreports/exibir',
                    context: '',
                    success: function(response) {
                        if (response.success) {
                            document.location = $.devUrlBase + "relatorio/jreports/download/FILENAME/" + response.filename;
                        } else {
                            $.devDialog.alert(response.mensagem, "Atenção");
                        }
                    }
                });
            },
            openLink: function(el)
            {
                var strUrl = el.attr('linkwindow');
                var strTitulo = el.attr('titlewindow');
                var bolOpenTab = el.attr('opentab') == "1" ? true : false;
                var bolOpenFrame = el.attr('openFrame') == "" || el.attr('openFrame') == "1" || el.attr('openFrame') == undefined ? true : false;
                var bolImprimir = el.attr('imprimir') == "1" ? true : false;
                var bolExibir = true;
                if (el.is('select'))
                {
                    var objJson = el.combobox("json");
                    if (objJson == "" || objJson == undefined)
                        bolExibir = false;
                }
                if (bolExibir)
                {
                    if (bolOpenTab) {
                        window.open(strUrl, "NovaJanela");
                    } else {
                        $.devReportDialog({
                            title: strTitulo,
                            width: 800,
                            height: 600,
                            url: strUrl,
                            urlNova: bolOpenFrame,
                            frame: bolOpenFrame,
                            modal: false,
                            google: false,
                            impress: bolImprimir
                        });
                    }
                }
                return false;
            },
            openJConsulta: function(el)
            {
                var strUrl = el.attr('linkwindow');
                var strTitulo = el.attr('titlewindow');
                var bolOpenTab = el.attr('opentab') == "1" ? true : false;
                var bolOpenFrame = el.attr('openFrame') == "" || el.attr('openFrame') == "1" || el.attr('openFrame') == undefined ? true : false;
                var bolImprimir = el.attr('imprimir') == "1" ? true : false;
                var bolModal = el.attr('modal') == "1" ? true : false;
                //deve ser um objeto json
                //var objJsonParametros = $.parseJSON(el.attr('parametros'));

                var bolExibir = true;
                if (el.is('select'))
                {
                    var objJson = el.combobox("json");
                    if (objJson == "" || objJson == undefined)
                        bolExibir = false;
                }
                if (bolExibir)
                {
                    if (bolOpenTab) {
                        window.open(strUrl, "NovaJanela");
                    } else {

                        /*if(strUrl != '' && objJsonParametros != ''){
                         $.each(objJsonParametros,function(){});
                         }*/
                        $.devReportDialog({
                            title: strTitulo,
                            width: 800,
                            height: 600,
                            //data:{PARAMETROS:'yesye'},
                            url: strUrl,
                            urlNova: bolOpenFrame,
                            frame: bolOpenFrame,
                            modal: bolModal,
                            google: false,
                            impress: bolImprimir
                        });
                    }
                }
                return false;
            },
            preencherComboLink: function(el)
            {
                var objJsonCombo = el.combobox('json');
                // verifica se sera executado 
                if (objJsonCombo != null && objJsonCombo != '')
                {
                    var strIdCombo = el.attr('dev-select-link');
                    var strParam = el.attr('dev-select-param');
                    var callback = el.attr('dev-select-callback');
                    var codigo = el.attr('dev-select-codigo');
                    var objJsonParam = $.parseJSON(strParam);
                    var arrParametros = {};
                    for (var strParam in objJsonParam.parametros)
                    {
                        arrParametros[strParam] = objJsonParam.parametros[strParam];
                    }
                    for (var strParam in objJsonCombo)
                    {
                        arrParametros[strParam] = objJsonCombo[strParam];
                    }
                    $.devAjax(
                            {
                                data: {
                                    "datasource": objJsonParam.datasource,
                                    "componente": objJsonParam.componente,
                                    "classe": objJsonParam.classe,
                                    "metodo": objJsonParam.metodo,
                                    "filtro": objJsonParam.filtro,
                                    "campomascara": objJsonParam.campomascara,
                                    "campocodigo": objJsonParam.campocodigo,
                                    "valorcodigo": codigo,
                                    "parametros": arrParametros
                                },
                                action: "select/link/buscar", // acao ou url a ser executada
                                success: function(objJson) {
                                    $confs.funcs.retornoComboLink(objJson, strIdCombo, callback);
                                }
                            }
                    );
                }
                else
                {
                    $('#' + strIdCombo).combobox('clear');
                }
            },
            retornoComboLink: function(objJson, strIdCombo, callback)
            {
                $('#' + strIdCombo).combobox('preencherComboBox', objJson.DADOS, objJson.CAMPOMASCARA, objJson.CAMPOCODIGO, objJson.VALORCODIGO);
                $('#' + strIdCombo).combobox("value", objJson.CAMPOCODIGO, objJson.VALORCODIGO);
                $('#' + strIdCombo).combobox("rebuild");
                if ($('#' + strIdCombo).children().length == 3)
                    $('#' + strIdCombo).combobox('selectedIndex', 2);
                if (callback) {
                    var method = searchMethod(callback);
                    if (method) {
                        method();
                    }
                }
            }
        },
        /**
         * Funcoes de validacao
         */
        validators: {
            noEmpty: function(value) {
                if ($.trim(value) != "" && value != null && value != undefined)
                    return true;
                return  value !== null && /^.+$/.test($.trim(value));
            },
            alpha: function(value) {
                return /^.*[a-zA-Z]$/.test($.trim(value));
            },
            integer: function(value) {
                return /^.*[0-9]$/.test(value);
            },
            float: function(value) {
                return  /^[-+]?[0-9]*\.[0-9]+([eE][-+]?[0-9]+)?$/.test(value);
            },
            date: function(value) {
                return /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/.test(value);
            },
            email: function(value) {
                return /^[\w\-\+\&\*]+(?:\.[\w\-\_\+\&\*]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test($.trim(value));
            },
            minSize: function(value, size) {
                return value.length >= size;
            },
            maxSize: function(value, size) {
                return value.length <= size;
            },
            cpf: function(value) {
                var cpf = eval(function(p, a, c, k, e, r) {
                    e = function(c) {
                        return c.toString(a)
                    };
                    if (!''.replace(/^/, String)) {
                        while (c--)
                            r[e(c)] = k[c] || e(c);
                        k = [function(e) {
                                return r[e]
                            }];
                        e = function() {
                            return'\\w+'
                        };
                        c = 1
                    }
                    ;
                    while (c--)
                        if (k[c])
                            p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
                    return p
                }('p=n(a){a=a.f(\'.\',\'\');a=a.f(\'.\',\'\');a=a.f(\'-\',\'\');m b,e,4,i,8,d;d=1;7(a.k<3)6 c;g(i=0;i<a.k-1;i++)7(a.5(i)!=a.5(i+1)){d=0;o}7(!d){b=a.h(0,9);e=a.h(9);4=0;g(i=j;i>1;i--)4+=b.5(j-i)*i;8=4%3<2?0:3-4%3;7(8!=e.5(0))6 c;b=a.h(0,j);4=0;g(i=3;i>1;i--)4+=b.5(3-i)*i;8=4%3<2?0:3-4%3;7(8!=e.5(1))6 c;6 l}q 6 c;6 l}', 27, 27, '|||11|soma|charAt|return|if|resultado||||false|digitos_iguais|digitos|replace|for|substring||10|length|true|var|function|break|cpf_function|else'.split('|'), 0, {}))
                return cpf(value);
            }

        }
    };

    /**
     * Retorna um objeto com os nomes e valores dos campos encontrados
     * dentro do elemento (element)
     */
    var getDatas = function(element) {
        var $el = $(element);
        var $inputs = $el.find('input,select,textarea');
        var data = {};

        $.each($inputs, function(index, element) {
            var name = $(element).attr('name');
            var value = $(element).is('select') ? $(element).children(":selected").val() : $(element).val();
            var type = $(element).attr('type');
            if (type != 'checkbox' && type != 'radio') {
                data[name] = value;
            } else if ($(element).attr('checked')) {
                name = name.replace(/(\[\]*)/, "");
                if (typeof (data[name]) == 'undefined') {
                    data[name] = new Array();
                }
                data[name].push(value);
            }
        });

        return data;
    };


    /**
     * Percorre o vetor $conf.funcs procurando a funcao com o nome passado pelo
     * atributo do elemento. Muito utilizado para setar funcoes padroes
     * 
     */
    var searchMethod = function(attr) {
        var method = null;
        if (attr) {
            var i = attr.split('.');

            if (i.length > 1) {
                if (typeof $confs.funcs[i[0]] !== "undefined" && typeof $confs.funcs[i[0]][i[1]] !== "undefined") {
                    method = $confs.funcs[i[0]][i[1]];
                } else if (typeof $.devModules[i[0]] !== "undefined" && typeof $.devModules[i[0]][i[1]] !== "undefined") {
                    method = $.devModules[i[0]][i[1]];
                } else {
                    throw Error("O metodo " + i[0] + "." + i[1] + " para não foi encontrado no registro do modulo em action.js");
                }
            } else {
                method = $confs.funcs[i[0]];
            }
        }
        ;

        return method;

    };

    var validation_registred = new Array();
    var retorno_validacao = false;
    /*
     * --------------------------------------------
     * Finalizacao  das configuracaoes dos plugins
     * ============================================
     */



    /*
     * ============================================
     * Inicializando os plugins
     * -------------------------------------------- 
     */
    $.devUrlBase = $.ajaxSettings.url.replace(/index\.php(.*)/, 'index.php/');
    $.devShortUrlBase = $.devUrlBase.replace(/index\.php(.*)/, '');

     if($.ajaxSettings.url.indexOf('/branches') > 0 ){
         $.devUrlServer = $.ajaxSettings.url.replace(/\/\/(.*)\/(.*)/, '') + '//' + $.ajaxSettings.url.split("/")[2] 
         + '/'  +  $.ajaxSettings.url.split("/")[3] + '/' + $.ajaxSettings.url.split("/")[4];
     }else{

       $.devUrlServer = $.ajaxSettings.url.replace(/\/\/(.*)\/(.*)/, '') + '//' + $.ajaxSettings.url.split("/")[2];
     }
    $.devShortUrlBaseFramework = $.devUrlServer + '/phpxml/classes/dev.framework/dev/default/';



    /**
     * devAction contem as acoes que serao executadas antes depois, em caso de
     * sucesso e error nas requisicoes ajax Aceita ate doi níveis para a
     * separacao por modulos. Sobrescrever estas acoes apenas quando toda a 
     * aplicacao utilizar este metodo. Exemplo:
     * 
     * $.devAction = {
     * 		solicitacao:{
     * 			gravarPedido:function(){ ... }
     * 		}
     * }
     * 
     * Neste caso em toda a aplicacao sera visivel o modulo $.devAction.solicitacao.gravarPedido()
     * 
     * 
     * Ex: 
     * $devAction.nomeModulo.nomeFuncao = function(){}
     */
    $.devAction = {};
    /**
     * Realiza requisicoes ajax personalizadas, possui um argumento obrigatório
     * o alert_conf. As configuracoes de ajax_conf e alert_conf sao descritas
     * abaixo:
     * 
     * ajax_conf : Configuracoes da requisicao ajax
     * 		{
     * 				data:{} // dados a serem passados via post
     *				action:"/index/index/buscar", // acao ou url a ser executada
     *				context:"body",  // contexto DOM para buscar inputs, selects e demais a fim de enviar via post
     *				complete:function(){},// funcao executada ao completar requisicao
     *				before:function(){}, // funcao executada antes da requisicao
     *				success:function(){}, // funcao executada ao termino com sucesso da requisicao
     *				error:function(){} // funcao executada quando houver erro na requisicao
     * 		}
     * alert_conf:  Configuracoes de mensagens de alerta nas requisicoes
     * 		{
     * 			isConfirm:false // booleano que verifica se sera aberto uma janela de confirmacao
     * 			confirmTitle:$.devModules.solicitacao.msg.confirmacao // titulo da janela de confirmacao 
     * 			confirmText:$.devModules.solicitacao.msg.confirmText  // texto da janela de confirmacao,
     * 			isProgressbar:false	// ativa ou desativa a janela de progressbar
     * 		}
     * 
     */
    $.devAjax = function(ajax_conf, alert_conf) {
        var dt = ajax_conf.data || {};
        ajax_conf.data = $.extend({
            __ajax: 1
        }, dt);

        alert_conf = $.extend({
            isConfirm: 0,
            confirmTitle: "",
            confirmText: "",
            isProgressbar: true
        }, alert_conf);



        //console.log(alert_conf.isProgressbar)
        var ajax_params = {
            url: $.devUrlBase + ajax_conf.action,
            type: 'POST',
            data: $.extend(getDatas(ajax_conf.context), ajax_conf.data),
            cache: false,
            dataType: 'json',
            beforeSend: function() {
                if (ajaxProgressBarAutoControl && alert_conf.isProgressbar) {
                    $.devDialog.wait.open();
                }
                var _before = ajax_conf.before || $confs.funcs.beforeDefault;
                var r = _before();

                if (!r && typeof r !== 'undefined') {
                    if (ajaxProgressBarAutoControl && alert_conf.isProgressbar) {
                        $.devDialog.wait.close();
                    }
                }
                return r;
            },
            success: function(response) {
                if (!response.__error) {
                    var _success = ajax_conf.success || $confs.funcs.successDefault;
                    _success(response);
                } else {
                    this.error(response);
                }
            },
            complete: function() {
                if (ajaxProgressBarAutoControl && alert_conf.isProgressbar) {
                    $.devDialog.wait.close();
                }
                var _complete = ajax_conf.complete || $confs.funcs.completeDefault;
                _complete();
            },
            error: function(param) {
                var _error = ajax_conf.error || $confs.funcs.errorDefault;
                _error(param);
            },
            statusCode: {
                404: function() {
                    $confs.funcs.notFound();
                },
                403: function() {
                    $confs.funcs.notAllow();
                }
            }
        };

        if (alert_conf.isConfirm === 1) {

            $.devDialog.check(
                    function() {
                        $.ajax(ajax_params);
                    },
                    null,
                    {
                        title: $confs.messages[alert_conf.confirmTitle],
                        text: $confs.messages[alert_conf.confirmText]
                    }
            );
        } else {
            $.ajax(ajax_params);
        }
    };

    /**
     * Funcionalidade de dialogos
     * 
     * $.devDialog.wait.open(); para abrir o dialogo de espera (apenas um por
     * chamada) $.devDialog.wait.close(); para fechar o dialogo de espera
     * $.devDialog.check(funcao_ao_confirmar, funcao_ao_cancelar,configuracao_dialogo); para
     * abrir um dialogo de confirmacao
     * 
     * Segue os exemplos abaixo:
     * 
     * $.devDialog.wait.open();  // abre janela modal de progressbar. Uma por vez
     * $.devDialog.wait.close(); // fecha janela modal de progressbar. Uma por vez
     * 
     * 
     * $.devDialog.check(
     * 		function(){ console.log("Apertou o botao confirmar")},
     * 		function(){ console.log("Apertou o botao cancelar")},
     * 		{
     * 			title:$.devModules.solicitacao.msg.confirmTitle,
     * 			text:$.devModules.solicitacao.msg.confirmText,
     * 			width:400
     * 		}
     * );
     * 
     * $.devDialog.alert("mensagem do alerta","titulo")
     * $.devDialog.error("mensagem de erro maluco","titulo")
     * $.devDialog.success("mensagem de sucesso finoo","titulo")
     * 
     */
    $.devDialog = {
        id: 1,
        // janela de espera com progress bar animado
        wait: {
            open: function() {
                stateProgressBar = moveProgressBar();
                devWait.dialog('open');
            },
            close: function() {
                devWait.dialog('close');
                clearInterval(stateProgressBar);
            }
        },
        // janela de confirmacao de tarefas
        check: function(func_ok, func_cancel, conf) {
            conf = conf || {
                text: "Deseja realmente realizar esta tarefa ?",
                title: "Confirmação de tarefa",
                width: 300,
                titleConfimacao: "Confirma",
                titleCancelar: "Cancela",
                titleCheck: "Check",
                confMarcado: true
            };
            
            conf.titleConfimacao = conf.titleConfimacao || "Confirma";
            conf.titleCancelar = conf.titleCancelar || "Cancela";
            conf.titleCheck = conf.titleCheck || '';
            conf.confMarcado = conf.confMarcado || true;

            func_cancel = func_cancel || function() {
            };

            func_ok = func_ok || function() {
            };

            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = "name";
            checkbox.value = "value";
            checkbox.id = "checkId";

            var label = document.createElement('label');
            label.setAttribute("for", "checkId");
            label.setAttribute("id", "LabelId");
            label.innerHTML = conf.titleCheck;

            var id = 'dev-wait-check-' + $.devDialog.id
                    , devCheck = $('<div>').attr('id', id)
                    , boxMsg = $('<div>').addClass('dev-wait-check').html(conf.text)
                    , checkMsg = $('<div>').addClass('dev-wait-check');
                   

            $('body').append(devCheck.append(boxMsg));

            if(conf.titleCheck != '')
            $('body').append(devCheck.append(checkMsg.append(checkbox).append(label)));

            devCheck.children().css("margin-top", '20px');
            if (conf.parametrosCSS !== undefined)
                for (var strNome in conf.parametrosCSS)
                    devCheck.children().css(strNome, conf.parametrosCSS[strNome]);
            devCheck.dialog({
                title: conf.title,
                modal: true,
                width: conf.width,
                buttons: [
                    {
                        text: conf.titleConfimacao,
                        click: function () {
                            marcado = conf.confMarcado;
                            func_ok();
                            if(marcado == true){
                            $(this).dialog('destroy');
                            devCheck.remove();}
                        }},
                    {
                        text: conf.titleCancelar,
                        click: function () {
                            marcado = true;
                            $(this).dialog('destroy');
                            devCheck.remove();
                            func_cancel();
                        }
                    }
                ]});
            devCheck.prev('.ui-dialog-titlebar')
                    .find('.ui-dialog-titlebar-close')
                    .click(function() {
                devCheck.dialog('destroy');
                devCheck.remove();
            });

            $.devDialog.id++;
        },
        // janela de alert
        alert: function(msg, title, callback) {

            buildDialog({
                title: title || $confs.messages.alertTitle,
                text: msg || $confs.messages.alertText,
                callback: callback || function() {
                },
                icon: 'ui-icon-alert'
            });
        },
        // janela de erro
        error: function(msg, title, callback) {
            buildDialog({
                title: title || $confs.messages.errorTitle,
                text: msg || $confs.messages.errorText,
                callback: callback || function() {
                },
                icon: 'ui-icon-circle-close'
            });
        },
        // janela de sucesso
        success: function(msg, title, callback,width) {
            buildDialog({
                title: title || $confs.messages.successTitle,
                text: msg || $confs.messages.successText,
                width: width,
                callback: callback || function() {
                },
                icon: 'ui-icon-circle-check'
                
            });
        }
    },
    /**
     * Percorre todo o DOM e procura os elementos dev-comp para realizar as
     * associacoes com a requisicao Ajax. Os atributos dos componentes sao:
     * 
     * dev-event   || nome do evento que dispara a requisicao ajax. Estilo jquery: ready, click, hover...
     * dev-ajax    || boolean para conferir se quando houver o evento sera disparado a requisicao ajax 
     * dev-action  || url que sera executada na requisicao ajax. Deve iniciar sempre com um /. Ex: /index/index/buscar
     * dev-context || o contexto de busca dos parametros enviados para a requisicao. Ex: #form
     * dev-before  || metodo que sera executado antes da requisicao ajax. Ex: $.devModules.solicitacao.antes
     * dev-complete|| metodo que sera executado ao completar a requisicao ajax. Ex: $.devModules.solicitacao.antes
     * dev-success || metodo que sera executado no final da requisicao requisicao ajax. Ex: $.devModules.solicitacao.antes
     * dev-error   || metodo que sera executado caso ocorra erro na requisicao ajax. Ex: $.devModules.solicitacao.antes
     * dev-confirm || verifica se pararecera a janela de confirmacao quando o evento for disparado e antes da requisicao
     * dev-confirm-title || titulo da janela de requisicao. Utilize as variaveis de modulo. $.devModules.solicitacao.msg.meuTitulo
     * dev-confirmt-text || texto da janela de requisicao. Utilize as variaveis de modulo. $.devModules.solicitacao.msg.meuTexto
     * dev-progress-bar  || 0 ou 1 para verificar se a janela modal de progressbar aparecera na tela
     */
    $.devComponent = function(settings, context) {

        /**
         * Configuracoes padrao
         */
        var config = {};
        if (settings) {
            $.extend(config, settings);
        }


        /**
         * Buscando componentes
         */
        var elements = null;
        if (context === undefined)
            elements = $('[dev-comp="true"]');
        else
            elements = $('[dev-comp="true"]', context);
        //var request = 

        // <buttton dev-comp="true" dev-complete="complete"
        // dev-before="complete" dev-success="complete" dev-event="click"
        // dev-action="" dev-context="body" />
        var usados = {};
        $.each(elements, function(index, elm) {
            var $elm = $(elm);
            var event = $elm.attr("dev-event");
            var ajax = ($elm.attr("dev-ajax") == 'true') ? true : false;
            // busca atributos no elemento DOM elm. Exemplo: <input dev-event="click" ... />
            var ajax_conf = {
                action: $elm.attr("dev-action"),
                context: $elm.attr("dev-context"),
                complete: searchMethod($elm.attr('dev-complete')),
                before: searchMethod($elm.attr('dev-before')),
                success: searchMethod($elm.attr('dev-success')),
                error: searchMethod($elm.attr('dev-error'))
            };

            var alert_conf = {
                isConfirm: $elm.attr("dev-confirm"),
                confirmTitle: $elm.attr("dev-confirm-title"),
                confirmText: $elm.attr("dev-confirm-text"),
                isProgressbar: ($elm.attr("dev-progressbar") == "1")
            };

            //   $(document).ready(function(){
            // registra o evento que dispara a funcao ajax
            //usados[$elm.attr('dev-action')] || usados[$elm.attr('dev-action')]==undefined        	
            if (!usados[$elm.attr("id") + "_" + $elm.attr('dev-action')])
            {
                $elm.bind(event, function() {

                    if (ajax) {
                        $.devAjax(ajax_conf, alert_conf);
                    } else {
                        var _func = searchMethod($elm.attr('dev-action'));
                        _func = _func || function() {
                        };
                        _func($elm);
                    }

                });
                usados[$elm.attr("id") + "_" + $elm.attr('dev-action')] = true;
            }
            //});

            // Executa o ajax automaticamente
            if (event === "ready") {
                $elm.trigger("ready");
            }

        });

        return this;

    };
    /**
     * Inicializa a masca para os campos
     * @param {type} context
     */
    $.devMask = function(context) {
        var elements = null;

        if (typeof context === "undefined") {
            elements = $('[dev-mask]');
        } else {
            elements = $('[dev-mask]', context);
        }

        $.each(elements, function(index, elm) {
            var element = $(elm);
            //element.mask(element.attr('dev-mask'));
            element.setMask(element.attr('dev-mask'));
        });
    };
    /**
     * Registro de modulo para a aplicacao
     * Todo modulo devera ou podera ter um arquivo de configuracoes e funcoes
     * proprio. Para isso sera preciso inicializar este modulo no arquivo
     * nomeDoModulo/action.js contido no dev.rsc/js. Para isso segue o exemplo
     * abaixo:
     * 
     * Assinatura == $.devModules.init("nomeDaSolicitacao",{ //funcoes },{ //mensagens });
     * 
     * action.js
     * $.devModules.init("solicitacao",{
     * 			_init:function(){
     * 				//metodo de inicializacao, executado apenas um vez
     * 				//utiliza-se, principalmente, para registrar eventos. Ex:
     * 
     * 				this._bind("#confirmar","click",this.salvarDados);
     * 			},
     * 
     * 			salvarDados:function(elemento,dados){
     * 					...
     * 			},
     * 
     * 			bemVindoUsuario:function(){
     * 					$.devDialog.success("Bem vindo aluno");
     * 			}
     * },{
     * 		
     * 		confirmText:"Você deseja realmente realizar esta solicitação ?",
     * 		confirmTitle:"Solicitação on-line"
     * });
     * 
     * 
     * 
     * arquivo_qualquer.js
     * ......
     * 		$.devModules.solicitacao.bemVindoUsuario();
     * .....
     * 
     */
    $.devModules = {
        /**
         * Registra funcoes de modulos
         */
        init: function(name, config, config_msg) {
            /**
             * Configurando mensagens de modulo
             */
            config_msg = config_msg || {};
            $.extend($confs.messages, config_msg);

            /**
             * Configurqando funcoes de modulo
             */
            var obj = $.extend({
                _init: function() {

                },
                _bind: function(elm, event, callback) {
                    $(elm).bind(event, this, function(elm) {
                        if (callback)
                            callback($(this), elm.data);
                    });
                },
                _validators: {
                },
                _fireOnLoad: function(id, context) {
                    context = context || obj;
                    var fc = $.isFunction(id) ? id : config[id];
                    $(document).ready(function() {
                        fc(context);
                    });
                },
                msg: $confs.messages

            }, config);
            obj._init();
            this[name] = obj;
        }

    };
    /**
     * Procura e inicializa a 
     * validacao dos campos
     * @param {text} context
     */
    $.devValidation = function(context) {

        var objValidation = null;
        if (typeof context === 'undefined')
            objValidation = $("[dev-validation]");
        else
            objValidation = $("[dev-validation]", context);

        objValidation.each(function(index, _elm) {
            _elm = $(_elm);

            //{ noEmpty:{ text:'', event:'',before:function(){},callback:function(){}}}
            var validator = $.parseJSON(_elm.attr("dev-validation"));


            for (var i in validator) {
                // noEmpty:{ text:'', event:'',before:function(){},callback:function(){}}
                var validator_obj = $.extend({
                    before: 'before',
                    callback: 'callback',
                    event: 'blur'
                }, validator[i]);


                var _method = $confs.validators[i];
                if (!_method) {
                    throw new Error("Metodo de validacao " + i + " nao foi encontrado!");
                }
                ;

                var _before = searchMethod(validator_obj.before) || function() {
                    return true;
                };
                var _callback = searchMethod(validator_obj.callback) || function() {
                    return true;
                };

                var data = {
                    before: _before,
                    callback: _callback,
                    text: validator_obj.text,
                    method: _method,
                    elm: _elm,
                    size: validator_obj.size || false
                };

                _elm.bind(validator_obj.event, data, function(event) {

                    var isValid = false;
                    if (event.data.before(_elm)) {
                        isValid = event.data.method(event.data.elm.is('select') ? event.data.elm.children(':selected').val() : event.data.elm.val(), event.data.size || null);
                        if (isValid) {
                            event.data.elm.removeClass('ui-state-error');
                            event.data.callback();
                        } else {
                            event.stopImmediatePropagation();
                            event.data.elm.addClass('ui-state-error');
                            if (!retorno_validacao) {
                                retorno_validacao = true;
                                $.devDialog.error(event.data.text, 'Campo inválido !', function() {
                                    retorno_validacao = false;
                                });
                            }
                        }
                    }
                    return isValid;
                });


                validation_registred.push({
                    elm: _elm,
                    event: validator_obj.event
                });
            }
        });

    };
    /**
     * Ativa todas as validações para os
     * campos de acordo com as configuracoes
     * @returns {boolean}
     */
    $.devValidationAll = function(escopo) {
        //se não foi passado o escopo, analisa todos os elementos 
        //que possuem validação registrada
        if (!escopo) {
            for (var i in validation_registred) {
                var conf = validation_registred[i];
                conf.elm.trigger(conf.event);
            }
        }
        //se foi passado o escopo, verifica se o elemento que possui a validação 
        //registrada está dentro do escopo passado, para então disparar a validação
        else {
            for (var i in validation_registred) {
                var conf = validation_registred[i];
                //console.log(conf.elm);
                if (conf.elm.parents(escopo).length > 0)
                    conf.elm.trigger(conf.event);
            }
        }
        return !retorno_validacao;
    };

    /**
     *   $.devReportDialog({ 
     *        title:"Relatorio", 
     *        width:800,
     *        height:600,
     *        url:'index/index/file',
     *        frame: false,
     *        modal:false,
     *        google:false,
     *        data:{}
     *    })
     * @param object config
     */
    $.devReportDialog = function(config) {
        config = $.extend({
            title: "Relatório",
            width: 800,
            height: 600,
            frame: false, // or PDF
            url: '#',
            urlNova: false, // parametro usado para frame quando irá utilizar um novo caminho
            modal: false,
            google: false,
            impress: false,
            minimize: true,
            maximize: true,
            close: true,
            ajax: true,
            html: "",
            afterClose: function() {
            },
            callback: function() {
            },
            data: {}
        }, config);

        var id = 'dev-report-dialog-' + $.devDialog.id;
        var boxDialog = $('<div>').attr('id', id).addClass("dev-window");

        if (config.frame) {
            boxDialog.css('overflow', 'none');
        }
        var dialogMinimize = function(win) {
            var title_bar = $(win).parent().find(".ui-dialog-titlebar");
            var link = '<a href="#" class="ui-dialog-titlebar-icon ui-dialog-titlebar-left ui-corner-all" role="button"><span class="ui-icon ui-icon-minusthick">button</span></a>';
            var _link = $(link).hover(
                    function() {
                        $(this).addClass("ui-state-hover");
                    },
                    function() {
                        $(this).removeClass("ui-state-hover");
                    });
            var size = boxDialog.parent().height();
            $(_link).toggle(
                    function() {
                        $(this).children('span').removeClass('ui-icon-minusthick').addClass('ui-icon-carat-1-n');
                        $(this).parent().parent().animate({
                            height: 25
                        }, 700);
                    },
                    function() {
                        $(this).children('span').removeClass('ui-icon-carat-1-n').addClass('ui-icon-minusthick');
                        $(this).parent().parent().animate({
                            height: size
                        }, 700);
                    }
            );

            title_bar.append(_link);
        };

        var dialogMaximize = function(win) {
            var title_bar = $(win).parent().find(".ui-dialog-titlebar");
            //maximizar em outra aba
            var link = '<a href="#" class="ui-dialog-titlebar-icon ui-dialog-titlebar-center ui-corner-all" role="button"><span class="ui-icon ui-icon-arrowthick-2-ne-sw">button</span></a>';
            var _link = $(link).hover(function() {
                $(this).addClass("ui-state-hover");
            }, function() {
                $(this).removeClass("ui-state-hover");
            }).click(function() {
                dialogNewTab(win);
            });

            title_bar.append(_link);
        };

        var dialogNewTab = function(dialog) {
            if (config.urlnova)
            {
                window.open(config.url, config.title);
            }
            else
            {
                var win = window.open();
                var body = $(win.document).find('body');
                body.append($(dialog).html());
            }
            boxDialog.dialog("destroy");
            boxDialog.remove();
        };

        var createDialog = function(content, callback) {
            callback = callback || function() {
            };
            boxDialog.html(content);

            boxDialog.dialog({
                title: config.title,
                width: config.width,
                height: config.height,
                modal: config.modal,
                closeOnEscape: config.close,
                buttons: createButton(),
                open: function(event, ui) {
                    //minimizar janela
                    if (config.maximize) {
                        dialogMaximize(this);
                    }
                    if (config.minimize) {
                        dialogMinimize(this);
                    }

                    if (!config.close) {
                        $(this).parent()
                                .find(".ui-dialog-titlebar")
                                .find('.ui-dialog-titlebar-close')
                                .remove();
                    }
                    if (config.frame) {
                        $('.ui-dialog .ui-dialog-content').css('overflow', 'visible');
                    }
                },
                create: config.callback
            });

            boxDialog.prev('.ui-dialog-titlebar')
                    .find('.ui-dialog-titlebar-close')
                    .click(function() {
                boxDialog.dialog('destroy');
                boxDialog.remove();
                config.afterClose();
            });

            $('body').add(boxDialog);
        };

        var createButton = function() {
            var btns = {};

            if (config.impress) {
                btns = {
                    "Imprimir": function() {
                        var content = null;

                        if (!config.frame) {
                            var win = window.open();
                            var body = $(win.document).find('body');
                            body.append(boxDialog.clone());
                            body.find('div').css('overflow', 'visible');
                            win.focus();
                            win.print();
                            win.focus();
                            win.close();
                        } else {
                            var iframe = boxDialog.find('iframe').get(0);
                            ifDoc = iframe.contentWindow || iframe.contentDocument;
                            if (ifDoc.document)
                                ifDoc = ifDoc.document;

                            content = $(ifDoc).find('body').html();

                            // removendo caracteres indesejados do conteudo html gerados pelo reltorio
                            while (content.indexOf('##') >= 0)
                            {
                                content = content.replace('##', '');
                            }

                            var win = window.open();
                            var body = $(win.document).find('body');
                            body.html(content);
                            body.find('div').css('overflow', 'visible');
                            win.focus();
                            win.print();
                            win.focus();
                            win.close();
                        }
                    }
                };
            }

            return btns;
        };



        if (config.ajax) {
            if (!config.frame) {
                $.devAjax({
                    action: config.url,
                    data: config.data,
                    success: function(response) {
                        createDialog(response.html + config.html);
                    }
                });
            } else {
                var v = new Array();
                for (var i in config.data) {
                    v.push(i);
                    var j = (typeof config.data[i] == "object") ? JSON.stringify(config.data[i]) : config.data[i];
                    v.push(j);
                }
                if (config.frame && config.urlNova)
                {
                    var params = config.url;
                }
                else {
                    var params = $.devUrlBase + config.url + '/' + v.join('/');
                }
                var url = config.google ? "http://docs.google.com/viewer?url=" + encodeURIComponent(params) + "&embedded=true"
                        : params;
                var iFrame = $('<iframe>').attr("frameborder", 0)
                        .attr("src", url)
                        .attr("name", "dev-frame")
                        .css("width", "100%")
                        .css("height", "100%");

                iFrame.load(function() {
                    $.devDialog.wait.close();
                });

                boxDialog.append(iFrame);
                createDialog();
                $.devDialog.wait.open();
            }
        } else {
            createDialog(config.html);
        }

        $.devDialog.id++;
        return {
            close: function() {
                boxDialog.dialog("destroy");
                boxDialog.remove();
            },
            getDialog: function() {
                return boxDialog;
            },
            getId: function() {
                return id;
            }
        };

    };
    /*
     * --------------------------------------------
     * Finalizando a construcao dos plugins
     * ============================================
     */


    /*
     * ============================================
     * Utilidades para uso em componentes
     * ============================================
     */
    $.devRunConfigure = function() {
        $.extend($confs.funcs, $.devAction.funcs);
        $.extend($confs.messages, $.devAction.messages);
        $.extend($confs.validators, $.devAction.validators);

        if ($.devAction.event) {
            for (var i in $.devAction.event) {
                var evt = $.devAction.event[i];
                if (evt) {
                    for (var j in $.devAction.event[i]) {
                        var fc = $.devAction.event[i][j];
                        $(j).live(i, fc);
                    }
                }
            }
        }

        delete $.devAction;
    };

    $.devRefreshComponent = function(context) {
        context = '' || context;
        $(context + ' [dev-date]').calendar();
        $(context + ' input[type="file"]').fileupload();
        $(context + ' [dev-accordion=true]').devaccordion();
        $(context + ' [jquery-template=1]').template();
        $(context + '.compartilhar-facebook').facebook();
        $(context + ' [dev-type=cep]').cep();
        $(context + ' [dev-tab]').devtabs();
        $('input[type=text]', context).css({
            "height": "38px"
        });
        $('[dev-type=datepicker]').datepicker();
        $(context + ' select').combobox();
        $('[dev-type=autocompletar]').autocompletar();
        $.devValidation();
        $.devComponent();
        $.devMask();
    };

    $.devGetModuleScript = function(module_name, callback) {
        callback = callback || function() {
        };
        //$.getScript($.devShortUrlBase + 'dev.rsc/js/' + module_name + '/action.js', callback);
        //o comando acima estava dando problemas com charset, portanto será usado o ajax comum que permite passar o mimetype
        $.ajax({
            url: $.devShortUrlBase + 'dev.rsc/js/' + module_name + '/action.js',
            dataType: "script",
            success: callback,
            mimeType: "text/html; charset=iso-8859-1"
        });
        $('select').combobox();
    };

    $.devGetModuleScriptFramework = function(module_name, callback) {
        callback = callback || function() {
        };
        //$.getScript($.devShortUrlBase + 'dev.rsc/js/' + module_name + '/action.js', callback);
        //o comando acima estava dando problemas com charset, portanto será usado o ajax comum que permite passar o mimetype
        $.ajax({
            url: $.devShortUrlBaseFramework + 'dev.rsc/js/' + module_name + '/action.js',
            dataType: "script",
            success: callback,
            mimeType: "text/html; charset=iso-8859-1"
        });
        $('select').combobox();
    };
    $.devGetModuleCSS = function(module_name, callback) {
        callback = callback || function() {
        };
        //$.getScript($.devShortUrlBase + 'dev.rsc/js/' + module_name + '/action.js', callback);
        //o comando acima estava dando problemas com charset, portanto será usado o ajax comum que permite passar o mimetype
        $.ajax({
            url: $.devShortUrlBase + 'dev.rsc/css/' + module_name + '.css',
            dataType: "script",
            success: callback,
            mimeType: "text/html; charset=iso-8859-1"
        });
        
    };
    /// alias for devReportDialog
    $.devWindow = function(config) {
        return $.devReportDialog(config);
    };
    /**
     * Retorna um metodo padrao de jquery-action
     * @param {function} name
     */
    $.devMethodDefault = function(name) {
        var fc = $confs.funcs[name];
        if (!fc) {
            throw Error('Metodo padrao nao existe em $confs.funcs');
        }
        return fc;
    };
    /**
     * Retorna o metodo [name] do arquivo javascript de
     * modulo juntamente com o contexto.
     * @param {function} name
     */
    $.devModuleFunction = function(name) {

        var fc_name = name.split("."),
                fc = $.devModules[fc_name[0]];

        if (fc_name.length) {
            fc = $.devModules[fc_name[0]][fc_name[1]];
        }
        return {
            func: fc,
            context: $.devModules[fc_name[0]]
        };
    };
    /*
     * Retorna o tamanho, numero de propriedades
     */
    $.devGetSizeObj = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key))
                size++;
        }
        return size;
    };

    $.devTooltip = function(destroy) {
        destroy = destroy || 'init';

        if (destroy === 'destroy') {
            $(document).find(':not(table.ui-datepicker-calendar tr td)').tooltip('destroy');
        } else if (destroy === 'init') {
            $(document).find(':not(table.ui-datepicker-calendar tr td)').tooltip({
                position: {my: "left center", at: "right center"},
                hide: {effect: "fade", duration: 1000},
                show: {effect: "fade", duration: 800}
            });
        } else {
            throw Error('Configuracao indefinida');
        }
    };

    $.devGetAllAttr = function(elm) {
        var attr = elm,
                obj = new Object();

        if (!$.isArray(elm) && !elm[0].jquery) {
            attr = $(elm)[0];
        }

        if (attr) {
            var attr_list = attr.attributes;
            for (var item in attr_list) {
                if (attr_list[item].nodeName) {
                    if (attr_list[item].nodeName !== 'class') {
                        var val = attr_list[item].nodeValue;
                        if (val === 'true') {
                            val = true;
                        } else if (val === 'false') {
                            val = false;
                        }
                        obj[attr_list[item].nodeName] = val;
                    }
                }
            }
        }
        return obj;
    };
    /*
     * --------------------------------------------
     * Finalizando as utilidades para componentes
     * ============================================
     */

    /// inicializando configuracoes basicas
    $(document).ready(function() {
        $.devRunConfigure();
    });
})(jQuery);