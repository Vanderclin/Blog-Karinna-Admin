$("#modal-account-check").click(function () {
	setTimeout(function () {
			$("#modal-account-check-collapse").collapse("hide");
		},
		3000);
});

function readURLTwo(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (f) {
			$("#product_image_preview").attr("src", f.target.result);
		};
		reader.readAsDataURL(input.files[0]);
	}
}

$("#product_image").change(function () {
	readURLTwo(this);
});

/**************************************************************************************/
function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			$("#avatar_view").attr("src", e.target.result);
		};
		reader.readAsDataURL(input.files[0]);
	}
}

$("#avatar").change(function () {
	readURL(this);
});


/** Switch Checkbox Button **/
$("#deleteaccount").click(function () {
	if (document.getElementById("deleteaccount").checked == true) {
        document.getElementById("delete_account").disabled = false;
    } else {
        document.getElementById("delete_account").disabled = true;
    }
});

$("#newpassword").click(function () {
	if (document.getElementById("newpassword").checked == true) {
        document.getElementById("new_password_account").disabled = false;
    } else {
        document.getElementById("new_password_account").disabled = true;
    }
});


// Barra de pesquisa
$(document).ready(function () {
    $("#search_bar").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $('div[class="card"]').filter(function () {
            $(this).toggle($(this).find('h5, h6').text().toLowerCase().indexOf(value) > -1);
        });
    });
});
// Menu Hamb
$(document).ready(function () {
  $('#menu-hamb').on('click', function () {
    $('.animated-icon').toggleClass('open');
  });
});

function mascara(v) {
	v = v.replace(/\D/g, "");
	v = new String(Number(v));
	var len = v.length;
	if (1 == len)
		v = v.replace(/(\d)/, "0,0$1");
	else if (2 == len)
		v = v.replace(/(\d)/, "0,$1");
	else if (len > 2)
	{
		v = v.replace(/(\d{2})$/, ',$1');
		if (len > 5)
		{
			var x = len - 5,
				er = new RegExp('(\\d{' + x + '})(\\d)');
			v = v.replace(er, '$1.$2');
		}
	}
	return v;
}

var price = document.getElementById('product_price');
price.onkeyup = function(){
	document.getElementById('base_price').innerText = "R$ " + mascara( price.value);
};
