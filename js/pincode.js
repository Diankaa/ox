$(document).ready(function() {
    let enterCode = "";
    let send_count = 0;
    enterCode.toString();

    $("#numbers button").click(function() {
        $("#pincode__error").addClass('hide');

        $(this).addClass("clicked");
        setTimeout(() => {
            $(this).removeClass("clicked");
        }, 100);
    })

    $("#numbers button:not(.backspace)").click(function() {
        if (!$("#pin_form").hasClass("miss")) {
            $("#pincode__error").addClass('hide');

            let clickedNumber = $(this).text().toString();
            enterCode = enterCode + clickedNumber;
            let lengthCode = parseInt(enterCode.length);
            lengthCode--;
            $("#pin_form .fields-number:eq(" + lengthCode + ")").addClass("active");

            if ($("#pin_form").hasClass("line-fields")) {
                $("#pin_form .fields-number:eq(" + lengthCode + ")").text(clickedNumber);
            }

            if (lengthCode == 3) {
                $("#pin_form input[name='pin']").val(enterCode);
                $("#pin_form").submit();       
                send_count++;    
            }
        }
    })

    $("#numbers button.backspace").click(function() {
        if (enterCode.length) {

            enterCode = enterCode.slice(0, -1);
            $(".fields-number.active").last().text("").removeClass("active");
        }
    })

    let clearFields = () => {
        $("#pin_form").addClass("miss");
        enterCode = "";

        if ($("#pin_form").hasClass("line-fields")) {
            $("#pin_form .fields-number").text("");
        }

        setTimeout(function() {
            $("#pin_form .fields-number").removeClass("active");
        }, 200);

        setTimeout(function() {
            $("#pin_form").removeClass("miss");
        }, 500);
    }

    $(document).on('submit', '#pin_form', function(e) {
        e.preventDefault();
        var formData = $(this).serialize();
        $.post('/api/check_relay_pin', formData, function(data){
          var res = JSON.parse(data);
          if (res['status'] == 'error'){
              if (send_count > 3) {
                // window.location = '/api/qr_message';
                if (res['message_text'] && res['message_text'].length) {
                    $("#pin-error .pin-result__title").text(res['message_text']);
                }
                $("#pin-error").show();
                $("#pincode").hide();
              } else {
                  $("#pincode__error").removeClass("hide");
                  clearFields();
              }
          } else if (res['status'] == 'success'){
              if (res['message_text'] && res['message_text'].length) {
                $("#pin-welcome .pin-result__title").text(res['message_text']);
              }
              $("#pin-welcome").show();
              $("#pincode").hide();
            // window.location = '/api/qr_message/1';
          } else {
            if (res['error_text'] && res['error_text'].length) {
                $("#pin-error .pin-result__title").text(res['error_text']);
            }
            $("#pin-error").show();
            $("#pincode").hide();
            // window.location = '/api/qr_message';
          }
        })
    })
})