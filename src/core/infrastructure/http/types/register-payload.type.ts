export interface RegisterPayload {
  correo: string,
  contrasena: string,
  telefono: string,
  primerNombre: string
  segundoNombre: string
  primerApellido: string
  segundoApellido: string
  fotoPerfil: string
  roles: number[]
}