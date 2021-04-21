import React, {useState, useEffect} from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import { API } from "aws-amplify";
import { useAppContext } from "../libs/contextlib";
import { onError } from "../libs/errorlib";
import { LinkContainer } from "react-router-bootstrap";
import "./Orders.css";

export default function Orders() {
  const { isAuthenticated } = useAppContext();
  // -------------------------------------------------------------------------
  // Variables de estado
  // -------------------------------------------------------------------------
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // -------------------------------------------------------------------------
  // Carga de datos
  // -------------------------------------------------------------------------
  useEffect(() => { 
    onLoad();
  }, [isAuthenticated]);

  async function onLoad() {
    if (isAuthenticated) {
      try {
        const resp = await API.get("orders", "/orders");
        console.log(resp);
        setOrders(resp);
      } catch (e) {
        console.log(e);
        onError(e);
      }
    }
    setIsLoading(false);
  }

  // -------------------------------------------------------------------------
  // Renders
  // -------------------------------------------------------------------------

  function renderOrders() {
    return (
      <ListGroup>
      {orders.map(({ orderId, origAddress, destAddress, distance, createdAt }) => (
        <ListGroup.Item key={orderId}>
          <p>Desde: {origAddress} Hasta: {destAddress}</p>
          <span className="text-muted">
            {new Date(createdAt).toLocaleString()} -  {distance.toFixed(2)} km       
          </span>
        </ListGroup.Item>
      ))}
      </ListGroup>
    );
  }

  return (
    <div className="orders">
      <h1>Mis Pedidos</h1>
      { isLoading ? (<div className="p-5 text-center text-muted"> Cargando pedidos ....  </div>) : renderOrders()  }
    </div>
  );
}
