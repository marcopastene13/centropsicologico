import { Container, Button, Row, Col, Card, Badge } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";

const professionals = [
  {
    id: 1,
    name: "Patricia Santander",
    title: "Psicóloga Clínica",
    img: "/images/patty.jpg",
    whatsapp: "56986431293",
    bio: "Patricia Santander, Directora y Psicóloga Clínica desde 2016 en Maipú, especialista en psicodiagnóstico, terapia individual y víctimas de ASI. También ejerce como Perito Judicial Forense, elaborando informes y evaluaciones en contextos penales y familiares.",
    specialties: ["Trastornos de Ansiedad", "Depresión", "Terapia Cognitivo-Conductual", "Terapia de Adultos"],
    education: [
      "Diplomado en Peritaje Psicológico y Social en Contexto Judicial | Universidad Andrés Bello (UNAB) | 2023",
      "Diplomado Internacional Estrategias Clínicas Terapia Breve | ADIPA | 2021",
      "Curso Peritaje Psicológico en contexto familiar  | Instituto Virtulys | 2021",
      "Curso Psicopatología Forense: Herramientas para la Evaluación Pericial Psicológica | Instituto Grupo Palermo | 2018",
      "Título Profesional de Psicóloga con Grado Académico de Licenciada en Psicología | Universidad de Las Américas(UDLA) | 2015",
      "Seminario “Psicología Forense y Jurídica” | Universidad Bernardo O'Higgins (UBO) | 2015",
      "Seminario “Expresiones de la Violencia de Género” | Universidad de Concepción (UDC) | 2015",
      "Seminario “Autocuidado y Manejo de las Emociones en Niños Preadolescentes” | Universidad de Las Américas(UDLA) | 2013",
      "Seminario “Apego en la Primera Infancia” | Universidad de Chile (UDCH) | 2012",
      "Cátedra Grafología | Universidad de Las Américas (UDLA) | 2012"
    ],
    scheduleLabel: "Lunes a Viernes: 9:00 - 20:00",
    workingDays: [1, 2, 3, 4, 5], // 1=Lunes ... 5=Viernes
    slots: { start: "09:00", end: "20:00", intervalMins: 60 }, // cada 60m
    exceptions: {
    },
    booked: {
    },
    priceInPerson: 30000,
    priceOnline: 25000
  },
  {
    id: 2,
    name: "Yasna Valdes",
    title: "Psicólogo Infantil",
    img: "/images/carlos.jpg",
    whatsapp: "56987654321",
    bio: "Especialista en psicología infantil y adolescente con enfoque en terapia familiar. Experto en el tratamiento de TDAH, trastornos del espectro autista y problemas de conducta.",
    specialties: ["Psicología Infantil", "TDAH", "Trastornos del Espectro Autista", "Terapia Familiar"],
    education: [
      "Psicólogo, Universidad Católica (2010)",
      "Magíster en Psicología Infantil, UDP (2013)",
      "Certificación en Terapia ABA (2016)"
    ],
     scheduleLabel: "Lunes a Viernes: 9:00 - 20:00",
    workingDays: [1, 2, 3, 4, 5], // 1=Lunes ... 5=Viernes
    slots: { start: "09:00", end: "20:00", intervalMins: 60 }, // cada 60m
    exceptions: {
    },
    booked: {
    },
    priceInPerson: 30000,
    priceOnline: 25000
  },
  {
    id: 3,
    name: "Stephany Troncoso",
    title: "Psicólogo Infantil",
    img: "/images/stephany.jpg",
    whatsapp: "56987654321",
    bio: "Especialista en psicología infantil y adolescente con enfoque en terapia familiar. Experto en el tratamiento de TDAH, trastornos del espectro autista y problemas de conducta.",
    specialties: ["Psicología Infantil", "TDAH", "Trastornos del Espectro Autista", "Terapia Familiar"],
    education: [
      "Psicólogo, Universidad Católica (2010)",
      "Magíster en Psicología Infantil, UDP (2013)",
      "Certificación en Terapia ABA (2016)"
    ],
     scheduleLabel: "Lunes a Viernes: 9:00 - 20:00",
    workingDays: [1, 2, 3, 4, 5], // 1=Lunes ... 5=Viernes
    slots: { start: "09:00", end: "20:00", intervalMins: 60 }, // cada 60m
    exceptions: {
    },
    booked: {
    },
    priceInPerson: 30000,
    priceOnline: 25000
  }
];

// Utils
const CLP = (n) =>
  n?.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function generateTimeSlots(start, end, intervalMins) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const slots = [];
  let cur = new Date(0, 0, 0, sh, sm, 0);
  const endD = new Date(0, 0, 0, eh, em, 0);
  while (cur <= endD) {
    slots.push(`${pad(cur.getHours())}:${pad(cur.getMinutes())}`);
    cur = new Date(cur.getTime() + intervalMins * 60000);
  }
  // Elimina el último si coincide exacto con end y no quieres tomar la hora final como inicio
  if (slots.length > 1 && slots[slots.length - 1] === end) slots.pop();
  return slots;
}

