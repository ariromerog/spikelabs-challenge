import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Routes from "./Routes";
import { AppContext } from "./libs/contextlib";
import { LinkContainer } from "react-router-bootstrap";
import "./App.css";

function App() {
  const history = useHistory();
  // -------------------------------------------------------------------------
  // Verificar sesion 
  // -------------------------------------------------------------------------
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);  
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    userHasAuthenticated(false);
    await Auth.signOut();
    console.log("** user logged out **");
    history.push("/login");
  }

  // -------------------------------------------------------------------------
  // Render aplicacion
  // -------------------------------------------------------------------------
  return ( isAuthenticating ? (<div>Autenticando...</div>) : (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg="dark" variant="dark" expand="md" className="mb-3">
        <LinkContainer to="/">
          <Navbar.Brand className="font-weight-bold">
            Spikelabs Delivery!
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav activeKey={window.location.pathname}>
          {isAuthenticated ? (
            <>
              <LinkContainer to="/orders">
                <Nav.Link>Mis pedidos</Nav.Link>
              </LinkContainer>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </>
          ) : (
            <>
              <LinkContainer to="/signup">
                <Nav.Link>Registrarse</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            </>
          )}

          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
        <Routes />
      </AppContext.Provider>
      <hr/>
      <p className="text-center text-muted text-xs">@ariromerog  | spikelabs.xyz</p>
    </div>
  ));
}

export default App;

