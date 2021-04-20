import React, {useState, useEffect} from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import { API } from "aws-amplify";
import { useAppContext } from "../libs/contextlib";
import { onError } from "../libs/errorlib";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import { FaMotorcycle } from "react-icons/fa";
import "./Home.css";

export default function Home() {
  
  // -------------------------------------------------------------------------
  // Variables de estado
  // -------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAppContext();
 
  // -------------------------------------------------------------------------
  // Renders
  // -------------------------------------------------------------------------

  function renderForm() {
    return (
      <> Crear Orden </>
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

