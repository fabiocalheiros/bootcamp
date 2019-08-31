#instalação do projeto
yarn

#comando pra rodar o projeto
yarn dev


################ biblitecas PROD

bcryptjs
# responsavel por gerar uma senha hash ou ate mesmo comparar uma senha

express
# biblioteca do node

jsonwebtoken
# biblioteca que trabalha com tokens

# pg
Dependencia necessaria pra se usar o postgres

# pg-hstore
Dependencia necessaria pra se usar o postgres

# sequelize
Abstrai a aplicação do banco seja qual for, pra que seja possivel usar javascript
config: .sequelizerc

# yup
plugin de schema validation. Cria uma estrutura schema e verifica se os dados foram fornecidos

# multer
trabalhar com a formatação pra lidar com arquivos no servidor
formato que suporta envio de arquivos fisicos
multpart form data

################ biblitecas DEV

# eslint
Padroniza o e verifica o codigo javascript
config: .eslintrc.js

# eslint-config-airbnb-base
Base que será utilizada como padrão airbnb

eslint-plugin-import

# nodemon
nodemon é responsável por monitorar a aplicação, atualizando e subindo o server
config: nodemon.json

# prettier
Ajuda da padronização do codigo, quebrando linhas e ajustando o codigo.

# eslint-config-prettier
Configuração do prettier
config: .prettierrc

# eslint-plugin-prettier
Padroniza o codigo

# sequelize-cli
Interface de linha de comando que habilita possibilidade usar migrations e outros comandos.

# sucrase
Habilita a possibilidade de se usar import e export no node
ex: import express from 'express';

# date-fns
Verificação de datas

# nodemailer
Envio de emails no node

#bee-queue
Controle de filas no node
