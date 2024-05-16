import inquirer from 'inquirer';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const mainQuestion = [
  {
    type: 'list',
    name: 'AI_SELECTED',
    message: 'Escolha a IA que deseja usar:',
    choices: ['GPT'],
  },
];

const commonQuestions = [
  {
    type: 'input',
    name: 'MENSAGEM_PARA_ENVIAR_QUANDO_RECEBER_TIPO_DESCONHECIDO',
    default:
      'Eu ainda não consigo processar a mensagem que você mandou. Por favor, envie um texto.',
    message:
      'Informe a mensagem para quando receber uma mensagem de demais tipos (documento, localização, etc...) :',
  },
  {
    type: 'input',
    name: 'HORAS_PARA_REATIVAR_IA',
    message:
      'Informe o número de horas para a IA voltar a responder uma conversa depois que acontecer uma intervenção humana na conversa:',
    default: '24',
  },
  {
    type: 'input',
    name: 'SOMENTE_RESPONDER',
    message:
      'Caso não queira que a IA responda todos os contatos, digite aqui os números separados por virgula que ela deve responder: (exemplo: "555199284158, 559496817713")',
  },
  {
    type: 'input',
    name: 'NAO_RESPONDER',
    message:
      'Caso queira que a IA não responda números especificos, digite aqui os números separados por virgula que ela NÃO deve responder: (exemplo: "555199284158, 559496817713")',
  },
  {
    type: 'input',
    name: 'SEGUNDOS_PARA_ESPERAR_ANTES_DE_GERAR_RESPOSTA',
    message: 'Informe os segundos para esperar antes de gerar resposta:',
    default: '10',
  },
];

const geminiQuestion = [
  {
    type: 'input',
    name: 'GEMINI_KEY',
    message:
      'Informe a sua GEMINI_KEY (https://aistudio.google.com/app/apikey):',
    validate: (input) =>
      !!input ||
      'A GEMINI_KEY não pode ser vazia. Por favor, informe um valor válido.',
  },
  {
    type: 'input',
    name: 'GEMINI_PROMPT',
    message: 'Informe a seu prompt:',
  },
];

const gptQuestions = [
  {
    type: 'input',
    name: 'OPENAI_KEY',
    message: 'Informe a sua OPENAI_KEY (https://platform.openai.com/api-keys):',
    validate: (input) =>
      !!input ||
      'A OPENAI_KEY não pode ser vazia. Por favor, informe um valor válido.',
  },
  {
    type: 'input',
    name: 'OPENAI_ASSISTANT',
    message:
      'Informe o seu OPENAI_ASSISTANT (https://platform.openai.com/assistants):',
    validate: (input) =>
      !!input ||
      'O OPENAI_ASSISTANT não pode ser vazio. Por favor, informe um valor válido.',
  },
];

const processCommonQuestions = async (envConfig) => {
  const commonAnswers = await inquirer.prompt(commonQuestions);
  Object.keys(commonAnswers).forEach((key) => {
    envConfig += `${key}="${commonAnswers[key]}"\n`;
  });
  return envConfig;
};

inquirer.prompt(mainQuestion).then(async (answers) => {
  let envConfig = `AI_SELECTED="${answers.AI_SELECTED}"\n`;

  if (answers.AI_SELECTED === 'GEMINI') {
    const geminiAnswer = await inquirer.prompt(geminiQuestion);
    envConfig += `GEMINI_KEY="${geminiAnswer.GEMINI_KEY}"\nGEMINI_PROMPT="${geminiAnswer.GEMINI_PROMPT}"\n`;
  } else {
    const gptAnswers = await inquirer.prompt(gptQuestions);
    envConfig += `OPENAI_KEY="${gptAnswers.OPENAI_KEY}"\nOPENAI_ASSISTANT="${gptAnswers.OPENAI_ASSISTANT}"\n`;
  }

  envConfig = await processCommonQuestions(envConfig);

  fs.writeFileSync('.env', envConfig, { encoding: 'utf8' });
  console.log('Configuração salva com sucesso! 🎉');
});
