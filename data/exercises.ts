
import { Exercise } from '../types';

export const EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Rosca Direta',
    category: 'Bíceps',
    difficulty: 'Iniciante',
    description: 'O exercício clássico para construção de pico de bíceps com barra ou halteres.',
    videoUrl: 'https://www.youtube.com/results?search_query=rosca+direta+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnRmc3N5eDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9iZCZjdD1n/61O8iP1NInM8A8v8bK/giphy.gif',
    tips: {
      posture: 'Pés na largura dos ombros, joelhos levemente flexionados.',
      contraction: 'Mantenha os cotovelos fixos e esmague o bíceps no topo.',
      breathing: 'Solte o ar na subida (esforço), inspire na descida.'
    },
    commonErrors: ['Balançar o tronco para subir o peso', 'Descolar os cotovelos das costelas', 'Punhos frouxos no topo'],
    advancedTips: ['Use a barra W para poupar os punhos', 'No topo, gire levemente os punhos para fora', 'Teste o método 21'],
    biomechanics: 'O bíceps braquial tem maior ativação com a palma da mão voltada para cima (supinação).'
  },
  {
    id: '3',
    name: 'Supino Reto',
    category: 'Peitoral',
    difficulty: 'Intermediário',
    description: 'Rei dos exercícios de empurrar para peitoral, ombros e tríceps.',
    videoUrl: 'https://www.youtube.com/results?search_query=supino+reto+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXNwcDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/j0Gq30N9K3Y2Y/giphy.gif',
    tips: {
      posture: 'Escápulas "travadas" no banco, pés firmes no chão.',
      contraction: 'Imagine que quer encostar um bíceps no outro.',
      breathing: 'Bloqueie o ar na descida (estabilidade), solte na subida.'
    },
    commonErrors: ['Tirar o glúteo do banco', 'Bater a barra no peito', 'Cotovelos abertos em 90 graus (risco ombro)'],
    advancedTips: ['Arqueie a lombar mantendo o glúteo fixo', 'Use o Leg Drive', 'Pausa de 1s no peito'],
    biomechanics: 'A adução horizontal é a principal função do peitoral maior aqui.'
  },
  {
    id: '4',
    name: 'Agachamento Livre',
    category: 'Pernas',
    difficulty: 'Avançado',
    description: 'O melhor exercício para construção de membros inferiores e core.',
    videoUrl: 'https://www.youtube.com/results?search_query=agachamento+livre+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3Rmc3N5eDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9iZCZjdD1n/rC9uzO6rR1C2o/giphy.gif',
    tips: {
      posture: 'Olhar para frente, core travado, peito aberto.',
      contraction: 'Empurre o chão com o meio do pé.',
      breathing: 'Inspire fundo antes de descer, segure, e solte ao subir.'
    },
    commonErrors: ['Joelhos "entrando" (valgo dinâmico)', 'Calcanhares saindo do chão', 'Arredondar a lombar'],
    advancedTips: ['Use anilhas nos calcanhares para mobilidade', 'Foque no Bracing abdominal'],
    biomechanics: 'Exige coordenação extrema entre quadríceps, glúteo e eretores da espinha.'
  }
];
