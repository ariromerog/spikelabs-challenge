import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import ListGroup from 'react-bootstrap/ListGroup';
import { API } from "aws-amplify";
import { useAppContext } from "../libs/contextlib";
import { useFormFields } from "../libs/hookslib";
import { FaMotorcycle } from "react-icons/fa";
import "./Home.css";

export default function Home() {
  
  // -------------------------------------------------------------------------
  // Variables de estado
  // -------------------------------------------------------------------------
  const { isAuthenticated } = useAppContext();
  const [error, setError] = useState(false);
  const [distance, setDistance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useFormFields({
    origAddress: "",
    destAddress: "",
  });
  const [row, setRow] = useState({});
  
  // -------------------------------------------------------------------------
  // Validaciones de formulario
  // -------------------------------------------------------------------------
  function validateForm() {
    return (
      fields.origAddress.length > 5 && 
      fields.destAddress.length > 5
    );
  }

  // -------------------------------------------------------------------------
  // Obtener distancia 
  // -------------------------------------------------------------------------

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    // obtener datos de Nominatim
    // TODO: obtener varios resultados y permitir al usuario seleccionar el correcto
    // por ahora nos quedamos con el primero
    console.log("obteniendo datos");
    const origReq = await fetch("https://nominatim.openstreetmap.org/search/"+fields.origAddress+"?format=json&limi=1");
    const origResp = await origReq.json();
    const destReq = await fetch("https://nominatim.openstreetmap.org/search/"+fields.destAddress+"?format=json&limi=1");
    const destResp = await destReq.json();
    setIsLoading(false);

    // verificar datos recibidos 
    if ( !origResp.length || !destResp.length ) {
      setError(true);
      return;
    } 
    
    const orig = origResp[0];
    const dest = destResp[0];
    // obtener distancia entre 2 coordenadas usando API
    // https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md
    // http://router.project-osrm.org/route/v1/driving/13.388860,52.517037;13.397634,52.529407
    console.log(orig);
    console.log(dest);
   
    const routeReq = await fetch(`https://router.project-osrm.org/route/v1/driving/${orig.lon},${orig.lat};${dest.lon},${dest.lat}`);
    const routeResp = await routeReq.json();

    console.log(routeResp);
    
    // verificar datos recibidos 
    if ( routeResp.code !== "Ok" || !routeResp.routes[0]  ) {
      setError(true);
      return;
    }

    // desplegar distancia
    const dist = routeResp.routes[0].distance/1000 ;
    setDistance( dist ) ;

    // TODO: desplegar mapa ... 

    setRow({
      origAddress: fields.origAddress,
      origComputedAddress: orig.display_name,
      origLat: orig.lat,
      origLon: orig.lon,
      destAddress: fields.destAddress,
      destComputedAddress: dest.display_name,
      destLat: dest.lat,
      destLon: dest.lon,
      distance: dist,
    });
  }

  // -------------------------------------------------------------------------
  // Enviar datos a DynamoDB
  // -------------------------------------------------------------------------

  function handleConfirm() {
    console.log("** enviando datos a dyndb! **");
    console.log(row);
  }

  // -------------------------------------------------------------------------
  // Renders
  // -------------------------------------------------------------------------

  function renderForm() {
    return (
    <div className="CreateOrder">

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="origAddress" size="lg">
          <Form.Label>Dirección de origen</Form.Label>
          <Form.Control
            autoFocus
            placeholder="Ej. Avenida siempreviva 742, Springfield"
            onChange={setFields}
            value={fields.startAddress}
          />
        </Form.Group>
        <Form.Group controlId="destAddress" size="lg">
          <Form.Label>Dirección de destino</Form.Label>
          <Form.Control
            onChange={setFields}
            value={fields.destAddress}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validateForm() || isLoading}>
         { isLoading ? (<>Calculando...</>) : (<>Calcular Distancia</>) } 
        </Button> 
      </Form>

      { error && (
          <Alert variant="danger" className="text-center">
            <h1>Ooops!</h1> 
            <p>No pudimos encontrar tus direcciones. Por favor intenta de nuevo.</p>
          </Alert>
      )}

      { distance && (

          <Alert variant="success" className="text-center">
            <h1> { distance.toFixed(2) } km</h1> 
          </Alert>
      )}

      <Button block size="lg" variant="success" disabled={!distance || isLoading} onClick={handleConfirm}>
        Enviar
      </Button> 
      <Button block type="reset" variant="secondary">
        Limpiar
      </Button> 
    </div>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1><span className="text-danger"><FaMotorcycle/></span></h1>
        <h1>Spikelabs Delivery</h1>
        <p className="text-muted">PerdidosYa también era un buen nombre</p>
        <p>Regístrate para empezar a pedir</p>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderForm() : renderLander()}
    </div>
  );
}

