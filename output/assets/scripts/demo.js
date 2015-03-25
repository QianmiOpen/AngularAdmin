var Demo = function() {
    // Handle Theme Settings
    var handleTheme = function() {

        var panel = $('.theme-panel');

        //handle theme layout
        var resetLayout = function() {
            $("body").
            removeClass("page-boxed").
            removeClass("page-footer-fixed").
            removeClass("page-sidebar-fixed").
            removeClass("page-header-fixed").
            removeClass("page-sidebar-reversed");

            $('.page-header > .page-header-inner').removeClass("container");

            if ($('.page-container').parent(".container").size() === 1) {
                $('.page-container').insertAfter('body > .clearfix');
            }

            if ($('.page-footer > .container').size() === 1) {
                $('.page-footer').html($('.page-footer > .container').html());
            } else if ($('.page-footer').parent(".container").size() === 1) {
                $('.page-footer').insertAfter('.page-container');
                $('.scroll-to-top').insertAfter('.page-footer');
            }

             $(".top-menu > .navbar-nav > li.dropdown").removeClass("dropdown-dark");

            $('body > .container').remove();
        };

        var lastSelectedLayout = '';

        var setLayout = function() {

            var layoutOption = $('.layout-option', panel).val();  //布局
            var sidebarOption = $('.sidebar-option', panel).val();  //侧边栏模式
            var headerOption = $('.page-header-option', panel).val();  //页头
            var footerOption = $('.page-footer-option', panel).val();  //底部页脚
            var sidebarPosOption = $('.sidebar-pos-option', panel).val();  //
            var sidebarStyleOption = $('.sidebar-style-option', panel).val();  //侧边栏风格
            var sidebarMenuOption = $('.sidebar-menu-option', panel).val();  //侧边栏菜单
            var headerTopDropdownStyle = $('.page-header-top-dropdown-style-option', panel).val();  //顶部菜单

            if (sidebarOption == "fixed" && headerOption == "default") {
                //alert('Default Header with Fixed Sidebar option is not supported. Proceed with Fixed Header with Fixed Sidebar.');
                alert('页头：默认和侧边栏模式：固定不兼容！ 转换为页头：固定和侧边栏模式：固定。');
                $('.page-header-option', panel).val("fixed");
                $('.sidebar-option', panel).val("fixed");
                sidebarOption = 'fixed';
                headerOption = 'fixed';
            }

            resetLayout(); // reset layout to default state

            if (layoutOption === "boxed") {
                $("body").addClass("page-boxed");

                // set header
                $('.page-header > .page-header-inner').addClass("container");
                var cont = $('body > .clearfix').after('<div class="container"></div>');

                // set content
                $('.page-container').appendTo('body > .container');

                // set footer
                if (footerOption === 'fixed') {
                    $('.page-footer').html('<div class="container">' + $('.page-footer').html() + '</div>');
                } else {
                    $('.page-footer').appendTo('body > .container');
                }
            }

            if (lastSelectedLayout != layoutOption) {
                //layout changed, run responsive handler: 
                Metronic.runResizeHandlers();
            }
            lastSelectedLayout = layoutOption;

            //header
            if (headerOption === 'fixed') {
                $("body").addClass("page-header-fixed");
                $(".page-header").removeClass("navbar-static-top").addClass("navbar-fixed-top");
            } else {
                $("body").removeClass("page-header-fixed");
                $(".page-header").removeClass("navbar-fixed-top").addClass("navbar-static-top");
            }

            //sidebar
            if ($('body').hasClass('page-full-width') === false) {
                if (sidebarOption === 'fixed') {
                    $("body").addClass("page-sidebar-fixed");
                    $("page-sidebar-menu").addClass("page-sidebar-menu-fixed");
                    $("page-sidebar-menu").removeClass("page-sidebar-menu-default");
                    Layout.initFixedSidebarHoverEffect();
                } else {
                    $("body").removeClass("page-sidebar-fixed");
                    $("page-sidebar-menu").addClass("page-sidebar-menu-default");
                    $("page-sidebar-menu").removeClass("page-sidebar-menu-fixed");
                    $('.page-sidebar-menu').unbind('mouseenter').unbind('mouseleave');
                }
            }

            // top dropdown style
            if (headerTopDropdownStyle === 'dark') {
                $(".top-menu > .navbar-nav > li.dropdown").addClass("dropdown-dark");
            } else {
                $(".top-menu > .navbar-nav > li.dropdown").removeClass("dropdown-dark");
            }

            //footer 
            if (footerOption === 'fixed') {
                $("body").addClass("page-footer-fixed");
            } else {
                $("body").removeClass("page-footer-fixed");
            }

            //sidebar style
            if (sidebarStyleOption === 'light') {
                $(".page-sidebar-menu").addClass("page-sidebar-menu-light");
            } else {
                $(".page-sidebar-menu").removeClass("page-sidebar-menu-light");
            }

            //sidebar menu 
            if (sidebarMenuOption === 'hover') {
                if (sidebarOption == 'fixed') {
                    $('.sidebar-menu-option', panel).val("accordion");
                    //alert("Hover Sidebar Menu is not compatible with Fixed Sidebar Mode. Select Default Sidebar Mode Instead.");
                    alert("侧边栏菜单：浮动不兼容侧边栏模式：固定！使用侧边栏菜单：折叠代替。");
                } else {
                    $(".page-sidebar-menu").addClass("page-sidebar-menu-hover-submenu");
                }
            } else {
                $(".page-sidebar-menu").removeClass("page-sidebar-menu-hover-submenu");
            }

            //sidebar position
            if (Metronic.isRTL()) {
                if (sidebarPosOption === 'left') {
                    $("body").addClass("page-sidebar-reversed");
                    $('#frontend-link').tooltip('destroy').tooltip({
                        placement: 'right'
                    });
                } else {
                    $("body").removeClass("page-sidebar-reversed");
                    $('#frontend-link').tooltip('destroy').tooltip({
                        placement: 'left'
                    });
                }
            } else {
                if (sidebarPosOption === 'right') {
                    $("body").addClass("page-sidebar-reversed");
                    $('#frontend-link').tooltip('destroy').tooltip({
                        placement: 'left'
                    });
                } else {
                    $("body").removeClass("page-sidebar-reversed");
                    $('#frontend-link').tooltip('destroy').tooltip({
                        placement: 'right'
                    });
                }
            }

            Layout.fixContentHeight(); // fix content height            
            Layout.initFixedSidebar(); // reinitialize fixed sidebar

            //设置layout的cookie信息
            if ($.cookie) {
                //组装字符串
                var crmProps = {
                    layout : layoutOption,
                    sidebar : sidebarOption,
                    header : headerOption,
                    footer : footerOption,
                    sidebarPos : sidebarPosOption,
                    sidebarStyle : sidebarStyleOption,
                    sidebarMenu : sidebarMenuOption,
                    headerTopDropdownStyle : headerTopDropdownStyle
                };
                $.cookie('crm-props', JSON.stringify(crmProps), {expires: 31, path: '/' });
            }
        };

        // handle theme colors
        var setColor = function(color) {
            var color_ = (Metronic.isRTL() ? color + '-rtl' : color);
            $('#style_color').attr("href", Layout.getLayoutCssPath() + 'themes/' + color_ + ".css");
            if (color == 'light2') {
                $('.page-logo img').attr('src', Layout.getLayoutImgPath() + 'logo-invert.png');
            } else {
                $('.page-logo img').attr('src', Layout.getLayoutImgPath() + 'logo.png');
            }
            if ($.cookie) {
                $.cookie('style_color', color, {expires: 31, path: '/' });
            }
        };

        //初始化布局信息
        if ($.cookie && $.cookie('crm-props')) {
            var crmProps = JSON.parse($.cookie('crm-props'));
            //设置自定义保存默认值
            $('.layout-option', panel).val(crmProps.layout).selectpicker('refresh');  //布局
            $('.sidebar-option', panel).val(crmProps.sidebar).selectpicker('refresh');  //侧边栏模式
            $('.page-header-option', panel).val(crmProps.header).selectpicker('refresh');  //页头
            $('.page-footer-option', panel).val(crmProps.footer).selectpicker('refresh');  //底部页脚
            $('.sidebar-pos-option', panel).val(crmProps.sidebarPos).selectpicker('refresh');  //
            $('.sidebar-style-option', panel).val(crmProps.sidebarStyle).selectpicker('refresh');  //侧边栏风格
            $('.sidebar-menu-option', panel).val(crmProps.sidebarMenu).selectpicker('refresh');  //侧边栏菜单
            $('.page-header-top-dropdown-style-option', panel).val(crmProps.headerTopDropdownStyle).selectpicker('refresh');  //顶部菜单
            setLayout();
        } else {
            if ($('body').hasClass('page-boxed') === false) {
                $('.layout-option', panel).val("fluid").selectpicker('refresh');
            } else {
                $('.layout-option', panel).val("boxed").selectpicker('refresh');
            }

            if ($("body").hasClass("page-sidebar-fixed")) {
                $('.sidebar-option', panel).val("fixed").selectpicker('refresh');
            } else {
                $('.sidebar-option', panel).val("default").selectpicker('refresh');
            }
            $('.page-header-option', panel).val("fixed").selectpicker('refresh');

            if ($("body").hasClass("page-footer-fixed")) {
                $('.page-footer-option', panel).val("fixed").selectpicker('refresh');
            } else {
                $('.page-footer-option', panel).val("default").selectpicker('refresh');
            }
            if ($("body").hasClass("page-sidebar-reversed")) {
                $('.sidebar-pos-option', panel).val("right").selectpicker('refresh');
            }

            if ($(".page-sidebar-menu").hasClass("page-sidebar-menu-light")) {
                $('.sidebar-style-option', panel).val("light").selectpicker('refresh');
            }
            if ($(".page-sidebar-menu").hasClass("page-sidebar-menu-hover-submenu")) {
                $('.sidebar-menu-option', panel).val("hover").selectpicker('refresh');
            }

            if ($('.sidebar-pos-option').attr("disabled") === false) {
                $('.sidebar-pos-option', panel).val(Metronic.isRTL() ? 'right' : 'left').selectpicker('refresh');
            }
        }

        $('.toggler', panel).click(function() {
            $('.toggler').hide();
            $('.toggler-close').show();
            $('.theme-panel > .theme-options').show();
        });

        $('.toggler-close', panel).click(function() {
            $('.toggler').show();
            $('.toggler-close').hide();
            $('.theme-panel > .theme-options').hide();
        });

        $('.theme-colors > ul > li', panel).click(function() {
            var color = $(this).attr("data-style");
            setColor(color);
            $('ul > li', panel).removeClass("current");
            $(this).addClass("current");
        });

        $('.layout-option, .page-header-option, .page-header-top-dropdown-style-option, .sidebar-option, .page-footer-option, .sidebar-pos-option, .sidebar-style-option, .sidebar-menu-option', panel).change(setLayout);


        if ($.cookie && $.cookie('style_color')) {
            var color = $.cookie('style_color');
            setColor(color);
            $('.theme-panel ul [data-style="'+color+'"]').addClass("current");
        } else {
            $('.theme-panel ul [data-style="darkblue"]').addClass("current");
        }
    };

    return {

        //main function to initiate the theme
        init: function() {
            // handles style customer tool
            handleTheme();
        }
    };
}();