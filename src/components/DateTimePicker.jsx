import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
registerLocale('es', es);

function DateTimePicker({ fecha, setFecha, hora, setHora }) {
  const handleDateChange = (date) => {
    setFecha(date);
    if (!hora) setHora(new Date(date).setHours(15, 0, 0));
  };

  // 'selected' debe ser un objeto Date para el control de 12h, pero usamos string para el input
  const timeValue = new Date(hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(':');
    const newDate = new Date(fecha);
    newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    setHora(newDate);
  };

  return (
    <div className="datetime-group">
      <div className="input-group">
        <FaCalendarAlt className="input-icon" />
        <DatePicker
          selected={fecha}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          locale="es"
          minDate={new Date()}
          placeholderText="Selecciona fecha"
          className="datepicker-input"
        />
      </div>
      <div className="input-group">
        <FaClock className="input-icon" />
        <input
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          className="datepicker-input"
        />
      </div>
    </div>
  );
}
export default DateTimePicker;