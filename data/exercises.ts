
import { Exercise } from '../types';

export const EXERCISES: Exercise[] = [
  // BRAÇOS - BÍCEPS
  {
    id: '1',
    name: 'Rosca Direta',
    category: 'Bíceps',
    difficulty: 'Iniciante',
    description: 'O exercício clássico para construção de pico de bíceps com barra ou halteres.',
    videoUrl: 'https://www.youtube.com/results?search_query=rosca+direta+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnRmc3N5eDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9iZCZjdD1n/61O8iP1NInM8A8v8bK/giphy.gif',
    tips: ['Mantenha os cotovelos colados ao corpo', 'Não balance as costas', 'Controle a descida (fase excêntrica)']
  },
  {
    id: 'b2',
    name: 'Rosca Martelo',
    category: 'Bíceps',
    difficulty: 'Iniciante',
    description: 'Focado no braquial e braquiorradial, excelente para dar espessura ao braço.',
    videoUrl: 'https://www.youtube.com/results?search_query=rosca+martelo+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnN3dm9xeDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l3vR5In8pP0lP3ZlS/giphy.gif',
    tips: ['Pegada neutra (palmas para dentro)', 'Evite usar o impulso dos ombros', 'Esmague o músculo no topo']
  },
  {
    id: 'b3',
    name: 'Rosca Concentrada',
    category: 'Bíceps',
    difficulty: 'Intermediário',
    description: 'Isolamento total para o pico do bíceps.',
    videoUrl: 'https://www.youtube.com/results?search_query=rosca+concentrada+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHN3dm9xeDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/M9Z9A3u9uH59S/giphy.gif',
    tips: ['Apoie o braço na parte interna da coxa', 'Movimento lento e controlado', 'Foco na contração máxima']
  },

  // BRAÇOS - TRÍCEPS
  {
    id: '2',
    name: 'Tríceps Testa',
    category: 'Tríceps',
    difficulty: 'Intermediário',
    description: 'Focado na cabeça longa do tríceps, essencial para a espessura do braço.',
    videoUrl: 'https://www.youtube.com/results?search_query=triceps+testa+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZhcHoxeDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/M9Z9A3u9uH59S/giphy.gif',
    tips: ['Cotovelos apontando para o teto', 'Desça a barra devagar até a testa', 'Estenda totalmente os braços']
  },
  {
    id: 't2',
    name: 'Tríceps Pulley',
    category: 'Tríceps',
    difficulty: 'Iniciante',
    description: 'Exercício fundamental em polia para isolamento do tríceps.',
    videoUrl: 'https://www.youtube.com/results?search_query=triceps+pulley+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXNwcDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKub7i8pXjO2Gpq/giphy.gif',
    tips: ['Mantenha os ombros para baixo', 'Não abra os cotovelos', 'Estenda o braço até o final']
  },
  {
    id: 't3',
    name: 'Tríceps Corda',
    category: 'Tríceps',
    difficulty: 'Intermediário',
    description: 'Permite maior amplitude e contração do tríceps na fase final.',
    videoUrl: 'https://www.youtube.com/results?search_query=triceps+corda+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnNwcDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/26uf8uT0vYd7v8Ltu/giphy.gif',
    tips: ['Abra a corda no final do movimento', 'Mantenha o punho firme', 'Foco na parte lateral do tríceps']
  },

  // PEITORAL
  {
    id: '3',
    name: 'Supino Reto',
    category: 'Peitoral',
    difficulty: 'Intermediário',
    description: 'Rei dos exercícios de empurrar para peitoral, ombros e tríceps.',
    videoUrl: 'https://www.youtube.com/results?search_query=supino+reto+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXNwcDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/j0Gq30N9K3Y2Y/giphy.gif',
    tips: ['Adução de escápulas', 'Toque levemente o peito', 'Mantenha os pés firmes no chão']
  },
  {
    id: 'p2',
    name: 'Peck Deck',
    category: 'Peitoral',
    difficulty: 'Iniciante',
    description: 'Máquina voador para isolamento e "pump" no peitoral.',
    videoUrl: 'https://www.youtube.com/results?search_query=peck+deck+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3NwcDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l2R09lU6i7QkYn68w/giphy.gif',
    tips: ['Mantenha o peito aberto', 'Não deixe os ombros virem para frente', 'Sinta o alongamento no final']
  },

  // COSTAS
  {
    id: 'c1',
    name: 'Puxada Alta',
    category: 'Costas',
    difficulty: 'Iniciante',
    description: 'Trabalha a largura das costas (Latíssimo do dorso).',
    videoUrl: 'https://www.youtube.com/results?search_query=puxada+alta+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHNwcDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKVUn7iM8FMEU24/giphy.gif',
    tips: ['Puxe a barra em direção ao peito', 'Incline levemente o tronco para trás', 'Não use o corpo para balançar']
  },
  {
    id: 'c2',
    name: 'Remada Baixa',
    category: 'Costas',
    difficulty: 'Iniciante',
    description: 'Focado na espessura das costas e trapézio médio.',
    videoUrl: 'https://www.youtube.com/results?search_query=remada+baixa+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXNwcDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l0MYL72610pajZ9sc/giphy.gif',
    tips: ['Mantenha a coluna ereta', 'Traga o triângulo até o abdômen', 'Aperte as escápulas no final']
  },

  // PERNAS
  {
    id: '4',
    name: 'Agachamento Livre',
    category: 'Pernas',
    difficulty: 'Avançado',
    description: 'O melhor exercício para construção de membros inferiores e core.',
    videoUrl: 'https://www.youtube.com/results?search_query=agachamento+livre+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3Rmc3N5eDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/rC9uzO6rR1C2o/giphy.gif',
    tips: ['Peito estufado', 'Joelhos na direção da ponta dos pés', 'Desça até quebrar o paralelo']
  },
  {
    id: 'l2',
    name: 'Cadeira Extensora',
    category: 'Pernas',
    difficulty: 'Iniciante',
    description: 'Isolamento máximo para o quadríceps.',
    videoUrl: 'https://www.youtube.com/results?search_query=cadeira+extensora+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTBzdm9xeDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l0HlS68U5I7N9L6n2/giphy.gif',
    tips: ['Mantenha o quadril fixo no banco', 'Extensão total dos joelhos', 'Controle a descida']
  },

  // OMBROS
  {
    id: 'o1',
    name: 'Elevação Lateral',
    category: 'Ombros',
    difficulty: 'Iniciante',
    description: 'O segredo para ombros largos e estéticos.',
    videoUrl: 'https://www.youtube.com/results?search_query=elevação+lateral+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTFzdm9xeDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l0HlU9p6MvXoX0f9S/giphy.gif',
    tips: ['Leve os halteres até a linha do ombro', 'Pequena flexão nos cotovelos', 'Imagine que está derramando água de uma jarra']
  },
  {
    id: 'o2',
    name: 'Desenvolvimento',
    category: 'Ombros',
    difficulty: 'Intermediário',
    description: 'Exercício básico de força para a parte frontal e lateral do deltóide.',
    videoUrl: 'https://www.youtube.com/results?search_query=desenvolvimento+ombros+execução+correta',
    animationUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTJzdm9xeDRmZGt6eHR5dzl6dThoMGVzY3N6eXh6eXh6eXh6eXh6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l0MYLp6k8hI6p0vS8/giphy.gif',
    tips: ['Mantenha os antebraços na vertical', 'Não arqueie excessivamente as costas', 'Estenda acima da cabeça']
  }
];
