import Equipo from '../models/Equipo.models.js'

// Crear un nuevo equipo
export const crearEquipo = async (req, res) => {
  try {
    const equipo = new Equipo(req.body);
    await equipo.save();
    res.status(201).json(equipo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los equipos
export const obtenerEquipos = async (req, res) => {
  try {

    const {autorId} =  await req.query
    let filtro = {autorId}

    const equipos = await Equipo.find();

    res.status(200).json(equipos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un equipo por ID
export const obtenerEquipoPorId = async (req, res) => {
  try {
    const equipo = await Equipo.findById(req.params.id).populate("torneos", "nombre");
    if (!equipo)
      return res.status(404).json({ message: "Equipo no encontrado" });
    res.json(equipo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un equipo por ID
export const obtenerEquipoPorPartido = async (req, res) => {

  const { id_local, id_visitante } = req.body
  try {
    const equipo_local = await Equipo.findById(id_local)
    const equipo_visitante = await Equipo.findById(id_visitante)

    if (!equipo_local || !equipo_visitante)
      return res.status(404).json({ message: "Equipos no encontrados" });


    const equipos = [equipo_local,equipo_visitante]

    res.json(equipos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un equipo por ID
export const actualizarEquipo = async (req, res) => {
  try {
    const {autorId} =await req.query

    const equipofound = await Equipo.findById(req.params.id)

    if(equipofound && equipofound.autorId !== autorId){
      return res.status(401).json({message:"No tienes permitido editar este equipo"})
    }

    const equipo = await Equipo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!equipo)
      return res.status(404).json({ message: "Equipo no encontrado" });
    res.status(201).json(equipo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un equipo por ID
export const eliminarEquipo = async (req, res) => {
  try {
    const equipo = await Equipo.findByIdAndDelete(req.params.id);
    if (!equipo)
      return res.status(404).json({ message: "Equipo no encontrado" });
    res.json({ message: "Equipo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
