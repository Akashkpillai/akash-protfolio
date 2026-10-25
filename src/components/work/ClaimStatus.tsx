import { claimStatusLabels, type ClaimStatus as Status } from "@/content/claim-status";

export function ClaimStatus({ status }: { status?: Status }) {
  if (!status) {
    return null;
  }

  return (
    <span className={`claim-status claim-status-${status}`}>
      {claimStatusLabels[status]}
    </span>
  );
}
