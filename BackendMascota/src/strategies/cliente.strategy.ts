import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import parseBearerToken from 'parse-bearer-token';
import {UserProfile} from '@loopback/security';
import {AutenticacionService} from '../services';

export class EstrategiaCliente implements AuthenticationStrategy {
  name: string = "cliente";
  constructor(
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService
  ) { }
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let token = parseBearerToken(request);
    if (token) {
      let datos = this.servicioAutenticacion.ValidarTokenJWT(token);
      if (datos) {
        let perfil: UserProfile = Object.assign({
          nombre: datos.data.nombre
        });
        return perfil;

      } else {
        throw new HttpErrors[401]("El token esta malo")
      }

    } else {
      throw new HttpErrors[401]("no vino el token incluido")

    }


  }

}
