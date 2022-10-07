$.devAction = {
    event: {

        click: {
            ".bt-sair": function () {

                $.devAjax({
                    action: "index/seguranca/logout",
                    success: function (response) {
                        window.location.href = $.devUrlBase + 'index/seguranca/dev/instituicao/' + response.codInstituicao;
                    }
                });
                return false;
            },
            ".cabecalho-sair": function () {

                $.devAjax({
                    action: "index/seguranca/logout",
                    success: function (response) {
                        window.location.href = $.devUrlBase + 'index/seguranca/dev/instituicao/' + response.codInstituicao;
                    }
                });
                return false;
            },
            ".android": function () {
                window.open("https://play.google.com/store/apps/details?id=br.anima.sol");
            },
            ".apple": function () {
                window.open("https://itunes.apple.com/br/app/sol-aluno/id901572561");
            },
            ".windows-phone": function () {
                window.open("https://www.microsoft.com/pt-br/store/p/sol-aluno-mobile/9nblggh5xd01");
            },
            ".noticia": function () {
                window.open($(this).attr('link'));
            },
            ".atendimento": function () {
                window.open($(this).attr('link'));
            },
            ".editar-dados": function () {
                window.location.href = $(this).attr('link');
            },
            ".sair": function () {

                $.devAjax({
                    action: "index/seguranca/logout",
                    success: function (response) {
                        window.location.href = $.devUrlBase + 'index/seguranca/dev/instituicao/' + response.codInstituicao;
                    }
                });
                return false;
            },
            ".bt-trocar": function () {
                $.devWindow({
                    title: "Trocar Curso",
                    width: 900,
                    height: 500,
                    modal: true,
                    minimize: false,
                    maximize: false,
                    url: "index/index/cursos",
                    callback: function ()
                    {
                        $('.buttonAcao').hover(function () {
                            $(this).addClass("ui-state-hover");
                        }, function () {
                            $(this).removeClass("ui-state-hover");
                        });
                    }
                });
            },
            ".buttonAcao": function ()
            {
                var intLinha = $(this).attr('numlinhatabela');
                var intCodAlunoAtual = $('#hidCodAluno').val();
                var intCodAlunoNovo = objJson_tblCursosAssociados[intLinha].CODALUNO;
                $.devAjax({
                    data: {
                        alteraCurso: 'S',
                        aluno_atual: intCodAlunoAtual,
                        aluno_novo: intCodAlunoNovo
                    },
                    action: "index/seguranca/login",
                    context: '#divCursosAssociados',
                    success: function (response) {
                        var link = $.devUrlBase;
                        if (response.restricao) {
                            link = response.link;
                        }
                        window.location.href = link;
                    }
                });
            },
            ".bt-trocar-ingressante": function () {
                $.devWindow({
                    title: "Trocar Concurso",
                    height: 300,
                    modal: true,
                    minimize: false,
                    maximize: false,
                    url: "index/index/cursos",
                    callback: function ()
                    {
                        $('.btnIngressanteTrocar').hover(function () {
                            $(this).addClass("ui-state-hover");
                        }, function () {
                            $(this).removeClass("ui-state-hover");
                        });
                    }
                });
            },
            ".trocarIngressante": function ()
            {
                var dados = $.parseJSON($(this).attr('dados'));

                $.devAjax({
                    data: {
                        INITSESSION: 'S',
                        DADOSALUNO: dados
                    },
                    action: "index/seguranca/login_ingressante", // acao ou url a ser executada
                    success: function (response) {
                        if (response.successIngressante) {
                            window.location.href = $.devUrlBase;
                            return false;
                        } else {
                            $.devDialog.alert('Erro ao trocar de concurso', 'Atenção');
                        }
                    }
                });
            },
            ".bt-trocar-egresso": function () {
                $.devWindow({
                    title: "Trocar Curso",
                    height: 300,
                    modal: true,
                    minimize: false,
                    maximize: false,
                    url: "index/index/cursos",
                    callback: function ()
                    {
                        $('.btnEgressoTrocar').hover(function () {
                            $(this).addClass("ui-state-hover");
                        }, function () {
                            $(this).removeClass("ui-state-hover");
                        });
                    }
                });
            },
            ".trocarEgresso": function ()
            {
                var dados = $.parseJSON($(this).attr('dados'));

                $.devAjax({
                    data: {
                        INITSESSION: 'S',
                        DADOSALUNO: dados
                    },
                    action: "index/seguranca/login_egresso", // acao ou url a ser executada
                    success: function (response) {
                        if (response.successEgresso) {
                            if (response.restricao) {
                                window.location.href = response.link;
                            } else {
                                window.location.href = $.devUrlBase;
                            }
                            return false;
                        } else {
                            $.devDialog.alert('Erro ao trocar de curso', 'Atenção');
                        }
                    }
                });
            },
            ".ico-atendimento": function ()
            {
                var strUrl = $('#link_atendimento_online').val();

                window.open(strUrl, "Atendimento On-Line");
            },
            ".menu-search-bar": function ()
            {
                $('.nav-side-menu').css('display', 'block');

                var iDiv = document.createElement('div');
                iDiv.className = 'ui-widget-overlay menu-overlay';
                document.getElementsByTagName('body')[0].appendChild(iDiv);
                
                $('.sub-menu.collapse.in').removeClass('in');
                $('.nav-side-menu ul li span').removeClass("arrow-down arrow").addClass("arrow");
                $(".nav-side-menu .brand").addClass('brand'+$('#sgl_marca').val());

            },
            ".menu-overlay": function ()
            {
                $('.menu-overlay').css('display', 'none');
                $('.nav-side-menu').css('display', 'none');
                $('.menu-overlay').remove();                
            },
            ".menu-cabecalho": function ()
            {
                $('.menu-overlay').css('display', 'none');
                $('.nav-side-menu').css('display', 'none');
                $('.menu-overlay').remove();
            },
            ".menu-arrow": function ()
            {
                $(this).children('span').toggleClass("arrow-down").toggleClass("arrow");
                if ($(this).children('span').hasClass('arrow')){
                    $("ul"+ $(this).attr('data-target')).children('ul').removeClass('in');
                    $("li[data-target^="+ $(this).attr('data-target') + "_]").children('span').removeClass("arrow-down arrow").addClass("arrow");
                }
            },
        }
    }
};