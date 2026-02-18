📄 Functional Core v1 — Zippy
Plataforma de movilidad inteligente con negociación de tarifa
1. Propósito del sistema

Zippy es una plataforma de movilidad urbana que conecta pasajeros y conductores mediante:

Solicitud flexible de viajes

Negociación transparente de tarifas

Sistema profesional de ranking de conductores

Experiencia simple y confiable para el usuario

El objetivo principal es ofrecer una alternativa moderna, profesional y adaptable a la realidad del mercado argentino.

2. Roles del sistema
Passenger (Pasajero)

Puede:

Solicitar viajes desde app o web

Indicar condiciones del viaje (equipaje, mascotas, accesibilidad)

Proponer o negociar tarifa

Calificar conductor

Driver (Conductor)

Puede:

Recibir solicitudes cercanas

Aceptar o negociar tarifa

Gestionar viajes activos

Mejorar o perder nivel profesional según desempeño

Admin / Operaciones

Responsable de:

Supervisión general del sistema

Gestión de conductores

Control de incidencias

Métricas operativas

3. Estados del viaje (Ride Lifecycle)

Estados oficiales:

REQUESTED → viaje solicitado

NEGOTIATING → negociación activa

ASSIGNED → conductor asignado

DRIVER_EN_ROUTE → conductor en camino

ARRIVED → conductor llegó

IN_PROGRESS → viaje en curso

COMPLETED → viaje finalizado

CANCELLED → cancelado

EXPIRED → solicitud vencida

Reglas:

Solo se avanza en orden lógico

Cancelaciones pueden ocurrir desde cualquier estado previo a completion

Cada cambio genera un evento auditable

4. Sistema de negociación de tarifa

Diferencial central de Zippy.

Conceptos:

estimatedFare
Tarifa sugerida por sistema (referencial).

passengerOffer
Oferta inicial o modificada del pasajero.

driverCounterOffer
Contraoferta del conductor.

agreedFare
Tarifa final acordada.

Reglas:

Múltiples conductores pueden ofertar

El pasajero acepta una oferta

El sistema registra historial de negociación

Al acordar tarifa → estado pasa a ASSIGNED

5. Condiciones especiales del viaje

Campos iniciales:

hasLuggage → equipaje

hasPets → mascotas

needsAccessibility → accesibilidad

note → comentario adicional

Objetivo:

Mejor matching conductor/pasajero

Mayor claridad antes de aceptar viaje

6. Ranking profesional del conductor

Sistema dinámico basado en desempeño real.

Niveles:

Bronze

Silver

Gold

Platinum

(No gamificado — enfoque profesional.)

Factores de evaluación:

Tasa de aceptación de viajes

Cancelaciones

Tiempo de llegada

Calificaciones

Volumen reciente de viajes

Importante:

👉 El nivel puede subir o bajar.

Beneficios futuros:

Mayor visibilidad en solicitudes

Mejores sugerencias tarifarias

Acceso prioritario a viajes premium

7. Eventos en tiempo real (Realtime)

Eventos iniciales:

ride.created

ride.statusChanged

offer.created

offer.accepted

driver.locationUpdated (fase 2)

Tecnología prevista:

WebSockets / Gateway realtime

8. Seguridad y arquitectura (principios)

Backend desacoplado (API-first)

Validación estricta de datos

CORS controlado por whitelist

Logging estructurado

Auditoría de eventos

9. Objetivo UX principal

Prioridades:

Simplicidad extrema para pedir viaje

Información clara antes de aceptar

Interfaz moderna y profesional

Experiencia fluida web + app

10. Roadmap inmediato
Fase 1 — Core funcional

API rides

Negociación básica

Admin simple

Fase 2 — Experiencia

Tracking en tiempo real

Matching inteligente

Notificaciones

Fase 3 — Optimización

Algoritmos de tarifa

Analítica operativa

Expansión comercial
