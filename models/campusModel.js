const inscricoesCampus = {
  'IFC Blumenau': ['Futsal Masculino', 'Vôlei Masculino'],
  'IFC Camboriú': ['Basquete Masculino'],
  'IFC Brusque': ['Futsal Masculino']
};

const atletasCampus = [
  { id: 1, nome: 'Lucas Mendes', campus: 'IFC Blumenau', modalidade: 'Futsal Masculino', status: 'Regular' },
  { id: 2, nome: 'Camila Nunes', campus: 'IFC Blumenau', modalidade: 'Basquete Masculino', status: 'Pendente' },
  { id: 3, nome: 'Bruno Alves', campus: 'IFC Camboriú', modalidade: 'Vôlei Masculino', status: 'Regular' }
];

function getInscricoes(campusNome) {
  return (inscricoesCampus[campusNome] || []).slice();
}

function salvarInscricoes(campusNome, modalidades) {
  inscricoesCampus[campusNome] = Array.isArray(modalidades) ? modalidades : [modalidades].filter(Boolean);
  return getInscricoes(campusNome);
}

function getAtletas(campusNome) {
  return atletasCampus.filter((item) => item.campus === campusNome).map((item) => ({ ...item }));
}

function cadastrarAtleta(campusNome, dados) {
  const atleta = { id: Date.now(), ...dados, campus: campusNome, status: 'Regular' };
  atletasCampus.push(atleta);
  return atleta;
}

function substituirAtleta(campusNome, dados) {
  const atleta = { id: Date.now(), ...dados, campus: campusNome, status: 'Pendente_Laudo' };
  atletasCampus.push(atleta);
  return atleta;
}

module.exports = {
  getInscricoes,
  salvarInscricoes,
  getAtletas,
  cadastrarAtleta,
  substituirAtleta
};
