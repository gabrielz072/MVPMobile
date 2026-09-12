# Configuracao do Firebase

A aplicacao ja esta configurada para o projeto Firebase `mvpmobile` informado.

## Console Firebase

1. Abra https://console.firebase.google.com/ e entre no projeto `mvpmobile`.
2. Em **Authentication > Sign-in method**, ative **Email/Password**.
3. Em **Firestore Database**, crie o banco.
4. Publique o conteudo de `firestore.rules` na aba **Rules**.

## Primeiro administrador

1. Crie uma conta pela tela de cadastro do aplicativo.
2. Em **Authentication > Users**, copie o UID dessa conta.
3. No Firestore, crie ou edite o documento `users/{UID}` com:

```json
{
  "name": "Nome do administrador",
  "email": "admin@exemplo.com",
  "role": "admin"
}
```

Novos cadastros recebem automaticamente `role: "user"`. Somente o documento
criado manualmente como `admin` pode alterar eventos.

## Documento de eventos

Crie o documento `events/atm` no Firestore. Os campos aceitos são:

- `title`
- `subtitle`
- `heroImage`
- `description`
- `program`
- `closing`

Se o documento ainda nao existir, a tela exibe os textos padrao. O administrador
pode criar o documento pela propria tela de eventos ao salvar a primeira edicao.

A configuracao Firebase usada esta em `lib/firebase.ts`. A chave de API Web do
Firebase nao e um segredo; a protecao fica nas regras do Firestore.
