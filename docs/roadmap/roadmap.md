# Cadence — Product Roadmap

## Diagnostico: el estado real

Cadence tiene una base tecnica excelente y una identidad de producto clara (constraint como feature, tres areas de vida, AI-assisted planning). Lo que tiene construido es solido. El problema es que la mayoria de las apps de productividad mueren no por falta de features, sino por problemas en tres momentos criticos:

**Dia 1** - el usuario no llega al "aha moment"
**Semana 1** - no forma el habito de abrir la app
**Mes 1** - no ve su progreso, no siente que valio la pena

Cadence tiene todo para resolver los tres. Pero aun no lo hace.

---

## North Star Metric

> **Usuarios que completan el Daily Close 4+ dias en cualquier semana de los ultimos 14 dias**

Por que este: el Daily Close es el ritual que une tasks, habits, goals y AI en un loop. Un usuario que lo completa regularmente ya formo el habito. Es la mejor proxy de retencion real.

Metricas secundarias:
- **Activation rate**: % de usuarios que crean su primera task Y primer habito en las primeras 24h
- **Weekly review completion rate**: proxy de retencion semanal
- **Zombie rate**: % de tasks que se posponen 3+ veces - si sube, el sistema esta fallando al usuario

---

## Framework de retencion para Cadence

La retencion en una app de productividad personal funciona en loops:

```
Loop diario (habit):       Abrir -> Today view -> Complete tasks -> Daily Close -> Dopamine hit
Loop semanal (progress):   Weekly review -> ver progreso -> sentir momentum -> comprometerse a mas
Loop trimestral (growth):  Quarterly goals -> milestones -> retrospectiva -> nuevo trimestre
```

Cada loop debe ser satisfactorio por si solo y debe alimentar al loop mayor. Hoy, el loop diario existe pero es incompleto porque el "dopamine hit" post-close es minimo. Los loops semanales y trimestrales son demasiado leves.

---

## Roadmap por fases

### Fase 0 - Solidification (ahora, 3-4 semanas)

*Antes de crecer, no sangrar usuarios por problemas de base*

**Epic 14: Onboarding**

El problema mas urgente. Un usuario nuevo abre la app y ve pantallas vacias. No hay nada mas danino para la retencion que un empty state sin direccion.

- Flujo de 4 pasos post-primer-login: nombre -> elegir las 3 areas -> crear un habito inicial -> crear la primera goal trimestral
- Empty states que explican el "por que" de cada seccion, no solo el "que"
- Primera task creada con AI como demo guiada ("proba escribir algo que queres hacer hoy")
- El AI profile se completa durante el onboarding, no en settings

**Epic 15: Error states y edge cases**

- Offline graceful degradation (ya esta, pero hay gaps)
- Cuando el usuario no tiene tasks para hoy: motivar, no mostrar vacio
- Cuando la API de AI falla: fallback limpio, mensaje humano, no exponer el error tecnico
- Rate limiting visible en lugar de errores silenciosos

**Epic 16: Performance audit**

- Medir LCP, FID en mobile real (no Lighthouse en desktop)
- Skeleton loading en Today view - el primer render en cold start tiene que ser instantaneo
- Prefetch de datos del dia siguiente al completar el Daily Close

---

### Fase 1 - Retention Core (1-2 meses)

*Construir el loop diario completo. Si el usuario no vuelve manana, nada mas importa.*

**Epic 17: Momentum System**

El concepto central que le falta a Cadence: el usuario necesita ver que esta en racha, que tiene impulso.

- **Consistency Score**: numero del 0-100 calculado semanalmente (combinacion de task completion rate + habit consistency + daily closes). No es una puntuacion gamificada, es una metrica real de auto-gestion. Mostrar en el header de Today view de forma sutil.
- **Day streak** para el daily close ritual (separado del streak de habits individuales). "Vas 8 dias cerrando el dia" es poderoso.
- **Area balance indicator**: representacion visual de cuanto tiempo/energia fue a cada area en los ultimos 7 dias. El desbalance visible es un trigger de reflexion.

**Epic 18: Daily Close mejorado**

El Daily Close es el mejor feature de Cadence y esta subutilizado como herramienta de retencion.

