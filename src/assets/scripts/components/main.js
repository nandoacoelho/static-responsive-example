(function () {
    var $dashboard = $('.dashboard'),
        $widgetMinimize = $('.widget-minimize'),
        $headerLight = $dashboard.find('.header-light'),
        $dashboardHeader = $dashboard.find('.dashboard-header'),
        $dashboardOptions = $dashboard.find('.dashboard-options'),
        $dashboardOptionsSubmenu = $dashboard.find('.dashboard-options-submenu'),
        $subtitleOptions = $dashboard.find('.subtitle-options'),
        $subtitleOptionsSubmenu = $dashboard.find('.subtitle-options-submenu'),
        $main = $dashboard.find('.main'),
        $mainResearch = $dashboard.find('.main.-research');

    function init() {
        timeouts();
        setClickout();
        dashboardOptions();
        datepicker();
    }

    init();

    function timeouts() {
        setTimeout(function () {
            $headerLight.removeClass('-hidden');
        }, 300);

        if ($dashboardHeader) {
            setTimeout(function () {
                $($dashboardHeader[0]).removeClass('-hidden');
            }, 700);
        }

        if ($widgetMinimize) {
            setTimeout(function () {
                $widgetMinimize.each(function (index, item) {
                    $(item).click();
                });
            }, 700);
        }

        setTimeout(function () {
            $main.removeClass('-hidden');
            $($dashboardHeader[1]).removeClass('-hidden');
            $('.indexes-main').removeClass('-hidden');
            $('.calendar-header').removeClass('-hidden');
            $('.calendar-gantt').removeClass('-hidden');
        }, 1100);
    }

    function setClickout() {
        $('.-click-out').click(function (event) {
            event.stopPropagation();
        });

        $(document).click(function (event) {
            if (!$(event.target).hasClass('-click-out')) {
                $('.-click-out')
                    .removeClass('-active')
                    .removeClass('-before')
                    .removeClass('-middle')
                    .removeClass('-first')
                    .removeClass('-last');
            }
        });
    }

    function dashboardOptions() {
        $dashboardOptions.click(function (event) {
            event.stopPropagation();
            event.preventDefault();
            $dashboardOptionsSubmenu.toggleClass('-active');
        });
        $subtitleOptions.click(function (event) {
            event.stopPropagation();
            event.preventDefault();
            $subtitleOptionsSubmenu.toggleClass('-active');
        });
    }

    function datepicker() {
        $.datepicker.setDefaults({
            dayNamesMin: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]
        });

        $('.datepicker').each(function (index, item) {
            console.log('blau')
            $(item).datepicker();
        })
    }

})();