export default function ProfessionalDetail() {
  const { id } = useParams();
  const professional = professionals.find((p) => p.id === parseInt(id));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    // reset slot al cambiar fecha
    setSelectedSlot(null);
  }, [selectedDate]);

  const allSlots = useMemo(() => {
    if (!professional) return [];
    return generateTimeSlots(
      professional.slots.start,
      professional.slots.end,
      professional.slots.intervalMins
    );
  }, [professional]);

  if (!professional) {
    return (
      <Container className="mt-4">
        <Card className="custom-card text-center">
          <Card.Body>
            <h2>Profesional no encontrado</h2>
            <p>El profesional que buscas no existe o ha sido removido.</p>
            <Button href="/professionals" variant="primary">
              Ver todos los profesionales
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const isWeekend = (date) => {
    const day = date.getDay(); // 0=Domingo ... 6=Sábado
    return day === 0 || day === 6;
  };

  const isWorkingDay = (date) => {
    const jsDay = date.getDay(); // 0=Domingo,1=Lunes
    // Convertimos a 1-7 con Lunes=1
    const weekday = jsDay === 0 ? 7 : jsDay;
    return professional.workingDays.includes(weekday);
  };

  const isDisabledDay = (date) => {
    const key = toKey(date);
    if (professional.exceptions[key]) return true;
    if (!isWorkingDay(date)) return true; // bloquea fines de semana y días no laborales
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true; // pasado
    return false;
  };

  const key = toKey(selectedDate);
  const bookedForDay = professional.booked[key] || [];
  const availableSlots = allSlots.filter((s) => !bookedForDay.includes(s));

  const whatsappMessage = selectedSlot
    ? `Hola ${professional.name}, quiero agendar una sesión el ${selectedDate.toLocaleDateString()} a las ${selectedSlot}.`
    : `Hola ${professional.name}, me gustaría coordinar una sesión.`;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8}>
          <Card className="custom-card mb-4">
            <Row className="g-0">
              {professional.img && (
                <Col md={4} className="d-flex flex-column">
                  <Card.Img
                    src={professional.img}
                    alt={`Foto de ${professional.name}`}
                    style={{ height: "300px", objectFit: "cover" }}
                    className="rounded-start"
                  />
                  {/* Valores de atención bajo la foto */}
                  {(professional.priceInPerson || professional.priceOnline) && (
                    <div className="p-3 border-top">
                      {professional.priceInPerson && (
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Presencial</span>
                          <Badge bg="light" text="dark">{CLP(professional.priceInPerson)}</Badge>
                        </div>
                      )}
                      {professional.priceOnline && (
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted">Online</span>
                          <Badge bg="light" text="dark">{CLP(professional.priceOnline)}</Badge>
                        </div>
                      )}
                    </div>
                  )}
                </Col>
              )}
              <Col md={professional.img ? 8 : 12}>
                <Card.Body>
                  <Card.Title as="h1">{professional.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {professional.title}
                  </Card.Subtitle>
                  <div className="mb-3">
                    {professional.specialties.map((sp, i) => (
                      <Badge key={i} bg="light" text="dark" className="me-2 mb-2">
                        {sp}
                      </Badge>
                    ))}
                  </div>
                  <Card.Text>{professional.bio}</Card.Text>
                  <div className="mb-3">
                    <h6>Horarios de Atención:</h6>
                    <p className="text-muted">{professional.scheduleLabel}</p>
                  </div>
                  <div>
                    <h6>Formación</h6>
                    <ul className="mb-0">
                      {professional.education.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="custom-card sticky-top">
            <Card.Body>
              <Card.Title className="text-center mb-3">Reservar Sesión</Card.Title>

              <div className="mb-3">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  minDate={new Date()}
                  tileDisabled={({ date, view }) =>
                    view === "month" ? isDisabledDay(date) : false
                  }
                  className="mx-auto"
                />
                <div className="text-center mt-2">
                  <small className="text-muted">
                    Fecha seleccionada: <strong>{selectedDate.toLocaleDateString()}</strong>
                  </small>
                </div>
              </div>

              <div className="mb-3">
                <h6 className="mb-2">Horarios disponibles</h6>
                {availableSlots.length === 0 ? (
                  <div className="text-muted small">
                    No hay horarios disponibles para este día.
                  </div>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedSlot === slot ? "success" : "outline-success"}
                        size="sm"
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              <div className="d-grid gap-2">
                <Button
                  href={`https://wa.me/${professional.whatsapp}?text=${encodeURIComponent(
                    whatsappMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="success"
                  size="lg"
                  disabled={!selectedSlot}
                >
                  Confirmar {selectedSlot ? `(${selectedSlot})` : ""}
                </Button>
                <Button
                  href={`https://wa.me/${professional.whatsapp}?text=${encodeURIComponent(
                    `Hola ${professional.name}, tengo algunas preguntas sobre la terapia.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline-primary"
                >
                  Hacer consulta
                </Button>
              </div>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Fines de semana y días no laborales aparecen bloqueados en el calendario.
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
