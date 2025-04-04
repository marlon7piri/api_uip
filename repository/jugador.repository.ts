import { JugadorServices } from "services/jugador.services";

export class JugadorRepository {



    constructor(readonly jugadorServices: JugadorServices) { }

    async find() {
        await this.jugadorServices.findAll()
    }
}