- Post-close: pantalla de cierre con los highlights del dia (X tasks done, Y habits logged, Z zombie tasks resueltas). 30 segundos de celebracion genuina.
- El AI summary del close tiene que ser mas personal - usar el AI profile + contexto historico, no solo el dia
- **Siguiente dia:** al terminar el close, el AI sugiere 1-3 tasks para manana basado en goals + lo que quedo pendiente. Reduce la friccion del dia siguiente.

**Epic 19: Smart Notifications**

Las notificaciones que tiene hoy son genericas. Necesitan ser contextuales.

- Notificacion de "morning kickoff" personalizable por hora: muestra cuantas tasks tiene agendadas + quote del dia
- Notificacion de "cierre inminente" si pasaron las 19:00 y no hizo daily close
- Notificacion inteligente: si el usuario completo tasks 4 dias seguidos, recordarle el streak en peligro si no abrio la app
- **Nunca mas de 2 notificaciones por dia** - esto tiene que ser una regla de sistema, no solo de UI

---

### Fase 2 - Value Deepening (2-4 meses)

*El usuario ya tiene el habito. Ahora necesita ver que vale la pena a largo plazo.*

**Epic 20: Insights Dashboard**

El feature con mayor impacto en retencion a largo plazo. Las personas que ven su progreso no se van.

- **Vista /insights** (nueva ruta en la nav): datos de las ultimas 4-12 semanas
- Task completion rate por area (donde completas mas, donde postergas mas)
- Habit consistency calendar (como el de GitHub contributions pero por area)
- Zombie pattern: que tipos de tasks se vuelven zombies - esto es insight real sobre friccion personal
- **Correlation view** (feature estrella): "Los dias que loggas `ejercicio`, tu completion rate de work tasks es 34% mayor." Esto es lo que ninguna app de productividad hace bien.
- Goal progress: % de milestones completados por goal activa, proyeccion de si vas a llegar al final del trimestre

**Epic 21: AI que aprende**

El AI profile existe pero es estatico. Necesita un feedback loop real.

- Despues de cada Weekly Review, el sistema actualiza automaticamente el contexto del AI con los patrones detectados (no el perfil manual, sino metadata inferida)
- El AI de creacion de tasks tiene contexto historico: sabe que los lunes soles agregar cosas de "identity", que "llamar al contador" siempre se posterga
- **AI Coach**: en el Weekly Review, el AI no solo resume la semana sino que hace una pregunta especifica basada en el patron detectado ("Hace 3 semanas que el objetivo X no tiene actividad. Sigue siendo relevante?")
- Zombie check mejorado: el AI analiza por que una task se vuelve zombie (demasiado grande, mal momento de la semana, wrong area) y sugiere una accion concreta

**Epic 22: Goal System completo**

Las goals son el ancla de largo plazo. Hoy estan subutilizadas.

- **Progress automatico**: cuando se completa una milestone, la goal calcula su % automaticamente y lo muestra visualmente
- **Quarterly retrospective**: al final de cada trimestre, flujo guiado de 5 pasos similar al Weekly Review. El AI analiza las 3 goals del trimestre y genera un resumen de lo aprendido.
- **Goal suggestions**: al crear un nuevo trimestre, el AI sugiere goals basadas en los weekly reviews anteriores ("En 3 de tus ultimas 4 weekly reviews mencionaste querer aprender X")
- Milestone date tracking: saber si las milestones se completaron antes o despues de la fecha estimada. Eso es accuracy de planificacion personal.

---

### Fase 3 - Growth (4-8 meses)

*El producto es solido. Ahora escalar la base de usuarios.*

**Epic 23: Integrations**

La friccion de adopcion mas grande es "tengo que duplicar mi sistema". Reducirla.

- **Google Calendar sync** (read-only primero): importar eventos del dia como contexto para la Today view. No como tasks sino como "carga cognitiva del dia" que informa cuantas tasks realmente hacer.
- **Import de tasks**: CSV, Todoist, Things. One-time migration para usuarios que vienen de otra herramienta.
- **Webhooks de salida**: permite a power users conectar Cadence con Zapier/Make para sus propios flujos.

