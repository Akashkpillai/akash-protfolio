import type { Claim } from "@/content/projects";
import { ClaimStatus } from "@/components/work/ClaimStatus";

export function ClaimList({ claims }: { claims: readonly Claim[] }) {
  return (
    <ul className="claim-list">
      {claims.map((claim) => (
        <li key={claim.text}>
          {claim.status && (
            <>
              <ClaimStatus status={claim.status} />{" "}
            </>
          )}
          {claim.text}
        </li>
      ))}
    </ul>
  );
}
