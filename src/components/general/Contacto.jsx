import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../../styles/ContactoStyle.css"

function Contacto() {
  return (
    <section className="contact-section">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="contact-header text-center mb-5">
              <h1 className="contact-title">Contacto</h1>
              <div className="title-divider"></div>
              <p className="contact-subtitle">
                ¿Tienes alguna consulta? ¡Estamos para ayudarte!
              </p>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="contact-card">
              <div className="contact-icon mb-4">
                <i className="fas fa-envelope"></i>
              </div>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa tu nombre"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="tuemail@ejemplo.com"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Mensaje</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Escribe tu mensaje"
                  />
                </Form.Group>

                <Button type="submit" className="contact-btn w-100">
                  <i className="fas fa-paper-plane me-2"></i>Enviar Mensaje
                </Button>
              </Form>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <div className="contact-footer text-center mt-5">
              <div className="paw-prints">
                <i className="fas fa-paw"></i>
                <i className="fas fa-paw"></i>
                <i className="fas fa-paw"></i>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Contacto;

