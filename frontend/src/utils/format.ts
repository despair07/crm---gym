/**
 * Utilidades de formato localizadas para Colombia
 */

/** Formatea un número como pesos colombianos: $ 1.250.000 */
export const formatCOP = (value: number | undefined | null): string => {
  if (value == null) return '$ 0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/** Formatea un número de teléfono colombiano: 300 000 0000 */
export const formatTelCO = (tel: string | null | undefined): string => {
  if (!tel) return '—';
  const digits = tel.replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return tel;
};

/** Formatea una fecha ISO a formato colombiano: dd/mm/yyyy */
export const formatFecha = (fecha: string | null | undefined): string => {
  if (!fecha) return '—';
  try {
    const d = new Date(fecha + (fecha.includes('T') ? '' : 'T00:00:00'));
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return fecha;
  }
};

/** Formatea una fecha+hora ISO a formato colombiano: dd/mm/yyyy hh:mm */
export const formatFechaHora = (fechaHora: string | null | undefined): string => {
  if (!fechaHora) return '—';
  try {
    const d = new Date(fechaHora);
    return d.toLocaleString('es-CO', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch {
    return fechaHora;
  }
};
