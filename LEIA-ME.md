# Painel de abordagem · Seguros

O `index.html` contém todo o painel. Não depende de internet, bibliotecas externas ou instalação. Nenhuma base fictícia foi criada.

## Abrir diretamente

1. Coloque seu CSV na mesma pasta de `index.html`.
2. Abra `index.html` com duplo clique em um navegador atualizado, como Edge ou Chrome.
3. Clique em **Carregar base** e selecione seu CSV.
4. Em **Minha carteira**, informe a funcional do gerente.

Ao abrir com duplo clique, o navegador não permite ler outro arquivo da pasta automaticamente. A seleção do CSV libera sua leitura para aquela sessão. O arquivo pode ter qualquer nome. Ao recarregar ou fechar a página, selecione a base novamente.

## Leitura automática

Quando servido por HTTP/HTTPS, o HTML busca **clientes.csv**, na mesma pasta, ao abrir. Também pode ser carregado manualmente. Para usar outro nome, altere `CONFIG.csvFile` no início do script de `index.html`.

Se já houver um servidor interno, disponibilize o HTML e o CSV juntos. Para testar neste computador, com Node.js instalado, também é possível executar:

```powershell
node servidor.cjs
```

Abra o endereço local exibido. O servidor só atende neste computador. Encerre com `Ctrl+C`. O botão **Trocar base** permite atualizar o arquivo carregado sem reiniciar o painel.

## Colunas da base

| Coluna | Uso |
| --- | --- |
| `cpf` | Obrigatória. Identificação do cliente. |
| `funcional` | Obrigatória. Vínculo exato com o gerente. |
| `mod_atnd_ip` | Modalidade: BUILDER, HIGH, MEDICOP, PREMIUM, SERVIDOR ou SMART. |
| Outras colunas | Exibidas automaticamente em **Ver cliente**, na ordem do arquivo. |

- Cabeçalhos aceitam maiúsculas/minúsculas, espaços ao redor e acentos. `mod_atnd_ip` ausente fica como **Não informada**.
- Nomes reconhecidos na tabela: `nome`, `nome_cliente`, `nm_cliente`, `nm_clie`, `nm_cli`, `cliente` e `nome_completo`.
- Contato reconhecido: `celular`, `telefone`, `telefone_cliente`, `fone`, `tel_celular`, `nr_celular`, `email` ou `e_mail`. Todos os demais contatos continuam disponíveis nos detalhes.
- Aceita ponto e vírgula, vírgula ou tabulação; campos entre aspas, aspas escapadas e quebras de linha dentro de campos; UTF-8, Windows-1252 e UTF-16 com BOM.
- CPF e funcional são tratados como texto: zeros à esquerda são preservados. A funcional `00123` é diferente de `123`. Exporte os identificadores como texto, sem notação científica.
- Registros sem funcional são ignorados com aviso; linhas associadas a uma funcional precisam conter CPF. Cabeçalhos duplicados e linhas com quantidade de campos incorreta são rejeitados com mensagem. Uma importação inválida mantém a base anterior.
- Cada linha válida é um registro. O painel não deduplica CPFs nem atribui prioridade sem uma regra definida.

## Editar os roteiros

Procure `ARGUMENTACOES` no `index.html`. Cada modalidade tem título, resumo, abertura da conversa, orientação para explorar a necessidade, próximo passo e três perguntas. Os textos atuais são provisórios e não afirmam coberturas ou benefícios de produtos específicos.

## Funcionamento dos dados

Os dados são processados na memória do navegador, sem armazenamento persistente nem envio a serviços externos. A funcional é um filtro de carteira, não uma autenticação: quem tem acesso ao HTML e ao CSV consegue consultar outras funcionais. Uma versão com controle de acesso por gerente exige autenticação e filtragem no servidor.
