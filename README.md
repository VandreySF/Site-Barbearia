# Barbearia Elite - Sistema de Agendamento

Este projeto é um site completo para a Barbearia Elite, permitindo que clientes agendem horários online e que a administração gerencie os agendamentos de forma prática e visual.

---

## Funcionalidades

### Para o Cliente (Site Principal)
- **Página inicial moderna** com informações sobre a barbearia, serviços, galeria de fotos e contato.
- **Agendamento online**: o cliente pode escolher o serviço, data e horário disponíveis, preenchendo um formulário simples.
- **Validação automática**: impede agendamentos em horários lotados, datas inválidas ou fora do expediente.
- **Confirmação visual**: após o agendamento, o cliente vê um modal de sucesso.
- **Contato fácil**: links diretos para WhatsApp e Instagram.

### Para o Administrador (Área Admin)
- **Login protegido**: acesso restrito à área administrativa.
- **Dashboard**: visão geral de agendamentos do dia, próximos horários, total de clientes e receita do mês.
- **Tabela e cards de agendamentos**: visualização adaptada para desktop e mobile.
- **Filtros e busca**: por nome, telefone, serviço, status e data.
- **Edição e exclusão**: possibilidade de editar status, dados do cliente ou excluir agendamentos.
- **Exportação**: exporta todos os agendamentos em CSV.
- **Notificações**: badge de novos agendamentos pendentes.
- **Logout**: botão para sair da área administrativa.

---

## Estrutura de Pastas

```
Site barbearia/

├── index.html             # Página principal do site
├── style.css              # Estilos do site principal
├── script.js              # Scripts do site principal
└── area_admin/
    ├── gerenciamento.html   # Painel administrativo
    ├── gerenciamento.js     # Scripts do painel administrativo
    ├── gerenciamento.css    # Estilos do painel administrativo
    ├── login.html           # Tela de login do admin
    ├── login.js             # Scripts da tela de login
    └── login.css            # Estilos da tela de login
```

---

## Como Funciona

### 1. Agendamento pelo Cliente
- O cliente acessa o site, preenche o formulário de agendamento e escolhe um serviço, data e horário.
- O sistema valida a disponibilidade (máximo 2 agendamentos por horário).
- O agendamento é salvo no navegador (localStorage) e também fica disponível para o painel administrativo.

### 2. Gerenciamento pelo Admin
- Para acessar a ‘área admin’ o administrador deve rolar a página até encontrar ‘Links rápidos’.
- O administrador faz login em `/area_admin/login.html` (usuário e senha padrão: **admin**).
- No painel, pode visualizar, filtrar, editar status ou excluir agendamentos.
- Os dados são salvos no `localStorage` do navegador.

### 3. Observações Técnicas
- **Não há backend**: todo o armazenamento é feito no `localStorage` do navegador.
- **Os dados são locais**: para uso real, recomenda-se implementar um backend (em produção).
- **Responsivo**: funciona bem em desktop e mobile.
- **Acessibilidade**: inclui melhorias de acessibilidade e usabilidade.

---

## Como Rodar

1. Baixe ou clone o projeto.
2. Abra o arquivo `index.html` no navegador para acessar o site principal.
3. Para acessar a ‘área admin’ o administrador deve rolar a página até encontrar ‘Links rápidos’.

**Para testar como admin, use:**
- Usuário: `admin`
- Senha: `admin`

---

## Observações

O sistema foi desenvolvido para fins didáticos.
