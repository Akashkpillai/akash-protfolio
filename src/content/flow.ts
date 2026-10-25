export const flowStages = [
  {
    id: "input",
    label: "Input",
    responsibility: "Receive a request or a piece of information.",
  },
  {
    id: "process",
    label: "Process",
    responsibility: "Apply a defined transformation to what was received.",
  },
  {
    id: "result",
    label: "Result",
    responsibility: "Return an outcome that the next person or system can use.",
  },
] as const;
