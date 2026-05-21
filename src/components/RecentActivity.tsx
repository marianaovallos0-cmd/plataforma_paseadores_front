import { useAuth } from "@/context/AuthContext";
import { getStatusBadge } from "@/hooks/useBadgeStatus";
import { useRequestByOwner } from "@/hooks/useRequests";
import Loader from "./Loader";

export default function RecentActivity() {
  const { user: usuario } = useAuth();
  const { requests, loadRequests } = useRequestByOwner(usuario.idUsuario)

  if (loadRequests) return <Loader/>

  return (
    <div className="col-right">
      <div className="actividad-card">
        <h3>Actividad reciente</h3>
        {requests.length === 0 ? <p className="actividad-vacia">No hay actividad reciente</p> :
          <div className="actividad-lista">
            {requests.map(solicitud => {
              const estadoInfo = getStatusBadge(solicitud.estado);
              return (
                <div key={solicitud.idSolicitud} className="actividad-item">
                  <div className="actividad-info">
                    <div className="actividad-mascota">{solicitud.cantidadPerros} Mascotas</div>
                    <div className="actividad-fecha">{new Date(solicitud.fechaSolicitud).toLocaleDateString('es-ES')} - {solicitud.horaSugerida}</div>
                    <div className="actividad-acciones">
                      <span className={`estado-badge ${estadoInfo.clase}`}>{estadoInfo.icono} {estadoInfo.texto}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        }
      </div>
    </div>
  )
}
