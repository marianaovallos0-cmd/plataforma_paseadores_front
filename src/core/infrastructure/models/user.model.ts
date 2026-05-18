
export interface UserRoleDto {
  idRol: string
  nombre: string
}

export interface UserDto {
  idUsuario: number
  correo: string
  telefono: string
  primerNombre: string
  segundoNombre: string
  primerApellido: string
  segundoApellido: string
  fotoPerfil: string
  reputacion: number
  activo: boolean
  roles: UserRoleDto[]
}