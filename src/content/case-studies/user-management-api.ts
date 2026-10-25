import type { CaseStudy } from "@/content/projects";

// Every claim cites IDs from the User Management API section of
// docs/project-evidence.md (reviewed commit 97603df). Decision reasons appear only
// when owner-confirmed.
export const userManagementApi: CaseStudy = {
  problem: [
    {
      text: "The project is an API for administering user accounts and the locations they belong to, where most actions are restricted to admins.",
      evidence: ["UM-01", "UM-04", "UM-05"],
    },
  ],
  contribution: [
    {
      text: "I designed and built the whole API myself: the modules, guards, interceptors, and Prisma schema.",
      evidence: [],
    },
  ],
  implementation: [
    {
      text: "Users sign in with email and password. Passwords are hashed with bcrypt, and the API issues a JSON Web Token carrying the user's ID and role, valid for one day.",
      evidence: ["UM-02", "UM-03"],
    },
    {
      text: "Routes declare their allowed roles with a Roles decorator. An authentication guard verifies the token, and an authorization guard compares its role with the route's list.",
      evidence: ["UM-01", "UM-02"],
    },
    {
      text: "Admin-only routes list users with pagination and their country, state, and city, fetch or delete a user, and block or unblock an account. Blocked users cannot sign in.",
      evidence: ["UM-04"],
    },
    {
      text: "An interceptor removes the password field from every user response.",
      evidence: ["UM-03"],
    },
    {
      text: "Country, state, and city modules provide admin-only create and list routes.",
      evidence: ["UM-06"],
    },
    {
      text: "Swagger UI is served at /api, generated Compodoc documentation is committed to the repository, and a global validation pipe, exception filter, and response interceptor apply to every request.",
      evidence: ["UM-07", "UM-08"],
    },
  ],
  architecture: {
    kind: "data-model",
    interactive: false,
    title: "Data model",
    summary:
      "Four Prisma models in PostgreSQL. Countries contain states, states contain cities, and every user belongs to one country, state, and city. Relations reference each location's integer code rather than its UUID.",
    components: [
      {
        id: "country",
        name: "Country",
        responsibility: "Fields: id (UUID), name (unique), code (unique integer). Has many states, cities, and users.",
        evidence: ["UM-05"],
        grid: { column: 0, row: 0 },
      },
      {
        id: "state",
        name: "State",
        responsibility: "Fields: id, name (unique), code (unique integer), countryId → Country.code. Has many cities and users.",
        evidence: ["UM-05"],
        grid: { column: 2, row: 0 },
      },
      {
        id: "city",
        name: "City",
        responsibility: "Fields: id, name (unique), code (unique integer), countryId → Country.code, stateId → State.code. Has many users.",
        evidence: ["UM-05"],
        grid: { column: 2, row: 1 },
      },
      {
        id: "user",
        name: "User",
        responsibility: "Fields: id, name, email (unique), password (bcrypt hash), role (ADMIN or USER), isBlocked, and countryId, stateId, cityId → location codes.",
        evidence: ["UM-01", "UM-03", "UM-05"],
        grid: { column: 0, row: 1 },
      },
    ],
    links: [
      { from: "country", to: "state", label: "Has many states" },
      { from: "state", to: "city", label: "Has many cities" },
      { from: "country", to: "city", label: "Has many cities" },
      { from: "user", to: "country", label: "Belongs to a country" },
      { from: "user", to: "state", label: "Belongs to a state" },
      { from: "user", to: "city", label: "Belongs to a city" },
    ],
  },
  decisions: [
    {
      text: "Authorization is declarative: each route lists its allowed roles with a decorator, and one guard enforces the list.",
      evidence: ["UM-D1"],
    },
    {
      text: "Relations point at a location's integer code instead of its UUID primary key.",
      evidence: ["UM-D2"],
    },
    {
      text: "List routes use POST, with page and limit in the request body.",
      evidence: ["UM-D3"],
    },
    {
      text: "Password removal happens in one interceptor rather than in each query.",
      evidence: ["UM-03"],
    },
  ],
  tradeoffs: [
    {
      text: "Code-based relations let requests refer to locations by short integer codes instead of UUIDs, but every code must stay unique.",
      evidence: ["UM-D2"],
    },
    {
      text: "Pagination in a POST body keeps list parameters out of the URL, but listing is not a GET request.",
      evidence: ["UM-D3"],
    },
    {
      text: "A single interceptor strips passwords from every response, so queries need not exclude the field, though the hash is still loaded from the database.",
      evidence: ["UM-03"],
    },
  ],
  limitations: [
    {
      text: "The repository README is still the NestJS starter, so setup, example requests, and role behavior are not documented there.",
      evidence: ["UM-L1"],
    },
    {
      text: "Role checks decide which routes each role can call, but the public create route and the update route open to users accept a role field, and updates do not check that users change only their own record. Authorization needs hardening before real use.",
      evidence: ["UM-L2"],
    },
    {
      text: "State and city names are unique across the whole table, so two cities with the same name cannot both be stored.",
      evidence: ["UM-L3"],
    },
    {
      text: "Only the starter end-to-end test is present.",
      evidence: ["UM-L4"],
    },
    {
      text: "No independent security or scalability review has been done, and no such guarantee is made.",
      evidence: ["UM-L5"],
    },
  ],
  discrepancies: ["README describes the NestJS starter, not this project."],
};
