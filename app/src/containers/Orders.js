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
        const notes = await API.get("orders", "/orders");
        console.log(orders);
        setOrders(orders);
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
      <div className="jumbotron">Cargando pedidos...</div>
    );
  }

  return (
    <div className="orders">
      <h1>Mis Pedidos</h1>
      { isLoading && (<div className="p-5 text-center text-muted"> Cargando pedidos ....  </div>)  }
    </div>
  );
}
