var objThis;
$.devModules.init("index", {
    _init: function () {
        objThis = this;
        $("#logar").click(this.logar);
        this._fireOnLoad(this.buscaTela);
        this._fireOnLoad(this.ativaEnter);
        this._fireOnLoad(this.ativaSlide);
        this._fireOnLoad(this.ativaSlideIlang);
        this._fireOnLoad(this.ativaPortlet);
        this._fireOnLoad(this.verificaLogin);
        // carrega as funcionalidades do combo assim que carrega a pagina por causa de links externos

        objAviso = $.parseJSON($('#hidAviso').val());
        if (objAviso && objAviso.length > 0) {
            for (var i = 0; i < objAviso.length; i++) {
                $.devDialog.alert(objAviso[i].TXTCONTEUDO, "Aviso");
            }
        }

        $('#btnExAluno').click(function () {
            $("input[type=text],input[type=password]").val('');
            $('.form_acesso_ex').show();
            $('.form_acesso_mat').hide();
            $('.form_acesso_pre').hide();
            $(".input_cpf").hide();
            $(".input_mat").show();
            $(".linkMat").hide();
            $(".linkVoltar").show();
            $("#comboAcesso").val(2);
            $("#loginEx01").attr('checked', true);
        });

        $('#btnPreMatricula').click(function () {
            $("input[type=text],input[type=password]").val('');
            $('.form_acesso_pre').show();
            $('.form_acesso_mat').hide();
            $('.form_acesso_ex').hide();
            $(".input_cpf").show();
            $(".input_mat").hide();
            $(".linkMat").hide();
            $(".linkVoltar").show();
            $("#comboAcesso").val(3);
        });

        //direciona pra pre matricula se url acesso/pre
        urlLogin = window.location.pathname;
        if (urlLogin.indexOf('/acesso/pre') !== -1) {
            $('#btnPreMatricula').trigger('click');
        }

        $('.btnVoltarLogin').click(function () {
            $("input[type=text],input[type=password]").val('');
            $('.form_acesso_mat').show();
            $('.form_acesso_ex').hide();
            $('.form_acesso_pre').hide();
            $(".input_cpf").hide();
            $(".input_mat").show();
            $(".linkMat").show();
            $(".linkVoltar").hide();
            $("#comboAcesso").val(1);
        });

        // ação botao checbox CPF
        $(".opt_check").click(function () {
            // limpa os campos do formulario
            $("input[type=text],input[type=password]").val('');

            switch ($(this).val()) {
                case '1':
                    //$(this).removeClass('ui-state-hover');
                    $(".input_cpf").hide();
                    $(".input_mat").show();
                    break;
                case '2':
                    //$(this).addClass('ui-state-hover');
                    $(".input_cpf").show();
                    $(".input_mat").hide();
                    break;
                default:
                    break;
            }

        }).hover(function () {
            //$(this).toggleClass('ui-state-hover');
        });
        
        // mascaras dos campos
        if (!/iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
            $("#num_cpf").setMask("999.999.999-99");
            $("#dat_nascimento").setMask("99/99/9999");
        }

        // evento para login do egresso
        $(".logarEgresso").live('click', function () {
            var dados = $.parseJSON($(this).attr('dados'));

            $.devAjax({
                data: {
                    INITSESSION: 'S',
                    DADOSALUNO: dados
                },
                action: "index/seguranca/login_egresso", // acao ou url a ser executada
                success: function (response) {
                    if (response.successEgresso) {
                        // fecha caixa de dialogo
                        $('.ui-icon-closethick').trigger('click');
                        $("#dev-login-wait").next().hide();
                        $("#dev-login-wait").fadeIn(900, function () {
                            if (response.restricao) {
                                window.location.href = response.link;
                            } else {
                                window.location.href = $.devUrlBase;
                            }
                        });
                        return false;
                    } else {
                        $.devDialog.alert('Erro ao realizar o login', 'Atenção');
                    }
                }
            });
        });

        // evento para login do ingressante
        $(".logarIngressante").live('click', function () {
            var dados = $.parseJSON($(this).attr('dados'));

            $.devAjax({
                data: {
                    INITSESSION: 'S',
                    DADOSALUNO: dados
                },
                action: "index/seguranca/login_ingressante", // acao ou url a ser executada
                success: function (response) {
                    if (response.successIngressante) {
                        // fecha caixa de dialogo
                        $('.ui-icon-closethick').trigger('click');
                        $("#dev-login-wait").next().hide();
                        $("#dev-login-wait").fadeIn(900, function () {
                            window.location.href = $.devUrlBase;
                        });
                        return false;
                    } else {
                        $.devDialog.alert('Erro ao realizar o login', 'Atenção');
                    }
                }
            });
        });

    },
    verificaLogin: function () {
        var bolLogin = $('#autologin').val();
        if (bolLogin)
            $("#logar").click();
    },
    logar: function () {
        var matricula = $.trim($("input[name=matricula]").val());
        var senha = $.trim($("input[name=senha]").val());
        var num_cpf = $("input[name=num_cpf]").val();
        var dat_nascimento = $("input[name=dat_nascimento]").val();
        var combo = $('#comboAcesso').val();
        var error = false;
        var mensagem = "";
        var acao = "";


        // verifica se é aluno ativo, egresso ou temporario (ingressante)
        switch (combo) {
            case"1":
                acao = "index/seguranca/login";
                // realiza a validação dos campos
                if (matricula == "" && senha == "") {
                    mensagem = "Os campos RA e Senha são obrigatórios para o login";
                    error = true;
                } else if (matricula == "") {
                    mensagem = "O campo RA é obrigatório para o login";
                    error = true;
                } else if (senha == "") {
                    mensagem = "O campo senha é obrigatório para o login";
                    error = true;
                }
                break;
            case"2":
                acao = "index/seguranca/login_egresso";
                // verifica se setou a opção de cpf
                if ($('input:radio[name=loginEx]:checked').val() == '2') {
                    // realiza a validação dos campos
                    if (num_cpf == "" && dat_nascimento == "") {
                        mensagem = "Os campos CPF e Data de nascimento são obrigatórios para o login";
                        error = true;
                    } else if (num_cpf == "") {
                        mensagem = "O campo CPF é obrigatório para o login";
                        error = true;
                    } else if (dat_nascimento == "") {
                        mensagem = "O campo Data Nascimento é obrigatório para o login";
                        error = true;
                    }
                } else {
                    // realiza a validação dos campos
                    if (matricula == "" && senha == "") {
                        mensagem = "Os campos RA e senha são obrigatórios para o login";
                        error = true;
                    } else if (matricula == "") {
                        mensagem = "O campo RA é obrigatório para o login";
                        error = true;
                    } else if (senha == "") {
                        mensagem = "O campo senha é obrigatório para o login";
                        error = true;
                    }
                }
                break;

            case"3":
                acao = "index/seguranca/login_ingressante";
                // realiza a validação dos campos
                if (num_cpf == "" && dat_nascimento == "") {
                    mensagem = "Os campos CPF e Data de Nascimento são obrigatórios para o login";
                    error = true;
                } else if (num_cpf == "") {
                    mensagem = "O campo CPF é obrigatório para o login";
                    error = true;
                } else if (dat_nascimento == "") {
                    mensagem = "O campo Data Nascimento é obrigatório para o login";
                    error = true;
                }

                break;
            default:
                break;
        }

        // lança os erros para aluno
        if (error) {
            $.devDialog.alert(mensagem, "Atenção");
            return false;
        }

        $.devAjax({
            action: acao,
            data: {opcao_acesso: $('input:radio[name=loginEx]:checked').val()},
            context: 'form',
            success: function (response) {

                //Set Identity Aluno / Funcionário Session Storage
                if (response.data != undefined) {
                    if (response.data.identity.access_token != undefined) {
                        sessionStorage.setItem("SOL_ANIMA_TOKEN", response.data.identity.access_token);
                        sessionStorage.setItem("SOL_ANIMA_REFRESH_TOKEN", response.data.identity.refresh_token);
                    }
                }

                // verifica se é aluno ativo, egresso ou temporario (ingressante)
                switch (combo) {
                    case"1":
                        // condiçoes normal para ALUNO ATIVO
                        if (response.restricao === "403" || (response.restricao && response.restricao !== "405" && response.restricao !== "403")) {
                            if (response.html) {
                                $.devWindow({
                                    html: response.html,
                                    title: "Você possui pendências",
                                    ajax: false,
                                    modal: true,
                                    minimize: false,
                                    maximize: false
                                });
                            } else {
                                if (!response.url)
                                    $.devDialog.alert(response.link, "Segurança");
                                else {
                                    $.devDialog.alert(response.link, "Segurança",
                                        function () {
                                            window.location.href = response.url;
                                        }
                                    );
                                }
                            }
                        } else if (response.restricao != "405") {
                            $("#dev-login-wait").next().hide();
                            $('.form_acesso_mat').hide();
                            $('.form_acesso_cpf').hide();
                            $('.linkCont').hide();
                            $("#dev-login-wait").fadeIn(900, function () {
                                window.location.href = $.devUrlBase;
                            });
                        } else {
                            $('.form_acesso_mat').hide();
                            $('.linkCont').hide();
                            $("#dev-login-wait").next().hide();
                            $("#dev-login-wait").fadeIn(900, function () {
                                window.location.href = response.link;
                            });
                        }
                        break;
                    case"2":
                        if (response.restricao === "403") {

                            $.devWindow({
                                html: response.html,
                                title: "Você possui pendências",
                                ajax: false,
                                modal: true,
                                minimize: false,
                                maximize: false
                            });
                            return false;

                        } else {
                            //verifica acesso do egresso
                            if (response.successEgresso) {
                                // se aluno foi validado redireciona
                                if (response.redirect) {

                                    $("#dev-login-wait").next().hide();
                                    $("#dev-login-wait").fadeIn(900, function () {
                                        if (response.restricao) {
                                            window.location.href = response.link;
                                        } else {
                                            window.location.href = $.devUrlBase;
                                        }
                                    });

                                    return false;
                                }
                                // se aluno possui mais de um curso
                                $.devWindow({
                                    height: 300,
                                    html: response.html,
                                    title: "Selecione o curso correspondente",
                                    html: response.tabelaCursos,
                                    ajax: false,
                                    modal: true,
                                    minimize: false,
                                    maximize: false,
                                    callback: function () {
                                        $('.btnEgressoLogin').hover(function () {
                                            $(this).addClass("ui-state-hover");
                                        }, function () {
                                            $(this).removeClass("ui-state-hover");
                                        });
                                    }
                                });
                                return false;
                            } else {
                                $.devDialog.alert(response.mensagem, "Atenção");
                                return false;
                            }
                        }
                        break;

                    case"3":
                        //verifica acesso do ingressante
                        if (response.successIngressante) {
                            // se aluno foi validado redireciona
                            if (response.redirect) {

                                $("#dev-login-wait").next().hide();
                                $('.form_acesso_cpf').hide();
                                $("#dev-login-wait").fadeIn(900, function () {
                                    window.location.href = $.devUrlBase;
                                });

                                return false;
                            }
                            // se aluno possui mais de um concurso para selecionar
                            $.devWindow({
                                height: 300,
                                html: response.html,
                                title: "Selecione o concurso correspondente",
                                html: response.tabelaConcursos,
                                ajax: false,
                                modal: true,
                                minimize: false,
                                maximize: false,
                                callback: function () {
                                    $('.btnIngressanteLogin').hover(function () {
                                        $(this).addClass("ui-state-hover");
                                    }, function () {
                                        $(this).removeClass("ui-state-hover");
                                    });
                                }
                            });
                            return false;
                        } else {
                            $.devDialog.alert(response.mensagem, "Atenção");
                            return false;
                        }
                        break;
                    default:
                        break;
                }
            }
        });


    }
    , buscaTela: function () {
        var elm = $("[dev-tela]"),
            url = elm.attr("dev-tela");

        if (elm.length) {
            $.devAjax({
                action: url,
                success: function (response) {
                    if (response.urlrestricao != undefined && response.urlrestricao)
                        document.location = $.devUrlBase;
                    else {
                        elm.html(response.html);
                        $.devRefreshComponent('[dev-tela]');
                        $('#chkAceite').css({
                            "height": "15px"
                        });
                        $.devGetModuleScript(elm.attr("dev-modulo"));
                    }
                }
            });
        }
    }
    , aceitaMatricula: function () {
        var radio = $("#chkAceite").get(0);

        if (radio) {
            if (radio.checked) {
                $.devAjax({
                    data: {IND_ACEITE: 'S'},
                    action: "matricula/contrato/aceite", // acao ou url a ser executada
                    success: function (response) {
                        if (response.ACEITE) {												//
                            $.devDialog.alert('Seu contrato foi aceito', 'Matrícula on-line', function () {
                                window.location.href = $.devUrlBase;
                            });
                        } else {
                            $.devDialog.error('Erro ao aceitar os termos do contrato', 'Matrícula on-line');
                        }
                    }
                });
            } else {
                $.devDialog.error('Favor aceitar os termos do contrato.', 'Matrícula on-line');
            }
        } else {
            window.location.href = $.devUrlBase;
        }
    }
    , ativaEnter: function () {
        $(document).bind('keypress', function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code === 13) {
                $("#logar").trigger("click");
            }
        });
    }
    , loadScriptQuestWeb: function () {
        // carrega o script do questionario web
        $.devGetModuleScript('questionario');
        //$.devModules.questionarioweb.exibeMensagemAvalAtendProtocolo()
    }
    , ativaSlide: function () {

        if ($("#slides2"))
            ativarSlides('#slides2');
    }
    , ativaSlideIlang: function () {

        if ($("#slide-ilang"))
            ativarSlides('#slide-ilang');
    }
    , ativaPortlet: function (self) {
        $('.addContent').find('li').click(function () {
            var portletId = $(this).attr('idportlet'),
                portlet = $('#' + portletId);

            if (!portlet.hasClass('green')) {
                portlet.show(1000);
            }

            self.salvarPortlets();
            return false;
        });
        $('.add').click(function () {
            $('.addContent').toggle(500);
            return false;
        });

        $('.column').find('.ui-icon-trash').live('click', function () {
            $(this).parent().parent().hide(1000);
            self.salvarPortlets();
        });
    }
    , salvarPortlets: function () {

        $.devDialog.check(function () {
            var conf = new Array();
            $.each($('.column'), function (index, elm) {
                var portlet = new Array();

                $.each($(elm).find('.portlet'), function (ix, pt) {
                    var p = $(pt);
                    portlet.push({
                        'name': p.attr('nome'),
                        'column': index,
                        'line': ix,
                        'show': p.css('display')
                    });
                });
                conf.push(portlet);
            });

            $.devAjax({
                data: {
                    portlets: conf
                },
                action: 'index/index/salvar',
                success: function (resp) {
                    if (resp.salvo === 'true') {
                        $.devDialog.alert('Layout de tela inicial salvo com sucesso.');
                    } else {
                        $.devDialog.error('Não foi possivel salvar o novo layout. Tente mais tarde.');
                    }
                }
            });
        }, function () {
        }, {
            text: "Deseja salvar o novo layout ?",
            title: "Mudança de layout"
        });
    }

});
