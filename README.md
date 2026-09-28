# Painel de abordagem · Seguros

O gerente recebe apenas **index.html**. Abre com duplo clique, entra em **Minha carteira** e informa sua funcional. Os dados já estão dentro do HTML: não precisa de servidor, internet, Node.js nem selecionar CSV.

## Atualizar os dados

1. Coloque seu CSV na mesma pasta de `index.html`, `Atualizar base.cmd` e `atualizar-base.cjs`.
2. Dê dois cliques em **Atualizar base.cmd**.
3. Aguarde a mensagem **HTML atualizado**. Distribua o `index.html` atualizado aos gerentes.

O script dá preferência a **clientes.csv**. Se houver apenas um CSV na pasta, aceita qualquer nome. Se houver vários, renomeie o desejado para `clientes.csv` ou arraste o arquivo sobre `Atualizar base.cmd`.

Sempre que mudar o CSV, execute o atualizador novamente. O script substitui somente a base incorporada ao HTML; preserva o visual, os roteiros e o CSV original. Se o arquivo estiver inválido ou sem registros válidos, mantém o HTML anterior. Uma cópia já enviada a um gerente precisa ser substituída pela nova versão.

O atualizador usa Node.js, já instalado neste computador. Essa dependência existe apenas no computador de quem atualiza a base. Também pode executar `node atualizar-base.cjs` pelo terminal nesta pasta.

Nenhum CSV fictício foi criado. Até a primeira atualização, o guia de abordagens funciona e a carteira informa que a base está indisponível. O `servidor.cjs` da versão anterior não é necessário para este fluxo.

## Colunas da base

| Coluna | Uso |
| --- | --- |
| `cpf` | Obrigatória. Identificação do cliente. |
| `funcional` | Obrigatória. Vínculo exato com o gerente. |
| `mod_atnd_ip` | Modalidade: BUILDER, HIGH, MEDICOP, PREMIUM, SERVIDOR ou SMART. |
| Outras colunas | Exibidas automaticamente em **Ver cliente**, na ordem do arquivo. |

- Nomes reconhecidos na tabela: `nome`, `nome_cliente`, `nm_cliente`, `nm_clie`, `nm_cli`, `cliente` e `nome_completo`.
- Contato reconhecido: `celular`, `telefone`, `telefone_cliente`, `fone`, `tel_celular`, `nr_celular`, `email` ou `e_mail`. Demais campos continuam disponíveis nos detalhes.
- Aceita separação por ponto e vírgula, vírgula ou tabulação; campos entre aspas; UTF-8, Windows-1252 e UTF-16 com BOM.
- CPF e funcional são textos: zeros à esquerda são preservados, e `00123` difere de `123`. Exporte esses campos sem notação científica.
- Registros sem funcional são ignorados com aviso. Cabeçalhos duplicados, CPF vazio em registro com funcional e linhas com quantidade de campos incorreta interrompem a atualização.
- Cada linha válida é um registro. Não há deduplicação automática de CPF. Modalidades ausentes ou desconhecidas continuam visíveis, sem roteiro associado.

## Editar os roteiros

Procure `ARGUMENTACOES` no `index.html`. Os textos atuais são provisórios. Pode editá-los antes ou depois de atualizar a base; o atualizador preserva essas alterações.

## Dados dentro do HTML

O HTML atualizado contém toda a base incorporada. A funcional serve como filtro, não como senha nem controle de acesso. Distribua esse arquivo apenas a quem pode receber a base completa. O painel não envia os dados a serviços externos.
