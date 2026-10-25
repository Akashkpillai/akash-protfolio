import type { CaseStudy } from "@/content/projects";

// Every claim cites IDs from the Notification Platform section of
// docs/project-evidence.md (reviewed commit f202b48). Decision reasons appear only
// when owner-confirmed.
export const notificationPlatform: CaseStudy = {
  problem: [
    {
      text: "The project separates accepting a notification request from delivering it. The API answers as soon as the request is published to Kafka; separate workers send each message and record what happened.",
      evidence: ["NP-01", "NP-D2", "NP-03"],
    },
  ],
  contribution: [
    {
      text: "I designed and built the whole system myself: the gateway, the router, the channel workers, the shared library, and the database schema.",
      evidence: [],
    },
  ],
  implementation: [
    {
      text: "The API gateway exposes POST /notifications behind JWT authentication and a rate limiter. It adds an event ID, timestamp, and retry count, publishes it to the notification.requested topic, and returns.",
      evidence: ["NP-01"],
    },
    {
      text: "A router service consumes that topic, stores a Notification record with status pending in PostgreSQL, and republishes the event to the email, SMS, or push topic by type.",
      evidence: ["NP-02"],
    },
    {
      text: "The email worker sends through SMTP with Nodemailer. It skips notifications already marked sent, marks a missing recipient as dead, and records sent with a timestamp on success.",
      status: "implemented-code-path",
      evidence: ["NP-03"],
    },
    {
      text: "The SMS worker follows the same steps using Twilio.",
      status: "implemented-code-path",
      evidence: ["NP-04"],
    },
    {
      text: "When a send fails, the worker increments the retry count. Below three attempts it marks the record failed and publishes to notification.retry; at three it marks it dead and publishes to notification.dlq.",
      status: "implemented-code-path",
      evidence: ["NP-05"],
    },
    {
      text: "DTOs, enums, topic names, and the Prisma service live in a shared library, so every service uses the same message contract.",
      evidence: ["NP-06"],
    },
    {
      text: "The schema also defines per-user channel preferences and reusable message templates.",
      evidence: ["NP-07"],
    },
  ],
  architecture: {
    kind: "architecture",
    interactive: true,
    title: "Notification flow",
    summary:
      "Requests enter through the API gateway and travel over Kafka to a router, which records them and hands each one to a channel worker. Email and SMS workers send messages and update the record; push delivery is unfinished. Failed sends publish retry and dead-letter events, which nothing consumes yet.",
    components: [
      {
        id: "gateway",
        name: "API gateway",
        responsibility: "Authenticates and rate-limits POST /notifications, adds an event ID, and publishes to notification.requested.",
        evidence: ["NP-01"],
        grid: { column: 0, row: 1 },
      },
      {
        id: "kafka",
        name: "Kafka",
        responsibility: "Carries events between services on the request, channel, retry, and dead-letter topics.",
        evidence: ["NP-D1", "NP-06"],
        grid: { column: 1, row: 1 },
      },
      {
        id: "router",
        name: "Router",
        responsibility: "Stores each request as a pending Notification record and republishes it to the topic for its type.",
        evidence: ["NP-02"],
        grid: { column: 2, row: 1 },
      },
      {
        id: "database",
        name: "PostgreSQL",
        responsibility: "Holds Notification records with status, retry count, last error, and sent time.",
        evidence: ["NP-07"],
        grid: { column: 2, row: 2 },
      },
      {
        id: "email",
        name: "Email worker",
        responsibility: "Sends through SMTP, skips notifications already sent, and updates the record to sent, failed, or dead.",
        status: "implemented-code-path",
        evidence: ["NP-03", "NP-05"],
        grid: { column: 3, row: 0 },
      },
      {
        id: "push",
        name: "Push worker",
        responsibility: "Placeholder only: returns “Hello World!” and does not consume the push topic.",
        status: "unfinished",
        evidence: ["NP-L1"],
        grid: { column: 3, row: 1 },
      },
      {
        id: "sms",
        name: "SMS worker",
        responsibility: "Sends through Twilio with the same duplicate, recipient, and status steps as email.",
        status: "implemented-code-path",
        evidence: ["NP-04", "NP-05"],
        grid: { column: 3, row: 2 },
      },
      {
        id: "retry",
        name: "Retry and dead-letter topics",
        shortName: "Retry / dead-letter",
        responsibility: "Receive failed events: retry below three attempts, dead-letter at three. No consumer re-sends them yet.",
        status: "implemented-code-path",
        evidence: ["NP-05", "NP-L2"],
        grid: { column: 4, row: 1 },
      },
    ],
    links: [
      { from: "gateway", to: "kafka", label: "Publishes notification.requested" },
      { from: "kafka", to: "router", label: "Delivers request events" },
      { from: "router", to: "database", label: "Stores a pending record" },
      { from: "router", to: "email", label: "Publishes to notification.email" },
      { from: "router", to: "push", label: "Publishes to notification.push", status: "unfinished" },
      { from: "router", to: "sms", label: "Publishes to notification.sms" },
      { from: "email", to: "retry", label: "On a failed send", status: "implemented-code-path" },
      { from: "sms", to: "retry", label: "On a failed send", status: "implemented-code-path" },
    ],
  },
  decisions: [
    {
      text: "Intake, routing, and each delivery channel are separate NestJS applications that communicate only through Kafka topics.",
      evidence: ["NP-D1"],
    },
    {
      text: "The gateway publishes and returns without waiting; delivery happens later in the workers.",
      evidence: ["NP-D2"],
    },
    {
      text: "Failure handling lives inside each channel worker, with a fixed limit of three attempts before a notification is marked dead.",
      evidence: ["NP-D3"],
    },
    {
      text: "A shared library defines the message contract, topic names, and database access for every service.",
      evidence: ["NP-06"],
    },
  ],
  tradeoffs: [
    {
      text: "Returning before delivery keeps the HTTP request independent of the email or SMS provider, but the caller does not receive a delivery result.",
      evidence: ["NP-D2", "NP-01"],
    },
    {
      text: "Separate applications keep each channel's code and configuration apart, at the cost of more services to run and connect to Kafka.",
      evidence: ["NP-D1"],
    },
    {
      text: "Keeping retry logic in each worker places it next to the send call, but the email and SMS workers repeat the same logic.",
      evidence: ["NP-D3"],
    },
  ],
  limitations: [
    {
      text: "Push delivery is unfinished: the push app is a placeholder and nothing consumes the push topic.",
      status: "unfinished",
      evidence: ["NP-L1"],
    },
    {
      text: "Retry and dead-letter events are published, but no service consumes them yet, so failed notifications are not re-sent.",
      status: "unfinished",
      evidence: ["NP-L2"],
    },
    {
      text: "The router stores each record under a database-generated ID, while the workers look records up by the gateway's event ID. As written, the duplicate check and status updates would not find the stored record; this has not been run to confirm.",
      evidence: ["NP-L3"],
    },
    {
      text: "User preferences and message templates exist only in the schema; no code uses them yet.",
      evidence: ["NP-L4"],
    },
    {
      text: "No flow has been run end to end for this review. No exactly-once, production-reliability, or push-provider claim is made.",
      evidence: ["NP-L5"],
    },
  ],
  discrepancies: [
    "README calls the system production-grade and lists push delivery; push is unfinished in code.",
    "README names topics notifications.*; code uses notification.*.",
  ],
};
