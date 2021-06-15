let Widgets = function()
{
    let setWidgetsPosition = () => {
        // gridstack
        let options = {
            animate: true,
            width: 12,
            minWidth: 200,
            minHeight: 200,
            draggable: {
              handle: '.block',
              scroll: false, 
              appendTo: 'body'
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
        
        setTimeout(() => {
        $('.blocks').addClass("active");  
        $('.blocks-loader').removeClass("active");  
        }, 1000)
    }

    let editWidgets = () => {
        $("#edit-widgets").on("click", () => {
            $("#edit-widgets").removeClass("active");
            $("#save-widgets").addClass("active");
            $(".block__inner").addClass("active edit");

            setTimeout(function() {
              $(".block__inner").removeClass("active");
            }, 1000)

            $('.grid-stack').data('gridstack').movable($('.grid-stack-item'), true); 
            $('.grid-stack').data('gridstack').resizable($('.grid-stack-item'), true); 

        })
    }

    let saveWidgets = () => {
        $("#save-widgets").on("click", (e) => {
            e.preventDefault();
            let user_id = $("#user_id").val();
            let widgets = [];

            $('[data-widget]').each((i, widget) => {
                widgets[i] = {};
                let widget_id = $(widget).attr("data-widget-id");
                let widget_x = $(widget).parents(".grid-stack-item").attr("data-gs-x");
                let widget_y = $(widget).parents(".grid-stack-item").attr("data-gs-y");
                let widget_width = $(widget).parents(".grid-stack-item").attr("data-gs-width");
                let widget_height = $(widget).parents(".grid-stack-item").attr("data-gs-height");
                let widget_min_height = $(widget).parents(".grid-stack-item").attr("data-gs-min-height");
                let widget_min_width = $(widget).parents(".grid-stack-item").attr("data-gs-min-width");

                widgets[i].widgets = {x: widget_x, y: widget_y, width: widget_width, height: widget_height, min_width: widget_min_width, min_height: widget_min_height};
                widgets[i].widget_id = widget_id;
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
                    var res = JSON.parse(data);
					if (res['status'] == 'ok') {
						alert('Збережено!');
                    } else if (res['status'] == 'error') {
						alert('Виникла помилка!');
					}

                    $("#edit-widgets").addClass("active");
                    $("#save-widgets").removeClass("active");
                    $(".block__inner").removeClass("active edit");

                    $('.grid-stack').data('gridstack').movable($('.grid-stack-item'), false); 
                    $('.grid-stack').data('gridstack').resizable($('.grid-stack-item'), false); 
                },
                error: function(data, error) {
                    $(".save-filter").removeClass('saving');
                    alert('Помилка!');
                }
            })
        })
    }
    
    let deleteWidget = () => {
        $(".block__delete").on("click", function(e) {
            e.preventDefault();
            $(this).parents(".grid-stack-item").addClass("hide");
        })

        $(".widgets-modal__item-delete").on("click", function(e) {
            let id = $(this).attr("data-id");

            $(".block[id='"+id+"']").parents(".grid-stack-item").addClass("half-hide");
            $(this).find("img").attr("src", "images/add_circle_gray.png");
            $(this).attr("class", "widgets-modal__item-add");
        })
    }

    let saveWidgetsModalSettings = () => {
        $(".widget-save-btn").on("click", function(e) {
            $(".half-hide").removeClass("half-hide").addClass("hide");
        })
    }

    let addWidget = () => {
        $(".widgets-modal__item-add").on("click", function(e) {
            $(this).find("img").attr("src", "images/remove_circle.png");
            $(this).attr("class", "widgets-modal__item-delete");
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