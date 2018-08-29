<?php
class WC_calculo_envio_personalizado extends WC_Shipping_Method{

  public function __construct(){
    $this->id = 'calculo_envio_personalizado';
    $this->method_title = __( 'Costo de envío personalizado', 'woocommerce' );

    // Cargar opciones
    $this->init_form_fields();
    $this->init_settings();
    
    // Definir variables de usuario
    $this->enabled  = $this->get_option( 'enabled' );
    $this->title    = $this->get_option( 'title' );
  
    add_action( 'woocommerce_update_options_shipping_' . $this->id, array( $this, 'process_admin_options' ) );
    
    $json_data = json_decode(file_get_contents('tarifas.json',FILE_USE_INCLUDE_PATH),true);
    $this->tarifas_json =$json_data;

    $this->add_rate( array(
      'id'  => $this->id,
      'label' => $this->title,
      'cost'  => 0,
      'calc_tax' => 'per_order'
    ));
    
  }

  public function init_form_fields(){
    $this->form_fields = array(
      'enabled' => array(
        'title'     => __( 'Activar/Desactivar', 'woocommerce' ),
        'type'      => 'checkbox',
        'label'     => __( 'Activar costo de envío personalizado', 'woocommerce' ),
        'default'     => 'yes'
      ),
      'title' => array(
        'title'     => __( 'Method Title', 'woocommerce' ),
        'type'      => 'text',
        'description'   => __( 'Título que el usuario ve durante la comprobación.', 'woocommerce' ),
        'default'   => __( 'Costo de envío', 'woocommerce' ),
        
      )
    );
  }

  public function calculate_shipping($package){

    $region = $package["destination"]["state"];
    $comuna = $package["destination"]["city"];

    $valor_comuna;

    if($comuna!==""){
      $comuna_val = $this->tarifas_json[$region];
      foreach ($comuna_val as $key => $value) {
        if($value["nombre"]==$comuna){
          $valor_comuna = $value["valor"];
        }
      }
      $cost += $valor_comuna;
    }else{
      $cost = 0;
    } 
    
    // enviar datos al usuario
    $this->add_rate( array(
      'id'  => $this->id,
      'label' => $this->title,
      'cost'  => $cost,
      'calc_tax' => 'per_order'
    ));
  }
}
?>