import { Container, Row, Col, Card } from "react-bootstrap";
import "../../styles/AboutStyle.css"

function About() {
  return (
    <section className="about-section">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div className="about-header text-center mb-5">
              <h1 className="about-title">Sobre Nosotros</h1>
              <div className="title-divider"></div>
              <p className="about-subtitle">
                Descubre la historia detrás de Milulandia
              </p>
            </div>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={12}>
            <Card className="about-card main-card">
              <Card.Body>
                <Row className="mb-4">
                  <Col lg={6} className="mb-4">
                    <div className="story-section">
                      <div className="card-icon mb-3">
                        <i className="fas fa-heart"></i>
                      </div>
                      <Card.Title className="card-title">Nuestra Historia</Card.Title>
                      <Card.Text className="card-text">
                        Milulandia nació del amor por nuestra gatita Milu, quien nos inspiró
                        a crear un espacio donde cada producto sea seleccionado con el mismo
                        cariño y dedicación que le damos a ella. Desde 2023, nos hemos
                        especializado en ofrecer productos únicos que reflejan calidad y pasión.
                      </Card.Text>
                    </div>
                  </Col>

                  <Col lg={6} className="mb-4">
                    <div className="mission-section">
                      <div className="card-icon mb-3">
                        <i className="fas fa-gem"></i>
                      </div>
                      <Card.Title className="card-title">Nuestra Misión</Card.Title>
                      <Card.Text className="card-text">
                        Brindarte una experiencia de compra excepcional, donde cada
                        producto cuenta una historia y cada compra es una aventura.
                        Nos comprometemos a ofrecer calidad, variedad y un servicio
                        al cliente que supere tus expectativas.
                      </Card.Text>
                    </div>
                  </Col>
                </Row>

                <hr className="section-divider" />

                <div className="features-section text-center">
                  <div className="featured-icon mb-4">
                    <i className="fas fa-star"></i>
                  </div>
                  <Card.Title className="featured-title mb-4">
                    ¿Por qué elegir Milulandia?
                  </Card.Title>
                  <Row>
                    <Col md={4} className="mb-3">
                      <div className="feature-item">
                        <i className="fas fa-shield-alt feature-icon"></i>
                        <h5 className="feature-title">Compra Segura</h5>
                        <p className="feature-text">
                          Protección total en cada transacción
                        </p>
                      </div>
                    </Col>
                    <Col md={4} className="mb-3">
                      <div className="feature-item">
                        <i className="fas fa-shipping-fast feature-icon"></i>
                        <h5 className="feature-title">Envío Rápido</h5>
                        <p className="feature-text">
                          Recibí tus productos en tiempo récord
                        </p>
                      </div>
                    </Col>
                    <Col md={4} className="mb-3">
                      <div className="feature-item">
                        <i className="fas fa-award feature-icon"></i>
                        <h5 className="feature-title">Calidad Premium</h5>
                        <p className="feature-text">
                          Productos seleccionados con amor y criterio
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <div className="about-footer text-center">
              <h3 className="footer-title">¡Bienvenido a la familia Milulandia!</h3>
              <p className="footer-text">
                Donde cada compra es una nueva aventura y cada cliente es parte de nuestra historia.
              </p>
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

export default About;