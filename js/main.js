$(document).ready(function () {
  // sidenav open
  let count = 0;
    $(".header__toggle").on("click", function() {
      count = 0;
      count++;
        $(this).toggleClass("active");
        $(".sidenav").toggleClass("active");

        setTimeout(() => {
          if (count !== 2) {
            if (!$(".sidenav__hidden").hasClass("active")) {
              $(".sidenav__hidden").addClass("active");
            }
          }
          
        }, 200);

        if ($(".sidenav__hidden").hasClass("active")) {
          count++;
          $(".sidenav__hidden").removeClass("active");
        }
    })

    // custom select open
    $(".click-item").on("click", function() {
        $(this).siblings(".click-list").toggleClass("active");
    })

    $(document).on("click", function(e) {
      if (!$(e.target).hasClass('click-item') && !$(e.target).closest('.click-item').length && !$(e.target).hasClass('click-list') && !$(e.target).closest('.click-list').length) {
        // use the framework to close the dropdown instead of just hiding it: hiding it will require you to click the trigger 2 times to reopen!
        $(".click-list").removeClass("active");
      }
    })

    // active delete btn on search keyup
    $(".search").on("keyup change", function(event) {
        $(this).addClass("active");
        if ($(this).val().length > 0) {
            $(this).siblings(".search_delete").addClass("active");
        } else {
            $(this).siblings(".search_delete").removeClass("active");
        }
    })

    $(".search").on("keyup change", function(event) {
      initMainSearch(event);
    })

    $(".search").on("mouseleave", function() {
      $(this).removeClass("active");
    })

    $(".search_delete").on("click", function(e) {
      e.preventDefault();
        $(this).siblings(".search").val('') && $(this).removeClass("active");
    })
      
    // workers calendar settings
    let date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();

    $.fn.datepicker.dates["ua"] = {
        days: [
          "неділя",
          "понеділок",
          "вівторок",
          "среда",
          "четвер",
          "п'ятница",
          "субота",
        ],
        daysShort: ["нд", "пн", "вт", "ср", "чт", "пт", "сб"],
        daysMin: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        months: [
          "січень",
          "лютий",
          "березень",
          "квітень",
          "травень",
          "червень",
          "липень",
          "серпень",
          "вересень",
          "жовтень",
          "листопад",
          "грудень",
        ],
        monthsShort: [
          "Січ",
          "Лют",
          "Бер",
          "Квіт",
          "Трав",
          "Черв",
          "Лип",
          "Серп",
          "Вер",
          "Жовт",
          "Лист",
          "Груд",
        ],
        clear: "Clear",
        weekStart: 0,
      };

    $('#calendar').datepicker({
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        format: "MM",
        viewMode: "months",
        minViewMode: "months",
        todayHighlight: true,
        language: "ua",
        autoClose: true,
    });

    $("#month-prev").click(() => {
        currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        
        // change small calendar month
        const calendarDate = $("#calendar").datepicker("getDate") || new Date();
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        $("#calendar").datepicker("setDate", new Date());
        $("#calendar").datepicker("setDate", calendarDate);
      });

      $("#month-next").click(() => {
        currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        currentMonth = (currentMonth + 1) % 12;
    
        // change small calendar month
        const calendarDate = $("#calendar").datepicker("getDate") || new Date();
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        $("#calendar").datepicker("setDate", new Date());
        $("#calendar").datepicker("setDate", calendarDate);
      });

      $('#calendar').datepicker().on('changeDate', function (ev) {
        $(".main-card__dates-item").text(ev.format());
    });

    // select2
    $(".custom-select").select2();

   // modal
   $(".modal-link").click(function (e) {
     let modal_id = $(this).attr("data-modal");
     $("#"+modal_id+"").addClass("active");
   })

   $(".modal__overlay, .modal__close").click(function (e) {
    $(".modal__overlay").removeClass("active");
   })

    function try_role() {
      $('#btn_close_role_try').click(function (e) {			
        e.preventDefault();
        $.post('/admin/login/change_role_back', function(data) {
          var res = JSON.parse(data)
          if(res['success'] == '1'){
            if(res['reload'] == '1'){
              location.reload()
            } else {
              location.href = '/admin/users/role';
            }
          }
        });
      })
      $('#try_role_select').on('select2:select', function() {
        var flag = $(this).children('option:selected').attr('data-flag');
        if($(this).val() != ''){
          $('#try_user_select').children('option').prop('disabled', false).removeAttr('disabled')
          $('#try_user_select').children('option:not([data-flag="'+flag+'"])').prop('disabled', true).attr('disabled', 'disabled')
        } else {
          $('#try_user_select').children('option').prop('disabled', false).removeAttr('disabled')
        }
        $('#try_user_select').children('option[value=""]').prop('disabled', false).removeAttr('disabled').prop('selected', true)
        $('#try_user_select').select2()
      });
      $('#try_user_select').on('select2:select', function() {
        var flag = $(this).children('option:selected').attr('data-flag');
        if($(this).val() != ''){
          $('#try_role_select').children('option[data-flag="'+flag+'"]').prop('selected', true)
        }
        $('#try_role_select').select2()
      });
      $('#btn_try_role').on('click', function(event) {
        event.preventDefault();
        var role = $('#try_role_select').children('option:selected').attr('data-flag');
        var user_role = $('#try_role_select').val();
        var user = $('#try_user_select').val();
        
        $.post('/admin/login/change_role_ajax', {role:role, user_role:user_role, user:user }, function(data) {
          var res = JSON.parse(data)
          if(res['success'] == '1'){
            location.reload()
          }
        });
      });
    }

    const initMainSearch = (event) => {
      var count = 1;//для скролу між елементами списку
      if(event.keyCode != 13 && event.keyCode != 38 && event.keyCode != 40){
        // $(".nav-search__loader").show();
        let value = $(this).val();
        if (value !== '') {
          $.post('/admin/list/main/main_search/', {search:value}, function(data) {
            if (data.status == 'ok') {
              const search_list = $(".header-search__dropdown ul");
              search_list.empty();
              for (i = 0; i < data.result.length; i++) {
                  const getUrl = window.location;
                  const baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
                  const item = `<li><a href="${baseUrl}/${data.result[i].url}">${data.result[i].name}</a></li>`;
                  search_list.append(item);
              }
              $(".header-search__dropdown ul li").first().find('a').addClass('active')
              $(".header-search__dropdown").show();
              // $(".nav-search__loader").hide();
            } else {
              $(".header-search__dropdown").hide();
              // $(".nav-search__loader").hide();
            }
          });
          $(".header-search__dropdown-inner").animate({
            scrollTop: 0
          }, 500);
          count = 1;
        } else {
          $(".header-search__dropdown").hide();
          // $(".nav-search__loader").hide();
        }
      } else {
        count = chooseItemSearch(event, count);
      }
    }
  
    const chooseItemSearch = (event, count) => {
      var searchList = $(".header-search__dropdown ul li:visible").length
      if (searchList > 0){
        if (event.keyCode === 13) {
          var newHref = $(".header-search__dropdown .active:visible").attr('href')
          location.href = newHref;
        } else {
          var itemIndex = $(".header-search__dropdown .active").closest('li').index()
          $(".header-search__dropdown .active:visible").removeClass('active')
          //38 - вверх
          if (event.keyCode === 38) {
            if (itemIndex == 0){
              var newIndex = searchList-1;
            } else {
              var newIndex = itemIndex-1;
            }
            $(".header-search__dropdown ul li:eq("+newIndex+")").find('a').addClass('active')
          }
          //40 - вниз
          if (event.keyCode === 40) {
            var newIndex = itemIndex+1;
            if (newIndex == searchList){
              newIndex = 0;
            }
            $(".header-search__dropdown ul li:eq("+newIndex+")").find('a').addClass('active')
          }
          
          var step = 38;
          var scroll = $("li .active").offset().top
          if(event.keyCode === 38 && scroll > 280 && count == 1){//якщо з першого ел на останній через верх
            count = Math.ceil((scroll-238)/step)+1;
            newScroll = step*count;
            $('.header-search__dropdown-inner').animate({
              scrollTop: newScroll
            }, 200);
          } else if (event.keyCode === 40 && scroll > 240){//якщо донизу
            newScroll = step*count;       
            $('.header-search__dropdown-inner').animate({
              scrollTop: newScroll
            }, 200);
            count++;
          } else if (event.keyCode === 40 && scroll < 0){//якщо з ост на перший через низ
            $('.header-search__dropdown-inner').animate({
              scrollTop: 0
            }, 200);
            count = 1;
          } else if (event.keyCode === 38 && scroll < 30 && scroll != 0){//якщо догори
            newScroll = step*(count-2);
            $('.header-search__dropdown-inner').animate({
              scrollTop: newScroll,
            }, 200);
            count--;
          }
        }
      }
      return count;
    }  

    const initListDraggable = () => {
      let count = 0;
      $(".main-widgets__item").each(function(i, item) {
        count += $(item).width();
      })

      $(".draggable").draggable({ 
        cursor: "move", 
        containment: "main-widgets__inner",
        axis: "x",
        stop: function(e) {
          if ($(".draggable").position().left < (-count) - 200 || $(".draggable").position().left > 0) {
            $(".draggable").css("left", 0);
          } 
              
        }
      });
    }

    try_role();
    initListDraggable();
})
