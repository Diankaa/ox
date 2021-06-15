$(document).ready(function () {
  // sidenav open
  let count_nav = 0;
  $(".header__toggle").on("click", function() {
    count_nav = 0;
    count_nav++;
      $(this).toggleClass("active");
      $(".sidenav").toggleClass("active");

      setTimeout(() => {
        if (count_nav !== 2) {
          if (!$(".sidenav__hidden").hasClass("active")) {
            $(".sidenav__hidden").addClass("active");
          }
        }
        
      }, 200);

      if ($(".sidenav__hidden").hasClass("active")) {
        count_nav++;
        $(".sidenav__hidden").removeClass("active");
      }
  })

  // custom select open
  $(".click-item").on("click", function() {
      $(this).siblings(".click-list").toggleClass("active");
  })

  $(document).on("click", function(e) {
    if (!$(e.target).hasClass('click-item') && !$(e.target).closest('.click-item').length && !$(e.target).hasClass('click-list') && !$(e.target).closest('.click-list').length) {
      $(".click-list").removeClass("active");
    }

    if (!$(e.target).hasClass('search') && !$(e.target).closest('.search').length && !$(e.target).hasClass('search__dropdownt') && !$(e.target).closest('.search__dropdown').length) {
      $(".search__dropdown").hide();
    }

    if (!$(e.target).hasClass('sidenav') && !$(e.target).hasClass('header__toggle') && !$(e.target).parents('.header__toggle').length && !$(e.target).parents('.sidenav').length) {
      $(".header__toggle, .sidenav, .sidenav__hidden").removeClass("active");
    }
  })

  // active delete btn on search keyup
  $(".search").on("keyup change", function() {
      $(this).addClass("active");
      if ($(this).val().length > 0) {
          $(this).siblings(".search_delete").addClass("active");
      } else {
          $(this).siblings(".search_delete").removeClass("active");
      }
  })

  var count = 1;
  $(".search__input").on("keyup", function(event) {
    let parent = $(this).parents(".search");
    initMainSearch($(this), parent, event);
  })

  $(".search__input").on("mouseleave", function() {
    if ($(this).val().length < 0) {
      $(this).removeClass("active");
    }
  })

  $(".search__input").on("click", function() {
    let parent = $(this).parents(".search");
    if ($(parent).find(".search__dropdown-inner ul").length) {
      $(parent).find(".search__dropdown").show();
    }
  })

  $(".search_delete").on("click", function(e) {
    e.preventDefault();
      let parent = $(this).parents(".search");
      $(this).siblings(".search__input").val('').focus() && $(this).removeClass("active");
      $(parent).find(".search__dropdown").hide();
      setTimeout(() => {
        $(parent).find(".search__dropdown ul").empty();
      }, 0);
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

  // subnaw dropdown
  $(".sidenav__dropdown-parent").click(function(e) {
    e.preventDefault();
    $(this).toggleClass("active");
  })

  const try_role = () => {
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

  const initMainSearch = (item, parent, event) => {
    // var count = 1;//для скролу між елементами списку
    if(event.keyCode != 13 && event.keyCode != 38 && event.keyCode != 40){
      // $(".nav-search__loader").show();
      let value = $(item).val();
      if (value !== '') {
        $.post('/admin/list/main/main_search/', {search:value}, function(data) {
          if (data.status == 'ok') {
            const search_list = $(parent).find(".search__dropdown ul");
            search_list.empty();
            for (i = 0; i < data.result.length; i++) {
                const getUrl = window.location;
                const baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
                const item = `<li><a href="${baseUrl}/${data.result[i].url}">${data.result[i].name}</a></li>`;
                search_list.append(item);
            }
            $(parent).find(".search__dropdown ul li").first().find('a').addClass('active')
            $(parent).find(".search__dropdown").show();
            // $(".nav-search__loader").hide();
          } else {
            $(parent).find(".search__dropdown").hide();
            // $(".nav-search__loader").hide();
          }
        });
        $(parent).find(".search__dropdown-inner").animate({
          scrollTop: 0
        }, 500);
        count = 1;
      } else {
        $(parent).find(".search__dropdown").hide();
        // $(".nav-search__loader").hide();
      }
    } else {
      count = chooseItemSearch(event, count, parent);
    }
  }
  
  const chooseItemSearch = (event, count, parent) => {
    var searchList = $(parent).find(".search__dropdown ul li:visible").length
    if (searchList > 0){
      if (event.keyCode === 13) {
        var newHref = $(parent).find(".search__dropdown .active:visible").attr('href')
        location.href = newHref;
      } else {
        var itemIndex = $(parent).find(".search__dropdown .active").closest('li').index()
        $(parent).find(".search__dropdown .active:visible").removeClass('active')
        //38 - вверх
        if (event.keyCode === 38) {
          if (itemIndex == 0){
            var newIndex = searchList-1;
          } else {
            var newIndex = itemIndex-1;
          }
          $(parent).find(".search__dropdown ul li:eq("+newIndex+")").find('a').addClass('active')
        }
        //40 - вниз
        if (event.keyCode === 40) {
          var newIndex = itemIndex+1;
          if (newIndex == searchList){
            newIndex = 0;
          }
          $(parent).find(".search__dropdown ul li:eq("+newIndex+")").find('a').addClass('active')
        }
        
        var step = 38;
        var scroll = $("li .active").offset().top
        if(event.keyCode === 38 && scroll > 280 && count == 1){//якщо з першого ел на останній через верх
          count = Math.ceil((scroll-238)/step)+1;
          newScroll = step*count;
          $(parent).find('.search__dropdown-inner').animate({
            scrollTop: newScroll
          }, 200);
        } else if (event.keyCode === 40 && scroll > 240){//якщо донизу
          newScroll = step*count;       
          $(parent).find('.search__dropdown-inner').animate({
            scrollTop: newScroll
          }, 200);
          count++;
        } else if (event.keyCode === 40 && scroll < 0){//якщо з ост на перший через низ
          $(parent).find('.search__dropdown-inner').animate({
            scrollTop: 0
          }, 200);
          count = 1;
        } else if (event.keyCode === 38 && scroll < 30 && scroll != 0){//якщо догори
          newScroll = step*(count-2);
          $(parent).find('.search__dropdown-inner').animate({
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
