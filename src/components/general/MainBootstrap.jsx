import { Container, Row, Col, Image } from "react-bootstrap";
import CarruselBootstrap from "./CarruselBootstrap";
import "../../styles/MainStyle.css"

function MainBootstrap() {
  return (
    <section className="main-section">
      <Container>
        <Row className="align-items-center mb-5">
          <Col xs={12} md={6} lg={6}>
            <CarruselBootstrap />
          </Col>
          <Col xs={12} md={6} lg={6}>
            <div className="main-text">
              <h1 className="main-title">Bienvenido a Milulandia</h1>
              <div className="title-divider"></div>
              <p className="main-subtitle">
                Descubre nuestros productos favoritos seleccionados con amor para vos.
              </p>
            </div>
          </Col>
        </Row>

      </Container>
    </section>
  );
}


export default MainBootstrap;

