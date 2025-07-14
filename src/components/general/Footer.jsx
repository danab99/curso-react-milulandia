import { Container, Row, Col } from "react-bootstrap";
import "../../styles/FooterStyle.css"

function Footer() {
  return (
    <footer className="footer-section">
      <Container>
        <Row className="text-center text-md-start gy-4">
          <Col md={4}>
            <h5 className="footer-title">Milulandia</h5>
            <p className="footer-text">
              Un lugar para vos. Productos únicos, elegidos con amor.
            </p>
          </Col>

          <Col md={4}>
            <h6 className="footer-subtitle">Seguinos</h6>
            <div className="footer-social">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
            </div>
          </Col>

          <Col md={4}>
            <h6 className="footer-subtitle">Contacto</h6>
            <p className="footer-text">info@milulandia.com</p>
            <p className="footer-text">+54 9 11 1111 1111</p>
          </Col>
        </Row>

        <hr className="footer-divider" />

        <Row>
          <Col className="text-center">
            <p className="footer-copy">
              &copy; 2025 Milulandia — Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;

