var gObjFileUpload = null;

(function($) {
    $.widget_id = 1;

    $.widget("ui.inputstyle", {
        _create: function() {
            var self = this;
            var strType = self.element.attr("type");

            switch (strType)
            {
                case "checkbox":
                    {
                        var $input = self.element.addClass('ui-inputstyle-hidden').wrap('<span class="ui-inputstyle-wrapper"></span>');
                        var $wrapper = $input.parent().append('<span class="ui-inputstyle-checkbox"></span>');
                        /* Click Handler */
                        var $a = $wrapper.find('.ui-inputstyle-checkbox').click(function() {
                            var $a = $(this);
                            var input = $a.parent().find("input[type=checkbox]")[0];
                            $(input).click();
                            if (input.checked === true) {
                                $a.addClass('ui-inputstyle-checked');
                            }
                            else {
                                $a.removeClass('ui-inputstyle-checked');
                            }
                            return false;
                        });
                        $input.click(function() {
                            if (this.checked) {
                                $a.addClass('ui-inputstyle-checked');
                            }
                            else {
                                $a.removeClass('ui-inputstyle-checked');
                            }
                        }).focus(function() {
                            $a.addClass('ui-inputstyle-focus');
                        }).blur(function() {
                            $a.removeClass('ui-inputstyle-focus');
                        });

                        /* set the default state */
                        if (self.element.get(0).checked) {
                            $('.ui-inputstyle-checkbox', $wrapper).addClass('ui-inputstyle-checked');
                        }
                        $('.ui-inputstyle-hidden').css({opacity: 0});
                        break;
                    }
            }
        }
    });

    /**
     * Plugin combobox para criacao de combos em  modal-window
     * Propriedades
     * dev-window: cria um combowindow se for true
     * dev-width: seta a largura do combo
     * dev-window-width: seta a largura da janela do combo se for um combowindow
     * dev-window-column: numero de colunas em um combowindow
     */
    $.widget("ui.combobox", {
        box: false,
        _create: function() {
            var input,
                    self = this,
                    select = this.element.hide(),
                    dev_window = this.isWindow = this.element.attr("dev-window"),
                    dev_width = this.element.attr("dev-width"),
                    dev_height = this.element.attr("dev-height"),
                    dev_height_button = this.element.attr("dev-height-button"),
                    selected = select.children(":selected"),
                    value = selected.val() ? selected.text() : "",
                    wrapper = this.wrapper = $("<span>")
                    .addClass("ui-combobox")
                    .addClass("ui-combobox-width-" + dev_width)
                    .insertAfter(select);
            if (dev_height == undefined || dev_height == "")
                dev_height = "38px";

            if (dev_height_button == undefined || dev_height_button == "")
                dev_height_button = "35px";

            var px = parseInt(wrapper.css('width').replace('px', ''), 10);
            var bReadOnly = this.element.attr('readonly');
            input = this.input = $("<input>")
                    .appendTo(wrapper)
                    .val(value)
                    .addClass("ui-state-default ui-combobox-input")
                    .css({
                "width": px - 30
            });
            /* Se for ipad bloquea a escrita nos campus */
            var isiPad = /ipad/i.test(navigator.userAgent.toLowerCase());
            if (isiPad)
                if (bReadOnly)
                    input.attr('readonly', true);


            if (dev_window) {
                this.box = this._window();
            } else {
                var dialog = input.parents('.dev-window');
                input.autocomplete({
                    delay: 0,
                    minLength: 0,
                    position: {
                        my: "right top",
                        at: "right bottom",
                        collision: 'flip',
                        within: dialog || window
                    },
                    source: function(request, response) {
                        var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                        response(select.children("option").map(function() {
                            var text = $(this).text();

                            if (this.value && (!request.term || matcher.test(text)))
                                return {
                                    label: text.replace(
                                            new RegExp(
                                            "(?![^&;]+;)(?!<[^<>]*)(" +
                                            $.ui.autocomplete.escapeRegex(request.term) +
                                            ")(?![^<>]*>)(?![^&;]+;)", "gi"
                                            ), "<strong>$1</strong>"),
                                    value: text,
                                    option: this
                                };
                        }));
                    },
                    select: function(event, ui) {
                        ui.item.option.selected = true;
                        self._trigger("selected", event, {
                            item: ui.item.option
                        });
                        $(ui.item.option).parent().change();
                    },
                    change: function(event, ui) {
                        if (!ui.item) {
                            var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i"),
                                    valid = false;
                            select.children("option").each(function() {
                                var itemSelecionado = $(this).is(':selected');
                                if ($(this).text().match(matcher) || itemSelecionado) {
                                    this.selected = valid = true;
                                    return false;
                                }
                            });
                            if (!valid) {
                                // remove invalid value, as it didn't match anything
                                $(this).val("");
                                select.val("");
                                input.data("autocomplete").term = "";
                                return false;
                            }
                        }
                    }
                })
                        .addClass("ui-widget ui-widget-content ui-corner-left");

                input.data("autocomplete")._renderItem = function(ul, item) {
                    return $("<li></li>")
                            .data("item.autocomplete", item)
                            .append("<a>" + item.label + "</a>")
                            .appendTo(ul);
                };
            }

            $("<a>")
                    .attr("tabIndex", -1)
                    .attr("dev-combowindow", 1)
                    //.attr("title", "Show All Items")
                    .appendTo(wrapper)
                    .button({
                icons: {
                    primary: "ui-icon-triangle-1-s"
                },
                text: false
            })
                    .removeClass("ui-corner-all")
                    .addClass("ui-corner-right ui-combobox-toggle")
                    .click(function() {

                if (!self.box) {
                    // close if already visible
                    if (input.autocomplete("widget").is(":visible")) {
                        input.autocomplete("close");
                        return;
                    }

                    // work around a bug (likely same cause as #5265)
                    $(this).blur();

                    // pass empty string as value to search for, displaying all results
                    input.autocomplete("search", "");
                    input.focus();
                } else {
                    if ($(this).attr('dev-combowindow') == '1') {
                        self.box.dialog("open");
                    }
                }
            });
            self.element.autocomplete().change();

            $('.ui-combobox input').css({
                "font-size": "12px",
                "color": "#333",
                "background": "#FFF",
                "border": "none",
                "height": dev_height
            });
            $('a.ui-button', $('.ui-combobox')).css("height", dev_height_button);
        },
        rebuild: function(callback) {
            if (this.isWindow) {
                callback = callback || function() {
                };
                this.box.remove();
                this.box = this._window();
                callback();
            }
        },
        /*
         * Seta o option que possui em seu JSON
         * o campo name com o valor value
         */
        value: function(name, value) {
            var self = this;
            var opts = this.element.children('option');


            opts.attr('selected', false);
            $.each(opts, function(j, elmt) {

                var el = $(elmt);
                if ($.trim(el.val()) != '')
                {
                    var elm_value = $.parseJSON(el.val());
                    if (elm_value[name] == value) {
                        el.attr('selected', 'selected');
                        self.element.next().next().find('input').val(el.text());
                        self.element.autocomplete().change();
                        return true;
                    }
                }
            });
        },
        /*
         * Retorna o JSON do option selecionado 
         */
        json: function(bolTexto) {
            var self = this;
            var option = this.element.children(":selected");
            if (bolTexto === undefined)
                bolTexto = false;
            if ($.trim(option.val()) !== '')
            {
                if (bolTexto)
                    return option.val();
                var json = $.parseJSON(option.val());
                return json;
            }
            return '';
        },
        /*
         * marca o valor do combo para link
         */
        selectLink: function(codigo) {
            var self = this;
            self.element.attr('dev-select-codigo', codigo);
        },
        /*
         * Limpa o combobox
         */
        clear: function() {
            var self = this;
            var strTextoSelecione = self.element.attr('text-sel');
            var opts = this.element.children('option');
            opts.attr('selected', false);
            $.each(opts, function(j, elmt) {
                var el = $(elmt);
                var elm_value = el.val();
                if ($.trim(elm_value) != '')
                {
                    el.remove();
                }
                else
                {
                    if ($.trim(el.text()) == strTextoSelecione)
                    {
                        el.attr('selected', 'selected');
                        self.element.autocomplete().change();
                        self.element.next().next().find('input').val(el.text());
                    }
                }
            });
        },
        /*
         * Limpa o combobox
         */
        clearAll: function() {
            var self = this;
            this.element.children().remove();
            self.element.autocomplete().change();
            self.element.next().next().find('input').val('');
        },
        /*
         * Limpa o combobox
         */
        selectedIndex: function(intPos) {
            var self = this;
            var opts = this.element.children('option');

            opts.attr('selected', false);
            $.each(opts, function(j, elmt) {

                var el = $(elmt);
                if (intPos == j)
                {
                    el.attr('selected', 'selected');
                    self.element.autocomplete().change();
                    self.element.next().next().find('input').val(el.text());
                }
            });
        },
        preencherComboBox: function(arrDados, strCampoMascara, strCampoCodigo, strCodigoSeleciona) {
            var self = this;
            self.clear();        
            for (intI = 0; intI < arrDados.length; intI++)
            {
                var objOption = $('<option value="">');
                if (arrDados[intI]["JSON"] == undefined)
                {
                    arrDados[intI]["JSON"] = JSON.stringify(arrDados[intI]);
                }
                objOption.val(arrDados[intI]["JSON"]);
                var strValor = strCampoMascara;
                for (var strCampo in arrDados[intI])
                {
                    strValor = strValor.replace(strCampo, arrDados[intI][strCampo]);
                }
                objOption.text(strValor);
                if (arrDados[intI][strCampoCodigo] == strCodigoSeleciona)
                {
                    objOption.attr('selected', true);                      
                    if (self.element.next().next().find('input').val() != strValor)
                    {
                       self.element.next().next().find('input').val(strValor); 
                    }
                }
                this.element.append(objOption)
            }           
        },
        disable: function() {
            var span = this.element.next('span');
            //disable combo
            this.input.autocomplete("disable");
            this.input.attr("disabled", true);
            span.addClass("ui-state-disabled");
            span.find('a').addClass("ui-state-disabled");
            this.wrapper.children('a').attr("dev-combowindow", -1);
        },
        enable: function() {
            var span = this.element.next('span');
            //enable combo
            this.input.autocomplete("enable");
            this.input.attr("disabled", false);
            span.removeClass("ui-state-disabled");
            span.find('a').removeClass("ui-state-disabled");
            this.wrapper.children('a').attr("dev-combowindow", 1);
        },
        destroy: function() {
            this.wrapper.remove();
            this.element.show();
            $.Widget.prototype.destroy.call(this);
        },
        _window: function() {
            var self = this,
                    _width = this.element.attr('dev-window-width'),
                    _column = this.element.attr('dev-window-column'),
                    id = this.windowId = 'ui-widget-' + $.widget_id,
                    options = this.element.children('option'),
                    ul = $("<ul>").addClass('dev-combowindow-ul'),
                    box;
            box = $('<div>').attr("id", id).hide().insertAfter(this.element.next());
            box.addClass('dev-combowindow');
            box.append(ul);

            $.each(options, function(i, elm) {
                var el = $(elm);
                var val = $(elm).val();
                if ($.trim(val) != '')
                {
                    var label = $('<span>');
                    var html_li = $('<li></li>').css({
                        "cursor": "pointer",
                        "width": (_width / _column) - 25
                    });

                    var html = null;
                    var input = $('<input type="radio">');
                    /*
                     html_li.hover(function(){
                     $(this).addClass('ui-state-focus');
                     },function(){
                     $(this).removeClass('ui-state-focus');
                     });
                     */

                    html_li.append(input);
                    html_li.append('<span>');
                    html_li.children('span').text(el.text());

                    html = box.children("ul").append(html_li);
                    input.attr({
                        "name": 'dev-' + self.element.attr('name'),
                        "value": $(elm).val()
                    });

                    input.bind("click", function() {
                        var _input = $(this);
                        box.dialog("close");
                        self.element.val(_input.val())

                                ;
                        self.element.next().next('.ui-combobox').find('.ui-combobox-input').val(_input.next().text());
                        self.element.change();
                    });
                }
            }
            );

            box.dialog({
                title: "Selecione",
                modal: true,
                autoOpen: false,
                width: _width
            });

            $.widget_id++;

            return box;
        }

    });


    /**
     * Plugin de template
     * Utilizado para exibir layouts conforme os arquivos dev.tpl contidos em 
     * dev.components. Os arquivos de templates sao arquivos HTML que possuem TAGs
     * jquery-template, as TAGs recebem os valores do json retornado pela requisicao
     * ajax do componente. A requisicao ajax dispara automaticamente quando o evento ajax
     * for igual a ready, em casos que o evento for diferente devera ser disparado um metodo fire
     * manualmente da seguinte forma:
     * $("#nome-do-template").template("fire","load");
     *
     */
    $.widget("ui.template", {
        progressbar: false,
        options: {
            autoShow: true,
            datas: new Array(),
            beforeUpdate: function() {
            },
            afterUpdate: function() {
            },
            beforeCreate: function() {
            },
            afterCreate: function() {
            }
        },
        _create: function() {
            this.id = this.element.attr('id');
            this.local = $('#' + this.id);
            var id_template = this.id + '-template';
            this.template = $('#' + id_template);
            this.id_template_box = id_template + '-box';
            this.template_box = $('#' + id_template + '-box');
            this.widget_id = $.widget_id;

            this.progress = $('.ui-widget-progressbar').progressbar({
                value: 100
            });

            this.progressbar = this._progressbar();
            $.widget_id++;


            //this.create(this.options.datas);		

        },
        _progressbar: function() {
            /*
             var step = 20;
             return setInterval(function() {
             
             $('.ui-progressbar-value', this.progress).stop(true).animate({
             width: step + '%'
             }, 600);
             step = step >= 100 ? 0 : step;
             step += 20;
             
             }, 1000);
             */
        },
        _mask: function(datas, mask_list) {
            mask_list = mask_list || false;
            if (mask_list) {
                for (var i in datas) {
                    var obj = datas[i];
                    for (var j in obj) {
                        var ob = obj[j];
                        for (var k in ob) {
                            var value = ob[k];
                            if (mask_list[k]) {
                                datas[i][j][k] = mask_list[k](value);
                            }
                        }
                    }
                }
            }
            return datas;
        },
        create: function(datas, mask) {
            datas = this._mask(datas || new Array(), mask);

            this.options.beforeCreate();
            this.template.tmpl(datas).appendTo(this.local);
            this.show();
            this.options.afterCreate();
        },
        update: function(datas, mask) {
            try {
                this.options.beforeUpdate();
                var tmpl_item = $('#' + this.id_template_box).tmplItem();

                if (typeof tmpl_item.update !== 'function') {
                    throw Error("Template ainda nao foi criado");
                }

                datas = this._mask(datas || new Array(), mask);
                tmpl_item.data = datas;
                tmpl_item.update();
                this.show();
                this.options.afterUpdate();
            } catch (e) {
                this.create(datas, mask);
            }
        },
        show: function() {
            if (this.progressbar) {
                clearInterval(this.progressbar);
            }
            this.local.find('.dev-widget-template-wait').hide().next().show();
            this.local.show();
        },
        hide: function() {
            clearInterval(this.progressbar);
            this.local.hide();
        },
        wait: function() {
            this.progressbar = this._progressbar();
            this.local.find('.dev-widget-template-wait').show().next().hide();
        },
        fire: function(event) {
            event = event || 'ready';
            this.local.children('span[dev-comp=true]').trigger(event);
        }


    });

    // The jQuery.aj namespace will automatically be created if it doesn't exist
    $.widget("ui.fileupload", {
        ArquivoUpload: "/phpxml/classes/upload/class.FileUpload.php",
        UrlSubmit: "",
        UserName: "Anima",
        Pwd: "ugpe3jto",        
        Token: "",
        options: {
            pastaUpload: "/tmp/",
            progressbar: true,
            armazenaSessao: true,
            size: "",
			limiteArquivo: "",
            validaConteudoZip: false,
            tipoPermitidos: new Array(),
            compactaArquivo: true,	            	
            beforeUpload: function() {
            },
            retornoUpload: function() {
            },
            erroUpload: function(strMsgErro) {
                $.devDialog.alert(strMsgErro);
            }

        },
        _create: function() {
			
            this.id = this.element.attr('id');
            this.Token = this.element.attr('Token');
            var objForm = this.element.get(0).form;
            var strFormName = objForm.id;
            var objThis = this;
            this.form = $( '#'+strFormName );
            //this.form.attr("target", "iframeUpload");
            this.form.attr("method", "post");
            this.form.attr("accept-charset", "utf-8");
            this.form.attr("enctype", "multipart/form-data");
            this.form.attr("encoding", "multipart/form-data");

            this.form.submit( function( e ) {                 
                 // HTML file input, chosen by user
                 $.ajax( {
                          url: objThis.UrlSubmit,
                          type: 'POST',
                          data: new FormData(this),
                          processData: false,                          
                          contentType: false,
                          cache: false,//,
                          //crossDomain: true,
                          beforeSend: function (xhr) {
                            if(objThis.options.api)
                            {
                                xhr.setRequestHeader ("Authorization", "Basic " + btoa(objThis.UserName+":"+objThis.Pwd));
                                xhr.setRequestHeader ("tipoacesso", "1");                                            
                                xhr.setRequestHeader ("token", objThis.Token);                                                    
                            }
                            xhr.setRequestHeader ("enctype", "multipart/form-data");                            
                          },
                          success: function ( objJson ) {
                                if(typeof objJson == "string")
                                {
                                    objJson = $.parseJSON(objJson);
                                }
                                objThis._retornoUpload(objThis, objJson);
                          },
                          error: function ( objJson ) {
                                    
                                var strJson = objJson.responseText;
                                if(typeof strJson == "string")
                                {
                                    objJsonErro = $.parseJSON(strJson);
                                }
                                objThis._retornoErro(objThis, objJsonErro);
                          }                      
                    });
                    e.preventDefault();                                 
                });          
            // criando atributo fileupload no iframe
            this.local = $('#' + this.id);
            this.widget_id = $.widget_id;
            var strArquivoUpload = this.element.attr('ArquivoUpload');
            if(strArquivoUpload!= undefined && strArquivoUpload!="")
            {
                this.ArquivoUpload = strArquivoUpload;
            }

            this.local.bind("change", this.local, function() {
                objThis.realizarUpload()
            });
            $.widget_id++;
        },
        setOptions: function(opt) {
            var opcoes = $.extend({
                pastaUpload: this.options.pastaUpload,
                progressbar: this.options.progressbar,
                armazenaSessao: this.options.armazenaSessao,
                size: this.options.size,
                json: this.option.json,
				limiteArquivo:this.options.limiteArquivo,
                validaConteudoZip: this.options.validaConteudoZip,
                tipoPermitidos: this.options.tipoPermitidos,
                compactaArquivo: this.options.compactaArquivo,
                beforeUpload: this.options.beforeUpload,
                retornoUpload: this.options.retornoUpload,
                erroUpload: this.options.erroUpload,
                enviaParametros: this.options.enviaParametros,
                api: this.option.api
            }, opt);
            if(opcoes.json==undefined)
               opcoes.json = false;

            if(opcoes.enviaParametros==undefined)
               opcoes.enviaParametros = true;

            if(opcoes.api==undefined)
               opcoes.api = false;


                
            this.options = opcoes;
        },
        realizarUpload: function() {
            // evento para ser executado antes de realizar upload
            this.options.beforeUpload();

            var id = this.element.attr('id');
            //this._criaFrame(objForm);

            var strParametros = "";
            if(this.options.enviaParametros)
            {
                // pasta upload            
                strParametros += "strCaminhoPastaUpload=" + this.options.pastaUpload + "&";

                // verifica conteudo zip
                if (this.options.validaConteudoZip)
                    strParametros += "bolVerificarConteudoZip=S&";
                else
                    strParametros += "bolVerificarConteudoZip=N&";
                // nome do arquivo
                strParametros += "strNomFile=" + id + "&";

                // tamanho maximo do arquivo
                strParametros += "intTamanhoMaximoUpload=" + this.options.size + "&";

                // tamanho maximo do arquivo
                if (this.options.armazenaSessao)
                    strParametros += "bolArmazenaSessao=S&";
                else
                    strParametros += "bolArmazenaSessao=N&";

                // compacta arquivos		
                if (this.options.compactaArquivo)
                {
                    strParametros += "bolCompactaArquivos=S&";
                }
                else
                {
                    strParametros += "bolCompactaArquivos=N&";
                }

                // arquivos permitidos
                var strArrTiposPermitidos = '';
                if (this.options.tipoPermitidos.length)
                {
                    //converte os parametros
                    for (var intI = 0; intI < this.options.tipoPermitidos.length; intI++)
                    {
                        strArrTiposPermitidos = strArrTiposPermitidos + this.options.tipoPermitidos[intI] + '|';
                    }
                }
    			
                strParametros += "strArquivosPermitidos=" + strArrTiposPermitidos + "&";
    			strParametros += "intLimiteArquivo=" + this.options.limiteArquivo + "&";

                //submetendo                
                this.UrlSubmit = this.ArquivoUpload + "?" + strParametros;
            }
            else
            {
                this.UrlSubmit = this.ArquivoUpload;
            }
			
            this.form.submit();

            if (this.options.progressbar)
            {
                $.devDialog.wait.open();
            }

        },
        _retornoUpload: function(objFileUpload, objJson) {
            if (!objFileUpload)
                return;
            
            // limpando valor 
            objFileUpload.element.val('');
            
            if (objJson.MSGERRO)
            {
                objFileUpload.options.erroUpload(objJson.MSGERRO);
            }
            else if(objJson.ErroAnexo)
            {
                objFileUpload.options.erroUpload(objJson.ErroAnexo);
            }
            else if(objJson[0])
            {
               if (objJson[0].ErroAnexo)
                   objFileUpload.options.erroUpload(objJson[0].ErroAnexo);
               else
                   objFileUpload.options.retornoUpload(objFileUpload, objJson);
            }
            else
            {
                objFileUpload.options.retornoUpload(objFileUpload, objJson);
            }

            // tirando progressbar
            if (objFileUpload.options.progressbar)
            {
                $.devDialog.wait.close();
            }
        },
        _retornoErro: function(objFileUpload, objJson) {
            if (!objFileUpload)
                return;
            
            objFileUpload.element.val('');
            
            if (objJson.MsgRequisicao!=undefined)
                objFileUpload.options.erroUpload(objJson.MsgRequisicao);

            if (objJson.MSGERRO!=undefined)
                objFileUpload.options.erroUpload(objJson.MSGERRO);            

            // tirando progressbar
            if (objFileUpload.options.progressbar)
            {
                $.devDialog.wait.close();
            }
        }
    });

    $.widget("ui.calendar", {
        options: {
            dates: {
            }
        },
        _create: function() {
            this.refreshData = {};
            var
                    self = this,
                    options = $.parseJSON(this.element.attr("dev-date")),
                    size = this.element.attr("dev-date-size"),
                    current = this.element.attr("dev-date-current"),
                    allClick = this.element.attr("dev-date-allow-all"),
                    defaultdt =  this.element.attr("dev-default"),
                    dates = $.extend(this.options.dates, options, this.refreshData);

            this.element.datepicker({
                dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
                dayNamesMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa"],
                dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
                monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
                monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
                altFormat: "dd-mm-yyyy",
                prevText: "mês anterior",
                nextText: "próximo mês",
                numberOfMonths: size || 1,
                defaultDate: defaultdt,
                beforeShowDay: function(date) {
                    var d = date.getDate();
                    var m = date.getMonth() + 1;
                    var day = (d < 10) ? "0" + d : d;
                    var month = (m < 10) ? "0" + m : m;

                    var search = (day) + "/" + (month) + "/" + date.getFullYear();
                    if (dates[search]) {
                        return [false, 'dev-calendar-color-' + dates[search].color || "red", dates[search].text];
                    }
                    return [true];
                },
                onSelect: function(date) {
                    if (allClick) {
                        var dt = date.split('/'),
                                newDt = dt[1] + "/" + dt[0] + "/" + dt[2];

                        var fc = $.devModuleFunction(allClick);
                        fc.func(newDt, fc.context);
                    }
                },
                onChangeMonthYear: function(year, month, obj)
                {
                    cls = '.ui-datepicker-unselectable span';
                    $(cls, self.element).live('click', function() {
                        var d = $(this).text();
                        var day = (d < 10) ? "0" + d : d;
                        var monthDate = (month < 10) ? "0" + month : month;
                        var search = (day) + "/" + (monthDate) + "/" + year;
                        if ((options[search] && options[search].click)) {
                            var method = options[search].click;
                            var fc = $.devModuleFunction(method);
                            fc.func(search, fc.context);
                        }
                    });
                }

            });

            // allClick = '1';
            cls = '.ui-datepicker-unselectable span';
            if (allClick) {
                // cls = '';
                $(cls).css("cursor", 'pointer');
            } else {
                this.element.find('td a').css("cursor", "default");
            }

            $(cls, this.element).live('click', function() {
                var dt = self.element.datepicker('getDate');
                var d = $(this).text();
                var m = dt.getMonth() + 1;
                var day = (d < 10) ? "0" + d : d;
                var month = (m < 10) ? "0" + m : m;

                var search = (day) + "/" + (month) + "/" + dt.getFullYear();
                if ((options[search] && options[search].click)) {
                    var method = options[search].click;
                    var fc = $.devModuleFunction(method);
                    fc.func(search, fc.context);
                }
            });
            $('a .ui-state-active', this.element).css("background", '#74848A');
            if (current == 0) {
                $(this.element).find(".ui-datepicker-today a")
                        .removeClass('ui-state-default ui-state-highlight ui-state-active');
            }
            ;

            if (size > 1) {
                this.element.css("width", "auto");
            }
        },
        refresh: function(datas) {
            this.refreshData = datas;
            this.element.datepicker("refresh");
        }

    });//widget calendar
    
    $.widget("ui.facebook", {
        _create: function() {
            var objThis = this;
            this.element.live('click', function() {
                objThis._verificaStatusUsuario();
                return false;
            });
        },
        _verificaStatusUsuario: function() {
            var objThis = this;

            FB.getLoginStatus(function(response) {
                var accessToken = "";
                if (response.status !== 'connected') {
                    FB.login(function(response) {
                        if (response.authResponse) {
                            accessToken = response.authResponse.accessToken;
                            $.devDialog.wait.open();
                            FB.api('/me', function(response) {
                                objThis._compartilhar(accessToken, response.id, response.name);
                            });
                        }
                        else
                            return false;
                    }, {scope: 'publish_stream'});
                }
                else {
                    accessToken = response.authResponse.accessToken;
                    $.devDialog.wait.open();
                    FB.api('/me', function(response) {
                        objThis._compartilhar(accessToken, response.id, response.name);
                    });
                }
            });
        },
        _compartilhar: function(accessToken, codigoUsuarioRedeSocial, nomeUsuarioRedeSocial) {

            var elm = this.element;

            var parametros = elm.attr("dev-fb-parametros");
            var acao = elm.attr("dev-fb-acao");

            var funcaoBefore = elm.attr("dev-fb-beforecompartilhamento");
            var funcaoAfterSucesso = elm.attr("dev-fb-aftercompartilhamentosucesso");
            var funcaoAfterErro = elm.attr("dev-fb-aftercompartilhamentoerro");

            if (funcaoBefore != "") {
                $.devModuleFunction(funcaoBefore).func();
            }

            var dadosAjax = {
                accessToken: accessToken,
                acao: acao,
                codigoUsuarioRedeSocial: codigoUsuarioRedeSocial,
                nomeUsuarioRedeSocial: nomeUsuarioRedeSocial
            };

            //se foi definido algum parametro, acrescenta para ser enviado via ajax
            if (parametros != "")
                dadosAjax.parametros = parametros;

            $.devAjax({
                data: dadosAjax,
                action: "rede_social/index/salvar",
                success: function(retorno) {
                    if (retorno.sucesso) {
                        $.devDialog.alert("Nota compartilhada !", "Facebook");
                        if (funcaoAfterSucesso != "")
                            $.devModuleFunction(funcaoAfterSucesso).func(response);
                    }
                    else {
                        if (funcaoAfterErro != "")
                            $.devModuleFunction(funcaoAfterErro).func(response);
                    }
                }
            },
            {isProgressbar: true});

        }
    }); //widget facebook

    $.widget("ui.cep", {
        _create: function() {
            var self = this,
                    config = this.config = {
                fields: {
                    "cep": "#txtCepEndereco",
                    "bairro": "#txtNomBairro",
                    "rua": "#txtNomLogradouro",
                    "cod_estado": {
                        "field": "#cmbCodEstado",
                        "column": "CODESTADO",
                        "isLinked": false
                    },
                    "cidade": "#txtNomCidade",
                    "json_cidade": "#hidtxtNomCidade_codigo"
                }
            };
            $.extend(this.config, $.parseJSON(this.element.attr('dev-cep')));
            this.dialogOpened = false;
            this.element.removeAttr('title');
            this._criarLayout();

            $.devAjax({
                data: {
                            NOMLOGRADOURO: this.config.fields.rua,
                            CODESTADO: this.config.fields.cod_estado,
                            NOMCIDADE: this.config.fields.cidade 
                        },
                action: "cep/busca/componentes",
                success: function(response) {
                    var log = response.logradouro.html,
                            est = response.estado.html,
                            cid = response.cidade.html;
                    self._criarDialog(log, est, cid)
                }
            }, {isProgressbar: false});
            this._criarDialog();
            this.element.blur(function() {
                self.buscar();
            });
        },
        _criarLayout: function() {
            var input = this.element,
                    height = this.element.css('height'),
                    iHeight = height.replace("px", ""),
                    width = this.element.css('width'),
                    iWidth = parseInt(width.replace("px", ""), 10) - 5,
                    borderColor = input.css("border-top-color"),
                    borderStyle = input.css("border-top-style"),
                    borderWidth = input.css("border-top-width"),
                    border = this.border = borderWidth + " " + borderStyle + " " + borderColor,
                    box = $('<span>').css({
                "border": border,
                "display": "block",
                "float": "left",
                "height": box,
                "width": width
            }),
            iconBox = this.btnOpen = $('<span>').css({
                "cursor": 'pointer',
                "width": "40px",
                "height": (iHeight - 2) + "px",
                "display": "block",
                "float": "left"
            }),
            icon = $('<span>').css({
                "margin": "11px"
            }).addClass('ui-icon')
                    .addClass('ui-icon ui-icon-search'),
                    parentInput = input.parent();

            input.css({
                "height": (iHeight - 2) + "px",
                "width": (iWidth - 41) + "px",
                "border": "none",
                "border-right": border,
                "float": "left"
            });
            iconBox.append(icon);
            box.append(iconBox);
            box.prepend(input)
            parentInput.append(box);
        },
        _criarDialog: function(htmlLogradrouro, htmlEstado, htmlCidade) {
            this.dialog = $('<div>').attr("id", this.element.attr('name') + "-dialog");

            var self = this,
                    form = this.form = $("<div>").addClass("dev-form").addClass("dev-form-cep"),
                    /* temp */

                    /* botao de pesquisar*/
                    iconBox = $('<span>').css({
                "height": "39px",
                "margin-top": "41px",
                "width": "39px",
                "float": "left",
                "display": "block",
                "border": self.border,
                "cursor": "pointer"
            }).attr("title", "Pesquisar por CEP")
                    .addClass("ui-widget")
                    .addClass("ui-widget-header"),
                    iconProcurar = $('<span>').addClass("ui-icon")
                    .addClass("ui-icon-search")
                    .css({
                "margin": "12px 11px"
            });
            iconBox.append(iconProcurar);
            iconBox.hover(function() {
                $(this).addClass("ui-state-hover");
            }, function() {
                $(this).removeClass("ui-state-hover");
            });
            iconBox.click(function() {
                self.buscar();
            });

            form.append(htmlLogradrouro)
                    .append(htmlEstado)
                    .append(htmlCidade)
                    .append(iconBox);
            this.dialog.append(form).append($("<div>").addClass("dev-cep-list"));

            $('body').append(this.dialog);
            this.dialog.dialog({
                title: "Busca de cep",
                modal: true,
                autoOpen: false,
                width: 870,
                height: 600,
                buttons: {
                    "Confirmar": function() {
                        self.dialog.dialog("close");
                    }
                },
                close: function() {
                    //ao fechar a janela, se o campo de CEP estiver vazio, dá o foco para ele,
                    //caso contrário dá o foco para o campo de endereço
                    if ($(self.config.fields["cep"]).val() == "") {
                        $(self.config.fields["cep"]).focus();
                    }
                    else {
                        $(self.config.fields["rua"]).focus();
                    }

                    self.dialogOpened = false;
                },
                open: function() {
                    self.dialogOpened = true;
                }
            });
            $('input[type=text]', form).css({
                "height": "38px"
            });
            $('[dev-type=autocompletar]').autocompletar();
            $('select', form).combobox();
            $('.ui-combobox input').css({
                "height": "38px"
            });
            $('a.ui-button', $('.ui-combobox')).css("height", "32px");
            //$.devComponent();


            this.btnOpen.click(function() {
                self.dialog.dialog("open");
            });
        },
        _change: function(input) {
            var endereco = this.values[input.val()];

            for (var i in this.config.fields) {

                var field = this.config.fields[i];
                //console.info($(field.field+"Cep").children(':selected'))
                if ($.isPlainObject(field)) { //combobox
                    $(field.field).combobox("value", field.column, endereco[i])
                } else { //input
                    $(field).val(endereco[i]);
                }

            }
            // fecha caixa de dialogo
            //$('.ui-icon-closethick').trigger('click');
            this.dialog.dialog('close');
        },
        buscar: function() {
            var self = this;
            var data = {};
            var error = new Array();

            var logradouro = this.config.fields.rua+"Cep";
            var estado = this.config.fields.cod_estado.field+"Cep";
            var cidade = this.config.fields.cidade+"Cep";

            logradouro = logradouro.substr(1);
            estado = estado.substr(1);

            if (this.dialogOpened) {
                var error = new Array();

                var log = $("input[name="+logradouro+"]").val();
                if (!log) {
                    error.push("Endereço nao pode ser vazio");
                }
                data['logradouro'] = log;

                var est = $("select[name="+estado+"]").combobox("json");
                if (!est) {
                    error.push("Estado nao pode ser vazio");
                }
                data['estado'] = est.CODESTADO;

                var cid = $(cidade).autocompletar("json");
                if (!cid) {
                    error.push("Cidade nao pode ser vazio");
                }
                data['cidade'] = cid.CODCIDADE;

                if (error.length) {
                    $.devDialog.error("<br/><br/>" + error.join("<br/>"));
                    return false; // cancela requisicao porque contem campos inválidos
                }
            } else {
                var cep = this.element.val();
                if (cep) {
                    data['cep'] = cep;
                } else {
                    return false; // cancela requisicao caso o blur aconteca com campo em branco
                }
            }

            $.devAjax({
                action: "cep/busca/endereco",
                data: data,
                before: function() {
                    self.clear();
                },
                success: function(response) {
                    if (response.error) {
                        $.devDialog.alert(response.message);
                        return false;
                    }
                    if (response.enderecos) {
                        self.popule(response.enderecos);
                    } else {
                        self.set(response);
                    }

                }
            });
        },
        set: function(response) {

            for (var i in this.config.fields) {
                var field = this.config.fields[i];

                //console.info($(field.field+"Cep").children(':selected'))
                if ($.isPlainObject(field)) { //combobox
                    if (!field.isLinked) {
                        $(field.field).attr('dev-select-codigo', response[field.hasLink]);
                    }
                    $(field.field).combobox("value", field.column, response[i]);
                } else { //input
                    $(field).val(response[i]);
                }
            }
        },
        //usado quando houver uma lista de enderecos. Somente com janela
        popule: function(enderecos) {
            var self = this;
            this.clear();
            this.values = new Object();
            var list = $("<ul>");
            for (var i in enderecos) {
                var li = $("<li>");
                var end = enderecos[i];
                var desc = end.cep + " - " + end.rua + ", " + end.bairro + ", " + end.cidade + ", " + end.estado;
                if (end.complemento_rua != "")
                    desc += ", " + end.complemento_rua;
                var input = $("<input>").attr({
                    "type": "radio",
                    "name": "cep-selected"
                }).val(i).click(function() {
                    self._change($(this));
                });
                var label = $("<label>").text(desc).val(i).click(function() {
                    self._change($(this));
                });

                this.values[i] = end;
                list.append(li.append(input).append(label));
            }
            this.form.next(".dev-cep-list").append(list);
        },
        clear: function() {
            this.form.next(".dev-cep-list").children().remove();
        }
    });

    $.widget("ui.devaccordion", {
        options: {
            length: 0,
            active: 0
        },
        styleElement: "",
        _create: function() {
            if (this.styleElement == "")
                this.styleElement = this.element.attr("style");
            this.removeTab = false;
            this.tbCount = 0;
            this._criarLayout();
            this._criarEvento();

            for (var i = 0; i < this.options.length; i++) {
                this.addTab.click();
            }

            if (this.options.length) {
                $("#tab-" + this.options.active).click();
            }
        },
        _destroy: function()
        {
            this.element.attr("style", this.styleElement);
            this.element.children().remove();
        },
        _criarLayout: function() {
            var id = this.element.attr("id"),
                    height = this.tabsHeight = this.element.attr("dev-height"),
                    isAddTab = this.element.attr("dev-addtab"),
                    isIcon = this.isIcon = this.element.attr("dev-icon"),
                    idContent = id + "-accordion-content",
                    title = this.element.attr('dev-title'),
                    header = $("<div>").addClass('ui-widget-header')
                    .css({
                "margin-bottom": "10px",
                "padding": "10px"
            }).html(title),
                    content = this.tabs = $("<div>").attr("id", idContent)
                    .css({"height": "16px", "margin": "5px"});

            var iconBox = this.addTab = $("<span>").addClass("dev-icon-box")
                    .attr("title", "Clique para adicionar uma nova aba"),
                    icon = $("<div>").addClass("ui-icon ui-icon-plus")
                    .css({
                "float": "right",
                "margin": "4px"
            });

            iconBox.hover(
                    function() {
                        $(this).addClass("ui-state-hover");
                    },
                    function() {
                        $(this).removeClass("ui-state-hover");
                    }
            );
            if (isAddTab !== "0" && title) {
                header.append(iconBox.append(icon));
                this.element.append(header);
            }
            this.element.append(content);
            this.element.addClass('ui-widget ui-widget-content')
                    .css({"min-height": (parseInt(height, 10) + 110) + "px", "position": "relative"});

            content.accordion({
                heightStyle: "fill"
            });

        },
        _criarEvento: function() {
            var self = this,
                    fc_name = this.element.attr("dev-success").split("."),
                    fc = $.devModules[fc_name[0]];

            if (fc_name.length) {
                fc = $.devModules[fc_name[0]][fc_name[1]];
            }

            //if (this.addTab) {
            this.addTab.click(function() {
                var size = self.tbCount;
                var html = fc($.devModules[fc_name[0]], size);
                var tabTitle = $("<h3>").attr({
                    'dev-index': size,
                    'id': 'tab-' + size
                }).html(html.title),
                        tabContent = $("<div>").css({
                    "position": "relative"
                }).html(html.content);
                var iconBox = null;
                if (self.isIcon) {
                    iconBox = $("<span>").attr("id", "tab-icon-" + size)
                            .addClass("ui-icon ui-icon-cancel")
                            .addClass(self.isIcon)
                            .css({"float": "right", "cursor": "default"});
                    tabTitle.append(iconBox);

                }

                self.tabs.append(tabTitle);
                self.tabs.append(tabContent)
                        .accordion("destroy")
                        .accordion({
                    heightStyle: "fill",
                    beforeActivate: function(event, ui) {
                        var h3 = $(ui.newHeader);
                        var div = $(ui.newPanel);
                        var html = fc($.devModules[fc_name[0]], h3.attr("dev-index"));
                        h3.html("<span class='ui-accordion-header-icon ui-icon ui-icon-triangle-1-s'/>" + html.title);
                        div.html(html.content);

                        if (iconBox) {
                            if (html.isIcon) {
                                iconBox.removeClass("ui-icon-check").addClass("ui-icon-cancel");
                            } else {
                                iconBox.addClass("ui-icon-check").removeClass("ui-icon-cancel");
                            }
                        }
                    },
                    activate: function(event, ui) {
                        if (self.removeTab === true) {
                            $(ui.oldHeader).remove();
                            $(ui.oldPanel).remove();
                            self.removeTab = false;
                        }
                    },
                    active: $('#tab-' + size)
                });
                var newHeight = parseInt(self.tabsHeight, 10) + (size * 30) + 110;

                self.element.css({"height": newHeight + "px"});
                self.element.find('.ui-accordion-content').css("height", self.tabsHeight + "px");
                self.tbCount++;
            });
            //}
        },
        remove: function(index) {
            this.removeTab = true;
            var tab = null;
            var title = this.tabs.find("[dev-index=" + index + "]"),
                    content = title.next("div");
            tab = title.prev().prev("h3");

            if (tab.length === 0) {
                tab = title.next().next("h3");
            }

            if (tab) {
                tab.click();
            } else {
                content.hide();
                title.hide();
            }
        },
        toggleIcon: function(index) {
            if (this.isIcon) {
                var icon = $("#" + "tab-icon-" + index);

                if (icon.hasClass("ui-icon-check")) {
                    icon.removeClass("ui-icon-check").addClass("ui-icon-cancel");
                } else {
                    icon.addClass("ui-icon-check").removeClass("ui-icon-cancel")
                }
            }
        }

    });

    $.widget("ui.wizard", {
        _create: function() {
            this.tabAllowed = {"tab-index-0": function() {
                    return true;
                }};
            this._criarLayout();
        },
        _criarLayout: function() {
            var self = this,
                    devSuccess = this.element.attr("dev-success"),
                    steps = this.steps = $.parseJSON(this.element.attr("dev-wizard-step")),
                    btnBox = $("<div>").addClass('ui-helper-reset ui-helper-clearfix dev-wizard-controller ui-widget'),
                    btnPrev = this.btnPrev = $("<button>").addClass('dev-wizard-controller-prev').text("Anterior"),
                    btnNext = this.btnNext = $('<button>').addClass('dev-wizard-controller-next').text("Próximo"),
                    btnImpress = this.btnImpress = $('<button>').addClass('dev-wizard-controller-impress').text("Imprimir").css("display", "none"),
                    tabsList = $("<ul>").addClass("dev-wizard-tabs"),
                    tabsContent = new Array();
            this.currentTab = 0;
            this.currentPasso = "";
            this.callbackContext = {};

            btnPrev.button({
                icons: {
                    primary: "ui-icon-circle-triangle-w"
                }
            });
            btnNext.button({
                icons: {
                    secondary: "ui-icon-circle-triangle-e"
                }
            });

            btnImpress.button({
                icons: {
                    primary: 'ui-icon-print'
                }
            });

            btnBox.append(btnImpress).append(btnNext).append(btnPrev);
            self.element.append(btnBox);
            btnPrev.hide();
            var j = 0;
            for (var i in steps) {
                var confStep = steps[i];
                var li = $("<li>").attr("id", "tab-index-" + j)
                        .attr("prevLabel", confStep.prevLabel || "Anterior")
                        .attr("nextLabel", confStep.nextLabel || "Próximo")
                        .attr("impress", confStep.impress || false),
                        a = $("<a>").attr("href", "#tab-" + j).text(i),
                        content = $("<div>").attr("id", "tab-" + j)
                        .text("tab-" + j);

                var conf = "tab-index-" + j,
                        fc_name = null, fc = null;


                if (confStep.action) {
                    fc_name = confStep.action.split("."),
                            fc = $.devModules[fc_name[0]];

                    if (fc_name.length) {
                        fc = $.devModules[fc_name[0]][fc_name[1]];
                    }

                    self.callbackContext[conf] = $.devModules[fc_name[0]];
                } else {
                    fc = function() {
                        return false;
                    };
                }

                self.tabAllowed[conf] = fc;
                if (confStep.html) {
                    var arrControlers = confStep.html.split("/");                    
                    switch(arrControlers.length)
                    {
                        case 1:
                            if (confStep.passo != undefined && confStep.passo !='')
                                a.attr("href", $.devUrlBase + confStep.html+'/index/index/passo/'+confStep.passo);
                            else
                                a.attr("href", $.devUrlBase + confStep.html+'/index/index/passo/'+(j+1));
                        break;
                        
                        case 2:
                            if (confStep.passo != undefined && confStep.passo !='')
                                a.attr("href", $.devUrlBase + confStep.html+'/index/passo/'+confStep.passo); 
                            else
                                a.attr("href", $.devUrlBase + confStep.html+'/index/passo/'+(j+1));                        
                        break;                        

                        case 3:
                            if (confStep.passo != undefined && confStep.passo !='')
                                a.attr("href", $.devUrlBase + confStep.html+'/passo/'+confStep.passo);                                                    
                            else
                                a.attr("href", $.devUrlBase + confStep.html+'/passo/'+(j+1));                        
                        break;

                        default:
                            if (confStep.passo != undefined && confStep.passo !='')
                                a.attr("href", $.devUrlBase + confStep.html+'/passo/'+confStep.passo);                                                    
                            else
                                a.attr("href", $.devUrlBase + confStep.html+'/passo/'+(j+1));    
                        break;                      
                    }                
                    content = null;
                }
                tabsList.append(li.append(a));
                tabsContent.push(content);
                j++;
            }
            ;
            self.element.append(tabsList);
            var disabledTabs = this.disabledTabs = new Array();
            for (var i = 0; i < j; i++) {
                self.element.append(tabsContent[i]);

                if (i) {
                    disabledTabs.push(i);
                }
            }
            this._criarEvento();
            btnBox.clone(true, true).appendTo(self.element);
            var btnNext = $('.dev-wizard-controller-next'),
                btnPrev = $('.dev-wizard-controller-prev'),
                hideShowBtns = function() {
                    switch (self.currentTab) {
                        case 0:
                            btnNext.show();
                            btnPrev.hide();
                            break;
                        case $.devGetSizeObj(self.tabAllowed) - 1:
                            btnPrev.show();
                            (self.steps[self.currentPasso].nextLabelUltimoPasso) ? btnNext.hide() : btnNext.show();                        
                            break;
                        default:
                            btnNext.show();
                            btnPrev.show();
                            break;
                    }
                };

            btnNext.click(hideShowBtns);
            btnPrev.click(hideShowBtns);
            $(".dev-wizard-tabs .ui-tabs-active").live('click', hideShowBtns);

            var content = '';
            var devProgress = true;
            self.element.tabs({
                disabled: disabledTabs,
                beforeLoad: function(event, ui) {
                    $(".dev-wizard-controller-impress").hide();
                    ui.panel.children().remove();
                    $.devDialog.wait.open();
                    ui.ajaxSettings.dataTypes = ['json'];
                    ui.ajaxSettings.contentType = 'application/x-www-form-urlencoded; charset=ISO-8859-1';                        
                    ui.ajaxSettings.success = function(resp) {
                        content = resp.html;
                        var currentStep = self.element.attr("dev-current-step");
                        if (currentStep == undefined || currentStep == "")
                            currentStep = 0;
                        if (currentStep > 0)
                        {
                            $('#tab-index-' + currentStep).children().click();
                            self.element.attr("dev-current-step", "0");
                            devProgress = false;
                        }
                        else
                            devProgress = true;
                    };
                },
                load: function(ev, ui) {
                    if ($('.ui-tabs-active').attr('impress') === 'false') {
                        $(".dev-wizard-controller-impress").hide();
                    } else {
                        $(".dev-wizard-controller-impress").show();
                    }
                    $(".dev-wizard-controller-prev .ui-button-text").text($('.ui-tabs-active').attr('prevLabel'));
                    $(".dev-wizard-controller-next .ui-button-text").text($('.ui-tabs-active').attr('nextLabel'));
                    $(ui.panel).html(content);
                    if (devSuccess) {
                        var conf = $.devModuleFunction(devSuccess);
                        conf.func(conf.context);
                    }
                    if (devProgress)
                        $.devDialog.wait.close();
                }
            });
            self._controleTabs(steps, self.element);
        },
        _controleTabs: function(steps, el)
        {
            var passo = 0;
            for (var i in steps) {
                var confStep = steps[i];
                if ((confStep.enable == undefined && passo == 0) || confStep.enable == "1" || confStep.enable)
                    el.tabs("enable", passo);
                passo++;
            }
        },
        _criarEvento: function() {
            var self = this;

            this.btnNext.click(function() {
                
                var currentContext = self.element.find("#ui-tabs-" + (1 + self.currentTab));
                var fireNext = function(/*callback*/) {                    
                    // callback = callback || function() {};
                    self.element.tabs("enable", ++self.currentTab);
                    self.element.find("#tab-index-" + self.currentTab + " a").trigger("click");
                };
                var context = self.callbackContext["tab-index-" + self.currentTab];
                self.tabAllowed["tab-index-" + self.currentTab](currentContext, fireNext, context);
                return false;
            });

            this.btnPrev.click(function() {
                if (self.currentTab > 0) {
                    --self.currentTab;
                    self.element.find("#tab-index-" + self.currentTab + " a").trigger("click");
                }
                return false;
            });

            this.btnImpress.click(function() {
                var context = $("#tab-index-" + self.currentTab).attr('impress');

                if (context !== "false") {
                    var content = $(context);
                    if (!content.is('iframe')) {
                        var win = window.open();
                        var body = $(win.document).find('body');
                        body.append(content.html());
                        win.focus();
                        win.print();
                        win.close();
                    } else {
                        content = $(content[0].contentWindow.document).find('body').html();
                        var hidden_IFrame = $('<iframe></iframe>').attr({
                            width: '1px',
                            height: '1px'
                        }).appendTo('body');
                        var myIframe = hidden_IFrame.get(0);
                        var frame_body = $(myIframe.contentWindow.document).find('body');
                        frame_body.html(content);
                        myIframe.contentWindow.print();
                        hidden_IFrame.remove();
                    }
                }
                return false;
            });

            this.element.find(".dev-wizard-tabs").find('li').click(function() {
				if ($(this).hasClass("ui-tabs-active"))
				{
					self.currentTab = $(this).prev().index() + 1;
					self.currentPasso = $(this).text();
				}
            });
        }
    });

    $.widget("ui.autocompletar", {
        _create: function() {

            var self = this,
                    options = $.parseJSON(this.element.attr("dev-autocompletar"));

            this.element.autocomplete({
                minLength: options.minLength,
                source: function(request, response) {

                    var objJsonCombo = null;
                    if (options.linkselect)
                    {
                        objJsonCombo = $('#' + options.linkselect).combobox('json');
                    }

                    var arrParametros = {};
                    for (var strParam in objJsonCombo)
                    {
                        arrParametros[strParam] = objJsonCombo[strParam];
                    }
                    $.devAjax(
                            {
                                data: {
                                    datasource: options.datasource,
                                    componente: options.componente,
                                    classe: options.classe,
                                    metodo: options.metodo,
                                    filtro: options.filtro,
                                    campodescricao: options.campodescricao,
                                    campocodigo: options.campocodigo,
                                    parametros: arrParametros,
                                    texto: self.element.val(),
                                    id: self.element.id,
                                    termo: request.term
                                },
                                action: "autocompletar/link/buscar", // acao ou url a ser executada
                                success: function(objJson) {
                                    response($.map(objJson.dados, function(item) {
                                        var keys = $.map(item, function(value, index) {
                                            return index;
                                        });
                                        return {
                                            label: item[options.campodescricao],
                                            id: item["JSON"]
                                        }
                                    })
                                            );
                                }
                            },
                    {
                        isProgressbar: false
                    }
                    );
                },
                select: function(event, ui) {
                    var strId = self.element.attr("id");
                    self.element.val(ui.item.label);
                    $('#hid' + strId + '_codigo').val(ui.item.id);
                    self.text = ui.item.label;
                    self.value = ui.item.id;
                    if (options.callback) {
                        var fc = $.devModuleFunction(options.callback);
                        if (fc.func)
                        {
                            var objJson = null;
                            if (self.value != "")
                            {
                                objJson = $.parseJSON(self.value);
                            }
                            fc.func(objJson, fc.context);
                        }
                    }
                },
                change: function(event, ui) {
                    var strId = self.element.attr("id");
                    if (ui.item == null) {
                        self.element.val("");
                        $('#hid' + strId + '_codigo').val("");
                        self.text = "";
                        self.value = "";
                    }
                }
            });

            this.element.blur(function(event, ui) {
                var v = self.element.val();
                if (v == '') {
                    var strId = self.element.attr("id");
                    $('#hid' + strId + '_codigo').val("");
                }
            });
        },
        /*
         * Seta o option que possui em seu JSON
         * o campo name com o valor value
         */
        value: function(name) {
            var self = this;
            var strId = self.element.attr("id");
            var objInput = $('#hid' + strId + '_codigo');
            if ($.trim(objInput.val()) != '')
            {
                var objJson = $.parseJSON(objInput.val());
                return objJson[name];
            }
            return "";
        },
        /*
         * Retorna o JSON do option selecionado 
         */
        json: function(bolTexto) {
            var self = this;
            var strId = self.element.attr("id");
            var objInput = $('#hid' + strId + '_codigo');
            if ($.trim(objInput.val()) != '')
            {
                if (bolTexto)
                {
                    return objInput.val();
                }
                var objJson = $.parseJSON(objInput.val());
                return objJson;
            }
            return '';
        }
    });//widget autocompletar    


    $.widget("ui.devtabs", {
        options: {},
        _create: function() {
            this.config = $.parseJSON(this.element.attr("dev-tab"));
            this._criarLayout();
        },
        _criarLayout: function() {
            var self = this;
            var tabNav = $("<ul>");
            this.element.append(tabNav);
            for (var i in this.config) {
                var panel = this.config[i],
                        id = i.replace(" ", "_"),
                        tabItem = $("<li>"),
                        tabLink = $("<a>").text(i),
                        tabContent = null;

                if (panel.html) {
                    tabLink.attr("href", panel.html);
                } else if (panel.context) {
                    tabLink.attr("href", "#" + id);
                    tabContent = $("<div>").attr("id", id).append($(panel.context));
                } else {
                    tabLink.attr("href", "#" + id);
                    tabContent = $("<div>").attr("id", id).append($.devModuleFunction(panel.callback));
                }

                tabItem.append(tabLink);
                tabNav.append(tabItem);
                this.element.append(tabContent);
            }

            var init = function(tab) {

                var idConfig = tab.children('a').text();
                var config = self.config[idConfig];
                var id = '#' + idConfig.replace(" ", "_");
                if (panel.callbackactivate)
                {
                    var fc = $.devModuleFunction(panel.callbackactivate);
                    fc.func(idConfig, fc.context);
                }
                if (config.context || config.callback) {
                    var content = config.context ? $(config.context) : $.devModuleFunction(panel.callback);
                    $(id).append(content);
                }
            };

            var opt = {
                create: function(event, ui) {
                    if (ui.tab)
                        init(ui.tab);
                },
                beforeActivate: function(ev, ui) {
                    init(ui.newTab);
                }
            };

            $.extend(this.options, opt);
            this.element.tabs(this.options);
        }
    });

    $.widget("ui.wizardvert", {
        options: {
            urlAtualizarPassos: ""
        },
        _create: function() {
            var self = this;
            this.wizardConfig = $.parseJSON(this.element.find("div:eq(0)").attr("dev-wizardvert-config"));
            this.numPassoAtual = 0;
            this.passosPercorridos = new Array();

            this._prepararElementos(0);
            this.buscarConteudoPrimeiroPasso();
            this._windowScroll();
        },
        _prepararElementos: function(inicio) {
            //atribui a ação dos botões avançar
            var botoesAvancar = this.element.find("a.next-step:gt(" + inicio + "), a.next-step:eq(" + inicio + ")");
            var self = this;
            botoesAvancar.each(function(i) {
                var botao = $(this);
                botao.click(function(event) {
                    return self._avancarPasso(event, self);
                });
            });

            //atribui a ação do clique nos passos, fazendo a página rolar
            $("li.menu-item-step:gt(" + inicio + ") a, li.menu-item-step:eq(" + inicio + ") a", this.element).each(function(i) {
                $(this).click(function() {
                    var elementoMenu = $(this);
                    var href = elementoMenu.attr('href').substr(1);
                    var elementoConteudo = $("div." + href, self.element);
                    self._rolarParaConteudo(elementoMenu, elementoConteudo, self);
                    return false;
                });
            });

        },
        buscarConteudoPrimeiroPasso: function() {
            this._buscarConteudoPasso(0, this);
        },
        _avancarPasso: function(event, self) {
		
            var elm = $(event.target);
            var indiceProximo = elm.attr("dev-wizardvert-next");
            var indiceAtual = elm.attr("dev-wizardvert-indice");
            //var indice = this.numPassoAtual;
            var itemStep = $(".item-step-" + indiceAtual, self.element);
			
			
			$.devAjax({
			data: {codConc:self.wizardConfig[indiceAtual].codConc},
			action: "index/passos/validaconcurso",
			success: function(retorno) {
			
				if (!retorno.sucesso){
					$.devDialog.error(retorno.mensagem, "Aviso",function(){
					location.reload();
				});
				} else{
				  //veirifca se foi setada uma função para ser executada antes de buscar o próximo passo
				  //se a função existir, ela será executada e ela mesma deve se encarregar de chamar a função do próximo passo
					var nomeFuncaoBefore = self.wizardConfig[indiceAtual]["config"]["before_next"];
					if (nomeFuncaoBefore != "") {
						nomeFuncaoBefore = nomeFuncaoBefore.split(".");  //quebra o modulo e a função
						$.devGetModuleScript(nomeFuncaoBefore[0], function() {
							var funcaoBefore = $.devModules[nomeFuncaoBefore[0]][nomeFuncaoBefore[1]];
							var fnProximo = function() {
								self.proximoPasso(indiceProximo);
							};
						funcaoBefore($.devModules[nomeFuncaoBefore[0]], itemStep, fnProximo);
						});
					}
					//se não existe nenhuma função definida, chama o próximo passo diretamente
				else {
					self.proximoPasso(indiceProximo);
				}
				}
			}

			},
			{isProgressbar: false});
			
            return false;
        },
        proximoPasso: function(indice) {
            this._atualizaPassos(indice, this);
            //this.numPassoAtual++;
            //this._buscarConteudoPasso(indice, this);
        },
        _atualizaPassos: function(indice, self) {
            //atualiza os passos
            if (self.options.urlAtualizarPassos != "") {
                $.devDialog.wait.open();
                $.devAjax({
                    data: {codConc:self.wizardConfig[indice].codConc},
                    action: self.options.urlAtualizarPassos,
                    success: function(retorno) {
					
						if (!retorno.sucesso){
							$.devDialog.wait.close();
							$.devDialog.error(retorno.mensagem, "Aviso",function(){
							location.reload();
                    	});
						}else{
							self._atualizarPassos(retorno.configs);
							self.numPassoAtual++;
							if (self.passosPercorridos[Number(indice)] === undefined) {
								self.passosPercorridos[Number(indice)] = true;
								if (Number(indice) <= self.wizardConfig.length) {
									self._buscarConteudoPasso(indice, self);
								}
							}
						}
                    },
                    error: function(retorno) {
                        $.devDialog.wait.close();

                        if (retorno.__error) {
                            $.devDialog.error("Erro ao atualizar os passos: " + retorno.__error, "Aviso");
                        }
                        else {
                            $.devDialog.error("Erro ao atualizar os passos.", "Aviso");
                        }

                    }
                },
                {isProgressbar: false});
            }
            else {
                $.devDialog.wait.close();

                //rola a página para o conteúdo carregado
                //self._rolarParaConteudo(menuItemStep.find("a"), itemStep, self);
            }
        },
        _buscarConteudoPasso: function(indice, self) {
            var url = self.wizardConfig[indice]["config"]["url_conteudo"];
            var itemStep = $(".item-step-" + indice, self.element);
            var menuItemStep = $("li.menu-item-step-" + indice, self.element);

            //quebra a url para saber qual o módulo, controlador e action
            var partesUrl = url.split("/");
            var nomeModulo = partesUrl[0];

            $.devDialog.wait.open();
            $.devAjax({
                data: {},
                action: url,
                success: function(retorno) {



                    $.devGetModuleScript(nomeModulo);

                    //coloca o HTML na div correspondente e exibe os botões de navegação
                    itemStep.find(".conteudo-step").html(retorno.html);
                    itemStep.show();

                    $.devComponent();
                    $.devValidation();
                    $.devMask();
                    $('select', itemStep).combobox();
                    $('input[dev-input-style=1]', itemStep).inputstyle();
                    $('[dev-date]', itemStep).calendar();
                    $('input[type="file"]', itemStep).fileupload();
                    $("[dev-accordion=true]", itemStep).devaccordion();
                    $('[jquery-template=1]', itemStep).template();
                    $('.compartilhar-facebook', itemStep).facebook();
                    $('[dev-type=cep]', itemStep).cep();
                    $('[dev-type=autocompletar]', itemStep).autocompletar();
                    $('[dev-tab]', itemStep).devtabs();

                    //rola a página para o conteúdo carregado
                    //self._rolarParaConteudo(menuItemStep.find("a"), itemStep, self);

                    //verifica se foi definida alguma função para ser executada após o passo ser carregado
                    var nomeFuncaoAfter = self.wizardConfig[indice]["config"]["after_load"];
                    if (nomeFuncaoAfter != "") {
                        nomeFuncaoAfter = nomeFuncaoAfter.split(".");  //quebra o modulo e a função
                        $.devGetModuleScript(nomeFuncaoAfter[0], function() {
                            var funcaoAfter = $.devModules[nomeFuncaoAfter[0]][nomeFuncaoAfter[1]];
                            funcaoAfter($.devModules[nomeFuncaoAfter[0]], itemStep);
                        });
                    }

                    $.devDialog.wait.close();
                      
                    //rola a página para o conteúdo carregado
                    self._rolarParaConteudo(menuItemStep.find("a"), itemStep, self);
                    //Funcao para chamar Scripts do google.....
                    //var src = 'https://inscricao.'+siglaInstituicao+'.br/VESTIB2/inscricao/dev.rsc/js/index/adwords-'+siglaInstituicao+'.php';
                   // var src = 'https://inscricao.' + siglaInstituicao + '.br/VESTIB/codigoFonte/inscricao/frame/google_analytics.php?intCodLocalHtml=3&TelaScriptGoogle=' + self.wizardConfig[indice]["config"]["url_conteudo"] + '&codIes=' + idInstituicao + '&codConc=' + self.wizardConfig[indice]["codConc"];
                   
                
                    if(typeof codTel === 'undefined'){
                             codTel = null;   
                    } 
                        if(codTel === null || codTel === ''){
                   
                      if(typeof inscricao === 'undefined'){
                             inscricao = null;   
                     
                    } 
                    
                    var src = $.devUrlServer+'/VESTIB/codigoFonte/inscricao/frame/google_analytics.php?intCodLocalHtml=3&TelaScriptGoogle=' + self.wizardConfig[indice]["config"]["url_conteudo"] + '&codIes=' + idInstituicao + '&codConc=' + self.wizardConfig[indice]["codConc"]+ ' + &codInscricao=' + inscricao; 
                    var html = '<iframe width="1" scrolling="no" height="1" frameborder="0" src="' + src + '"/>';
                    $('footer').append(html);

                }},
                error: function(retorno) {
                    $.devDialog.wait.close();

                    if (retorno.__error) {
                        $.devDialog.error(retorno.__error, "Aviso");
                    }
                    else {
                        $.devDialog.error("Erro na requisição.", "Aviso");
                    }

                }
            },
            {isProgressbar: false});
            //var src = 'https://inscricao.'+siglaInstituicao+'.br/VESTIB2/inscricao/dev.rsc/js/index/adwords-'+siglaInstituicao+'.php';
            //var src = 'http://localhost:8080/VESTIB/codigoFonte/inscricao/frame/google_analytics.php?intCodLocalHtml=2&TelaScriptGoogle=' + self.wizardConfig[indice]["config"]["url_conteudo"] + '&codIes=' + idInstituicao + '&codConc=' + self.wizardConfig[indice]["codConc"]+ '&codInscricao=' + inscricao; 
            
            //verifica se existe codigo de inscrição, se nao seta o valor para null
            var src = $.devUrlServer+'/VESTIB/codigoFonte/inscricao/frame/google_analytics.php?intCodLocalHtml=2&TelaScriptGoogle=' + self.wizardConfig[indice]["config"]["url_conteudo"] + '&codIes=' + idInstituicao + '&codConc=' + self.wizardConfig[indice]["codConc"]+'&navegacao='+indNavegacao;
            //var src = 'https://inscricao.'+siglaInstituicao+'.br/VESTIB/codigoFonte/inscricao/frame/google_analytics.php?intCodLocalHtml=2&TelaScriptGoogle=' + self.wizardConfig[indice]["config"]["url_conteudo"] + '&codIes=' + idInstituicao + '&codConc=' + self.wizardConfig[indice]["codConc"]+'&navegacao='+indNavegacao;

            $.ajax({
                url: src,
                success: function(retorno) {
                    eval(retorno);
                }
            });

            return false;
        },
        _rolarParaConteudo: function(elmItemMenu, elmConteudo, self) {

            if (elmConteudo.is(":visible")) {

                //rola a página
                $('html, body').animate({
                    scrollTop: elmConteudo.offset().top
                }, 500);

                //rola o menu
                /*$("div.navegacao ul", self.element).animate({
                 top: elmConteudo.offset().top
                 },500);*/


                //atualiza o número e o estilo do passo atual
                var indice = elmItemMenu.attr("dev-wizardvert-indice");
                var itensMenu = $("li.menu-item-step");
                var menuItemStep = $("li.menu-item-step-" + indice, self.element);
                var stepAtual = $(".step-atual", self.element);

                itensMenu.find("a").removeClass("active");
                menuItemStep.find("a").addClass("active");
                stepAtual.html(parseInt(indice) + 1);
            }
        },
        _windowScroll: function() {
            $(window).scroll(function() {
                var menu = $("div.navegacao ul", this.element);
                var alturaConteudo = $("div.conteudo", this.element).offset().top;
                var scrollJanela = $(window).scrollTop();

                //se o scroll passou da altura do conteúdo do primeiro passo, começa a rolar o menu
                //console.log(alturaConteudo+" - "+ scrollJanela);
                if (scrollJanela + 100 > alturaConteudo) {
                    //menu.css('top', scrollJanela+100);
                    menu.css({'position': 'fixed', 'top': '100px'});
                }
                else {
                    menu.css({'position': 'relative', 'top': 'auto'});
                }
            });
        },
        _atualizarPassos: function(newConfig) {
            var containerMenu = $("div.navegacao ul", this.element);
            var containerConteudo = $("div.conteudo", this.element);

            //atualiza os passos a frente do passo atual
            containerMenu.find("li.menu-item-step:gt(" + this.numPassoAtual + ")").remove();
            containerConteudo.find("div.item-step:gt(" + this.numPassoAtual + ")").remove();

            for (var i = this.numPassoAtual + 1; i < newConfig.length; i++) {

                //menu
                var li = $("<li class='menu-item-step menu-item-step-" + i + "'></li>");
                var link = $("<a href='#item-step-" + i + "' dev-wizardvert-indice='" + i + "'>" + newConfig[i]["passo"] + "</a>");

                li.append(link);
                containerMenu.append(li);

                //conteúdo
                var divItemStep = $("<div class='item-step item-step-" + i + "' style='display:none;'></div>");
                var divConteudo = $("<div class='conteudo-step'></div>");
                var divBotoes = $("<div class='botoes-navegacao'></div>");

                if (i + 1 < newConfig.length) {
                    var botao = $("<a href='#' class='button next-step' dev-wizardvert-next='" + (i + 1) + "' dev-wizardvert-indice='" + i + "'>Avançar</a>");
                    divBotoes.append(botao);
                }

                divItemStep.append(divConteudo);
                divItemStep.append(divBotoes);
                containerConteudo.append(divItemStep);
            }

            this.wizardConfig = newConfig;
            this._prepararElementos(this.numPassoAtual + 1);

            $(".total-steps", self.element).html(newConfig.length);

            //console.log("atualizarPassos");
            $.devDialog.wait.close();

            //volta o progressbar do ajax para o controle automático
            $.setAjaxProgressBarAutoControl(true);

            //rola a página para o conteúdo carregado
            //this._rolarParaConteudo(containerMenu.find("li.menu-item-step:eq(" + this.numPassoAtual + ") a"), containerConteudo.find("div.item-step:eq(" + this.numPassoAtual + ")"), this);
        }

    });

})(jQuery);

/* Portuguese inicializacao para jQuery UI date picker plugin. 
 * Usado somente em caso de campos com data para exibir o calendario tamnho pequeno
 * */  
jQuery(function($) {
    $.datepicker.regional['pt'] = {
        closeText: 'Fechar',
        prevText: 'Anterior',
        nextText: 'Seguinte',
        currentText: 'Hoje',
        monthNames: ['Janeiro', 'Fevereiro', 'Mar&ccedil;o', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        dayNames: ['Domingo', 'Segunda-feira', 'Ter&ccedil;a-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'S&aacute;bado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'S&aacute;b'],
        dayNamesMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'S&aacute;b'],
        weekHeader: 'Sem',
        dateFormat: 'dd/mm/yy',
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['pt']);
});

$('select').combobox();
$('input[dev-input-style=1]').inputstyle();
$('[dev-date]').calendar();
$('input[type="file"]').fileupload();
$("[dev-accordion=true]").devaccordion();
$('[jquery-template=1]').template();
$('.compartilhar-facebook').facebook();
$('[dev-type=cep]').cep();
$('[dev-type=autocompletar]').autocompletar();
$('[dev-tab]').devtabs();
$('[dev-type=datepicker]').datepicker();
