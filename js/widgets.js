let Widgets = function()
{
    var grid;
    let new_widgets = [];

    let setWidgetsPosition = () => {
        // gridstack
        let options = {
            animate: true,
            width: 12,
            float: true,
            minWidth: 200,
            minHeight: 200,
            disableDrag: true,
            disableResize: true,
            draggable: {
            handle: '.block',
            scroll: false, 
            appendTo: 'body',
            }
        };
        const data = [
            {item: 'news', x: 0, y: 0, w: 3, h: 11},
            {item: 'profit', x: 3, y: 0, w: 4, h: 5},
            {item: 'time', x: 7, y: 0, w: 5, h: 5},
            {item: 'workers', x: 3, y: 5, w: 9, h: 6},
          ];
        
        data.forEach(element => {
            var serializedData = _.map($('.grid-stack > .grid-stack-item:visible'), function (el) {
                var el = $(el);
                var el_name = $(el).find(".block").attr('id');

                if (element.item == el_name) {
                    $(el).attr('data-gs-x', element.x)
                    $(el).attr('data-gs-y', element.y)
                    $(el).attr('data-gs-width', element.w)
                    $(el).attr('data-gs-height', element.h)
                    $(el).attr('data-gs-min-height', 3)                    
                    $(el).attr('data-gs-min-width', 3)
                }
            });

        });
        
        $('.grid-stack').gridstack(options);
        grid = $('.grid-stack').data('gridstack');
        
        setTimeout(() => {
        $('.blocks').addClass("active");  
        $('.blocks-loader').removeClass("active");  
        }, 1000)
    }

    let editWidgets = () => {
        $("#edit-widgets").on("click", () => {
            $("#edit-widgets").addClass("hide");
            $("#save-widgets").removeClass("hide");
            $(".block__inner").addClass("active edit");

            setTimeout(function() {
              $(".block__inner").removeClass("active");
            }, 1000)

            $('.grid-stack').data('gridstack').movable($('.grid-stack-item'), true); 
            $('.grid-stack').data('gridstack').resizable($('.grid-stack-item'), true); 

        })
    }

    let saveWidgetsPost = () => {
        $(".notify-modal, .notify-preloader").addClass("active");

        let user_id = $("#user_id").val();
        let widgets = [];

        $(".grid-stack-item").each(function(i, widget){
            if (!$(widget).hasClass("remove")) {
                let count = widgets.length++;
                widgets[count] = {};

                let widget_id = $(widget).attr("data-widget-id");
                let widget_x = $(widget).attr("data-gs-x");
                let widget_y = $(widget).attr("data-gs-y");
                let widget_width = $(widget).attr("data-gs-width");
                let widget_height = $(widget).attr("data-gs-height");
                let widget_min_height = $(widget).attr("data-gs-min-height");
                let widget_min_width = $(widget).attr("data-gs-min-width");
                let selected_data = $(widget).hasClass("new-widget") ?'0' :'1';

                widgets[count].widgets = {x: widget_x, y: widget_y, width: widget_width, height: widget_height, min_width: widget_min_width, min_height: widget_min_height};
                widgets[count].widget_id = widget_id;
                widgets[count].selected_data = selected_data;
            }
        });

        var formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("widgets", JSON.stringify(widgets));

        $.ajax({
            method: "POST",
            url: '/admin/dashboard/main/saveUserWidgets',
            data: formData,
            contentType: false,
            processData: false,
            success: function(data) {
                $("#edit-widgets").removeClass("hide");
                $("#save-widgets").addClass("hide");
                $(".block__inner").removeClass("active edit");
                $(".modal__overlay").trigger('click');
                document.location.reload();


                $('.grid-stack').data('gridstack').movable($('.grid-stack-item'), false); 
                $('.grid-stack').data('gridstack').resizable($('.grid-stack-item'), false); 
            },
            error: function(data, error) {
                $(".save-filter").removeClass('saving');
                alert('Помилка!');
            }
        })
    }

    let saveWidgets = () => {
        $("#save-widgets").on("click", (e) => {
            e.preventDefault();
            let deleted_widgets = $(".grid-stack-item.hide");

            if (deleted_widgets.length) {
                if ($(".grid-stack-item.hide").length) {
                    $('.grid-stack').data('gridstack').removeWidget($(".grid-stack-item.remove"));
                }
            }

            setTimeout(() => {
                saveWidgetsPost();
            }, 0);
        })
    }

    let deleteWidget = () => {
        $(document).on('click', '.block__delete', function(e) { 
            e.preventDefault();
            $(this).parents(".grid-stack-item").addClass("remove hide half-hide");
            resetWidgetModal($(this));
        })

        $(document).on('click', '.widgets-modal__item-delete', function(e) { 
            let id = $(this).attr("data-widget");
            $(".grid-stack-item[data-widget='"+id+"']").addClass("remove half-hide");
            
            if (new_widgets.length) {
                new_widgets.forEach((widget, i) => {
                    if (widget.id == id) {
                        new_widgets.splice(i, 1);
                    }
                });
            }
            changeWidgetModalBtn($(this));
        })
    }

    let resetWidgetModal = (btn) => {
        let name = $(btn).parents(".grid-stack-item").attr("data-widget");
        let modal_btn = $(".widgets-modal__item-delete[data-widget="+name+"]");
        changeWidgetModalBtn(modal_btn)
    }

    let saveWidgetsModalSettings = () => {
        $(".widget-save-btn").on("click", function(e) {
            if ($(".grid-stack-item.remove").length) {
                $('.grid-stack').data('gridstack').removeWidget($(".grid-stack-item.remove"));
            }

            if (new_widgets.length) {
                $.each(new_widgets, (i, widget) => {
                    $('.grid-stack').data('gridstack').addWidget(widget.widget, null, null, widget.widget_w, widget.widget_h, true, widget.widget_min_w, null, widget.widget_min_h);
                })
                new_widgets = [];
            }
            saveWidgetsPost();
        })
    }

    let changeWidgetModalBtn = (btn) => {
        let src = btn.find("img").attr('src');
        let newsrc = src.replace('remove_circle', 'add_circle_gray');
        btn.find("img").attr("src", newsrc);
        btn.attr("class", "widgets-modal__item-add");
        btn.attr("title", "Додати");
    }

    let addWidget = () => {
        $(document).on('click', '.widgets-modal__item-add', function(e) { 
            e.preventDefault();
            let id = $(this).attr("data-widget");

            let removed = $(".grid-stack-item.half-hide[data-widget='"+id+"']");
            let src = $(this).find("img").attr('src');
            let newsrc = src.replace('add_circle_gray', 'remove_circle');
            $(this).find("img").attr("src", newsrc);
            $(this).attr("class", "widgets-modal__item-delete");
            $(this).attr("title", "Видалити");
            if ($(removed).length) {
                $(removed).removeClass("remove half-hide");
            } else {
                let widget_id = $(this).attr("data-widget-id");
                let widget_w = $(this).parents(".widgets-modal__item").attr("data-w");
                let widget_h = $(this).parents(".widgets-modal__item").attr("data-h");
                let widget_min_w = $(this).parents(".widgets-modal__item").attr("data-min-w");
                let widget_min_h = $(this).parents(".widgets-modal__item").attr("data-min-h");
                let widget_name = $(this).parents(".widgets-modal__item").find("span").text();

                let default_widget = $(".default-block").clone().addClass("new-widget").removeClass("default-block");
                default_widget.attr("data-widget", id);
                default_widget.attr("data-widget-id", widget_id);
                default_widget.find(".block__title").text(widget_name);

                new_widgets.push({widget: default_widget, widget_w, widget_h, widget_min_w, widget_min_h, id: id});
            }
        })
    }

	return {
		init: () =>
		{
			setWidgetsPosition();
            editWidgets();
            saveWidgets();
            saveWidgetsModalSettings();
            addWidget();
            deleteWidget();
		}
	};
}();

$(document).ready(() =>
{
	Widgets.init();
});



// $('.grid-stack').data('gridstack').update(true);