**Epic 24: Sharing & Accountability**

No red social, no gamificacion infantil. Accountability minimalista.

- **Accountability partner**: invitar a una persona que recibe un resumen semanal tuyo (solo el Consistency Score + si hiciste el Weekly Review). Sin acceso a las tasks. Privacidad total.
- **Share un weekly review**: exportar el resumen AI del weekly review como imagen o texto para compartir con alguien
- Esto es suficiente. No construir red social, no leaderboards, no features sociales complejos.

**Epic 25: Templates**

Reducir el tiempo al valor para usuarios nuevos.

- 5-8 templates de sistemas de habits pre-armados ("Morning routine", "Fitness builder", "Deep work protocol")
- Templates de goals trimestrales para contextos comunes (job search, side project launch, fitness goal)
- Importar un template no reemplaza lo existente, agrega opciones al setup

---

### Fase 4 - Monetization (6-12 meses)

*Construir el negocio*

**Modelo: Freemium con techo generoso**

El techo tiene que ser donde el usuario ya obtuvo valor real y quiere mas - no un paywall desde el dia 1 que frustra la activacion.

**Free tier:**
- Today view, tasks (limite de 7 por dia)
- 2 habits
- 1 goal activa por area (3 total)
- Daily Close
- Weekly Review (sin AI, solo el formulario)
- Insights basicos (ultimas 2 semanas)

**Cadence Pro (~$8-10/mes):**
- Habits ilimitados
- Goals ilimitadas con milestone tracking completo
- Weekly Review con AI summary
- Insights completos (12 semanas de historia + correlations)
- AI Coach en weekly review
- Smart notifications contextuales
- Accountability partner
- Quarterly retrospective con AI
- Google Calendar sync

Por que este modelo: el free tier es genuinamente util para el loop diario. El upgrade hace sentido cuando el usuario ya tiene 3+ meses de datos y quiere ver los insights completos. El pain point del paywall aparece en el momento de mayor engagement, no en el onboarding.

---

## Metricas por fase

| Fase | Objetivo | KPI |
|------|----------|-----|
| 0 - Solidification | Detener el churn de usuarios nuevos | Activation rate >40% (task + habito en 24h) |
| 1 - Retention Core | Formar el habito diario | D7 retention >30%, daily close 4+/semana en usuarios activos |
| 2 - Value Deepening | Crear dependencia del progreso | D30 retention >20%, weekly review completion >60% en activos |
| 3 - Growth | Escalar sin perder calidad | Referral rate organico >15% de nuevos usuarios |
| 4 - Monetization | Negocio sostenible | Conversion free->pro >5%, MRR crecimiento MoM |

---

## Prioridad inmediata: los proximos 30 dias

Si tuviera que elegir que hacer YA para mover la aguja mas rapido:

1. **Onboarding (Epic 14)** - sin esto, todo lo demas es construir sobre arena
2. **Post-close celebration + next day suggestions (Epic 18)** - el Daily Close es el mejor feature y hay que exprimirlo como herramienta de retencion
3. **Day streak para el ritual de cierre (Epic 17)** - una linea de codigo con impacto desproporcionado en retencion

El Insights Dashboard (Epic 20) es el feature con mas impacto en retencion a largo plazo, pero requiere que los usuarios tengan datos. Ese es el problema del huevo y la gallina: primero hay que retenerlos lo suficiente para que acumulen historial.

---

## Lo que deliberadamente NO esta en este roadmap

- **Time tracking / Pomodoro**: rompe el foco de Cadence. Si metes time tracking, ya sos otra app.
- **Team / colaboracion**: el constraint de ser un sistema personal es un feature, no una limitacion. No lo diluyas.
- **Subtasks**: las tasks de Cadence son atomicas por diseno. Las subtasks son el camino al infierno de la productividad.
- **Etiquetas y filtros complejos**: la complejidad del sistema es lo que mata la adopcion en productivity tools. El constraint de 3 areas ya resuelve esto.

El principio guia: **cada feature que agregas compite con todos los features que ya tenes por la atencion del usuario**. Cadence tiene una identidad clara. Defenderla es parte del trabajo del PM.
