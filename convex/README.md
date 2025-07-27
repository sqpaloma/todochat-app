# TodoChat - Convex Backend

Este é o backend do TodoChat construído com Convex, incluindo integração com o Resend para envio de emails.

## Configuração do Resend

O projeto usa o componente oficial [@convex-dev/resend](https://www.convex.dev/components/resend) para envio de emails.

### Variáveis de Ambiente Necessárias

Configure as seguintes variáveis no seu deployment do Convex:

```bash
# API Key do Resend (obrigatório)
RESEND_API_KEY=re_your_api_key_here

# Webhook Secret do Resend (opcional, mas recomendado para produção)
RESEND_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# URL da aplicação (para links nos emails)
NEXT_PUBLIC_APP_URL=https://your-app-url.com
```

### Como Configurar

1. **Obter API Key do Resend:**

   - Acesse [resend.com](https://resend.com)
   - Crie uma conta e obtenha sua API key
   - Configure no Convex: `npx convex env set RESEND_API_KEY re_your_key_here`

2. **Configurar Webhook (Recomendado):**

   - No dashboard do Resend, crie um webhook para: `https://your-convex-site.convex.site/resend-webhook`
   - Habilite todos os eventos `email.*`
   - Configure o secret: `npx convex env set RESEND_WEBHOOK_SECRET whsec_your_secret_here`

3. **URL da Aplicação:**
   - `npx convex env set NEXT_PUBLIC_APP_URL https://your-app-url.com`

## Funcionalidades de Email

### ✉️ Notificações de Tarefas

- Email automático quando uma nova tarefa é criada
- Inclui detalhes da tarefa, prazo e botões de ação
- Enviado para o responsável pela tarefa

### 📋 Resumo Diário

- Email diário com tarefas pendentes de cada membro
- Enviado automaticamente via cron job
- Inclui contagem de tarefas concluídas

### ✅ Notificações de Conclusão

- Email quando uma tarefa é marcada como concluída
- Enviado para todos os membros da equipe

### 🗑️ Limpeza Automática

- Remove emails antigos automaticamente
- Emails finalizados: removidos após 7 dias
- Emails abandonados: removidos após 4 semanas

## Arquivos Principais

- `emails.ts` - Funções de envio de email usando Resend
- `tasks.ts` - Gerenciamento de tarefas com notificações
- `teams.ts` - Gerenciamento de equipes e resumos diários
- `crons.ts` - Jobs agendados para emails e limpeza
- `convex.config.ts` - Configuração do componente Resend

## Convex Functions

A query function that takes two arguments looks like:

```ts
// convex/myFunctions.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const myQueryFunction = query({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Read the database as many times as you need here.
    // See https://docs.convex.dev/database/reading-data.
    const documents = await ctx.db.query("tablename").collect();

    // Arguments passed from the client are properties of the args object.
    console.log(args.first, args.second);

    // Write arbitrary JavaScript here: filter, aggregate, build derived data,
    // remove non-public properties, or create new objects.
    return documents;
  },
});
```

Using this query function in a React component looks like:

```ts
const data = useQuery(api.myFunctions.myQueryFunction, {
  first: 10,
  second: "hello",
});
```

A mutation function looks like:

```ts
// convex/myFunctions.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const myMutationFunction = mutation({
  // Validators for arguments.
  args: {
    first: v.string(),
    second: v.string(),
  },

  // Function implementation.
  handler: async (ctx, args) => {
    // Insert or modify documents in the database here.
    // Mutations can also read from the database like queries.
    // See https://docs.convex.dev/database/writing-data.
    const message = { body: args.first, author: args.second };
    const id = await ctx.db.insert("messages", message);

    // Optionally, return a value from your mutation.
    return await ctx.db.get(id);
  },
});
```

Using this mutation function in a React component looks like:

```ts
const mutation = useMutation(api.myFunctions.myMutationFunction);
function handleButtonPress() {
  // fire and forget, the most common way to use mutations
  mutation({ first: "Hello!", second: "me" });
  // OR
  // use the result once the mutation has completed
  mutation({ first: "Hello!", second: "me" }).then((result) =>
    console.log(result)
  );
}
```

Use the Convex CLI to push your functions to a deployment. See everything
the Convex CLI can do by running `npx convex -h` in your project root
directory. To learn more, launch the docs with `npx convex docs`.
