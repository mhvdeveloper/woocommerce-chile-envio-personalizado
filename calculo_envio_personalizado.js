jQuery( function($) {

var tarifas_json="";
var regiones= [
{"nombre": "REGION METROPOLITANA DE SANTIAGO"},
{"nombre": "REGION DE ARICA Y PARINACOTA"},
{"nombre": "REGION DE TARAPACA"},
{"nombre": "REGION DE ANTOFAGASTA"},
{"nombre": "REGION DE ATACAMA"},
{"nombre": "REGION DE COQUIMBO"},
{"nombre": "REGION DE VALPARAISO"},
{"nombre": "REGION DEL LIBERTADOR GRAL. BERNARDO O HIGGINS"},
{"nombre": "REGION DEL MAULE"},
{"nombre": "REGION DEL BIOBIO"},
{"nombre": "REGION DE LA ARAUCANIA"},
{"nombre": "REGION DE LOS RIOS"},
{"nombre": "REGION DE LOS LAGOS"},
{"nombre": "REGION AISEN DEL GRAL. CARLOS IBAÑEZ DEL CAMPO"},
{"nombre": "REGION MAGALLANES Y DE LA ANTARTICA CHILENA"}
];

  $.getJSON(jsVars.jsUrl+"/tarifas.json", function(json){
    tarifas_json= json;
});
  if($('#calc_shipping_city')){

    function crear_select(){
      $("#calc_shipping_state").after('<select name="calc_shipping_state" class="input-text">');
      $("#calc_shipping_state").remove();
      $("[name='calc_shipping_state']").attr("id","select_region").append($('<option value="" disabled selected>').text("Selecciona una region..."));

      $("#calc_shipping_city").after('<select name="calc_shipping_city" class="input-text">');
      $("#calc_shipping_city").remove();
      $("[name='calc_shipping_city']").attr("id","calc_shipping_city").append($('<option value="" disabled selected>').text("Selecciona una comuna..."));

      $.each(regiones, function(i,obj){      
        $("#select_region").append($('<option value="'+obj.nombre+'">').text(obj.nombre));
      });
    }
    crear_select();
  	var select_region = $('#select_region');
    var select_comuna = $('#calc_shipping_city');

    var valor_region_actual = select_region.val();

    function cambia_region(select_region, select_comuna){
      sr_id= select_region.attr("id");

      $( 'body' ).on('change','#'+sr_id, function() {
         id_region_seleccionada = select_region.val();


         
         if($("#billing_state")){
          $("#billing_state").val(id_region_seleccionada);
         }

         // console.log(id_region_seleccionada);
          select_comuna.empty();
          select_comuna.html("");
          select_comuna.append($('<option>').text("Selecciona una comuna..."));  
          
          $.each(tarifas_json[id_region_seleccionada], function(i,obj){      
                $( document.body ).trigger( 'cambio_region',[obj]);
          });

          valor_region_actual = id_region_seleccionada;
              
      });//changue

        $('body').on( 'cambio_region', function(e,obj) {
          select_comuna.append($('<option>').text(obj.nombre).attr('value', obj.nombre));
       
        });
    }

  cambia_region($("#select_region"),$("#calc_shipping_city"));    
  
    var comuna_seleccionada="";
    $( 'body' ).on('change','#calc_shipping_city', function() {
      comuna_seleccionada=this.value;
    });

    $( 'body' ).on('click',"[name='calc_shipping'], #shipping_method input[type='radio']" ,function(){
      var check_com_select = setInterval(function(){
        // $("#shipping_method").appendTo("#metodos_envio");
        if($('#calc_shipping_city').has('option').length < 1 ){
          //volvemos a cargar las comunas seleccionadas por la region
          crear_select();
          $(".shipping td").first().attr("colspan",2);
          $.each(tarifas_json[valor_region_actual], function(i,obj){ 
              $("#calc_shipping_city").append($('<option>').text(obj.nombre).attr('value', obj.nombre));
            
          });
          $("#calc_shipping_city").val(comuna_seleccionada);
          $("#select_region").val(valor_region_actual);
          
          cambia_region($("#select_region"),$("#calc_shipping_city"));
          clearInterval(check_com_select);
        }
      },1000);
    });

  }//end if

  //checkout

  $("#billing_state").after('<select name="billing_region" class="input-text">').css("display","none");
  $("[name='billing_region']").attr("id","billing_region").append($('<option value="" disabled selected>').text("Selecciona una region..."));

  $.each(regiones, function(i,obj){      
    $("#billing_region").append($('<option value="'+obj.nombre+'">').text(obj.nombre));
  });

  $("#billing_city").after('<select name="billing_city" class="input-text">');
  $("#billing_city").remove();
  $("[name='billing_city']").attr("id","billing_city").append($('<option value="" disabled selected>').text("Selecciona una comuna..."));

  cambia_region($("#billing_region"),$("#billing_city"));

  $(".shipping td").first().attr("colspan",2);

  $('body').on('change','#billing_city', function() {
    $('body').trigger('update_checkout');
  });

});//Jquery