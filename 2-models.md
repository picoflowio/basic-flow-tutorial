---
sort: 2
title: 'Lesson 2: Model Registry & Overrides'
---
---
## Why models are explicit

Picoflow requires every flow to choose a model up front. If a flow skips `useModel(...)`, `Flow.bootstrap()` throws before the session starts, so you always know which LLM will run. `BasicFlow` sets the baseline in `src/myflow/basic-flow/basic-flow.ts`:
```ts
export class BasicFlow extends Flow {
  constructor() {
    super(BasicFlow);
    this.useModel('gpt-4o'); // mandatory flow-wide default
  }
}
```

---
## What ships by default

`FlowEngine` registers a catalog of popular models on boot: see `src/picoflow/services/flow-engine.ts`, which calls `registerModels(createPopularModels())`. The factory in `src/picoflow/models/default-models.ts` preloads OpenAI (gpt-5.4, gpt-5, gpt-4o, gpt-4o-mini), Anthropic (claude-*), Gemini (gemini-*), and a sample Ollama model. These are ready to use without extra wiring.

---
## Controller overrides and new definitions

`ChatController` shows how to override a default entry or introduce a new one. It registers flows and then replaces the built-in `gpt-5` config with a custom one by passing `replace = true`:
```ts
flowEngine.registerModel(
  new Model('gpt-5', {
    apiKey: CoreConfig.OpenAIKey,
    maxRetries: CoreConfig.llmRetry,
    reasoning: { effort: 'low' },
  }),
  true,
);
```
Use this pattern to tweak retries, reasoning budget, base URL, or to alias a target model name (third constructor argument).

---
## Flow-level defaults and overrides

- **Required default:** Call `useModel('<name>')` in the flow constructor; it seeds every step that does not pick its own model.
- **Flow-wide parameter tweaks:** Use `useModelParams({ temperature: 0.2 })` or `useModelParams('<name>', { maxRetries: 5 })` to adjust provider options once for the whole flow. Parameters merge on top of the registered model config.

---
## Step-level overrides (optional)

Steps inherit the flow model unless they opt out. In `BasicFlow`, `InContextStep` switches to a higher-effort model just for that step:
```ts
new InContextStep(this)
  .useMemory('separate')
  .useModel('gpt-5', { reasoning: { effort: 'high' } });
```
You can also keep the flow's model but override parameters only:
```ts
new WeatherStep(this)
  .useMemory('default')
  .useModelParams({ temperature: 0.0 });
```

---
## Checklist

- Register flows and models in your controller before serving requests.
- Keep the default registry for convenience; override with `replace = true` when you need custom limits or keys.
- Every flow must call `useModel`; every step may optionally call `useModel` or `useModelParams` to tighten control.
