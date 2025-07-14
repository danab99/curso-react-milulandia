import { Container, Card } from "react-bootstrap";
import "../../styles/Admin/DashboardAdminStyle.css";

export default function Dashboard() {
  return (
    <Container className="dashboard-container">
      <Card className="dashboard-card shadow">
        <Card.Body>
          <h2 className="dashboard-title">Bienvenido al Panel de Administración</h2>
          <p className="dashboard-text">
            Aquí podrás visualizar estadísticas clave y acceder rápidamente a las funciones de gestión de tu tienda.
          </p>
          <p className="dashboard-text">
            Utiliza el menú lateral para navegar entre las secciones de productos, pedidos y usuarios.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

