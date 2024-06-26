import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Schedule.css';

const Schedule = () => {
  const [user, setUser] = useState({ fullName: '', phone: '', email: '' });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [isReservationValid, setIsReservationValid] = useState<boolean>(false);
  const [reservation, setReservation] = useState<any>(null);
  const navigate = useNavigate();

  const employees = {
    hairCut: ['Juan', 'Pedro', 'Luis', 'Carlos'],
    manicure: ['Ana', 'Maria', 'Sofia', 'Laura']
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser({
          fullName: userData.Nombre,
          phone: userData.telefono,
          email: userData.correo
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const validateReservation = () => {
      if (selectedDate && selectedTime && selectedService && selectedEmployee) {
        setIsReservationValid(true);
      } else {
        setIsReservationValid(false);
      }
    };

    validateReservation();
  }, [selectedDate, selectedTime, selectedService, selectedEmployee]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(event.target.value);
  };

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(event.target.value);
    setSelectedEmployee(''); // Reset employee when service changes
  };

  const handleEmployeeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEmployee(event.target.value);
  };

  const handleReservation = () => {
    if (isReservationValid) {
      setReservation({
        date: selectedDate,
        time: selectedTime,
        service: selectedService,
        employee: selectedEmployee,
        user: user
      });
    }
  };

  const handleMonthChange = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const renderCalendar = () => {
    const today = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      days.push(
        <button
          key={i}
          className={`calendar-day ${date < today ? 'past-day' : ''}`}
          onClick={() => handleDateChange(date)}
          disabled={date < today}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={() => handleMonthChange(-1)}>{"<"}</button>
          <span>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</span>
          <button onClick={() => handleMonthChange(1)}>{">"}</button>
        </div>
        <div className="calendar-weekdays">
          {daysOfWeek.map(day => <div key={day} className="calendar-weekday">{day}</div>)}
        </div>
        <div className="calendar-grid">{days}</div>
      </div>
    );
  };

  const renderTimeSlots = () => {
    if (!selectedDate) return null;

    const weekdayTimes = Array.from({ length: 15 }, (_, i) => `${8 + i}:00`);
    const weekendTimes = Array.from({ length: 8 }, (_, i) => `${11 + i}:00`);
    const times = selectedDate.getDay() % 6 === 0 ? weekendTimes : weekdayTimes;

    return (
      <select value={selectedTime} onChange={handleTimeChange}>
        <option value="">Seleccione una hora</option>
        {times.map(time => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>
    );
  };

  const renderEmployeeOptions = () => {
    const selectedEmployees = selectedService === 'Corte de cabello' ? employees.hairCut : employees.manicure;
    return (
      <select value={selectedEmployee} onChange={handleEmployeeChange}>
        <option value="">Seleccione un empleado</option>
        {selectedEmployees.map(employee => (
          <option key={employee} value={employee}>{employee}</option>
        ))}
      </select>
    );
  };

  return (
    <div className="schedule-container">
      <nav className="navbar">
        <p>Nombre: {user.fullName}</p>
        <p>Teléfono: {user.phone}</p>
        <p>Email: {user.email}</p>
        <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
      </nav>
      <div>
        <h2>Agendar Servicio</h2>
        {renderCalendar()}
        {selectedDate && (
          <>
            <div>
              <label>Hora: </label>
              {renderTimeSlots()}
            </div>
            <div>
              <label>Servicio: </label>
              <select value={selectedService} onChange={handleServiceChange}>
                <option value="">Seleccione un servicio</option>
                <option value="Corte de cabello">Corte de cabello</option>
                <option value="Manicure">Manicure</option>
              </select>
            </div>
            {selectedService && (
              <div>
                <label>Empleado: </label>
                {renderEmployeeOptions()}
              </div>
            )}
            <button
              className={`reserve-button ${isReservationValid ? 'active' : ''}`}
              onClick={handleReservation}
              disabled={!isReservationValid}
            >
              Agendar
            </button>
            {reservation && (
              <div className="reservation-modal">
                <div className="reservation-content">
                  <h3>Agendamiento realizado</h3>
                  <p>Fecha: {reservation.date?.toLocaleDateString()}</p>
                  <p>Hora: {reservation.time}</p>
                  <p>Servicio: {reservation.service}</p>
                  <p>Empleado: {reservation.employee}</p>
                  <p>Usuario: {reservation.user.fullName}</p>
                  <button onClick={() => setReservation(null)}>Aceptar</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Schedule;
